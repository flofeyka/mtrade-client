import { TestingModule, Test } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRdo, NotificationListRdo } from './rdo/notification.rdo';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  const mockNotificationRdo: NotificationRdo = {
    id: 1,
    text: 'Test notification message',
    end: new Date('2024-12-31T23:59:59.000Z'),
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  const mockNotificationListRdo: NotificationListRdo = {
    notifications: [mockNotificationRdo],
    total: 1,
  };

  const mockNotificationService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findActive: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const createDto: CreateNotificationDto = {
        text: 'Test notification message',
        end: '2024-12-31T23:59:59.000Z',
      };

      mockNotificationService.create.mockResolvedValue(mockNotificationRdo);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockNotificationRdo);
    });
  });

  describe('findAll', () => {
    it('should return all notifications', async () => {
      mockNotificationService.findAll.mockResolvedValue(
        mockNotificationListRdo,
      );

      const result = await controller.findAll({});

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockNotificationListRdo);
    });
  });

  describe('findActive', () => {
    it('should return active notifications', async () => {
      mockNotificationService.findActive.mockResolvedValue(
        mockNotificationListRdo,
      );

      const result = await controller.findActive();

      expect(service.findActive).toHaveBeenCalled();
      expect(result).toEqual(mockNotificationListRdo);
    });
  });

  describe('findOne', () => {
    it('should return a notification by id', async () => {
      mockNotificationService.findOne.mockResolvedValue(mockNotificationRdo);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNotificationRdo);
    });
  });

  describe('update', () => {
    it('should update a notification', async () => {
      const updateDto: UpdateNotificationDto = {
        text: 'Updated notification message',
      };

      mockNotificationService.update.mockResolvedValue(mockNotificationRdo);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(mockNotificationRdo);
    });
  });

  describe('remove', () => {
    it('should delete a notification', async () => {
      mockNotificationService.remove.mockResolvedValue(mockNotificationRdo);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNotificationRdo);
    });
  });
});
