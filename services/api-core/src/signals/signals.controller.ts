import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SignalsService } from './signals.service';
import { CreateSignalDto } from './signals.dto';

@ApiTags('signals')
@Controller('sessions/:sessionCode/signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  /**
   * Records a new audience signal (raise hand, reaction, etc.).
   * In production this will also be emitted via the realtime-gateway.
   */
  @Post()
  @ApiOperation({ summary: 'Send an audience signal' })
  @ApiCreatedResponse({ description: 'Signal recorded' })
  create(
    @Param('sessionCode') sessionCode: string,
    @Body() dto: CreateSignalDto,
  ) {
    // TODO: Derive participantId from auth JWT / socket presence map.
    const participantId = 'anon';
    return this.signalsService.create(sessionCode, participantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all visible signals for a session' })
  @ApiOkResponse({ description: 'Signal list' })
  findAll(@Param('sessionCode') sessionCode: string) {
    return this.signalsService.findBySession(sessionCode);
  }

  @Delete(':signalId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Dismiss a single signal' })
  @ApiParam({ name: 'signalId', description: 'Signal UUID' })
  @ApiNoContentResponse({ description: 'Signal dismissed' })
  async dismiss(
    @Param('sessionCode') sessionCode: string,
    @Param('signalId') signalId: string,
  ) {
    await this.signalsService.dismiss(sessionCode, signalId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Dismiss all signals for a session' })
  @ApiNoContentResponse({ description: 'All signals dismissed' })
  async dismissAll(@Param('sessionCode') sessionCode: string) {
    await this.signalsService.dismissAll(sessionCode);
  }
}
