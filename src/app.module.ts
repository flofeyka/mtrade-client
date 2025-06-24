import { Module } from '@nestjs/common';
import { PartnerModule } from './partner/partner.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { RequestModule } from './request/request.module';
import { VisitorModule } from './visitor/visitor.module';
import { ButtonModule } from './button/button.module';

@Module({
  imports: [
    PartnerModule,
    AuthModule,
    NotificationModule,
    RequestModule,
    VisitorModule,
    ButtonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
