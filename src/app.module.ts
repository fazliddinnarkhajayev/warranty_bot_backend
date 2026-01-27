import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { KnexModule } from './database/knex.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { ProductsModule } from './modules/products/products.module';
import { RegionsModule } from './modules/regions/regions.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { WarrantyHistoriesRepository } from './shared/repositories/warranty-histories.repository';

@Module({
  imports: [
    KnexModule,
    UsersModule,
    SellersModule,
    ProductsModule,
    RegionsModule,
    DistrictsModule,
    TelegramModule
  ],
  controllers: [AppController],
  providers: [AppService, WarrantyHistoriesRepository],
})
export class AppModule { }
