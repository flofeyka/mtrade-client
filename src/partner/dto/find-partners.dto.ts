import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindPartnersDto {
  @ApiProperty({
    title: 'Find parameter',
    description: 'Searches by username',
    example: 'supalonely',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
