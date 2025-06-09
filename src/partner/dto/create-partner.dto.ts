import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequisiteType, PartnerBonusStatus } from '@prisma/client';

export { RequisiteType, PartnerBonusStatus } from '@prisma/client';

export class CreatePartnerDto {
  @ApiProperty({
    description: 'The name of the partner',
    example: 'John Doe Trading Company',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Unique username for the partner',
    example: 'johndoe_trading',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description:
      'Payment requisites for the partner (card number, wallet, etc.)',
    example: '4111111111111111',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  requisites: string;

  @ApiProperty({
    description: 'Type of payment requisites',
    enum: RequisiteType,
    example: RequisiteType.Card,
  })
  @IsEnum(RequisiteType)
  requisiteType: RequisiteType;

  @ApiProperty({
    description: 'Current status of partner bonus',
    enum: PartnerBonusStatus,
    example: PartnerBonusStatus.PENDING,
  })
  @IsEnum(PartnerBonusStatus)
  bonusStatus: PartnerBonusStatus;

  @ApiProperty({
    description: 'Unique partner code for referrals and tracking',
    example: 'PARTNER_JD_2024',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  code: string;
}
