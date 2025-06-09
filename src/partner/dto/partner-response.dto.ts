import { ApiProperty } from '@nestjs/swagger';
import { RequisiteType, PartnerBonusStatus } from '@prisma/client';

export class PartnerResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the partner',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the partner',
    example: 'John Doe Trading Company',
  })
  name: string;

  @ApiProperty({
    description: 'Unique username for the partner',
    example: 'johndoe_trading',
  })
  username: string;

  @ApiProperty({
    description: 'Payment requisites for the partner',
    example: '4111111111111111',
  })
  requisites: string;

  @ApiProperty({
    description: 'Type of payment requisites',
    enum: RequisiteType,
    example: RequisiteType.Card,
  })
  requisiteType: RequisiteType;

  @ApiProperty({
    description: 'Current status of partner bonus',
    enum: PartnerBonusStatus,
    example: PartnerBonusStatus.PENDING,
  })
  bonusStatus: PartnerBonusStatus;

  @ApiProperty({
    description: 'Unique partner code for referrals and tracking',
    example: 'PARTNER_JD_2024',
  })
  code: string;

  @ApiProperty({
    description: 'Timestamp when the partner was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message or array of validation errors',
    oneOf: [
      { type: 'string', example: 'Partner not found' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['name should not be empty', 'username must be a string'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error identifier',
    example: 'Bad Request',
  })
  error: string;
}
