import { useFormik } from 'formik'
import {
  Box,
  Button,
  Card,
  CardBody,
  Text,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react'
import { submitForm } from '../../services/VaultService.ts'
import { OnboardingFormProps } from '../../types/OnboardingForm.ts'
import { useCallback, FocusEvent } from 'react'
import { OnboardingFormValidationSchema } from './ValidationSchema.ts'

export const OnboardingForm = () => {
  const formik = useFormik<OnboardingFormProps>({
    initialValues: {
      firstName: '',
      lastName: '',
      corporationNumber: '',
      phone: '',
    },
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values) => {
      formik.setStatus(undefined)
      const result = await submitForm(values)
      if (result !== undefined) {
        formik.setStatus(result.message)
      }
    },
    validationSchema: OnboardingFormValidationSchema,
  })

  const onFieldBlur = useCallback(
    (event: FocusEvent) => {
      formik.validateField(event.target.id)
    },
    [formik],
  )

  return (
    <Flex bg='gray.200' align='center' justify='center' h='100vh' w='100vw'>
      <Box bg='white' p={6} rounded='md'>
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4} align='flex-start'>
            <HStack spacing={4} align='flex-start'>
              <FormControl isInvalid={!!formik.errors.firstName}>
                <FormLabel htmlFor='firstName'>First Name</FormLabel>
                <Input
                  id='firstName'
                  name='firstName'
                  type='text'
                  variant='outline'
                  onChange={formik.handleChange}
                  onBlur={onFieldBlur}
                  value={formik.values.firstName}
                ></Input>
                <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors.lastName}>
                <FormLabel htmlFor='lastName'>Last Name</FormLabel>
                <Input
                  id='lastName'
                  name='lastName'
                  type='text'
                  variant='outline'
                  onChange={formik.handleChange}
                  onBlur={onFieldBlur}
                  value={formik.values.lastName}
                ></Input>
                <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
              </FormControl>
            </HStack>
            <FormControl isInvalid={!!formik.errors.phone}>
              <FormLabel htmlFor='phone'>Phone Number</FormLabel>
              <Input
                id='phone'
                name='phone'
                type='tel'
                variant='outline'
                onChange={formik.handleChange}
                onBlur={onFieldBlur}
                value={formik.values.phone}
              ></Input>
              <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!formik.errors.corporationNumber}>
              <FormLabel htmlFor='corporationNumber'>
                Corporation Number
              </FormLabel>
              <Input
                id='corporationNumber'
                name='corporationNumber'
                type='text'
                variant='outline'
                onChange={formik.handleChange}
                onBlur={onFieldBlur}
                value={formik.values.corporationNumber}
              ></Input>
              <FormErrorMessage>
                {formik.errors.corporationNumber}
              </FormErrorMessage>
            </FormControl>
            <Button type='submit' colorScheme='blackAlpha' width='full'>
              Submit
            </Button>
            {formik.status && (
              <Card bg='red.100' width='100%'>
                <CardBody>
                  <Text>{formik.status}</Text>
                </CardBody>
              </Card>
            )}
          </VStack>
        </form>
      </Box>
    </Flex>
  )
}
