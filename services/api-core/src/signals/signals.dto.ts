import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum SignalType {
  RAISE_HAND = 'RAISE_HAND',
  THUMBS_UP = 'THUMBS_UP',
  THUMBS_DOWN = 'THUMBS_DOWN',
  CONFUSED = 'CONFUSED',
  SPEED_UP = 'SPEED_UP',
  SLOW_DOWN = 'SLOW_DOWN',
  CUSTOM = 'CUSTOM',
}

export class CreateSignalDto {
  @ApiProperty({ enum: SignalType, example: SignalType.RAISE_HAND })
  @IsEnum(SignalType)
  type!: SignalType;

  @ApiPropertyOptional({ example: 'Can you explain that last slide?', maxLength: 280 })
  @IsOptional()
  @IsString()
  @MaxLength(280)
  message?: string;

  // TODO: participantId will be derived from auth token / socket presence map.
}
