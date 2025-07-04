import { Injectable } from '@nestjs/common';
import { StatsRepository } from './stats.repository';

@Injectable()
export class StatsService {

  constructor(
    private readonly repo: StatsRepository
  ) { }

  getOverallStats() {
    return this.repo.findOverallStats();
  }

  getOrgStats() {
    return this.repo.findOrgStats();
  }

  getProjectsStats() {
    return this.repo.findProjectsStats();
  }

}
