import { Injectable, NotFoundException } from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly knex: KnexService) { }

  private table = 'projects';

  async create(data: CreateProjectDto) {
    const [project] = await this.knex.getClient()(this.table)
      .insert(data)
      .returning('*');
    return project;
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
  
    return await this.knex.getClient()(this.table)
      .where({ id, org_id: orgId })
      .del();
  }
  


  async countAll(orgId: number, ) {
    return this.knex.getClient()(this.table).count('* as count').where('org_id', orgId);
  }
}
