import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ButtonRdo {
  @ApiProperty({
    description: 'Unique identifier of the button',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Name of the button',
    example: 'Download App',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Type of the button',
    example: 'primary',
  })
  @Expose()
  type: string;

  @ApiPropertyOptional({
    description: 'URL that the button points to',
    example: 'https://app.mtrade.com/download',
  })
  @Expose()
  url?: string;

  @ApiPropertyOptional({
    description: 'Description of the button',
    example: 'Download our mobile application',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Whether the button is active',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'Number of times the button was clicked',
    example: 42,
  })
  @Expose()
  clickCount: number;

  @ApiProperty({
    description: 'Date when the button was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the button was last updated',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
