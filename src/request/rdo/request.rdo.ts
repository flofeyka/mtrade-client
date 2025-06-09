import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from '../dto/create-request.dto';

export class RequestRdo {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier of the request',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'Full name of the person making the request',
    example: 'Иван Иванов',
  })
  fullName: string;

  @Expose()
  @ApiProperty({
    description: 'Phone number',
    example: '+7 (999) 123-45-67',
  })
  phone: string;

  @Expose()
  @ApiProperty({
    description: 'Email address',
    example: 'ivan@example.com',
  })
  email: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Telegram username or contact',
    example: '@ivan_telegram',
  })
  telegram?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Partner referral code',
    example: 'PARTNER_ABC_2024',
  })
  partnerCode?: string;

  @Expose()
  @ApiProperty({
    description: 'Source of the request',
    example: 'Website',
  })
  source: string;

  @Expose()
  @ApiProperty({
    description: 'Current status of the request',
    enum: RequestStatus,
    example: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'Timestamp when the request was created',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'Timestamp when the request was last updated',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}

export class RequestListRdo {
  @Expose()
  @Type(() => RequestRdo)
  @ApiProperty({
    description: 'List of requests',
    type: [RequestRdo],
  })
  requests: RequestRdo[];

  @Expose()
  @ApiProperty({
    description: 'Total number of requests',
    example: 42,
  })
  total: number;
}
