import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  IsArray,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum PollType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  WORD_CLOUD = 'WORD_CLOUD',
  RATING = 'RATING',
  OPEN_ENDED = 'OPEN_ENDED',
}

export enum PollStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export class CreatePollDto {
  @ApiProperty({ enum: PollType, example: PollType.MULTIPLE_CHOICE })
  @IsEnum(PollType)
  type!: PollType;

  @ApiProperty({ example: 'Which feature matters most to you?' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  question!: string;

  @ApiPropertyOptional({
    example: ['Performance', 'Reliability', 'Ease of use'],
    description: 'Options for MULTIPLE_CHOICE polls',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  // TODO: Add durationSeconds for timed polls.
  // TODO: Add anonymousVoting flag.
  // TODO: Add allowMultipleSelections for multi-select polls.
}

export class SubmitPollResponseDto {
  @ApiProperty({ example: 'Performance', description: 'Selected option or text answer' })
  @IsString()
  @MaxLength(500)
  value!: string;

  // TODO: Add participantId once auth / presence is wired.
}
