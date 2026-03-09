import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsObject,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: 'Q3 All-Hands Meeting', description: 'Display title for the session' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({
    example: { allowAnonymous: true, captionLanguage: 'en-US' },
    description: 'Arbitrary settings map persisted as JSON',
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;

  // TODO: Add hostId once auth is implemented (derived from JWT subject).
  // TODO: Add scheduledStartAt / scheduledEndAt for calendar integrations.
  // TODO: Add maxParticipants for license enforcement.
}
