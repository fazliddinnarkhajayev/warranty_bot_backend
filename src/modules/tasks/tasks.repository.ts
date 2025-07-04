import { Injectable, NotFoundException } from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksRepository {
  constructor(private readonly knex: KnexService) { }

  private table = 'tasks';

  async create(data: CreateTaskDto) {
    const [task] = await this.knex.getClient()(this.table)
      .insert({ ...data, status: 'CREATED', created_at: new Date() })
      .returning('*');
    return task;
  }

  async findAll(offset: number, limit: number) {
    return this.knex.getClient()(this.table)
      .select('*')
      .offset(offset)
      .limit(limit)
      .orderBy('id', 'DESC');
  }

  async findById(id: number) {
    return this.knex.getClient()(this.table).where({ id }).first();
  }

  async findTasksGroupedByProject() {
    const rows = await this.knex.getClient()('projects as p')
      .leftJoin('tasks as t', 'p.id', 't.project_id')
      .select(
        'p.id as project_id',
        'p.name as project_name',
        this.knex.getClient().raw(`COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', t.id,
            'title', t.title,
            'status', t.status,
            'due_date', t.due_date
          )
        ) FILTER (WHERE t.id IS NOT NULL), '[]') as tasks`)
      )
      .groupBy('p.id', 'p.name')
      .orderBy('p.id');

    return rows;
  }

  async update(id: number, data: { name?: string }) {
    const [org] = await this.knex.getClient()(this.table)
      .where({ id })
      .update(data)
      .returning('*');
    return org;
  }

  async delete(id: number) {
    return this.knex.getClient()(this.table).where({ id }).del();
  }

  async countAll() {
    return this.knex.getClient()(this.table).count('* as count');
  }
  
  async findUserTasksGroupedByProject(userId, offset: number, limit: number) {
    const rows = await this.knex.getClient()('projects as p')
      .leftJoin('tasks as t', 'p.id', 't.project_id')
      .select(
        'p.id as project_id',
        'p.name as project_name',
        this.knex.getClient().raw(`COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', t.id,
            'status', t.status,
            'due_date', t.due_date
          )
        ) FILTER (WHERE t.id IS NOT NULL), '[]') as tasks`)
      )
      .where('worker_user_id', userId)
      .offset(offset)
      .limit(limit)
      .groupBy('p.id', 'p.name')
      .orderBy('p.id');

    return rows;
  }

  async getUserTasksGroupedByStatusPerProjectPaginated(userId: number, offset: number, limit: number) {
    const rawQuery = `
      SELECT
        p.id AS project_id,
        p.name AS project_name,
        
        COALESCE(
          JSON_AGG(
            CASE WHEN t.status = 'CREATED' THEN
              JSON_BUILD_OBJECT('id', t.id, 'name', t.name, 'due_date', t.due_date, 'created_at', t.created_at, 'done_at', t.done_at)
            END
          ) FILTER (WHERE t.status = 'CREATED'), '[]'
        ) AS "CREATED",
  
        COALESCE(
          JSON_AGG(
            CASE WHEN t.status = 'IN_PROCESS' THEN
              JSON_BUILD_OBJECT('id', t.id, 'name', t.name, 'due_date', t.due_date, 'created_at', t.created_at, 'done_at', t.done_at)
            END
          ) FILTER (WHERE t.status = 'IN_PROCESS'), '[]'
        ) AS "IN_PROCESS",
  
        COALESCE(
          JSON_AGG(
            CASE WHEN t.status = 'DONE' THEN
              JSON_BUILD_OBJECT('id', t.id, 'name', t.name, 'due_date', t.due_date, 'created_at', t.created_at, 'done_at', t.done_at)
            END
          ) FILTER (WHERE t.status = 'DONE'), '[]'
        ) AS "DONE"
  
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id AND t.worker_user_id = ?
      GROUP BY p.id, p.name
      ORDER BY p.id
      OFFSET ? LIMIT ?
    `;
  
    const result = await this.knex.getClient().raw(rawQuery, [userId, offset, limit]);
    return result.rows;
  }
  
    
}
