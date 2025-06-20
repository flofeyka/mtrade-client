import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsISO8601 } from 'class-validator';

export class FindPartnersDto {
  @ApiProperty({
    title: 'Find parameter',
    description: 'Searches by username',
    example: 'supalonely',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Start date for filtering (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  dateFrom?: string;

  @ApiProperty({
    description: 'End date for filtering (ISO 8601 format)',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  dateTo?: string;
}
