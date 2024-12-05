import { PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodSchema, ZodError } from 'zod'

interface ValidationErrorDetail {
	field: string
	error: string
}

interface ValidationErrorResponse {
	status: 'error'
	message: string
	details: ValidationErrorDetail[]
}

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodSchema) {}

	transform(value: unknown) {
		try {
			// Validate the input against the Zod schema
			const parsedValue = this.schema.parse(value)
			return parsedValue
		} catch (error) {
			// Check if the error is a ZodError
			if (error instanceof ZodError) {
				// Transform Zod errors into the custom error format
				const details: ValidationErrorDetail[] = error.errors.map((err) => ({
					field: err.path.join('.'), // Convert path array to dot notation
					error: err.message,
				}))

				const validationError: ValidationErrorResponse = {
					status: 'error',
					message: 'Validation failed',
					details,
				}

				// Throw a BadRequestException with the custom error format
				throw new BadRequestException(validationError)
			}

			// If it's not a ZodError, rethrow the original error
			throw error
		}
	}
}
