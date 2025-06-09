import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '../dto/create-payment.dto';

export class PromoCodeInfo {
  @Expose()
  @ApiProperty({
    description: 'Promo code ID',
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
}

// Тип для данных из Prisma
export interface PaymentFromPrisma {
  id: number;
  fullName: string;
  email: string;
  source: string;
  product: string;
  amount: number;
  promoCodeId?: number | null;
  promoCode?: {
    id: number;
    code: string;
    discountPercent: number | null;
    discountAmount: number | null;
  } | null;
  status: 'PENDING' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentRdo {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier of the payment',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'Full name of the person making payment',
    example: 'Иван Иванов',
  })
  fullName: string;

  @Expose()
  @ApiProperty({
    description: 'Email address',
    example: 'ivan@example.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'Source of the payment',
    example: 'Website',
  })
  source: string;

  @Expose()
  @ApiProperty({
    description: 'Product name',
    example: 'MINI_GOLDI Subscription',
  })
  product: string;

  @Expose()
  @ApiProperty({
    description: 'Payment amount in kopecks',
    example: 299900,
  })
  amount: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Promo code ID',
    example: 1,
  })
  promoCodeId?: number | null;

  @Expose()
  @Type(() => PromoCodeInfo)
  @ApiPropertyOptional({
    description: 'Promo code used for this payment',
    type: PromoCodeInfo,
  })
  promoCode?: PromoCodeInfo | null;

  @Expose()
  @ApiProperty({
    description: 'Current status of the payment',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'Timestamp when the payment was created',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'Timestamp when the payment was last updated',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}

export class PaymentListRdo {
  @Expose()
  @ApiProperty({
    description: 'List of payments',
    type: [PaymentRdo],
  })
  payments: PaymentFromPrisma[];

  @Expose()
  @ApiProperty({
    description: 'Total number of payments',
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

export class PaymentStatsRdo {
  @Expose()
  @ApiProperty({
    description: 'Number of pending payments',
    example: 5,
  })
  pending: number;

  @Expose()
  @ApiProperty({
    description: 'Number of completed payments',
    example: 37,
  })
  completed: number;

  @Expose()
  @ApiProperty({
    description: 'Total amount of completed payments in kopecks',
    example: 10000000,
  })
  totalAmount: number;
}
