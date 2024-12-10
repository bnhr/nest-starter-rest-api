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
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ZodValidationPipe } from 'src/utils/validation.pipe'
import {
	CreateUserDto,
	createUserSchema,
	UpdateUserDto,
} from './schema/users.schema'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createUserSchema))
	async create(@Body() createUserDto: CreateUserDto) {
		const user = await this.usersService.create(createUserDto)

		return { data: user, httpStatus: HttpStatus.CREATED }
	}

	@Get()
	async findAll() {
		const user = await this.usersService.findAll()
		return { data: user, httpStatus: HttpStatus.OK }
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const user = await this.usersService.findOne(id)
		return { data: user, httpStatus: HttpStatus.OK }
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		const user = await this.usersService.update(id, updateUserDto)
		return { data: user, httpStatus: HttpStatus.OK }
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		const user = await this.usersService.remove(id)
		return { data: user, httpStatus: HttpStatus.OK }
	}
}
