import { Module } from '@nestjs/common';
import { UsersRepository } from 'src/modules/users/users.repository';
import { OrganizationUsersController } from './organization-users.controller';
import { OrganizationUsersRepository } from './organization-users.repository';
import { OrganizationUsersService } from './organization-users.service';

@Module({
  controllers: [OrganizationUsersController],
  providers: [
    OrganizationUsersService, 
    OrganizationUsersRepository,
    UsersRepository
  ],
  exports: [OrganizationUsersService]
})
export class OrganizationUsersModule {}
