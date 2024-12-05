import { HttpStatus } from '@nestjs/common'

export const getStatusText = (statusCode: number): string => {
	const statusMessages: Record<number, string> = {
		[HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
		[HttpStatus.BAD_REQUEST]: 'Bad Request',
		[HttpStatus.NOT_FOUND]: 'Not Found',
		[HttpStatus.CONFLICT]: 'Conflict',
		[HttpStatus.UNAUTHORIZED]: 'Unauthorized',
		[HttpStatus.FORBIDDEN]: 'Forbidden',
		// Add more as needed
	}
	return statusMessages[statusCode] || 'Unknown Status'
}
