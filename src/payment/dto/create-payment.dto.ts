import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsIn,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Full name of the person making payment',
    example: 'Иван Иванов',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'ivan@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Source of the payment',
    example: 'Website',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  source: string;

  @ApiProperty({
    description: 'Product name',
    example: 'MINI_GOLDI Subscription',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  product: string;

  @ApiProperty({
    description: 'Payment amount in kopecks',
    example: 299900, // 2999 rubles
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({
    description: 'Promo code ID if used',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  promoCodeId?: number;

  @ApiPropertyOptional({
    description: 'Current status of the payment',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  @IsOptional()
  @IsIn(Object.values(PaymentStatus))
  status?: PaymentStatus;
}
