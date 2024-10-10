import { OnboardingFormProps } from '../types/OnboardingForm.ts'

const BaseURL = 'https://fe-hometask-api.dev.vault.tryvault.com'

interface CorporationNumberValidationResult {
  valid: boolean
  corporationNumber?: string
  message?: string
}

interface FormSubmitResult {
  message?: string
}

export const validateCorporationNumber = async (
  numberToCheck: string,
): Promise<CorporationNumberValidationResult> => {
  return fetch(`${BaseURL}/corporation-number/${numberToCheck}`)
    .then(async (response) => {
      return await response.json()
    })
    .catch(async (error) => {
      return Promise.resolve({ message: error.message })
    })
}

export const submitForm = async (
  formData: OnboardingFormProps,
): Promise<FormSubmitResult | undefined> => {
  return fetch(`${BaseURL}/profile-details`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then(async (response) => {
      if (response.ok) {
        return Promise.resolve(undefined)
      }
      return await response.json()
    })
    .catch(async (error) => {
      return Promise.resolve({ message: error.message })
    })
}
