import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, PaymentStatus } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  PaymentListRdo,
  PaymentStatsRdo,
  PaymentFromPrisma,
} from './rdo/payment.rdo';
import { PromoCodeService } from '../promo-code/promo-code.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private promoCodeService: PromoCodeService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    // Validate promo code if provided
    if (createPaymentDto.promoCodeId) {
      const promoCode = await this.promoCodeService.findOne(
        createPaymentDto.promoCodeId,
      );
      const isValid = await this.promoCodeService.validatePromoCode(
        promoCode.code,
      );

      if (!isValid) {
        throw new BadRequestException('Promo code is not valid or expired');
      }
    }

    const payment = await this.prisma.payment.create({
      data: createPaymentDto,
      include: {
        promoCode: true,
      },
    });

    // Increment promo code usage if used
    if (createPaymentDto.promoCodeId) {
      await this.promoCodeService.incrementUsage(createPaymentDto.promoCodeId);
    }

    return payment;
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: PaymentStatus,
    search?: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<PaymentListRdo> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { product: { contains: search, mode: 'insensitive' } },
        { source: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          promoCode: {
            select: {
              id: true,
              code: true,
              discountPercent: true,
              discountAmount: true,
            },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        promoCode: {
          select: {
            id: true,
            code: true,
            discountPercent: true,
            discountAmount: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const existingPayment = await this.findOne(id);

    // Validate promo code if provided and different from current
    if (
      updatePaymentDto.promoCodeId &&
      updatePaymentDto.promoCodeId !== existingPayment.promoCodeId
    ) {
      const promoCode = await this.promoCodeService.findOne(
        updatePaymentDto.promoCodeId,
      );
      const isValid = await this.promoCodeService.validatePromoCode(
        promoCode.code,
      );

      if (!isValid) {
        throw new BadRequestException('Promo code is not valid or expired');
      }
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
      include: {
        promoCode: {
          select: {
            id: true,
            code: true,
            discountPercent: true,
            discountAmount: true,
          },
        },
      },
    });

    return updatedPayment;
  }

  async remove(id: number) {
    const existingPayment = await this.findOne(id);

    await this.prisma.payment.delete({
      where: { id },
    });

    return { message: 'Payment deleted successfully' };
  }

  async getStats(dateFrom?: string, dateTo?: string): Promise<PaymentStatsRdo> {
    const dateFilter: any = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) {
        dateFilter.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.createdAt.lte = new Date(dateTo);
      }
    }

    const [pending, completed, totalAmountResult] = await Promise.all([
      this.prisma.payment.count({
        where: { status: PaymentStatus.PENDING, ...dateFilter },
      }),
      this.prisma.payment.count({
        where: { status: PaymentStatus.COMPLETED, ...dateFilter },
      }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.COMPLETED, ...dateFilter },
        _sum: { amount: true },
      }),
    ]);

    return {
      pending,
      completed,
      totalAmount: totalAmountResult._sum.amount || 0,
    };
  }

  async findByEmail(email: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { email },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          promoCode: {
            select: {
              id: true,
              code: true,
              discountPercent: true,
              discountAmount: true,
            },
          },
        },
      }),
      this.prisma.payment.count({ where: { email } }),
    ]);

    return {
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
