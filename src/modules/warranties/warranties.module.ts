import { Module } from '@nestjs/common';
import { WarrantyHistoriesRepository } from 'src/shared/repositories/warranty-histories.repository';
import { WarrantiesController } from './warranties.controller';
import { WarrantiesService } from './warranties.service';

@Module({
  controllers: [WarrantiesController],
  providers: [WarrantiesService, WarrantyHistoriesRepository]
})
export class WarrantiesModule { }
