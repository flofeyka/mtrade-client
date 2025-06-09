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
}
