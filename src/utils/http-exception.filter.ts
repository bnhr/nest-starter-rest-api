import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR

		// Get the raw exception response
		const exceptionResponse = exception.getResponse()

		const errorResponse = {
			status: 'error',
			message: 'Validation failed',
			details: [],
		}
		// If the exception has a details property (from Zod validation)
		if (exceptionResponse && (exceptionResponse as any).details) {
			errorResponse.details = (exceptionResponse as any).details
		}
		// Fallback for other types of validation errors
		else if (
			status === HttpStatus.BAD_REQUEST &&
			Array.isArray((exceptionResponse as any).message)
		) {
			errorResponse.details = (exceptionResponse as any).message.map(
				(msg: string) => ({
					field: msg.split(' ')[0],
					error: msg,
				}),
			)
		}

		response.status(status).json(errorResponse)
	}
}
