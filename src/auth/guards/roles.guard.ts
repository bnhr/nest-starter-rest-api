import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role, ROLES_KEY } from 'src/utils/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		if (!requiredRoles) {
			return true
		}

		const { user } = context.switchToHttp().getRequest()
		const hasRole = requiredRoles.some((role) => user.role?.includes(role))

		if (!hasRole) {
			throw new ForbiddenException({
				details: 'Invalid role',
			})
		}
		return hasRole
	}
}
