import { z } from 'zod'

const baseTodoSchema = z.object({
	text: z
		.string({
			required_error: 'text is required',
			invalid_type_error: 'text must be a string',
		})
		.min(3, 'text must be at least 3 characters')
		.max(255, 'text cannot exceed 255 characters'),
	done: z.boolean({
		required_error: 'done is required',
		invalid_type_error: 'done must be a boolean',
	}),
})

export const createTodoSchema = baseTodoSchema.required()

export const updateTodoSchema = baseTodoSchema.partial()

// Infer types from schemas
export type CreateTodoDto = z.infer<typeof createTodoSchema>
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>
