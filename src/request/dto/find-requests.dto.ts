import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindRequestsDto {
  @ApiProperty({
    title: 'Search parameter',
    description: 'Searches by full name, email, phone, or telegram',
    example: 'Иван Иванов',
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
    example: 15,
  })
  @IsOptional()
  @IsString()
  limit?: string = '15';

  @ApiProperty({
    title: 'Request status parameter',
    description: 'Request status parameter',
    example: RequestStatus.APPROVED,
  })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @ApiProperty({
    title: 'Source parameter',
    description: 'Source the traffic',
    example: 'Google ads',
  })
  @IsOptional()
  @IsString()
  source?: string;

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
