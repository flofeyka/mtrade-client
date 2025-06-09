import { Test, TestingModule } from '@nestjs/testing';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import {
  CreatePartnerDto,
  RequisiteType,
  PartnerBonusStatus,
} from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

describe('PartnerController', () => {
  let controller: PartnerController;
  let mockPartnerService: any;

  const mockPartner = {
    id: 1,
    name: 'Test Partner',
    username: 'testuser',
    requisites: '1234567890',
    requisiteType: RequisiteType.Card,
    bonusStatus: PartnerBonusStatus.PENDING,
    code: 'TEST123',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  const createPartnerDto: CreatePartnerDto = {
    name: 'Test Partner',
    username: 'testuser',
    requisites: '1234567890',
    requisiteType: RequisiteType.Card,
    bonusStatus: PartnerBonusStatus.PENDING,
    code: 'TEST123',
  };

  beforeEach(async () => {
    mockPartnerService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByCode: jest.fn(),
      findByUsername: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerController],
      providers: [
        {
          provide: PartnerService,
          useValue: mockPartnerService,
        },
      ],
    }).compile();

    controller = module.get<PartnerController>(PartnerController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a partner successfully', async () => {
      mockPartnerService.create.mockResolvedValue(mockPartner);

      const result = await controller.create(createPartnerDto);

      expect(mockPartnerService.create).toHaveBeenCalledWith(createPartnerDto);
      expect(result).toEqual(mockPartner);
    });

    it('should pass through service errors', async () => {
      const error = new Error('Service error');
      mockPartnerService.create.mockRejectedValue(error);

      await expect(controller.create(createPartnerDto)).rejects.toThrow(
        'Service error',
      );
      expect(mockPartnerService.create).toHaveBeenCalledWith(createPartnerDto);
    });
  });

  describe('findAll', () => {
    it('should return array of partners', async () => {
      const partners = [mockPartner, { ...mockPartner, id: 2 }];
      mockPartnerService.findAll.mockResolvedValue(partners);

      const result = await controller.findAll({});

      expect(mockPartnerService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(partners);
    });

    it('should return empty array when no partners', async () => {
      mockPartnerService.findAll.mockResolvedValue([]);

      const result = await controller.findAll({});

      expect(mockPartnerService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a partner by id', async () => {
      mockPartnerService.findOne.mockResolvedValue(mockPartner);

      const result = await controller.findOne(1);

      expect(mockPartnerService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPartner);
    });

    it('should pass through service errors when partner not found', async () => {
      const error = new Error('Partner not found');
      mockPartnerService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(999)).rejects.toThrow(
        'Partner not found',
      );
      expect(mockPartnerService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    const updatePartnerDto: UpdatePartnerDto = {
      name: 'Updated Partner',
      bonusStatus: PartnerBonusStatus.COMPLETED,
    };

    it('should update a partner successfully', async () => {
      const updatedPartner = { ...mockPartner, ...updatePartnerDto };
      mockPartnerService.update.mockResolvedValue(updatedPartner);

      const result = await controller.update(1, updatePartnerDto);

      expect(mockPartnerService.update).toHaveBeenCalledWith(
        1,
        updatePartnerDto,
      );
      expect(result).toEqual(updatedPartner);
    });

    it('should pass through service errors', async () => {
      const error = new Error('Update failed');
      mockPartnerService.update.mockRejectedValue(error);

      await expect(controller.update(1, updatePartnerDto)).rejects.toThrow(
        'Update failed',
      );
      expect(mockPartnerService.update).toHaveBeenCalledWith(
        1,
        updatePartnerDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a partner successfully', async () => {
      mockPartnerService.remove.mockResolvedValue(mockPartner);

      const result = await controller.remove(1);

      expect(mockPartnerService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPartner);
    });

    it('should pass through service errors', async () => {
      const error = new Error('Delete failed');
      mockPartnerService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow('Delete failed');
      expect(mockPartnerService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findByCode', () => {
    it('should find partner by code successfully', async () => {
      mockPartnerService.findByCode.mockResolvedValue(mockPartner);

      const result = await controller.findByCode('TEST123');

      expect(mockPartnerService.findByCode).toHaveBeenCalledWith('TEST123');
      expect(result).toEqual(mockPartner);
    });

    it('should return null when partner not found by code', async () => {
      mockPartnerService.findByCode.mockResolvedValue(null);

      const result = await controller.findByCode('NONEXISTENT');

      expect(mockPartnerService.findByCode).toHaveBeenCalledWith('NONEXISTENT');
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should find partner by username successfully', async () => {
      mockPartnerService.findByUsername.mockResolvedValue(mockPartner);

      const result = await controller.findByUsername('testuser');

      expect(mockPartnerService.findByUsername).toHaveBeenCalledWith(
        'testuser',
      );
      expect(result).toEqual(mockPartner);
    });

    it('should return null when partner not found by username', async () => {
      mockPartnerService.findByUsername.mockResolvedValue(null);

      const result = await controller.findByUsername('nonexistent');

      expect(mockPartnerService.findByUsername).toHaveBeenCalledWith(
        'nonexistent',
      );
      expect(result).toBeNull();
    });
  });

  describe('should be defined', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
});
