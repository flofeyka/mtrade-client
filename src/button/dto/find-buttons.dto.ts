import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsISO8601 } from 'class-validator';

export class FindButtonsDto {
  @ApiProperty({
    title: 'Page parameter',
    description: 'Page number',
    example: 1,
  })
  @IsOptional()
  @IsString()
  page?: string = '1';

  @ApiProperty({
    title: 'Page size parameter',
    description: 'Items per page',
    example: 10,
  })
  @IsOptional()
  @IsString()
  pageSize?: string = '10';

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
