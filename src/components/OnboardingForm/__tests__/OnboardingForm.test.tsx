import { vi, describe, test, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OnboardingForm } from '../OnboardingForm'
import {
  submitForm,
  validateCorporationNumber,
} from '../../../services/VaultService.ts'

vi.mock('../../../services/VaultService.ts', () => ({
  validateCorporationNumber: vi.fn(),
  submitForm: vi.fn().mockResolvedValue({}),
}))

describe('Onboarding form tests', () => {
  beforeEach(() => {
    userEvent.setup()
  })

  test('Renders the Onboarding form', () => {
    render(<OnboardingForm />)
    const firstNameLabel = screen.getByText('First Name')
    expect(firstNameLabel).toBeInTheDocument()
  })

  test('Validates input on blur', async () => {
    render(<OnboardingForm />)
    const firstNameInput = screen.getByLabelText('First Name')

    await userEvent.type(firstNameInput, 'Test')
    await userEvent.clear(firstNameInput)
    await userEvent.tab()
    const errorLabels = screen.getAllByText('Field is required')
    expect(errorLabels[0]).toBeInTheDocument()
    expect(errorLabels.length).toEqual(1)
  })

  test('Validates phone number', async () => {
    render(<OnboardingForm />)
    const phoneInput = screen.getByLabelText('Phone Number')

    await userEvent.type(phoneInput, '12345')
    await userEvent.tab()
    const errorLabel = screen.getByText('Incorrect phone number')
    expect(errorLabel).toBeInTheDocument()
  })

  test('Validates corporation number via backend', async () => {
    render(<OnboardingForm />)
    validateCorporationNumber.mockResolvedValue({
      valid: false,
      message: 'Find me',
    })
    const corpNumberInput = screen.getByLabelText('Corporation Number')

    await userEvent.type(corpNumberInput, '123456789')
    await userEvent.tab()

    const errorMessage = screen.getByText('Find me')

    expect(validateCorporationNumber).toBeCalledWith('123456789')
    expect(errorMessage).toBeInTheDocument()
  })

  test('Validates whole form on backend', async () => {
    render(<OnboardingForm />)
    validateCorporationNumber.mockResolvedValue({
      valid: true,
    })
    submitForm.mockResolvedValue({
      message: 'Not valid :(',
    })

    const firstNameInput = screen.getByLabelText('First Name')
    const lastNameInput = screen.getByLabelText('Last Name')
    const phoneInput = screen.getByLabelText('Phone Number')
    const corpNumberInput = screen.getByLabelText('Corporation Number')
    const button = screen.getByText('Submit')

    await userEvent.type(firstNameInput, 'John')
    await userEvent.type(lastNameInput, 'Doe')
    await userEvent.type(phoneInput, '+12345678901')
    await userEvent.type(corpNumberInput, '123456789')
    await userEvent.click(button)

    expect(validateCorporationNumber).toBeCalledWith('123456789')
    expect(submitForm).toBeCalledWith(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        corporationNumber: '123456789',
        phone: '+12345678901',
      }),
    )
    const errorMessage = screen.getByText('Not valid :(')
    expect(errorMessage).toBeInTheDocument()
  })
})
