import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto, UpdateUserDto } from './schema/users.schema'
import { Prisma } from '@prisma/client'
import { HashingService } from 'src/utils/hashing.service'

@Injectable()
export class UsersService {
	constructor(
		private prisma: PrismaService,
		private hashService: HashingService,
	) {}

	async create(createUserDto: CreateUserDto) {
		try {
			const { email, password, role, username } = createUserDto

			const hashedPass = await this.hashService.createHash(password)

			const newUser = await this.prisma.user.create({
				data: {
					email,
					password: hashedPass,
					username,
					role,
				},
				select: {
					id: true,
					username: true,
				},
			})
			return newUser
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					const targetField = e.meta?.target?.[0] // the field that causing the issue
					if (targetField === 'username') {
						throw new ConflictException({
							details: `user with this username already exists`,
						})
					} else if (targetField === 'email') {
						throw new ConflictException({
							details: `user with this email already exists`,
						})
					} else {
						throw new ConflictException({
							details: `user with this unique constraint already exists`,
						})
					}
				}
				throw e
			}
		}
	}

	async findAll() {
		const todos = await this.prisma.user.findMany({
			select: {
				id: true,
				email: true,
				username: true,
				role: true,
			},
		})
		return todos
	}

	async findOne(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				username: true,
				role: true,
			},
		})

		if (!user) {
			throw new NotFoundException({
				details: `no user with id of ${id}`,
			})
		}
		return user
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		try {
			const updatedUser = await this.prisma.user.update({
				where: { id },
				select: {
					id: true,
					username: true,
				},
				data: updateUserDto,
			})
			return updatedUser
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2025') {
					throw new NotFoundException({
						details: `no user with id of ${id}`,
					})
				}
				throw e
			}
		}
	}

	async remove(id: string) {
		try {
			return await this.prisma.user.delete({
				where: { id },
				select: {
					id: true,
					username: true,
				},
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2025') {
					throw new NotFoundException({
						details: `no user with id of ${id}`,
					})
				}
				throw e
			}
		}
	}
}
