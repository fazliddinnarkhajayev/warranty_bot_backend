import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramAuthService } from './telegram.auth.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { WarrantyHistoriesRepository } from 'src/shared/repositories/warranty-histories.repository';
import { SellersModule } from '../sellers/sellers.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    UsersModule,
    SellersModule
  ],
  providers: [
    TelegramService, 
    TelegramAuthService,
    WarrantyHistoriesRepository
  ]
})
export class TelegramModule {}
