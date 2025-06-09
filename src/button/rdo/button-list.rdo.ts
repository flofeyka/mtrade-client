import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ButtonRdo } from './button.rdo';

export class ButtonListRdo {
  @ApiProperty({
    description: 'Array of buttons',
    type: [ButtonRdo],
  })
  @Expose()
  @Type(() => ButtonRdo)
  data: ButtonRdo[];

  @ApiProperty({
    description: 'Total number of buttons',
    example: 50,
  })
  @Expose()
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  @Expose()
  page: number;

  @ApiProperty({
    description: 'Number of buttons per page',
    example: 10,
  })
  @Expose()
  pageSize: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  @Expose()
  totalPages: number;
}
