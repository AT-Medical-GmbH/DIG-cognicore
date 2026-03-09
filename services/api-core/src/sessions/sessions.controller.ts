import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  /**
   * Creates a new session and returns it with a generated 6-digit code.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  @ApiCreatedResponse({ description: 'Session created successfully' })
  async create(@Body() dto: CreateSessionDto) {
    return this.sessionsService.create(dto);
  }

  /**
   * Retrieves a session by its human-readable 6-digit code.
   * Participants use this code to join via the audience app.
   */
  @Get(':code')
  @ApiOperation({ summary: 'Get session by 6-digit code' })
  @ApiParam({ name: 'code', example: 'XJ4K9M', description: '6-character session code' })
  @ApiOkResponse({ description: 'Session found' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async findOne(@Param('code') code: string) {
    return this.sessionsService.findByCode(code);
  }

  /**
   * Updates mutable session properties (title, status, settings).
   */
  @Patch(':code')
  @ApiOperation({ summary: 'Update a session' })
  @ApiParam({ name: 'code', example: 'XJ4K9M' })
  @ApiOkResponse({ description: 'Session updated' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async update(@Param('code') code: string, @Body() dto: UpdateSessionDto) {
    return this.sessionsService.update(code, dto);
  }

  /**
   * Ends a session. The session record is retained for auditing; only
   * the status is transitioned to ENDED.
   */
  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'End (soft-delete) a session' })
  @ApiParam({ name: 'code', example: 'XJ4K9M' })
  @ApiNoContentResponse({ description: 'Session ended' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async remove(@Param('code') code: string) {
    await this.sessionsService.remove(code);
  }
}
