import { PassportStrategy } from '@nestjs/passport'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: String(process.env.JWT_SECRET),
			passReqToCallback: true,
		})
	}

	validate(req: Request, payload: any) {
		const refreshToken = req.get('authorization').replace('Bearer', '').trim()
		console.log('🚀 ~ RefreshStrategy ~ validate ~ refreshToken:', refreshToken)
		if (!refreshToken)
			throw new ForbiddenException({ details: 'Refresh token malformed' })

		const pl = {
			id: payload.sub,
			username: payload.username,
			role: payload.role,
		}
		return { ...pl, refreshToken }
	}
}
