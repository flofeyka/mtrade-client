import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Тип для данных из Prisma
export interface PromoCodeFromPrisma {
  id: number;
  code: string;
  discountPercent: number | null;
  discountAmount: number | null;
  isActive: boolean;
  usageLimit: number | null;
  usageCount: number;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PromoCodeRdo {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier of the promo code',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'Promo code value',
    example: 'SAVE20',
  })
  code: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Discount percentage',
    example: 20,
  })
  discountPercent?: number | null;

  @Expose()
  @ApiPropertyOptional({
    description: 'Discount amount in kopecks',
    example: 50000,
  })
  discountAmount?: number | null;

  @Expose()
  @ApiProperty({
    description: 'Whether the promo code is active',
    example: true,
  })
  isActive: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Maximum number of times the code can be used',
    example: 100,
  })
  usageLimit?: number | null;

  @Expose()
  @ApiProperty({
    description: 'Number of times the code has been used',
    example: 5,
  })
  usageCount: number;

  @Expose()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: 'Expiration date of the promo code',
    example: '2024-12-31T23:59:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  expiresAt?: Date | null;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'Timestamp when the promo code was created',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'Timestamp when the promo code was last updated',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}

export class PromoCodeListRdo {
  @Expose()
  @ApiProperty({
    description: 'List of promo codes',
    type: [PromoCodeRdo],
  })
  promoCodes: PromoCodeFromPrisma[];

  @Expose()
  @ApiProperty({
    description: 'Total number of promo codes',
    example: 42,
  })
  total: number;

  @Expose()
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @Expose()
  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @Expose()
  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;
}
