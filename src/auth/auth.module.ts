import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { HashingService } from 'src/utils/hashing.service'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategies/jwt.strategy'
import { RefreshStrategy } from './strategies/refresh.stategy'
import { RolesGuard } from './guards/roles.guard'
import { UsersModule } from 'src/users/users.module'

@Module({
	imports: [PassportModule, UsersModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [
		AuthService,
		HashingService,
		JwtStrategy,
		RefreshStrategy,
		RolesGuard,
	],
	exports: [AuthService],
})
export class AuthModule {}
