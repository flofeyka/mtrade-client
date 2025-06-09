import { TestingModule, Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

describe('NotificationService', () => {
  let service: NotificationService;
  const mockPrisma = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockNotification = {
    id: 1,
    text: 'Test notification message',
    end: new Date('2024-12-31T23:59:59.000Z'),
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  const createNotificationDto: CreateNotificationDto = {
    text: 'Test notification message',
    end: '2024-12-31T23:59:59.000Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notification successfully and return RDO', async () => {
      mockPrisma.notification.create.mockResolvedValue(mockNotification);

      const result = await service.create(createNotificationDto);

      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: {
          text: createNotificationDto.text,
          end: new Date(createNotificationDto.end),
        },
      });

      expect(result).toEqual({
        id: mockNotification.id,
        text: mockNotification.text,
        end: mockNotification.end,
        createdAt: mockNotification.createdAt,
      });
    });
  });

  describe('findAll', () => {
    it('should return notifications list with total count in RDO format', async () => {
      const notifications = [mockNotification, { ...mockNotification, id: 2 }];
      mockPrisma.notification.findMany.mockResolvedValue(notifications);

      const result = await service.findAll({});

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(result).toEqual({
        notifications: notifications.map((notification) => ({
          id: notification.id,
          text: notification.text,
          end: notification.end,
          createdAt: notification.createdAt,
        })),
        total: notifications.length,
      });
    });

    it('should return empty list when no notifications exist', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([]);

      const result = await service.findAll({});

      expect(result).toEqual({
        notifications: [],
        total: 0,
      });
    });
  });

  describe('findActive', () => {
    it('should return active notifications only', async () => {
      const activeNotifications = [mockNotification];
      mockPrisma.notification.findMany.mockResolvedValue(activeNotifications);

      const result = await service.findActive();

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith({
        where: {
          end: {
            gt: expect.any(Date),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(result).toEqual({
        notifications: activeNotifications.map((notification) => ({
          id: notification.id,
          text: notification.text,
          end: notification.end,
          createdAt: notification.createdAt,
        })),
        total: activeNotifications.length,
      });
    });
  });

  describe('findOne', () => {
    it('should return a notification by id in RDO format', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(mockNotification);

      const result = await service.findOne(1);

      expect(mockPrisma.notification.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual({
        id: mockNotification.id,
        text: mockNotification.text,
        end: mockNotification.end,
        createdAt: mockNotification.createdAt,
      });
    });

    it('should throw NotFoundException when notification not found', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Уведомление с ID 999 не найдено'),
      );
    });
  });

  describe('update', () => {
    const updateNotificationDto: UpdateNotificationDto = {
      text: 'Updated notification message',
      end: '2025-01-15T23:59:59.000Z',
    };

    it('should update a notification successfully and return RDO', async () => {
      const updatedNotification = {
        ...mockNotification,
        text: updateNotificationDto.text,
        end: new Date(updateNotificationDto.end!),
      };
      mockPrisma.notification.findUnique.mockResolvedValue(mockNotification);
      mockPrisma.notification.update.mockResolvedValue(updatedNotification);

      const result = await service.update(1, updateNotificationDto);

      expect(mockPrisma.notification.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          text: updateNotificationDto.text,
          end: new Date(updateNotificationDto.end!),
        },
      });

      expect(result).toEqual({
        id: updatedNotification.id,
        text: updatedNotification.text,
        end: updatedNotification.end,
        createdAt: updatedNotification.createdAt,
      });
    });

    it('should update only provided fields', async () => {
      const partialUpdate = { text: 'Only text updated' };
      const updatedNotification = {
        ...mockNotification,
        text: partialUpdate.text,
      };

      mockPrisma.notification.findUnique.mockResolvedValue(mockNotification);
      mockPrisma.notification.update.mockResolvedValue(updatedNotification);

      await service.update(1, partialUpdate);

      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          text: partialUpdate.text,
        },
      });
    });

    it('should throw NotFoundException when notification not found', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updateNotificationDto)).rejects.toThrow(
        new NotFoundException('Уведомление с ID 999 не найдено'),
      );

      expect(mockPrisma.notification.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a notification successfully and return RDO', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(mockNotification);
      mockPrisma.notification.delete.mockResolvedValue(mockNotification);

      const result = await service.remove(1);

      expect(mockPrisma.notification.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.notification.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual({
        id: mockNotification.id,
        text: mockNotification.text,
        end: mockNotification.end,
        createdAt: mockNotification.createdAt,
      });
    });

    it('should throw NotFoundException when notification not found', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Уведомление с ID 999 не найдено'),
      );

      expect(mockPrisma.notification.delete).not.toHaveBeenCalled();
    });
  });
});
