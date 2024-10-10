import { ObjectSchema, ValidationError } from 'yup'
import { OnboardingFormProps } from '../../types/OnboardingForm.ts'
import * as Yup from 'yup'
import { validateCorporationNumber } from '../../services/VaultService.ts'

export const OnboardingFormValidationSchema: ObjectSchema<OnboardingFormProps> =
  Yup.object().shape({
    firstName: Yup.string()
      .max(50, 'First name should be shorter than 50 characters')
      .required('Field is required'),
    lastName: Yup.string()
      .max(50, 'Last name should be shorter than 50 characters')
      .required('Field is required'),
    phone: Yup.string()
      .matches(/\+1[0-9]{10}/, 'Incorrect phone number')
      .required('Field is required'),
    corporationNumber: Yup.string()
      .length(9, 'Incorrect Corporation Number length')
      .required('Field is required')
      .test('Backend validation', async (value) => {
        const corporationNumberValidationResult =
          await validateCorporationNumber(value)
        if (!corporationNumberValidationResult.valid) {
          return new ValidationError(
            corporationNumberValidationResult.message ?? '',
            value,
            'corporationNumber',
          )
        } else {
          return true
        }
      }),
  })
