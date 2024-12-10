import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards,
	UsePipes,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ZodValidationPipe } from 'src/utils/validation.pipe'
import {
	LoginDto,
	loginUserSchema,
	RegisterDto,
	registerUserSchema,
} from './schema/auth.schema'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RefreshGuard } from './guards/refresh.guard'
import RequestWithUser from 'src/utils/req-user'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post('register')
	@UsePipes(new ZodValidationPipe(registerUserSchema))
	async register(@Body() registerDto: RegisterDto) {
		const user = await this.authService.register(registerDto)
		return { data: user, httpStatus: HttpStatus.CREATED }
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	@UsePipes(new ZodValidationPipe(loginUserSchema))
	async login(@Body() loginDto: LoginDto) {
		const user = await this.authService.login(loginDto)
		return { data: user, httpStatus: HttpStatus.OK }
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async me(@Request() req: RequestWithUser) {
		const user = await this.authService.me(req.user)
		return { data: user, httpStatus: HttpStatus.OK }
	}

	@UseGuards(RefreshGuard)
	@Get('refresh')
	async refresh(@Request() req: RequestWithUser) {
		const token = await this.authService.refreshTokens(
			req.user.id,
			req.user.refreshToken,
		)
		return { data: token, httpStatus: HttpStatus.OK }
	}
}
