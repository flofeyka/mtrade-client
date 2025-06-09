import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';
import { PromoCodeListRdo, PromoCodeFromPrisma } from './rdo/promo-code.rdo';

@Injectable()
export class PromoCodeService {
  constructor(private prisma: PrismaService) {}

  async create(createPromoCodeDto: CreatePromoCodeDto) {
    try {
      const promoCode = await this.prisma.promoCode.create({
        data: {
          ...createPromoCodeDto,
          expiresAt: createPromoCodeDto.expiresAt
            ? new Date(createPromoCodeDto.expiresAt)
            : null,
        },
      });
      return promoCode;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Promo code already exists');
      }
      throw error;
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    isActive?: boolean,
  ): Promise<PromoCodeListRdo> {
    const skip = (page - 1) * limit;
    const where = isActive ? { isActive } : {};

    const [promoCodes, total] = await Promise.all([
      this.prisma.promoCode.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.promoCode.count({ where }),
    ]);

    return {
      promoCodes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const promoCode = await this.prisma.promoCode.findUnique({
      where: { id },
      include: {
        payments: {
          select: {
            id: true,
            fullName: true,
            amount: true,
            createdAt: true,
          },
        },
      },
    });

    if (!promoCode) {
      throw new NotFoundException(`Promo code with ID ${id} not found`);
    }

    return promoCode;
  }

  async findByCode(code: string) {
    const promoCode = await this.prisma.promoCode.findUnique({
      where: { code },
    });

    if (!promoCode) {
      throw new NotFoundException(`Promo code "${code}" not found`);
    }

    return promoCode;
  }

  async update(id: number, updatePromoCodeDto: UpdatePromoCodeDto) {
    const existingPromoCode = await this.findOne(id);

    try {
      const updatedPromoCode = await this.prisma.promoCode.update({
        where: { id },
        data: {
          ...updatePromoCodeDto,
          expiresAt: updatePromoCodeDto.expiresAt
            ? new Date(updatePromoCodeDto.expiresAt)
            : undefined,
        },
      });

      return updatedPromoCode;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Promo code already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const existingPromoCode = await this.findOne(id);

    await this.prisma.promoCode.delete({
      where: { id },
    });

    return { message: 'Promo code deleted successfully' };
  }

  async validatePromoCode(code: string): Promise<boolean> {
    const promoCode = await this.prisma.promoCode.findUnique({
      where: { code },
    });

    if (!promoCode || !promoCode.isActive) {
      return false;
    }

    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      return false;
    }

    if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
      return false;
    }

    return true;
  }

  async incrementUsage(id: number) {
    await this.prisma.promoCode.update({
      where: { id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }
}
