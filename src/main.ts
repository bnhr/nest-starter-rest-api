import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'

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
	await app.listen(PORT)
}
bootstrap()
