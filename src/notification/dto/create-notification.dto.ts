import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The text content of the notification',
    example: 'System maintenance will begin at 2 AM tomorrow',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The end date and time when the notification expires',
    example: '2024-12-31T23:59:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  end: string;
}
