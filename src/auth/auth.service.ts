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
import * as crypto from 'crypto'

@Injectable()
export class AuthService {
	constructor(
		private user: UsersService,
		private hashing: HashingService,
		private jwt: JwtService,
	) {}

	// Method to create a short, secure representation of the token
	private createTokenFingerprint(token: string): string {
		// Use SHA-256 to create a fixed-length representation
		return crypto
			.createHash('sha256')
			.update(token)
			.digest('hex')
			.substring(0, 32) // Take first 32 characters for a shorter representation of refresh token
	}

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

		// Compare the fingerprint of the incoming token with stored token
		const incomingTokenFingerprint = this.createTokenFingerprint(refreshToken)

		if (incomingTokenFingerprint !== user.refreshToken) {
			throw new ForbiddenException({
				details: 'Invalid credential',
			})
		}

		const tokens = await this.createToken(user.id, user.username, user.role)
		await this.updateRefreshToken(user.id, tokens.refresh_token)
		return tokens
	}

	async updateRefreshToken(id: string, refreshToken: string) {
		const tokenFingerprint = this.createTokenFingerprint(refreshToken)
		await this.user.updateToken(id, tokenFingerprint)
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
