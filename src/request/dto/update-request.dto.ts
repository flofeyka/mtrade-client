import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from './create-request.dto';

export class UpdateRequestDto {
  @ApiPropertyOptional({
    description: 'Full name of the person making the request',
    example: 'Иван Петров',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+7 (999) 123-45-67',
    minLength: 1,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'ivan@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

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

  @ApiPropertyOptional({
    description: 'Source of the request',
    example: 'Website',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    description: 'Current status of the request',
    enum: RequestStatus,
    example: RequestStatus.APPROVED,
  })
  @IsOptional()
  @IsIn(Object.values(RequestStatus))
  status?: RequestStatus;
}
