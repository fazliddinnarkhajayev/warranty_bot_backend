import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsRepository } from './organizations.repository';
import { OrganizationsService } from './organizations.service';
import { ProjectsModule } from './projects/projects.module';
import { OrganizationUsersModule } from './users/organization-users.module';

@Module({
  imports: [
    OrganizationUsersModule,
    ProjectsModule
  ],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    OrganizationsRepository
  ],
  exports: [OrganizationsService]
})
export class OrganizationsModule { }
