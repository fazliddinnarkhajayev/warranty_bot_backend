import { Module } from '@nestjs/common';
import { DistrictsController } from './districts.controller';
import { DistrictsRepository } from './districts.repository';
import { DistrictsService } from './districts.service';

@Module({
  controllers: [DistrictsController],
  providers: [DistrictsService, DistrictsRepository],
  exports: [DistrictsService]
})
export class DistrictsModule { }
