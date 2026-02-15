import { Module } from '@nestjs/common';
import { ServicesLogsRepository } from 'src/shared/repositories/services-logs.repository';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, ServicesLogsRepository]
})
export class ServicesModule { }
