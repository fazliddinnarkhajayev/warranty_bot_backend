import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { KnexService } from 'src/database/knex.service';
import { UserRole } from 'src/shared/enums/user-roles.enum';
import { CreateOrganizationUserDto } from './dto/create-organization-user.dto';

@Injectable()
export class OrganizationUsersRepository {
  constructor(private readonly knex: KnexService) { }

  private table = 'organization_users';

  async create(orgId: number, dto: CreateOrganizationUserDto) {
    return this.knex.getClient().transaction(async trx => {

      // create a new user with org_worker role
      const [user] = await trx('users')
        .insert({
          name: dto.name,
          role: UserRole.ORG_MEMBER,
          created_by: dto.created_by,
        })
        .returning('*');

      // apply organization_id and user_id
      const [orgUser] = await trx('organization_users')
        .insert({
          org_id: orgId,
          user_id: user.id,
        })
        .returning('*');

      return {
        user,
        organization_user: orgUser,
      };
    });
  }

  async findAll(orgId: number, offset: number, limit: number) {
    return this.knex.getClient()(this.table)
      .select('*')
      .where('org_id', orgId)
      .offset(offset)
      .limit(limit)
      .orderBy('id', 'DESC');
  }

  async findById(orgId: number, id: number) {
    return this.knex.getClient()(this.table).where({ id, org_id: orgId }).first();
  }

  async findOneById(id: number) {
    return this.knex.getClient()(this.table).where({ id }).first();
  }

  async update(orgId: number, id: number, data: { name?: string }) {
    const [org] = await this.knex.getClient()(this.table)
      .where({ id, org_id: orgId })
      .update(data)
      .returning('*');
    return org;
  }

  async delete(orgId: number, id: number) {

    const data = await this.knex.getClient()(this.table)
      .where({ id, org_id: orgId })
      .first();

    if (!data) {
      throw new NotFoundException(`Data not found`);
    }

    return this.knex.getClient()(this.table).where({ id, org_id: orgId }).del();
  }

  async countAll(orgId: number) {
    return this.knex.getClient()(this.table).count('* as count').where('org_id', orgId);
  }
}
