import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { HttpExceptionFilter } from './utils/http-exception.filter'
import { TransformInterceptor } from './utils/transform.interceptor'

async function bootstrap() {
	const PORT = parseInt(process.env.PORT) || 8080

	const app = await NestFactory.create(AppModule)
	app.use(helmet())
	app.setGlobalPrefix('/api')
	app.enableCors({
		origin: 'http://localhost:5173',
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		credentials: true,
		preflightContinue: true,
	})
	app.useGlobalFilters(new HttpExceptionFilter())
	app.useGlobalInterceptors(new TransformInterceptor())
	await app.listen(PORT)
}
bootstrap()
