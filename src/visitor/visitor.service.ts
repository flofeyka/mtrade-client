import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { VisitorRdo, VisitorListRdo } from './rdo/visitor.rdo';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class VisitorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVisitorDto): Promise<VisitorRdo> {
    const visitor = await this.prisma.visitor.create({
      data: dto,
    });

    return plainToInstance(VisitorRdo, visitor);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    country?: string,
    device?: string,
    browser?: string,
    trafficSource?: string,
  ): Promise<VisitorListRdo> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (country) {
      where.country = {
        contains: country,
        mode: 'insensitive',
      };
    }
    if (device) {
      where.device = {
        contains: device,
        mode: 'insensitive',
      };
    }
    if (browser) {
      where.browser = {
        contains: browser,
        mode: 'insensitive',
      };
    }
    if (trafficSource) {
      where.trafficSource = {
        contains: trafficSource,
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
