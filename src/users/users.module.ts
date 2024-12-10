import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { HashingService } from 'src/utils/hashing.service'
import { RolesGuard } from 'src/auth/guards/roles.guard'

@Module({
	imports: [PrismaModule],
	controllers: [UsersController],
	providers: [UsersService, HashingService, RolesGuard],
	exports: [UsersService],
})
export class UsersModule {}
