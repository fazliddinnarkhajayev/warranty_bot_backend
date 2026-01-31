import { Module } from '@nestjs/common';
import { TechniciansController } from './technicians.controller';
import { TechniciansRepository } from './technicians.repository';
import { TechniciansService } from './technicians.service';

@Module({
  controllers: [TechniciansController],
  providers: [TechniciansService, TechniciansRepository],
  exports: [TechniciansService]
})
export class TechniciansModule { }
