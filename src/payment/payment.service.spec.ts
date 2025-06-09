import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma/prisma.service';
import { PromoCodeService } from '../promo-code/promo-code.service';
import { PaymentStatus } from './dto/create-payment.dto';

describe('PaymentService', () => {
  let service: PaymentService;
  let prismaService: PrismaService;
  let promoCodeService: PromoCodeService;

  const mockPrismaService = {
    payment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
  };

  const mockPromoCodeService = {
    findOne: jest.fn(),
    validatePromoCode: jest.fn(),
    incrementUsage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PromoCodeService,
          useValue: mockPromoCodeService,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    prismaService = module.get<PrismaService>(PrismaService);
    promoCodeService = module.get<PromoCodeService>(PromoCodeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment successfully without promo code', async () => {
      const createDto = {
        fullName: 'Иван Иванов',
        email: 'ivan@example.com',
        source: 'Website',
        product: 'MINI_GOLDI',
        amount: 299900,
      };

      const mockPayment = {
        id: 1,
        ...createDto,
        status: PaymentStatus.PENDING,
        promoCode: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.payment.create.mockResolvedValue(mockPayment);

      const result = await service.create(createDto);

      expect(result).toEqual(mockPayment);
      expect(mockPrismaService.payment.create).toHaveBeenCalledWith({
        data: createDto,
        include: {
          promoCode: true,
        },
      });
    });

    it('should create a payment with valid promo code', async () => {
      const createDto = {
        fullName: 'Иван Иванов',
        email: 'ivan@example.com',
        source: 'Website',
        product: 'MINI_GOLDI',
        amount: 299900,
        promoCodeId: 1,
      };

      const mockPromoCode = {
        id: 1,
        code: 'SAVE20',
        isActive: true,
      };

      const mockPayment = {
        id: 1,
        ...createDto,
        status: PaymentStatus.PENDING,
        promoCode: mockPromoCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPromoCodeService.findOne.mockResolvedValue(mockPromoCode);
      mockPromoCodeService.validatePromoCode.mockResolvedValue(true);
      mockPrismaService.payment.create.mockResolvedValue(mockPayment);
      mockPromoCodeService.incrementUsage.mockResolvedValue(undefined);

      const result = await service.create(createDto);

      expect(result).toEqual(mockPayment);
      expect(promoCodeService.validatePromoCode).toHaveBeenCalledWith('SAVE20');
      expect(promoCodeService.incrementUsage).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException for invalid promo code', async () => {
      const createDto = {
        fullName: 'Иван Иванов',
        email: 'ivan@example.com',
        source: 'Website',
        product: 'MINI_GOLDI',
        amount: 299900,
        promoCodeId: 1,
      };

      const mockPromoCode = {
        id: 1,
        code: 'EXPIRED',
        isActive: false,
      };

      mockPromoCodeService.findOne.mockResolvedValue(mockPromoCode);
      mockPromoCodeService.validatePromoCode.mockResolvedValue(false);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated payments', async () => {
      const mockPayments = [
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
      ];

      mockPrismaService.payment.findMany.mockResolvedValue(mockPayments);
      mockPrismaService.payment.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        payments: mockPayments,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by status', async () => {
      const mockPayments = [];
      mockPrismaService.payment.findMany.mockResolvedValue(mockPayments);
      mockPrismaService.payment.count.mockResolvedValue(0);

      await service.findAll(1, 10, PaymentStatus.COMPLETED);

      expect(mockPrismaService.payment.findMany).toHaveBeenCalledWith({
        where: { status: PaymentStatus.COMPLETED },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          promoCode: {
            select: {
              id: true,
              code: true,
              discountPercent: true,
              discountAmount: true,
            },
          },
        },
      });
    });

    it('should filter by search term', async () => {
      const mockPayments = [];
      mockPrismaService.payment.findMany.mockResolvedValue(mockPayments);
      mockPrismaService.payment.count.mockResolvedValue(0);

      await service.findAll(1, 10, undefined, 'ivan@example.com');

      expect(mockPrismaService.payment.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { fullName: { contains: 'ivan@example.com', mode: 'insensitive' } },
            { email: { contains: 'ivan@example.com', mode: 'insensitive' } },
            { product: { contains: 'ivan@example.com', mode: 'insensitive' } },
            { source: { contains: 'ivan@example.com', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          promoCode: {
            select: {
              id: true,
              code: true,
              discountPercent: true,
              discountAmount: true,
            },
          },
        },
      });
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

      mockPrismaService.payment.findUnique.mockResolvedValue(mockPayment);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPayment);
      expect(mockPrismaService.payment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          promoCode: {
            select: {
              id: true,
              code: true,
              discountPercent: true,
              discountAmount: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException if payment not found', async () => {
      mockPrismaService.payment.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a payment successfully', async () => {
      const mockExistingPayment = {
        id: 1,
        fullName: 'Иван Иванов',
        email: 'ivan@example.com',
        source: 'Website',
        product: 'MINI_GOLDI',
        amount: 299900,
        status: PaymentStatus.PENDING,
        promoCodeId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto = {
        status: PaymentStatus.COMPLETED,
      };

      const mockUpdatedPayment = {
        ...mockExistingPayment,
        ...updateDto,
      };

      mockPrismaService.payment.findUnique.mockResolvedValue(
        mockExistingPayment,
      );
      mockPrismaService.payment.update.mockResolvedValue(mockUpdatedPayment);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mockUpdatedPayment);
      expect(mockPrismaService.payment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
        include: {
          promoCode: {
            select: {
              id: true,
              code: true,
              discountPercent: true,
              discountAmount: true,
            },
          },
        },
      });
    });

    it('should validate new promo code when updating', async () => {
      const mockExistingPayment = {
        id: 1,
        fullName: 'Иван Иванов',
        promoCodeId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto = {
        promoCodeId: 2,
      };

      const mockPromoCode = {
        id: 2,
        code: 'NEW20',
        isActive: true,
      };

      mockPrismaService.payment.findUnique.mockResolvedValue(
        mockExistingPayment,
      );
      mockPromoCodeService.findOne.mockResolvedValue(mockPromoCode);
      mockPromoCodeService.validatePromoCode.mockResolvedValue(true);
      mockPrismaService.payment.update.mockResolvedValue({});

      await service.update(1, updateDto);

      expect(promoCodeService.validatePromoCode).toHaveBeenCalledWith('NEW20');
    });

    it('should throw NotFoundException if payment not found for update', async () => {
      mockPrismaService.payment.findUnique.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a payment successfully', async () => {
      const mockPayment = {
        id: 1,
        fullName: 'Иван Иванов',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.payment.findUnique.mockResolvedValue(mockPayment);
      mockPrismaService.payment.delete.mockResolvedValue(mockPayment);

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Payment deleted successfully' });
      expect(mockPrismaService.payment.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if payment not found for deletion', async () => {
      mockPrismaService.payment.findUnique.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return payment statistics', async () => {
      mockPrismaService.payment.count
        .mockResolvedValueOnce(5) // pending
        .mockResolvedValueOnce(37); // completed

      mockPrismaService.payment.aggregate.mockResolvedValue({
        _sum: { amount: 10000000 },
      });

      const result = await service.getStats();

      expect(result).toEqual({
        pending: 5,
        completed: 37,
        totalAmount: 10000000,
      });
    });

    it('should handle null total amount', async () => {
      mockPrismaService.payment.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      mockPrismaService.payment.aggregate.mockResolvedValue({
        _sum: { amount: null },
      });

      const result = await service.getStats();

      expect(result).toEqual({
        pending: 0,
        completed: 0,
        totalAmount: 0,
      });
    });
  });

  describe('findByEmail', () => {
    it('should return payments by email with pagination', async () => {
      const mockPayments = [
        {
          id: 1,
          fullName: 'Иван Иванов',
          email: 'ivan@example.com',
          status: PaymentStatus.COMPLETED,
          promoCode: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.payment.findMany.mockResolvedValue(mockPayments);
      mockPrismaService.payment.count.mockResolvedValue(1);

      const result = await service.findByEmail('ivan@example.com', 1, 10);

      expect(result).toEqual({
        payments: mockPayments,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      expect(mockPrismaService.payment.findMany).toHaveBeenCalledWith({
        where: { email: 'ivan@example.com' },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          promoCode: {
            select: {
              id: true,
              code: true,
              discountPercent: true,
              discountAmount: true,
            },
          },
        },
      });
    });
  });
});
