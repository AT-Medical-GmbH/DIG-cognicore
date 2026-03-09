import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CaptionsService } from './captions.service';
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

class IngestCaptionDto {
  @IsString()
  @MaxLength(2000)
  text!: string;

  @IsString()
  language!: string;

  @IsNumber()
  startTime!: number;

  @IsNumber()
  endTime!: number;

  @IsOptional()
  @IsBoolean()
  isFinal?: boolean;
}

@ApiTags('captions')
@Controller('sessions/:sessionCode/captions')
export class CaptionsController {
  constructor(private readonly captionsService: CaptionsService) {}

  /**
   * Internal endpoint called by speech-gateway to push a caption segment.
   * TODO: Secure this endpoint with a service-to-service API key / mTLS.
   */
  @Post()
  @ApiOperation({ summary: 'Ingest a caption segment (speech-gateway internal)' })
  @ApiCreatedResponse({ description: 'Segment ingested' })
  ingest(@Param('sessionCode') sessionCode: string, @Body() dto: IngestCaptionDto) {
    return this.captionsService.ingest({
      sessionId: sessionCode,
      text: dto.text,
      language: dto.language,
      startTime: dto.startTime,
      endTime: dto.endTime,
      isFinal: dto.isFinal ?? true,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all caption segments for a session' })
  @ApiOkResponse({ description: 'Caption segment list' })
  findAll(@Param('sessionCode') sessionCode: string) {
    return this.captionsService.findBySession(sessionCode);
  }

  @Get('transcript')
  @ApiOperation({ summary: 'Get plain-text transcript for a session' })
  @ApiOkResponse({ description: 'Transcript text' })
  async getTranscript(@Param('sessionCode') sessionCode: string) {
    const text = await this.captionsService.getTranscript(sessionCode);
    return { sessionCode, transcript: text };
  }
}
