import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TodosModule } from './todos/todos.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TodosModule,
		UsersModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
