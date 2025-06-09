import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VisitorRdo {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier of the visitor',
    example: 'uuid-string-12345',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Traffic source of the visitor',
    example: 'Google Ads',
  })
  trafficSource: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'UTM tags for tracking',
    example: 'utm_source=google&utm_medium=cpc&utm_campaign=brand',
  })
  utmTags?: string;

  @Expose()
  @ApiProperty({
    description: 'Country of the visitor',
    example: 'Russia',
  })
  country: string;

  @Expose()
  @ApiProperty({
    description: 'Device type of the visitor',
    example: 'Desktop',
  })
  device: string;

  @Expose()
  @ApiProperty({
    description: 'Browser used by the visitor',
    example: 'Chrome 120.0',
  })
  browser: string;

  @Expose()
  @ApiProperty({
    description: 'Number of pages viewed by the visitor',
    example: 5,
  })
  pagesViewed: number;

  @Expose()
  @ApiProperty({
    description: 'Time spent on site by the visitor',
    example: '00:05:30',
  })
  timeOnSite: string;

  @Expose()
  @ApiProperty({
    description: 'Cookie file associated with the visitor',
    example: 'visitor_session_12345.cookie',
  })
  cookieFile: string;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'Timestamp when the visitor was created',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'Timestamp when the visitor was last updated',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}

export class VisitorListRdo {
  @Expose()
  @Type(() => VisitorRdo)
  @ApiProperty({
    description: 'List of visitors',
    type: [VisitorRdo],
  })
  visitors: VisitorRdo[];

  @Expose()
  @ApiProperty({
    description: 'Total number of visitors',
    example: 42,
  })
  total: number;

  @Expose()
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @Expose()
  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @Expose()
  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;
}
