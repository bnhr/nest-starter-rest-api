import { z } from 'zod'

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,}$/

const baseUserSchema = z.object({
	username: z
		.string({
			required_error: 'username is required',
			invalid_type_error: 'username must be a string',
		})
		.min(4, 'username must be at least 4 characters')
		.max(20, 'username cannot exceed 20 characters'),
	email: z
		.string({
			required_error: 'email is required',
			invalid_type_error: 'email must be a string',
		})
		.email({
			message: 'email must be a valid email address',
		}),
	password: z
		.string({
			required_error: 'password is required',
			invalid_type_error: 'password must be a string',
		})
		.min(6, 'password must be at least 6 characters')
		.regex(
			passwordRegex,
			'password must be alphanumeric and contain both letters and numbers',
		),
	role: z.enum(['ADMIN', 'USER']).optional().default('USER'),
})

export const createUserSchema = baseUserSchema.required()

export const updateUserSchema = baseUserSchema.partial()

// Infer types from schemas
export type CreateUserDto = z.infer<typeof createUserSchema>
export type UpdateUserDto = z.infer<typeof updateUserSchema>
