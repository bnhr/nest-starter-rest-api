import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	HttpStatus,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
	status: string
	message?: string
	data?: T
	totalRecords?: number
	metadata?: any
	httpStatus?: HttpStatus
}

@Injectable()
export class TransformInterceptor<T>
	implements NestInterceptor<T, Response<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<Response<T>> {
		return next.handle().pipe(
			map((data) => {
				const response: Response<T> = {
					status: 'success',
				}

				if (data.data !== undefined) {
					response.data = data.data
				}

				if (Array.isArray(data.data) && data.data.length > 0) {
					response.totalRecords = data.data.length
				}

				// Store the httpStatus temporarily
				const httpStatus = data.httpStatus || HttpStatus.OK

				// Set the HTTP status code
				const ctx = context.switchToHttp()
				const res = ctx.getResponse()
				res.status(httpStatus)

				// Remove httpStatus from the response object
				delete response.httpStatus

				// Set the message based on httpStatus
				switch (httpStatus) {
					case HttpStatus.CREATED:
						response.message = 'Created'
						break
					case HttpStatus.NO_CONTENT:
						response.message = 'No Content'
						break
					default:
						response.message = 'OK'
						break
				}

				return response
			}),
		)
	}
}
