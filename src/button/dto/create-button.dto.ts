import { IsString, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateButtonDto {
  @ApiProperty({
    description: 'Name of the button',
    example: 'Download App',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Type of the button',
    example: 'primary',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  type: string;

  @ApiPropertyOptional({
    description: 'URL that the button points to',
    example: 'https://app.mtrade.com/download',
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({
    description: 'Description of the button',
    example: 'Download our mobile application',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the button is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
