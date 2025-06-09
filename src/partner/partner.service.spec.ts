import { TestingModule, Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePartnerDto,
  RequisiteType,
  PartnerBonusStatus,
} from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

describe('PartnerService', () => {
  let service: PartnerService;
  let mockPrisma: any;

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
    mockPrisma = {
      partner: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnerService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<PartnerService>(PartnerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a partner successfully and return RDO', async () => {
      mockPrisma.partner.findFirst.mockResolvedValue(null);
      mockPrisma.partner.create.mockResolvedValue(mockPartner);

      const result = await service.create(createPartnerDto);

      expect(mockPrisma.partner.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { username: createPartnerDto.username },
            { code: createPartnerDto.code },
          ],
        },
      });
      expect(mockPrisma.partner.create).toHaveBeenCalledWith({
        data: createPartnerDto,
      });

      // Проверяем что результат содержит только нужные поля (RDO)
      expect(result).toEqual({
        id: mockPartner.id,
        name: mockPartner.name,
        username: mockPartner.username,
        requisites: mockPartner.requisites,
        requisiteType: mockPartner.requisiteType,
        bonusStatus: mockPartner.bonusStatus,
        code: mockPartner.code,
        createdAt: mockPartner.createdAt,
      });
    });

    it('should throw ConflictException when username already exists', async () => {
      const existingPartner = {
        ...mockPartner,
        username: createPartnerDto.username,
      };
      mockPrisma.partner.findFirst.mockResolvedValue(existingPartner);

      await expect(service.create(createPartnerDto)).rejects.toThrow(
        new ConflictException('Партнер с таким username уже существует'),
      );

      expect(mockPrisma.partner.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when code already exists', async () => {
      const existingPartner = {
        ...mockPartner,
        id: 2,
        username: 'different_username',
        code: createPartnerDto.code,
      };
      mockPrisma.partner.findFirst.mockResolvedValue(existingPartner);

      await expect(service.create(createPartnerDto)).rejects.toThrow(
        new ConflictException('Партнер с таким кодом уже существует'),
      );

      expect(mockPrisma.partner.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return partners list with total count in RDO format', async () => {
      const partners = [mockPartner, { ...mockPartner, id: 2 }];
      mockPrisma.partner.findMany.mockResolvedValue(partners);

      const result = await service.findAll({});

      expect(mockPrisma.partner.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
        where: {},
      });

      expect(result).toEqual({
        partners: partners.map((partner) => ({
          id: partner.id,
          name: partner.name,
          username: partner.username,
          requisites: partner.requisites,
          requisiteType: partner.requisiteType,
          bonusStatus: partner.bonusStatus,
          code: partner.code,
          createdAt: partner.createdAt,
        })),
        total: partners.length,
      });
    });

    it('should return empty list when no partners exist', async () => {
      mockPrisma.partner.findMany.mockResolvedValue([]);

      const result = await service.findAll({});

      expect(result).toEqual({
        partners: [],
        total: 0,
      });
    });
  });

  describe('findOne', () => {
    it('should return a partner by id in RDO format', async () => {
      mockPrisma.partner.findUnique.mockResolvedValue(mockPartner);

      const result = await service.findOne(1);

      expect(mockPrisma.partner.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual({
        id: mockPartner.id,
        name: mockPartner.name,
        username: mockPartner.username,
        requisites: mockPartner.requisites,
        requisiteType: mockPartner.requisiteType,
        bonusStatus: mockPartner.bonusStatus,
        code: mockPartner.code,
        createdAt: mockPartner.createdAt,
      });
    });

    it('should throw NotFoundException when partner not found', async () => {
      mockPrisma.partner.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Партнер с ID 999 не найден'),
      );
    });
  });

  describe('update', () => {
    const updatePartnerDto: UpdatePartnerDto = {
      name: 'Updated Partner',
      bonusStatus: PartnerBonusStatus.COMPLETED,
    };

    it('should update a partner successfully and return RDO', async () => {
      const updatedPartner = { ...mockPartner, ...updatePartnerDto };
      mockPrisma.partner.findUnique.mockResolvedValue(mockPartner);
      mockPrisma.partner.update.mockResolvedValue(updatedPartner);

      const result = await service.update(1, updatePartnerDto);

      expect(mockPrisma.partner.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.partner.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatePartnerDto,
      });

      expect(result).toEqual({
        id: updatedPartner.id,
        name: updatedPartner.name,
        username: updatedPartner.username,
        requisites: updatedPartner.requisites,
        requisiteType: updatedPartner.requisiteType,
        bonusStatus: updatedPartner.bonusStatus,
        code: updatedPartner.code,
        createdAt: updatedPartner.createdAt,
      });
    });

    it('should throw NotFoundException when partner not found', async () => {
      mockPrisma.partner.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updatePartnerDto)).rejects.toThrow(
        new NotFoundException('Партнер с ID 999 не найден'),
      );

      expect(mockPrisma.partner.update).not.toHaveBeenCalled();
    });

    it('should check uniqueness when updating username', async () => {
      const updateDto = { username: 'newusername' };
      mockPrisma.partner.findUnique.mockResolvedValue(mockPartner);
      mockPrisma.partner.findFirst.mockResolvedValue(null);
      mockPrisma.partner.update.mockResolvedValue({
        ...mockPartner,
        ...updateDto,
      });

      await service.update(1, updateDto);

      expect(mockPrisma.partner.findFirst).toHaveBeenCalledWith({
        where: {
          AND: [
            { id: { not: 1 } },
            {
              OR: [{ username: 'newusername' }],
            },
          ],
        },
      });
    });

    it('should throw ConflictException when updating to existing username', async () => {
      const updateDto = { username: 'existinguser' };
      const existingPartner = {
        ...mockPartner,
        id: 2,
        username: 'existinguser',
      };

      mockPrisma.partner.findUnique.mockResolvedValue(mockPartner);
      mockPrisma.partner.findFirst.mockResolvedValue(existingPartner);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        new ConflictException('Партнер с таким username уже существует'),
      );

      expect(mockPrisma.partner.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating to existing code', async () => {
      const updateDto = { code: 'EXISTING123' };
      const existingPartner = { ...mockPartner, id: 2, code: 'EXISTING123' };

      mockPrisma.partner.findUnique.mockResolvedValue(mockPartner);
      mockPrisma.partner.findFirst.mockResolvedValue(existingPartner);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        new ConflictException('Партнер с таким кодом уже существует'),
      );

      expect(mockPrisma.partner.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a partner successfully and return RDO', async () => {
      mockPrisma.partner.findUnique.mockResolvedValue(mockPartner);
      mockPrisma.partner.delete.mockResolvedValue(mockPartner);

      const result = await service.remove(1);

      expect(mockPrisma.partner.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.partner.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual({
        id: mockPartner.id,
        name: mockPartner.name,
        username: mockPartner.username,
        requisites: mockPartner.requisites,
        requisiteType: mockPartner.requisiteType,
        bonusStatus: mockPartner.bonusStatus,
        code: mockPartner.code,
        createdAt: mockPartner.createdAt,
      });
    });

    it('should throw NotFoundException when partner not found', async () => {
      mockPrisma.partner.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Партнер с ID 999 не найден'),
      );

      expect(mockPrisma.partner.delete).not.toHaveBeenCalled();
    });
  });

  describe('findByCode', () => {
    it('should return a partner by code in RDO format', async () => {
      mockPrisma.partner.findFirst.mockResolvedValue(mockPartner);

      const result = await service.findByCode('TEST123');

      expect(mockPrisma.partner.findFirst).toHaveBeenCalledWith({
        where: { code: 'TEST123' },
      });

      expect(result).toEqual({
        id: mockPartner.id,
        name: mockPartner.name,
        username: mockPartner.username,
        requisites: mockPartner.requisites,
        requisiteType: mockPartner.requisiteType,
        bonusStatus: mockPartner.bonusStatus,
        code: mockPartner.code,
        createdAt: mockPartner.createdAt,
      });
    });

    it('should return null when partner not found by code', async () => {
      mockPrisma.partner.findFirst.mockResolvedValue(null);

      const result = await service.findByCode('NONEXISTENT');

      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return a partner by username in RDO format', async () => {
      mockPrisma.partner.findFirst.mockResolvedValue(mockPartner);

      const result = await service.findByUsername('testuser');

      expect(mockPrisma.partner.findFirst).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });

      expect(result).toEqual({
        id: mockPartner.id,
        name: mockPartner.name,
        username: mockPartner.username,
        requisites: mockPartner.requisites,
        requisiteType: mockPartner.requisiteType,
        bonusStatus: mockPartner.bonusStatus,
        code: mockPartner.code,
        createdAt: mockPartner.createdAt,
      });
    });

    it('should return null when partner not found by username', async () => {
      mockPrisma.partner.findFirst.mockResolvedValue(null);

      const result = await service.findByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });
});
