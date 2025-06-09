import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentStatus } from './dto/create-payment.dto';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  const mockPaymentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    getStats: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const createDto = {
        fullName: 'Иван Иванов',
        email: 'ivan@example.com',
        source: 'Website',
        product: 'MINI_GOLDI',
        amount: 299900,
      };

      const mockResult = {
        id: 1,
        ...createDto,
        status: PaymentStatus.PENDING,
        promoCode: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPaymentService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated payments', async () => {
      const mockResult = {
        payments: [
          {
            id: 1,
            fullName: 'Иван Иванов',
            email: 'ivan@example.com',
            source: 'Website',
            product: 'MINI_GOLDI',
            amount: 299900,
            status: PaymentStatus.PENDING,
            promoCode: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockPaymentService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(
        1,
        10,
        PaymentStatus.PENDING,
        'search',
      );

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(
        1,
        10,
        PaymentStatus.PENDING,
        'search',
        undefined,
        undefined,
      );
    });

    it('should handle optional parameters', async () => {
      const mockResult = {
        payments: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockPaymentService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      );
    });
  });

  describe('getStats', () => {
    it('should return payment statistics', async () => {
      const mockStats = {
        pending: 5,
        completed: 37,
        totalAmount: 10000000,
      };

      mockPaymentService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(result).toEqual(mockStats);
      expect(service.getStats).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return payments by email', async () => {
      const mockResult = {
        payments: [
          {
            id: 1,
            fullName: 'Иван Иванов',
            email: 'ivan@example.com',
            status: PaymentStatus.COMPLETED,
            promoCode: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockPaymentService.findByEmail.mockResolvedValue(mockResult);

      const result = await controller.findByEmail('ivan@example.com', 1, 10);

      expect(result).toEqual(mockResult);
      expect(service.findByEmail).toHaveBeenCalledWith(
        'ivan@example.com',
        1,
        10,
      );
    });

    it('should handle optional pagination parameters', async () => {
      const mockResult = {
        payments: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockPaymentService.findByEmail.mockResolvedValue(mockResult);

      const result = await controller.findByEmail('test@example.com');

      expect(result).toEqual(mockResult);
      expect(service.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
        undefined,
        undefined,
      );
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      const mockPayment = {
        id: 1,
        fullName: 'Иван Иванов',
        email: 'ivan@example.com',
        source: 'Website',
        product: 'MINI_GOLDI',
        amount: 299900,
        status: PaymentStatus.PENDING,
        promoCode: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPaymentService.findOne.mockResolvedValue(mockPayment);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockPayment);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when payment not found', async () => {
      mockPaymentService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a payment', async () => {
      const updateDto = {
        status: PaymentStatus.COMPLETED,
      };

      const mockUpdatedPayment = {
        id: 1,
        fullName: 'Иван Иванов',
        email: 'ivan@example.com',
        source: 'Website',
        product: 'MINI_GOLDI',
        amount: 299900,
        status: PaymentStatus.COMPLETED,
        promoCode: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPaymentService.update.mockResolvedValue(mockUpdatedPayment);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedPayment);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when updating non-existent payment', async () => {
      mockPaymentService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(999, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a payment', async () => {
      const mockResult = { message: 'Payment deleted successfully' };

      mockPaymentService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove(1);

      expect(result).toEqual(mockResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when deleting non-existent payment', async () => {
      mockPaymentService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
