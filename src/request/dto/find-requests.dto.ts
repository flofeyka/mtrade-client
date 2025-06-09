import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindRequestsDto {
  @ApiProperty({
    title: 'Search parameter',
    description: 'Searches by username',
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
}
