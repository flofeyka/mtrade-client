import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PromoCodeController } from './promo-code.controller';
import { PromoCodeService } from './promo-code.service';

describe('PromoCodeController', () => {
  let controller: PromoCodeController;
  let service: PromoCodeService;

  const mockPromoCodeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCode: jest.fn(),
    validatePromoCode: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromoCodeController],
      providers: [
        {
          provide: PromoCodeService,
          useValue: mockPromoCodeService,
        },
      ],
    }).compile();

    controller = module.get<PromoCodeController>(PromoCodeController);
    service = module.get<PromoCodeService>(PromoCodeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a promo code', async () => {
      const createDto = {
        code: 'SAVE20',
        discountPercent: 20,
        isActive: true,
      };

      const mockResult = {
        id: 1,
        ...createDto,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPromoCodeService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated promo codes', async () => {
      const mockResult = {
        promoCodes: [
          {
            id: 1,
            code: 'SAVE20',
            discountPercent: 20,
            isActive: true,
            usageCount: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockPromoCodeService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(1, 10, true);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, true);
    });

    it('should handle optional parameters', async () => {
      const mockResult = {
        promoCodes: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockPromoCodeService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
      );
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

      mockPromoCodeService.findOne.mockResolvedValue(mockPromoCode);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockPromoCode);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when promo code not found', async () => {
      mockPromoCodeService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
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

      mockPromoCodeService.findByCode.mockResolvedValue(mockPromoCode);

      const result = await controller.findByCode('SAVE20');

      expect(result).toEqual(mockPromoCode);
      expect(service.findByCode).toHaveBeenCalledWith('SAVE20');
    });

    it('should throw NotFoundException when promo code not found by code', async () => {
      mockPromoCodeService.findByCode.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.findByCode('NONEXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('validatePromoCode', () => {
    it('should validate a promo code and return true', async () => {
      mockPromoCodeService.validatePromoCode.mockResolvedValue(true);

      const result = await controller.validatePromoCode('SAVE20');

      expect(result).toEqual({ isValid: true });
      expect(service.validatePromoCode).toHaveBeenCalledWith('SAVE20');
    });

    it('should validate a promo code and return false', async () => {
      mockPromoCodeService.validatePromoCode.mockResolvedValue(false);

      const result = await controller.validatePromoCode('INVALID');

      expect(result).toEqual({ isValid: false });
      expect(service.validatePromoCode).toHaveBeenCalledWith('INVALID');
    });
  });

  describe('update', () => {
    it('should update a promo code', async () => {
      const updateDto = {
        discountPercent: 25,
        isActive: false,
      };

      const mockUpdatedPromoCode = {
        id: 1,
        code: 'SAVE20',
        discountPercent: 25,
        isActive: false,
        usageCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPromoCodeService.update.mockResolvedValue(mockUpdatedPromoCode);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdatedPromoCode);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when updating non-existent promo code', async () => {
      mockPromoCodeService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(999, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a promo code', async () => {
      const mockResult = { message: 'Promo code deleted successfully' };

      mockPromoCodeService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove(1);

      expect(result).toEqual(mockResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when deleting non-existent promo code', async () => {
      mockPromoCodeService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
