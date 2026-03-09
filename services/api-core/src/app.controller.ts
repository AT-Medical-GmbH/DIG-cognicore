import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health-check endpoint consumed by load balancers, Kubernetes liveness
   * probes, and uptime monitors.
   */
  @Get('health')
  @ApiOperation({ summary: 'Service health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth(): Record<string, unknown> {
    return this.appService.getHealth();
  }
}
