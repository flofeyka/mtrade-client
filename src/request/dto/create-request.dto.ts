import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export class CreateRequestDto {
  @ApiProperty({
    description: 'Full name of the person making the request',
    example: 'Иван Иванов',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+7 (999) 123-45-67',
    minLength: 1,
    maxLength: 20,
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Email address',
    example: 'ivan@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Telegram username or contact',
    example: '@ivan_telegram',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({
    description: 'Partner referral code',
    example: 'PARTNER_ABC_2024',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  partnerCode?: string;

  @ApiProperty({
    description: 'Source of the request',
    example: 'Website',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  source: string;

  @ApiPropertyOptional({
    description: 'Current status of the request',
    enum: RequestStatus,
    example: RequestStatus.PENDING,
  })
  @IsOptional()
  @IsIn(Object.values(RequestStatus))
  status?: RequestStatus;
}
