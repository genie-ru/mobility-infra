import { Controller, Get } from '@nestjs/common';

// GET /api/health → {"status":"ok"}（web の healthcheck / CI が参照）
@Controller('health')
export class HealthController {
  @Get()
  health() {
    return { status: 'ok' };
  }
}
