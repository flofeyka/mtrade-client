import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RequisiteType, PartnerBonusStatus } from '@prisma/client';

export class UpdatePartnerDto {
  @ApiPropertyOptional({
    description: 'The name of the partner',
    example: 'Updated Trading Company Name',
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Unique username for the partner',
    example: 'updated_username',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description:
      'Payment requisites for the partner (card number, wallet, etc.)',
    example: '5555555555554444',
    minLength: 1,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  requisites?: string;

  @ApiPropertyOptional({
    description: 'Type of payment requisites',
    enum: RequisiteType,
    example: RequisiteType.Yoomoney,
  })
  @IsOptional()
  @IsEnum(RequisiteType)
  requisiteType?: RequisiteType;

  @ApiPropertyOptional({
    description: 'Current status of partner bonus',
    enum: PartnerBonusStatus,
    example: PartnerBonusStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(PartnerBonusStatus)
  bonusStatus?: PartnerBonusStatus;

  @ApiPropertyOptional({
    description: 'Unique partner code for referrals and tracking',
    example: 'UPDATED_CODE_2024',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  code?: string;
}
