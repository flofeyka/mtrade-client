import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindNotificationsDto {
  @ApiProperty({
    title: 'Find parameter',
    description: 'Searches by value',
    example: 'Host',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    title: 'Date from parameter',
    description: 'Filter from date (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiProperty({
    title: 'Date to parameter',
    description: 'Filter to date (ISO string)',
    example: '2024-01-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsString()
  dateTo?: string;
}
