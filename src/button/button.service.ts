import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateButtonDto } from './dto/create-button.dto';
import { UpdateButtonDto } from './dto/update-button.dto';
import { FindButtonsDto } from './dto/find-buttons.dto';
import { plainToInstance } from 'class-transformer';
import { ButtonRdo } from './rdo/button.rdo';
import { ButtonListRdo } from './rdo/button-list.rdo';
import { Prisma } from '@prisma/client';

@Injectable()
export class ButtonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createButtonDto: CreateButtonDto): Promise<ButtonRdo> {
    const button = await this.prisma.button.create({
      data: createButtonDto,
    });

    return plainToInstance(ButtonRdo, button, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(dto: FindButtonsDto): Promise<ButtonListRdo> {
    const page = Number(dto.page) || 1;
    const pageSize = Number(dto.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: Prisma.ButtonWhereInput = {};

    // Date filtering
    if (dto.dateFrom || dto.dateTo) {
      const dateField = dto.filterByUpdated ? 'updatedAt' : 'createdAt';
      where[dateField] = {};

      if (dto.dateFrom) {
        where[dateField].gte = new Date(dto.dateFrom);
      }

      if (dto.dateTo) {
        where[dateField].lte = new Date(dto.dateTo);
      }
    }

    const [buttons, total] = await Promise.all([
      this.prisma.button.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.button.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return plainToInstance(
      ButtonListRdo,
      {
        data: buttons,
        total,
        page,
        pageSize,
        totalPages,
      },
      { excludeExtraneousValues: true },
    );
  }

  async findOne(id: number): Promise<ButtonRdo> {
    const button = await this.prisma.button.findUnique({
      where: { id },
    });

    if (!button) {
      throw new NotFoundException(`Button with ID ${id} not found`);
    }

    return plainToInstance(ButtonRdo, button, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: number,
    updateButtonDto: UpdateButtonDto,
  ): Promise<ButtonRdo> {
    const existingButton = await this.prisma.button.findUnique({
      where: { id },
    });

    if (!existingButton) {
      throw new NotFoundException(`Button with ID ${id} not found`);
    }

    const button = await this.prisma.button.update({
      where: { id },
      data: updateButtonDto,
    });

    return plainToInstance(ButtonRdo, button, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<void> {
    const existingButton = await this.prisma.button.findUnique({
      where: { id },
    });

    if (!existingButton) {
      throw new NotFoundException(`Button with ID ${id} not found`);
    }

    await this.prisma.button.delete({
      where: { id },
    });
  }

  async incrementClickCount(id: number): Promise<ButtonRdo> {
    const existingButton = await this.prisma.button.findUnique({
      where: { id },
    });

    if (!existingButton) {
      throw new NotFoundException(`Button with ID ${id} not found`);
    }

    const button = await this.prisma.button.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });

    return plainToInstance(ButtonRdo, button, {
      excludeExtraneousValues: true,
    });
  }

  async trackClick(
    name: string,
    type?: string,
    url?: string,
  ): Promise<ButtonRdo> {
    // Попытаемся найти существующую кнопку по имени
    let button = await this.prisma.button.findFirst({
      where: { name },
    });

    if (button) {
      // Если кнопка существует, увеличиваем счетчик кликов
      button = await this.prisma.button.update({
        where: { id: button.id },
        data: {
          clickCount: {
            increment: 1,
          },
        },
      });
    } else {
      // Если кнопка не существует, создаем новую с 1 кликом
      button = await this.prisma.button.create({
        data: {
          name,
          type: type || 'action',
          url: url || undefined,
          description: `Auto-created button from frontend tracking`,
          isActive: true,
          clickCount: 1,
        },
      });
    }

    return plainToInstance(ButtonRdo, button, {
      excludeExtraneousValues: true,
    });
  }

  async getClickStats(dateFrom?: string, dateTo?: string): Promise<any> {
    const where: Prisma.ButtonWhereInput = {};

    // Date filtering - используем updatedAt для статистики кликов
    if (dateFrom || dateTo) {
      where.updatedAt = {};

      if (dateFrom) {
        where.updatedAt.gte = new Date(dateFrom);
      }

      if (dateTo) {
        where.updatedAt.lte = new Date(dateTo);
      }
    }

    const stats = await this.prisma.button.groupBy({
      by: ['type'],
      where,
      _sum: {
        clickCount: true,
      },
      _count: {
        id: true,
      },
    });

    return stats.map((stat) => ({
      type: stat.type,
      totalClicks: stat._sum.clickCount || 0,
      buttonCount: stat._count.id,
    }));
  }
}
