import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpCode,
	HttpStatus,
	UsePipes,
} from '@nestjs/common'
import { TodosService } from './todos.service'
import {
	CreateTodoDto,
	createTodoSchema,
	UpdateTodoDto,
} from './schema/todos.schema'
import { ZodValidationPipe } from 'src/utils/validation.pipe'

@Controller('todos')
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createTodoSchema))
	async create(@Body() createTodoDto: CreateTodoDto) {
		const todo = await this.todosService.create(createTodoDto)

		return { data: todo, httpStatus: HttpStatus.CREATED }
	}

	@Get()
	async findAll() {
		const todos = await this.todosService.findAll()
		return { data: todos, httpStatus: HttpStatus.OK }
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const todos = await this.todosService.findOne(+id)
		return { data: todos, httpStatus: HttpStatus.OK }
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
		const todo = await this.todosService.update(+id, updateTodoDto)
		return { data: todo, httpStatus: HttpStatus.OK }
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		const todo = await this.todosService.remove(+id)
		return { data: todo, httpStatus: HttpStatus.OK }
	}
}
