import { Module } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService, 
    TasksRepository,
    UsersRepository
  ],
  exports: [TasksService]
})
export class TasksModule {}
