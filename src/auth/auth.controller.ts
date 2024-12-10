import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
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
	@Get('me/:username')
	async me(@Param('username') username: string) {
		const user = await this.authService.me(username)
		return { data: user, httpStatus: HttpStatus.OK }
	}

	@UseGuards(RefreshGuard)
	@Post('refresh')
	async refresh() {
		const user = 'a'
		return { data: user, httpStatus: HttpStatus.OK }
	}
}
