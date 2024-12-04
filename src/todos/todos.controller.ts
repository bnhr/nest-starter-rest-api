import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpCode,
} from '@nestjs/common'
import { TodosService } from './todos.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { sendSuccess } from 'src/utils/response'

@Controller('todos')
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	@Post()
	@HttpCode(201)
	create(@Body() createTodoDto: CreateTodoDto) {
		const todo = this.todosService.create(createTodoDto)
		return sendSuccess('CREATED', todo)
	}

	@Get()
	findAll() {
		const todos = this.todosService.findAll()
		return sendSuccess('OK', todos)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		const todos = this.todosService.findOne(+id)
		return sendSuccess('OK', todos)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
		const todo = this.todosService.update(+id, updateTodoDto)
		return sendSuccess('OK', todo)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		const todo = this.todosService.remove(+id)
		return sendSuccess('OK', todo)
	}
}
