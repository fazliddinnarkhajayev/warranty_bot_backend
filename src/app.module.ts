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
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TechniciansModule } from './modules/technicians/technicians.module';
import { CustomersRepository } from './shared/repositories/customers.repository';
import { MobileModule } from './modules/mobile/mobile.module';

@Module({
  imports: [
    KnexModule,
    UsersModule,
    SellersModule,
    ProductsModule,
    RegionsModule,
    DistrictsModule,
    TelegramModule,
    AuthModule,
    TechniciansModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'superStrongSecret123',
    }),
    MobileModule,
  ],
  controllers: [AppController],
  providers: [AppService, WarrantyHistoriesRepository, CustomersRepository],
})
export class AppModule { }
