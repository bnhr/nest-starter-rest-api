import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTodoDto, UpdateTodoDto } from './schema/todos.schema'
import { Prisma } from '@prisma/client'

@Injectable()
export class TodosService {
	constructor(private prisma: PrismaService) {}

	async create(createTodoDto: CreateTodoDto) {
		const { text, done } = createTodoDto
		const newUser = await this.prisma.todo.create({
			data: {
				text,
				done,
			},
		})
		return newUser
	}

	async findAll() {
		const todos = await this.prisma.todo.findMany()
		return todos
	}

	async findOne(id: number) {
		const todo = await this.prisma.todo.findUnique({
			where: { id },
		})

		if (!todo) {
			throw new NotFoundException({
				details: `no todo with id of ${id}`,
			})
		}
		return todo
	}

	async update(id: number, updateTodoDto: UpdateTodoDto) {
		try {
			const updatedTodo = await this.prisma.todo.update({
				where: { id },
				data: updateTodoDto,
			})
			return updatedTodo
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2025') {
					throw new NotFoundException({
						details: `no todo with id of ${id}`,
					})
				}
			}
			throw e
		}
	}

	async remove(id: number) {
		try {
			return await this.prisma.todo.delete({
				where: { id },
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2025') {
					throw new NotFoundException({
						details: `no todo with id of ${id}`,
					})
				}
			}
			throw e
		}
	}
}
