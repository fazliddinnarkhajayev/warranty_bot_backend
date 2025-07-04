import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { StatsModule } from './modules/stats/stats.module';
import { KnexModule } from './database/knex.module';

@Module({
  imports: [
    KnexModule,
    UsersModule,
    OrganizationsModule,
    TasksModule, 
    StatsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
