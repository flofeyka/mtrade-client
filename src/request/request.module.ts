import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PartnerModule } from '../partner/partner.module';

@Module({
  imports: [PrismaModule, PartnerModule],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
