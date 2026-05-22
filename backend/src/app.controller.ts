import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Health check' })
  getHealth(): { status: string; timestamp: Date } {
    return { status: 'ok', timestamp: new Date() };
  }
}
