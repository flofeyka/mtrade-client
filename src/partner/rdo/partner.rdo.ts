import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RequisiteType, PartnerBonusStatus } from '@prisma/client';

export class PartnerRdo {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier of the partner',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The name of the partner',
    example: 'John Doe Trading Company',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Unique username for the partner',
    example: 'johndoe_trading',
  })
  username: string;

  @Expose()
  @ApiProperty({
    description: 'Payment requisites for the partner',
    example: '4111111111111111',
  })
  requisites: string;

  @Expose()
  @ApiProperty({
    description: 'Type of payment requisites',
    enum: RequisiteType,
    example: RequisiteType.Card,
  })
  requisiteType: RequisiteType;

  @Expose()
  @ApiProperty({
    description: 'Current status of partner bonus',
    enum: PartnerBonusStatus,
    example: PartnerBonusStatus.PENDING,
  })
  bonusStatus: PartnerBonusStatus;

  @Expose()
  @ApiProperty({
    description: 'Unique partner code for referrals and tracking',
    example: 'PARTNER_JD_2024',
  })
  code: string;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'Timestamp when the partner was created',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}

export class PartnerListRdo {
  @Expose()
  @Type(() => PartnerRdo)
  @ApiProperty({
    description: 'List of partners',
    type: [PartnerRdo],
  })
  partners: PartnerRdo[];

  @Expose()
  @ApiProperty({
    description: 'Total number of partners',
    example: 42,
  })
  total: number;
}
