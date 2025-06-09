import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateButtonDto } from './dto/create-button.dto';
import { UpdateButtonDto } from './dto/update-button.dto';
import { plainToInstance } from 'class-transformer';
import { ButtonRdo } from './rdo/button.rdo';
import { ButtonListRdo } from './rdo/button-list.rdo';

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

  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ButtonListRdo> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [buttons, total] = await Promise.all([
      this.prisma.button.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.button.count(),
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

  async getClickStats(): Promise<any> {
    const stats = await this.prisma.button.groupBy({
      by: ['type'],
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
