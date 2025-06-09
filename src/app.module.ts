import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PartnerModule } from './partner/partner.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { RequestModule } from './request/request.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { PaymentModule } from './payment/payment.module';
import { VisitorModule } from './visitor/visitor.module';
import { ButtonModule } from './button/button.module';

@Module({
  imports: [
    UserModule,
    PartnerModule,
    AuthModule,
    NotificationModule,
    RequestModule,
    PromoCodeModule,
    PaymentModule,
    VisitorModule,
    ButtonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
