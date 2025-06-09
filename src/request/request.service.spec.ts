import { TestingModule, Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RequestService } from './request.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto, RequestStatus } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

describe('RequestService', () => {
  let service: RequestService;
  let mockPrisma: any;

  const mockRequest = {
    id: 1,
    fullName: 'Иван Иванов',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
    telegram: '@ivan_telegram',
    partnerCode: 'PARTNER_ABC_2024',
    source: 'Website',
    status: RequestStatus.PENDING,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  const createRequestDto: CreateRequestDto = {
    fullName: 'Иван Иванов',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
    telegram: '@ivan_telegram',
    partnerCode: 'PARTNER_ABC_2024',
    source: 'Website',
    status: RequestStatus.PENDING,
  };

  beforeEach(async () => {
    mockPrisma = {
      request: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        groupBy: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<RequestService>(RequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a request successfully and return RDO', async () => {
      mockPrisma.request.create.mockResolvedValue(mockRequest);

      const result = await service.create(createRequestDto);

      expect(mockPrisma.request.create).toHaveBeenCalledWith({
        data: createRequestDto,
      });

      // Проверяем что результат содержит только нужные поля (RDO)
      expect(result).toEqual({
        id: mockRequest.id,
        fullName: mockRequest.fullName,
        phone: mockRequest.phone,
        email: mockRequest.email,
        telegram: mockRequest.telegram,
        partnerCode: mockRequest.partnerCode,
        source: mockRequest.source,
        status: mockRequest.status,
        createdAt: mockRequest.createdAt,
        updatedAt: mockRequest.updatedAt,
      });
    });

    it('should handle prisma create errors', async () => {
      const error = new Error('Database error');
      mockPrisma.request.create.mockRejectedValue(error);

      await expect(service.create(createRequestDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated requests list in RDO format with default parameters', async () => {
      const requests = [mockRequest, { ...mockRequest, id: 2 }];
      mockPrisma.request.findMany.mockResolvedValue(requests);
      mockPrisma.request.count.mockResolvedValue(2);

      const result = await service.findAll({});

      expect(mockPrisma.request.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(mockPrisma.request.count).toHaveBeenCalledWith({ where: {} });

      expect(result).toEqual({
        requests: requests.map((request) => ({
          id: request.id,
          fullName: request.fullName,
          phone: request.phone,
          email: request.email,
          telegram: request.telegram,
          partnerCode: request.partnerCode,
          source: request.source,
          status: request.status,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt,
        })),
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should return paginated requests with custom parameters', async () => {
      const requests = [mockRequest];
      mockPrisma.request.findMany.mockResolvedValue(requests);
      mockPrisma.request.count.mockResolvedValue(15);

      const result = await service.findAll({
        page: '2',
        limit: '5',
        status: 'PENDING',
        source: 'Website',
      });

      expect(mockPrisma.request.findMany).toHaveBeenCalledWith({
        where: {
          status: 'PENDING',
          source: {
            contains: 'Website',
            mode: 'insensitive',
          },
        },
        skip: 5,
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(mockPrisma.request.count).toHaveBeenCalledWith({
        where: {
          status: 'PENDING',
          source: {
            contains: 'Website',
            mode: 'insensitive',
          },
        },
      });

      expect(result).toEqual({
        requests: [
          {
            id: mockRequest.id,
            fullName: mockRequest.fullName,
            phone: mockRequest.phone,
            email: mockRequest.email,
            telegram: mockRequest.telegram,
            partnerCode: mockRequest.partnerCode,
            source: mockRequest.source,
            status: mockRequest.status,
            createdAt: mockRequest.createdAt,
            updatedAt: mockRequest.updatedAt,
          },
        ],
        total: 15,
        page: 2,
        limit: 5,
        totalPages: 3,
      });
    });

    it('should return empty list when no requests exist', async () => {
      mockPrisma.request.findMany.mockResolvedValue([]);
      mockPrisma.request.count.mockResolvedValue(0);

      const result = await service.findAll({});

      expect(result).toEqual({
        requests: [],
        total: 0,
      });
    });

    it('should filter by status only', async () => {
      const requests = [mockRequest];
      mockPrisma.request.findMany.mockResolvedValue(requests);
      mockPrisma.request.count.mockResolvedValue(1);

      await service.findAll({
        page: '1',
        limit: '10',
        status: RequestStatus.APPROVED,
      });

      expect(mockPrisma.request.findMany).toHaveBeenCalledWith({
        where: {
          status: RequestStatus.APPROVED,
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should filter by source only', async () => {
      const requests = [mockRequest];
      mockPrisma.request.findMany.mockResolvedValue(requests);
      mockPrisma.request.count.mockResolvedValue(1);

      await service.findAll({
        page: '1',
        limit: '10',
        status: undefined,
        source: 'Mobile App',
      });

      expect(mockPrisma.request.findMany).toHaveBeenCalledWith({
        where: {
          source: {
            contains: 'Mobile App',
            mode: 'insensitive',
          },
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a request by id in RDO format', async () => {
      mockPrisma.request.findUnique.mockResolvedValue(mockRequest);

      const result = await service.findOne(1);

      expect(mockPrisma.request.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual({
        id: mockRequest.id,
        fullName: mockRequest.fullName,
        phone: mockRequest.phone,
        email: mockRequest.email,
        telegram: mockRequest.telegram,
        partnerCode: mockRequest.partnerCode,
        source: mockRequest.source,
        status: mockRequest.status,
        createdAt: mockRequest.createdAt,
        updatedAt: mockRequest.updatedAt,
      });
    });

    it('should throw NotFoundException when request not found', async () => {
      mockPrisma.request.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Request with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    const updateRequestDto: UpdateRequestDto = {
      fullName: 'Updated Name',
      status: RequestStatus.APPROVED,
    };

    it('should update a request successfully and return RDO', async () => {
      const updatedRequest = { ...mockRequest, ...updateRequestDto };
      mockPrisma.request.findUnique.mockResolvedValue(mockRequest);
      mockPrisma.request.update.mockResolvedValue(updatedRequest);

      const result = await service.update(1, updateRequestDto);

      expect(mockPrisma.request.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.request.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateRequestDto,
      });

      expect(result).toEqual({
        id: updatedRequest.id,
        fullName: updatedRequest.fullName,
        phone: updatedRequest.phone,
        email: updatedRequest.email,
        telegram: updatedRequest.telegram,
        partnerCode: updatedRequest.partnerCode,
        source: updatedRequest.source,
        status: updatedRequest.status,
        createdAt: updatedRequest.createdAt,
        updatedAt: updatedRequest.updatedAt,
      });
    });

    it('should throw NotFoundException when request not found', async () => {
      mockPrisma.request.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updateRequestDto)).rejects.toThrow(
        new NotFoundException('Request with ID 999 not found'),
      );

      expect(mockPrisma.request.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a request successfully and return RDO', async () => {
      mockPrisma.request.findUnique.mockResolvedValue(mockRequest);
      mockPrisma.request.delete.mockResolvedValue(mockRequest);

      const result = await service.remove(1);

      expect(mockPrisma.request.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.request.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual({
        id: mockRequest.id,
        fullName: mockRequest.fullName,
        phone: mockRequest.phone,
        email: mockRequest.email,
        telegram: mockRequest.telegram,
        partnerCode: mockRequest.partnerCode,
        source: mockRequest.source,
        status: mockRequest.status,
        createdAt: mockRequest.createdAt,
        updatedAt: mockRequest.updatedAt,
      });
    });

    it('should throw NotFoundException when request not found', async () => {
      mockPrisma.request.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Request with ID 999 not found'),
      );

      expect(mockPrisma.request.delete).not.toHaveBeenCalled();
    });
  });

  describe('findByPartnerCode', () => {
    it('should return requests by partner code in RDO format', async () => {
      const requests = [mockRequest, { ...mockRequest, id: 2 }];
      mockPrisma.request.findMany.mockResolvedValue(requests);

      const result = await service.findByPartnerCode('PARTNER_ABC_2024');

      expect(mockPrisma.request.findMany).toHaveBeenCalledWith({
        where: {
          partnerCode: 'PARTNER_ABC_2024',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(result).toEqual(
        requests.map((request) => ({
          id: request.id,
          fullName: request.fullName,
          phone: request.phone,
          email: request.email,
          telegram: request.telegram,
          partnerCode: request.partnerCode,
          source: request.source,
          status: request.status,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt,
        })),
      );
    });

    it('should return empty array when no requests found for partner code', async () => {
      mockPrisma.request.findMany.mockResolvedValue([]);

      const result = await service.findByPartnerCode('NONEXISTENT');

      expect(mockPrisma.request.findMany).toHaveBeenCalledWith({
        where: {
          partnerCode: 'NONEXISTENT',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(result).toEqual([]);
    });
  });

  describe('getStatsByStatus', () => {
    it('should return request statistics by status', async () => {
      const mockStats = [
        { status: 'PENDING', _count: { id: 15 } },
        { status: 'APPROVED', _count: { id: 8 } },
        { status: 'REJECTED', _count: { id: 3 } },
        { status: 'IN_PROGRESS', _count: { id: 5 } },
      ];
      mockPrisma.request.groupBy.mockResolvedValue(mockStats);

      const result = await service.getStatsByStatus();

      expect(mockPrisma.request.groupBy).toHaveBeenCalledWith({
        by: ['status'],
        _count: {
          id: true,
        },
      });

      expect(result).toEqual({
        PENDING: 15,
        APPROVED: 8,
        REJECTED: 3,
        IN_PROGRESS: 5,
      });
    });

    it('should return empty stats when no requests exist', async () => {
      mockPrisma.request.groupBy.mockResolvedValue([]);

      const result = await service.getStatsByStatus();

      expect(result).toEqual({});
    });

    it('should handle single status stats', async () => {
      const mockStats = [{ status: 'PENDING', _count: { id: 1 } }];
      mockPrisma.request.groupBy.mockResolvedValue(mockStats);

      const result = await service.getStatsByStatus();

      expect(result).toEqual({
        PENDING: 1,
      });
    });
  });
});
