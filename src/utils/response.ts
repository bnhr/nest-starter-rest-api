import {
	HttpException,
	HttpStatus,
	BadRequestException,
	UnauthorizedException,
	ForbiddenException,
	NotFoundException,
	ConflictException,
	InternalServerErrorException,
} from '@nestjs/common'

type successType = 'OK' | 'CREATED'

export function sendSuccess<T>(message: successType = 'OK', data: T) {
	return {
		status: 'success',
		message,
		data,
	}
}

export function sendBadRequest<T>(
	details?: T,
	message: string = 'Bad Request',
): never {
	throw new BadRequestException({
		status: 'error',
		message,
		details,
	})
}

export function sendUnauthorized<T>(
	details?: T,
	message: string = 'Unauthorized',
): never {
	throw new UnauthorizedException({
		status: 'error',
		message,
		details,
	})
}

export function sendForbidden<T>(
	details?: T,
	message: string = 'Forbidden',
): never {
	throw new ForbiddenException({
		status: 'error',
		message,
		details,
	})
}

export function sendNotFound<T>(
	details?: T,
	message: string = 'Not Found',
): never {
	throw new NotFoundException({
		status: 'error',
		message,
		details,
	})
}

export function sendConflict<T>(
	details?: T,
	message: string = 'Conflict',
): never {
	throw new ConflictException({
		status: 'error',
		message,
		details,
	})
}

export function sendServerError<T>(
	details?: T,
	message: string = 'Internal Server Error',
): never {
	throw new InternalServerErrorException({
		status: 'error',
		message,
		details,
	})
}

// Custom HTTP status code handler
export function sendCustomError<T>(
	status: HttpStatus,
	details?: T,
	message: string = 'Error',
): never {
	throw new HttpException(
		{
			status: 'error',
			message,
			details,
		},
		status,
	)
}
