import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindVisitorsDto {
  @ApiProperty({
    title: 'Search parameter',
    description: 'Searches by traffic source, country, device, or browser',
    example: 'Google',
  })
  @IsOptional()
  @IsString()
  search?: string;

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
  limit?: string = '10';

  @ApiProperty({
    title: 'Country parameter',
    description: 'Filter by country',
    example: 'Russia',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    title: 'Device parameter',
    description: 'Filter by device',
    example: 'Desktop',
  })
  @IsOptional()
  @IsString()
  device?: string;

  @ApiProperty({
    title: 'Browser parameter',
    description: 'Filter by browser',
    example: 'Chrome',
  })
  @IsOptional()
  @IsString()
  browser?: string;

  @ApiProperty({
    title: 'Traffic source parameter',
    description: 'Filter by traffic source',
    example: 'Google Ads',
  })
  @IsOptional()
  @IsString()
  trafficSource?: string;

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
