import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpCode,
	UsePipes,
	HttpStatus,
	UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ZodValidationPipe } from 'src/utils/validation.pipe'
import {
	CreateUserDto,
	createUserSchema,
	UpdateUserDto,
} from './schema/users.schema'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Role, Roles } from 'src/utils/roles.decorator'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createUserSchema))
	async create(@Body() createUserDto: CreateUserDto) {
		const user = await this.usersService.create(createUserDto)

		return { data: user, httpStatus: HttpStatus.CREATED }
	}

	@Get()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	async findAll() {
		const user = await this.usersService.findAll()
		return { data: user, httpStatus: HttpStatus.OK }
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	async findOne(@Param('id') id: string) {
		const user = await this.usersService.findOne(id)
		delete user.refreshToken
		return { data: user, httpStatus: HttpStatus.OK }
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		const user = await this.usersService.update(id, updateUserDto)
		return { data: user, httpStatus: HttpStatus.OK }
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	async remove(@Param('id') id: string) {
		const user = await this.usersService.remove(id)
		return { data: user, httpStatus: HttpStatus.OK }
	}
}
