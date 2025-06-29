import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestRdo, RequestListRdo } from './rdo/request.rdo';
import { plainToInstance } from 'class-transformer';
import { FindRequestsDto } from './dto/find-requests.dto';
import { Prisma, PartnerBonusStatus } from '@prisma/client';
import { PartnerService } from '../partner/partner.service';

@Injectable()
export class RequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly partnerService: PartnerService,
  ) {}

  async create(dto: CreateRequestDto): Promise<RequestRdo> {
    const request = await this.prisma.request.create({
      data: dto,
    });

    // Если указан партнерский код, обновляем статус бонуса партнера на PENDING
    if (dto.partnerCode) {
      try {
        const partner = await this.partnerService.findByCode(dto.partnerCode);
        if (partner) {
          await this.partnerService.update(partner.id, {
            bonusStatus: PartnerBonusStatus.PENDING,
          });
        }
      } catch (error) {
        // Логируем ошибку, но не прерываем создание заявки
        console.warn(
          `Failed to update partner bonus status for code ${dto.partnerCode}:`,
          error,
        );
      }
    }

    return plainToInstance(RequestRdo, request);
  }

  async findAll(dto: FindRequestsDto): Promise<RequestListRdo> {
    const skip = (Number(dto?.page || 1) - 1) * Number(dto?.limit || 15);

    const where: Prisma.RequestWhereInput = {};

    if (dto?.status) {
      where.status = dto.status;
    }
    if (dto?.source) {
      where.source = {
        contains: dto.source,
        mode: 'insensitive',
      };
    }

    if (dto?.dateFrom || dto?.dateTo) {
      where.createdAt = {};
      if (dto.dateFrom) {
        where.createdAt.gte = new Date(dto.dateFrom);
      }
      if (dto.dateTo) {
        where.createdAt.lte = new Date(dto.dateTo);
      }
    }

    if (dto?.search) {
      where.OR = [
        {
          fullName: {
            contains: dto.search,
            mode: 'insensitive',
          },
        },
        {
          telegram: {
            contains: dto.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: dto.search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: dto.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [requests, total] = await Promise.all([
      this.prisma.request.findMany({
        where,
        skip,
        take: +(dto?.limit || 15),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.request.count({ where }),
    ]);

    return plainToInstance(RequestListRdo, {
      requests,
      total,
      page: Number(dto?.page || 1),
      limit: Number(dto?.limit || 15),
      totalPages: Math.ceil(total / Number(dto?.limit || 15)),
    });
  }

  async findOne(id: number): Promise<RequestRdo> {
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return plainToInstance(RequestRdo, request);
  }

  async update(id: number, dto: UpdateRequestDto): Promise<RequestRdo> {
    const existingRequest = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    const request = await this.prisma.request.update({
      where: { id },
      data: dto,
    });

    return plainToInstance(RequestRdo, request);
  }

  async remove(id: number): Promise<RequestRdo> {
    const existingRequest = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    const request = await this.prisma.request.delete({
      where: { id },
    });

    return plainToInstance(RequestRdo, request);
  }

  async findByPartnerCode(partnerCode: string): Promise<RequestRdo[]> {
    const requests = await this.prisma.request.findMany({
      where: {
        partnerCode,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return requests.map((request) => plainToInstance(RequestRdo, request));
  }

  async getStatsByStatus(): Promise<Record<string, number>> {
    const stats = await this.prisma.request.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    return stats.reduce(
      (acc, stat) => {
        acc[stat.status] = stat._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
