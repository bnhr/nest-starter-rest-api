import {
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { HashingService } from 'src/utils/hashing.service'
import { LoginDto, RegisterDto } from './schema/auth.schema'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'

@Injectable()
export class AuthService {
	constructor(
		private user: UsersService,
		private hashing: HashingService,
		private jwt: JwtService,
	) {}

	async validateUser(username: string, password: string) {
		const user = await this.user.findByUsername(username)

		const isValidPassword = await this.hashing.validateHash(
			password,
			user.password,
		)

		if (!isValidPassword) {
			throw new UnauthorizedException({
				details: `Invalid credential`,
			})
		}

		return user
	}

	async register(registerDto: RegisterDto) {
		const newUser = await this.user.create(registerDto)
		return newUser
	}

	async login(user: LoginDto) {
		const usr = await this.user.findByUsername(user.username)
		if (usr) {
			const token = await this.createToken(usr.id, usr.username, usr.role)
			await this.updateRefreshToken(usr.id, token.refresh_token)
			return token
		}
	}

	async me(user: User) {
		const usr = await this.user.findByUsername(user.username)
		delete usr.password
		return usr
	}

	async logout(id: string) {
		const updated = await this.user.logout(id)
		return updated
	}

	async refreshTokens(userId: string, refreshToken: string) {
		const user = await this.user.findOne(userId)
		if (!user || !user.refreshToken) {
			throw new ForbiddenException({
				details: 'Access Denied',
			})
		}
		const refreshTokenMatches = await this.hashing.validateHash(
			refreshToken,
			user.refreshToken,
		)
		if (!refreshTokenMatches)
			throw new ForbiddenException({
				details: 'Invalid credential',
			})
		const tokens = await this.createToken(user.id, user.username, user.role)
		await this.updateRefreshToken(user.id, tokens.refresh_token)
		return tokens
	}

	async updateRefreshToken(id: string, refreshToken: string) {
		const hashedRefreshToken = await this.hashing.createHash(refreshToken)
		await this.user.updateToken(id, hashedRefreshToken)
	}

	async createToken(id: string, username: string, role: string) {
		const [access_token, refresh_token] = await Promise.all([
			this.jwt.signAsync(
				{
					sub: id,
					username,
					role,
				},
				{
					secret: String(process.env.JWT_SECRET),
					expiresIn: String(process.env.JWT_EXP),
					algorithm: 'HS256',
				},
			),
			this.jwt.signAsync(
				{
					sub: id,
					username,
					role,
				},
				{
					secret: String(process.env.JWT_SECRET),
					expiresIn: String(process.env.JWT_REFRESH_EXP),
					algorithm: 'HS256',
				},
			),
		])

		return { access_token, refresh_token }
	}
}
