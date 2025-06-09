import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PromoCodeService } from './promo-code.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PromoCodeService', () => {
  let service: PromoCodeService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    promoCode: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromoCodeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PromoCodeService>(PromoCodeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a promo code successfully', async () => {
      const createDto = {
        code: 'SAVE20',
        discountPercent: 20,
        isActive: true,
      };

      const mockPromoCode = {
        id: 1,
        ...createDto,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.promoCode.create.mockResolvedValue(mockPromoCode);

      const result = await service.create(createDto);

      expect(result).toEqual(mockPromoCode);
      expect(mockPrismaService.promoCode.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          expiresAt: null,
        },
      });
    });

    it('should throw BadRequestException if promo code already exists', async () => {
      const createDto = {
        code: 'SAVE20',
        discountPercent: 20,
      };

      const error = new Error('Unique constraint violation') as any;
      error.code = 'P2002';
      mockPrismaService.promoCode.create.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated promo codes', async () => {
      const mockPromoCodes = [
        {
          id: 1,
          code: 'SAVE20',
          discountPercent: 20,
          isActive: true,
          usageCount: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.promoCode.findMany.mockResolvedValue(mockPromoCodes);
      mockPrismaService.promoCode.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        promoCodes: mockPromoCodes,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by active status', async () => {
      const mockPromoCodes = [];
      mockPrismaService.promoCode.findMany.mockResolvedValue(mockPromoCodes);
      mockPrismaService.promoCode.count.mockResolvedValue(0);

      await service.findAll(1, 10, true);

      expect(mockPrismaService.promoCode.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a promo code by id', async () => {
      const mockPromoCode = {
        id: 1,
        code: 'SAVE20',
        discountPercent: 20,
        isActive: true,
        usageCount: 5,
        payments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.promoCode.findUnique.mockResolvedValue(mockPromoCode);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPromoCode);
      expect(mockPrismaService.promoCode.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          payments: {
            select: {
              id: true,
              fullName: true,
              amount: true,
              createdAt: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException if promo code not found', async () => {
      mockPrismaService.promoCode.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCode', () => {
    it('should return a promo code by code', async () => {
      const mockPromoCode = {
        id: 1,
        code: 'SAVE20',
        discountPercent: 20,
        isActive: true,
        usageCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.promoCode.findUnique.mockResolvedValue(mockPromoCode);

      const result = await service.findByCode('SAVE20');

      expect(result).toEqual(mockPromoCode);
      expect(mockPrismaService.promoCode.findUnique).toHaveBeenCalledWith({
        where: { code: 'SAVE20' },
      });
    });

    it('should throw NotFoundException if promo code not found by code', async () => {
      mockPrismaService.promoCode.findUnique.mockResolvedValue(null);

      await expect(service.findByCode('NONEXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a promo code successfully', async () => {
      const mockExistingPromoCode = {
        id: 1,
        code: 'SAVE20',
        discountPercent: 20,
        isActive: true,
        payments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto = {
        discountPercent: 25,
        isActive: false,
      };

      const mockUpdatedPromoCode = {
        ...mockExistingPromoCode,
        ...updateDto,
      };

      mockPrismaService.promoCode.findUnique.mockResolvedValue(
        mockExistingPromoCode,
      );
      mockPrismaService.promoCode.update.mockResolvedValue(
        mockUpdatedPromoCode,
      );

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mockUpdatedPromoCode);
      expect(mockPrismaService.promoCode.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateDto,
          expiresAt: undefined,
        },
      });
    });

    it('should throw NotFoundException if promo code not found for update', async () => {
      mockPrismaService.promoCode.findUnique.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a promo code successfully', async () => {
      const mockPromoCode = {
        id: 1,
        code: 'SAVE20',
        payments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.promoCode.findUnique.mockResolvedValue(mockPromoCode);
      mockPrismaService.promoCode.delete.mockResolvedValue(mockPromoCode);

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Promo code deleted successfully' });
      expect(mockPrismaService.promoCode.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if promo code not found for deletion', async () => {
      mockPrismaService.promoCode.findUnique.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validatePromoCode', () => {
    it('should return true for valid active promo code', async () => {
      const mockPromoCode = {
        id: 1,
        code: 'SAVE20',
        isActive: true,
        expiresAt: null,
        usageLimit: null,
        usageCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.promoCode.findUnique.mockResolvedValue(mockPromoCode);

      const result = await service.validatePromoCode('SAVE20');

      expect(result).toBe(true);
    });

    it('should return false for inactive promo code', async () => {
      const mockPromoCode = {
        id: 1,
        code: 'SAVE20',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.promoCode.findUnique.mockResolvedValue(mockPromoCode);

      const result = await service.validatePromoCode('SAVE20');

      expect(result).toBe(false);
    });

    it('should return false for expired promo code', async () => {
      const mockPromoCode = {
        id: 1,
        code: 'SAVE20',
        isActive: true,
        expiresAt: new Date(Date.now() - 1000), // expired
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.promoCode.findUnique.mockResolvedValue(mockPromoCode);

      const result = await service.validatePromoCode('SAVE20');

      expect(result).toBe(false);
    });

    it('should return false for promo code that reached usage limit', async () => {
      const mockPromoCode = {
        id: 1,
        code: 'SAVE20',
        isActive: true,
        expiresAt: null,
        usageLimit: 10,
        usageCount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.promoCode.findUnique.mockResolvedValue(mockPromoCode);

      const result = await service.validatePromoCode('SAVE20');

      expect(result).toBe(false);
    });

    it('should return false for non-existent promo code', async () => {
      mockPrismaService.promoCode.findUnique.mockResolvedValue(null);

      const result = await service.validatePromoCode('NONEXISTENT');

      expect(result).toBe(false);
    });
  });

  describe('incrementUsage', () => {
    it('should increment promo code usage count', async () => {
      mockPrismaService.promoCode.update.mockResolvedValue({});

      await service.incrementUsage(1);

      expect(mockPrismaService.promoCode.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          usageCount: {
            increment: 1,
          },
        },
      });
    });
  });
});
