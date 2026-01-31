import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramAuthService } from './telegram.auth.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { WarrantyHistoriesRepository } from 'src/shared/repositories/warranty-histories.repository';
import { CustomersRepository } from 'src/shared/repositories/customers.repository';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    UsersModule
  ],
  providers: [
    TelegramService,
    TelegramAuthService,
    WarrantyHistoriesRepository,
    CustomersRepository
  ]
})
export class TelegramModule { }
