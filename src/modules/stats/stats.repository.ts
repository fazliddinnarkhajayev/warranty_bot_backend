import { Injectable, NotFoundException } from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';

@Injectable()
export class StatsRepository {
  constructor(private readonly knex: KnexService) { }


  async findOverallStats() {

    const rawQuery = `
    SELECT
    (SELECT COUNT(*) FROM organizations) AS total_organizations,
    (SELECT COUNT(*) FROM projects) AS total_projects,
    (SELECT COUNT(*) FROM tasks) AS total_tasks;
    `;

    const result = await this.knex.getClient().raw(rawQuery);
    return result.rows;
  }


  async findOrgStats() {

    const rawQuery = `
    SELECT
      o.id AS organization_id,
      o.name AS organization_name,
      COUNT(DISTINCT p.id) AS total_projects,
      COUNT(t.id) AS total_tasks
    FROM organizations o
    LEFT JOIN projects p ON p.org_id = o.id
    LEFT JOIN tasks t ON t.project_id = p.id
    GROUP BY o.id, o.name
    ORDER BY o.id;
    `;

    const result = await this.knex.getClient().raw(rawQuery);
    return result.rows;
  }

  async findProjectsStats() {

    const rawQuery = `
    SELECT
    o.id AS organization_id,
    o.name AS organization_name,
    p.id AS project_id,
    p.name AS project_name,
    COUNT(t.id) AS total_tasks
  FROM projects p
  JOIN organizations o ON o.id = p.org_id
  LEFT JOIN tasks t ON t.project_id = p.id
  GROUP BY o.id, o.name, p.id, p.name
  ORDER BY o.id, p.id;
    `;

    const result = await this.knex.getClient().raw(rawQuery);
    return result.rows;
  }
}
