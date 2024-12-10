import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest()
		const authHeader = request.headers.authorization

		// Check if Authorization header exists and starts with Bearer
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException({
				details: 'Token is not valid',
			})
		}

		// Extract token and check if it's not empty
		const token = authHeader.split(' ')[1]
		if (!token) {
			throw new UnauthorizedException({
				details: 'Token is not presented',
			})
		}

		return super.canActivate(context)
	}
}
