import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {

  constructor(private readonly service: StatsService) { }

  @Get('overall')
  getOverallStats() {
    return this.service.getOverallStats();
  }

  @Get('organizations')
  getOrgStats() {
    return this.service.getOrgStats();
  }

  @Get('projects')
  getProjectsStats() {
    return this.service.getProjectsStats();
  }
}
