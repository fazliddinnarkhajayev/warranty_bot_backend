import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { KnexModule } from './database/knex.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { ProductsModule } from './modules/products/products.module';
import { RegionsModule } from './modules/regions/regions.module';
import { DistrictsModule } from './modules/districts/districts.module';

@Module({
  imports: [
    KnexModule,
    UsersModule,
    SellersModule,
    ProductsModule,
    RegionsModule,
    DistrictsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
