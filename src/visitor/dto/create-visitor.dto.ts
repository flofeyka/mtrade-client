import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVisitorDto {
  @ApiProperty({
    description: 'Traffic source of the visitor',
    example: 'Google Ads',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  trafficSource: string;

  @ApiPropertyOptional({
    description: 'UTM tags for tracking',
    example: 'utm_source=google&utm_medium=cpc&utm_campaign=brand',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  utmTags?: string;

  @ApiProperty({
    description: 'Country of the visitor',
    example: 'Russia',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Device type of the visitor',
    example: 'Desktop',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  device: string;

  @ApiProperty({
    description: 'Browser used by the visitor',
    example: 'Chrome 120.0',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  browser: string;

  @ApiPropertyOptional({
    description: 'Number of pages viewed by the visitor',
    example: 5,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagesViewed?: number;

  @ApiProperty({
    description: 'Time spent on site by the visitor',
    example: '00:05:30',
    minLength: 1,
    maxLength: 20,
  })
  @IsString()
  timeOnSite: string;

  @ApiProperty({
    description: 'Cookie file associated with the visitor',
    example: 'visitor_session_12345.cookie',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  cookieFile: string;
}
