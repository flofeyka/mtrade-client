import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: 'The text content of the notification',
    example: 'Updated: System maintenance postponed to next week',
    minLength: 1,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    description: 'The end date and time when the notification expires',
    example: '2025-01-15T23:59:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  end?: string;
}
