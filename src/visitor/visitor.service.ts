import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { FindVisitorsDto } from './dto/find-visitors.dto';
import { VisitorRdo, VisitorListRdo } from './rdo/visitor.rdo';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';

@Injectable()
export class VisitorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVisitorDto): Promise<VisitorRdo> {
    const visitor = await this.prisma.visitor.create({
      data: dto,
    });

    return plainToInstance(VisitorRdo, visitor);
  }

  async findAll(dto: FindVisitorsDto): Promise<VisitorListRdo> {
    const page = parseInt(dto.page || '1');
    const limit = parseInt(dto.limit || '10');
    const skip = (page - 1) * limit;

    const where: Prisma.VisitorWhereInput = {};

    if (dto.search) {
      where.OR = [
        {
          trafficSource: {
            contains: dto.search,
            mode: 'insensitive',
          },
        },
        {
          country: {
            contains: dto.search,
            mode: 'insensitive',
          },
        },
        {
          device: {
            contains: dto.search,
            mode: 'insensitive',
          },
        },
        {
          browser: {
            contains: dto.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Date filtering
    if (dto.dateFrom || dto.dateTo) {
      where.createdAt = {};
      if (dto.dateFrom) {
        where.createdAt.gte = new Date(dto.dateFrom);
      }
      if (dto.dateTo) {
        where.createdAt.lte = new Date(dto.dateTo);
      }
    }

    // Specific filters
    if (dto.country) {
      where.country = {
        contains: dto.country,
        mode: 'insensitive',
      };
    }
    if (dto.device) {
      where.device = {
        contains: dto.device,
        mode: 'insensitive',
      };
    }
    if (dto.browser) {
      where.browser = {
        contains: dto.browser,
        mode: 'insensitive',
      };
    }
    if (dto.trafficSource) {
      where.trafficSource = {
        contains: dto.trafficSource,
        mode: 'insensitive',
      };
    }

    const [visitors, total] = await Promise.all([
      this.prisma.visitor.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.visitor.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return plainToInstance(VisitorListRdo, {
      visitors,
      total,
      page,
      limit,
      totalPages,
    });
  }

  async findOne(id: string): Promise<VisitorRdo> {
    const visitor = await this.prisma.visitor.findUnique({
      where: { id },
    });

    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }

    return plainToInstance(VisitorRdo, visitor);
  }

  async update(id: string, dto: UpdateVisitorDto): Promise<VisitorRdo> {
    const existingVisitor = await this.prisma.visitor.findUnique({
      where: { id },
    });

    if (!existingVisitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }

    const visitor = await this.prisma.visitor.update({
      where: { id },
      data: dto,
    });

    return plainToInstance(VisitorRdo, visitor);
  }

  async remove(id: string): Promise<VisitorRdo> {
    const existingVisitor = await this.prisma.visitor.findUnique({
      where: { id },
    });

    if (!existingVisitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }

    const visitor = await this.prisma.visitor.delete({
      where: { id },
    });

    return plainToInstance(VisitorRdo, visitor);
  }

  async findByCountry(country: string): Promise<VisitorRdo[]> {
    const visitors = await this.prisma.visitor.findMany({
      where: {
        country: {
          contains: country,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return visitors.map((visitor) => plainToInstance(VisitorRdo, visitor));
  }

  async findByTrafficSource(trafficSource: string): Promise<VisitorRdo[]> {
    const visitors = await this.prisma.visitor.findMany({
      where: {
        trafficSource: {
          contains: trafficSource,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return visitors.map((visitor) => plainToInstance(VisitorRdo, visitor));
  }

  async getStatsByCountry(): Promise<Record<string, number>> {
    const stats = await this.prisma.visitor.groupBy({
      by: ['country'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    return stats.reduce(
      (acc, stat) => {
        acc[stat.country] = stat._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async getStatsByDevice(): Promise<Record<string, number>> {
    const stats = await this.prisma.visitor.groupBy({
      by: ['device'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    return stats.reduce(
      (acc, stat) => {
        acc[stat.device] = stat._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async getStatsByBrowser(): Promise<Record<string, number>> {
    const stats = await this.prisma.visitor.groupBy({
      by: ['browser'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    return stats.reduce(
      (acc, stat) => {
        acc[stat.browser] = stat._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
