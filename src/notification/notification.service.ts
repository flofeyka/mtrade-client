import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRdo, NotificationListRdo } from './rdo/notification.rdo';
import {
  transformToSingleRdo,
  transformToArrayRdo,
} from '../common/utils/transform.util';
import { FindNotificationsDto } from './dto/find-notifcations.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto): Promise<NotificationRdo> {
    const notification = await this.prisma.notification.create({
      data: {
        text: dto.text,
        end: new Date(dto.end),
      },
    });

    return transformToSingleRdo(NotificationRdo, notification);
  }

  async findAll(dto: FindNotificationsDto): Promise<NotificationListRdo> {
    const where: Prisma.NotificationWhereInput = {};

    if (dto.search) {
      where.text = {
        contains: dto.search,
        mode: 'insensitive',
      };
    }

    if (dto.dateFrom || dto.dateTo) {
      where.createdAt = {};
      if (dto.dateFrom) {
        where.createdAt.gte = new Date(dto.dateFrom);
      }
      if (dto.dateTo) {
        where.createdAt.lte = new Date(dto.dateTo);
      }
    }

    const notifications = await this.prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      notifications: transformToArrayRdo(NotificationRdo, notifications),
      total: notifications.length,
    };
  }

  async findActive(): Promise<NotificationListRdo> {
    const currentDate = new Date();
    const notifications = await this.prisma.notification.findMany({
      where: {
        end: {
          gt: currentDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      notifications: transformToArrayRdo(NotificationRdo, notifications),
      total: notifications.length,
    };
  }

  async findOne(id: number): Promise<NotificationRdo> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Уведомление с ID ${id} не найдено`);
    }

    return transformToSingleRdo(NotificationRdo, notification);
  }

  async update(
    id: number,
    dto: UpdateNotificationDto,
  ): Promise<NotificationRdo> {
    // Проверяем существует ли уведомление
    await this.findOne(id);

    const updateData: any = {};
    if (dto.text !== undefined) {
      updateData.text = dto.text;
    }
    if (dto.end !== undefined) {
      updateData.end = new Date(dto.end);
    }

    const notification = await this.prisma.notification.update({
      where: { id },
      data: updateData,
    });

    return transformToSingleRdo(NotificationRdo, notification);
  }

  async remove(id: number): Promise<NotificationRdo> {
    // Проверяем существует ли уведомление
    await this.findOne(id);

    const notification = await this.prisma.notification.delete({
      where: { id },
    });

    return transformToSingleRdo(NotificationRdo, notification);
  }
}
