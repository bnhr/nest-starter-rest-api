import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { HashingService } from 'src/utils/hashing.service'

@Module({
	imports: [PrismaModule],
	controllers: [UsersController],
	providers: [UsersService, HashingService],
})
export class UsersModule {}
