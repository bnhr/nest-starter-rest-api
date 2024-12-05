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
} from '@nestjs/common'
import { TodosService } from './todos.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'

@Controller('todos')
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	@Post()
	@HttpCode(201)
	create(@Body() createTodoDto: CreateTodoDto) {
		this.todosService.create(createTodoDto)

		return { httpStatus: HttpStatus.CREATED }
	}

	@Get()
	findAll() {
		const todos = this.todosService.findAll()
		return { data: todos, httpStatus: HttpStatus.OK }
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		const todos = this.todosService.findOne(+id)
		return { data: todos, httpStatus: HttpStatus.OK }
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
		const todo = this.todosService.update(+id, updateTodoDto)
		return { data: todo, httpStatus: HttpStatus.OK }
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		const todo = this.todosService.remove(+id)
		return { data: todo, httpStatus: HttpStatus.OK }
	}
}
