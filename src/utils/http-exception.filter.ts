import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'

// Define a type for validation errors
interface ValidationError {
	field: string
	errors: string
}

// Generic error response type
interface ErrorResponse<T = null> {
	status: 'error'
	message: string
	details?: T
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest<Request>()
		console.log('🚀 ~ HttpExceptionFilter ~ request:', request)

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR

		const errorResponse: ErrorResponse<ValidationError[]> = {
			status: 'error',
			message:
				exception instanceof HttpException
					? (exception.getResponse() as any).message
					: 'Internal server error',
		}

		if (exception instanceof HttpException) {
			const exceptionResponse = exception.getResponse() as any

			if (exceptionResponse.details) {
				errorResponse.details = exceptionResponse.details
			}

			if (status === HttpStatus.BAD_REQUEST || status === HttpStatus.CONFLICT) {
				const validationErrors: ValidationError[] =
					exceptionResponse.validationErrors || []
				errorResponse.details = validationErrors
			}
		}

		response.status(status).json(errorResponse)
	}
}
