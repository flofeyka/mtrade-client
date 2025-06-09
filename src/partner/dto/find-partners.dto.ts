import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindPartnersDto {
  @ApiProperty({
    title: 'Find parameter',
    description: 'Searches by username',
    example: 'supalonely',
  })
  @Optional()
  @IsString()
  search?: string;
}
