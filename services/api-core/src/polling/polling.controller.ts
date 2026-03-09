import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PollingService } from './polling.service';
import { CreatePollDto, SubmitPollResponseDto } from './polling.dto';

@ApiTags('polling')
@Controller('sessions/:sessionCode/polls')
export class PollingController {
  constructor(private readonly pollingService: PollingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new poll in a session' })
  @ApiCreatedResponse({ description: 'Poll created' })
  create(@Param('sessionCode') sessionCode: string, @Body() dto: CreatePollDto) {
    // TODO: Resolve sessionCode → sessionId via SessionsService before creating poll.
    return this.pollingService.create(sessionCode, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all polls in a session' })
  @ApiOkResponse({ description: 'Poll list' })
  findAll(@Param('sessionCode') sessionCode: string) {
    return this.pollingService.findBySession(sessionCode);
  }

  @Get(':pollId')
  @ApiOperation({ summary: 'Get a specific poll' })
  @ApiParam({ name: 'pollId', description: 'Poll UUID' })
  findOne(@Param('pollId') pollId: string) {
    return this.pollingService.findById(pollId);
  }

  @Patch(':pollId/activate')
  @ApiOperation({ summary: 'Activate a poll (make it live)' })
  activate(@Param('pollId') pollId: string) {
    return this.pollingService.activate(pollId);
  }

  @Patch(':pollId/close')
  @ApiOperation({ summary: 'Close a poll' })
  close(@Param('pollId') pollId: string) {
    return this.pollingService.close(pollId);
  }

  @Post(':pollId/responses')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Submit a response to an active poll' })
  async submitResponse(
    @Param('pollId') pollId: string,
    @Body() dto: SubmitPollResponseDto,
  ) {
    await this.pollingService.submitResponse(pollId, dto);
  }

  @Get(':pollId/results')
  @ApiOperation({ summary: 'Get aggregated poll results' })
  getResults(@Param('pollId') pollId: string) {
    return this.pollingService.getResults(pollId);
  }
}
