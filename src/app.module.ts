import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TodosModule } from './todos/todos.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TodosModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
