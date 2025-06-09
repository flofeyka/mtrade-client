import { Module } from '@nestjs/common';
import { ButtonService } from './button.service';
import { ButtonController } from './button.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ButtonController],
  providers: [ButtonService, PrismaService],
})
export class ButtonModule {}
