import { z } from 'zod'

export const createTodoSchema = z
	.object({
		text: z.string({
			required_error: 'text is required',
			invalid_type_error: 'text must be a string',
		}),
		done: z.boolean({
			required_error: 'done is required',
			invalid_type_error: 'done must be a boolean',
		}),
	})
	.required()

export type CreateTodoDto = z.infer<typeof createTodoSchema>
