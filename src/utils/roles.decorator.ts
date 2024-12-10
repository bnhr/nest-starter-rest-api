import { SetMetadata } from '@nestjs/common'

export enum Role {
	ADMIN = 'ADMIN',
	USER = 'USER',
}
export const ROLES_KEY = 'roles'
export const Roles = (...role: Role[]) => SetMetadata(ROLES_KEY, role)
