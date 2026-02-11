import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramAuthService } from './telegram.auth.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { WarrantyHistoriesRepository } from 'src/shared/repositories/warranty-histories.repository';
import { CustomersRepository } from 'src/shared/repositories/customers.repository';
import { SellersModule } from '../sellers/sellers.module';
import { TechniciansModule } from '../technicians/technicians.module';
import { ServicesLogsRepository } from 'src/shared/repositories/services-logs.repository';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    UsersModule,
    SellersModule,
    TechniciansModule
  ],
  providers: [
    TelegramService,
    TelegramAuthService,
    WarrantyHistoriesRepository,
    CustomersRepository,
    ServicesLogsRepository
  ],
  exports: [
    TelegramService,
    TelegramAuthService,
    UsersModule,
    ProductsModule,
    UsersModule,
    SellersModule,
    TechniciansModule,
    UsersModule,
    ProductsModule,
    UsersModule,
    SellersModule,
    TechniciansModule,
    WarrantyHistoriesRepository,
    CustomersRepository,
    ServicesLogsRepository
  ]
})
export class TelegramModule { }
