import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramAuthService } from './telegram.auth.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { WarrantyHistoriesRepository } from 'src/shared/repositories/warranty-histories.repository';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    UsersModule
  ],
  providers: [
    TelegramService, 
    TelegramAuthService,
    WarrantyHistoriesRepository
  ]
})
export class TelegramModule {}
