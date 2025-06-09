import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePromoCodeDto {
  @ApiProperty({
    description: 'Promo code value',
    example: 'SAVE20',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  code: string;

  @ApiPropertyOptional({
    description: 'Discount percentage (0-100)',
    example: 20,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @ApiPropertyOptional({
    description: 'Discount amount in kopecks',
    example: 50000,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({
    description: 'Whether the promo code is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum number of times the code can be used',
    example: 100,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional({
    description: 'Expiration date of the promo code',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
