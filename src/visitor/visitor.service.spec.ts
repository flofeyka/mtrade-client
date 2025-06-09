import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';

describe('VisitorService', () => {
  let service: VisitorService;
  let prismaService: PrismaService;

  const mockVisitor = {
    id: 'uuid-test-12345',
    trafficSource: 'Google Ads',
    utmTags: 'utm_source=google&utm_medium=cpc',
    country: 'Russia',
    device: 'Desktop',
    browser: 'Chrome 120.0',
    pagesViewed: 5,
    timeOnSite: '00:05:30',
    cookieFile: 'visitor_session_12345.cookie',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockPrismaService = {
    visitor: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitorService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VisitorService>(VisitorService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a visitor successfully', async () => {
      const createVisitorDto: CreateVisitorDto = {
        trafficSource: 'Google Ads',
        utmTags: 'utm_source=google&utm_medium=cpc',
        country: 'Russia',
        device: 'Desktop',
        browser: 'Chrome 120.0',
        pagesViewed: 5,
        timeOnSite: '00:05:30',
        cookieFile: 'visitor_session_12345.cookie',
      };

      mockPrismaService.visitor.create.mockResolvedValue(mockVisitor);

      const result = await service.create(createVisitorDto);

      expect(mockPrismaService.visitor.create).toHaveBeenCalledWith({
        data: createVisitorDto,
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: mockVisitor.id,
          trafficSource: mockVisitor.trafficSource,
          country: mockVisitor.country,
        }),
      );
    });

    it('should handle database errors during creation', async () => {
      const createVisitorDto: CreateVisitorDto = {
        trafficSource: 'Google Ads',
        country: 'Russia',
        device: 'Desktop',
        browser: 'Chrome 120.0',
        timeOnSite: '00:05:30',
        cookieFile: 'visitor_session_12345.cookie',
      };

      mockPrismaService.visitor.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createVisitorDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated visitors without filters', async () => {
      const visitors = [mockVisitor];
      const total = 1;

      mockPrismaService.visitor.findMany.mockResolvedValue(visitors);
      mockPrismaService.visitor.count.mockResolvedValue(total);

      const result = await service.findAll(1, 10);

      expect(mockPrismaService.visitor.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(mockPrismaService.visitor.count).toHaveBeenCalledWith({
        where: {},
      });
      expect(result).toEqual(
        expect.objectContaining({
          visitors: expect.arrayContaining([
            expect.objectContaining({
              id: mockVisitor.id,
            }),
          ]),
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        }),
      );
    });

    it('should return filtered visitors by country', async () => {
      const visitors = [mockVisitor];
      const total = 1;

      mockPrismaService.visitor.findMany.mockResolvedValue(visitors);
      mockPrismaService.visitor.count.mockResolvedValue(total);

      const result = await service.findAll(1, 10, 'Russia');

      expect(mockPrismaService.visitor.findMany).toHaveBeenCalledWith({
        where: {
          country: {
            contains: 'Russia',
            mode: 'insensitive',
          },
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result.visitors).toHaveLength(1);
    });

    it('should return filtered visitors by multiple filters', async () => {
      const visitors = [mockVisitor];
      const total = 1;

      mockPrismaService.visitor.findMany.mockResolvedValue(visitors);
      mockPrismaService.visitor.count.mockResolvedValue(total);

      const result = await service.findAll(
        1,
        10,
        'Russia',
        'Desktop',
        'Chrome',
        'Google',
      );

      expect(mockPrismaService.visitor.findMany).toHaveBeenCalledWith({
        where: {
          country: {
            contains: 'Russia',
            mode: 'insensitive',
          },
          device: {
            contains: 'Desktop',
            mode: 'insensitive',
          },
          browser: {
            contains: 'Chrome',
            mode: 'insensitive',
          },
          trafficSource: {
            contains: 'Google',
            mode: 'insensitive',
          },
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result.visitors).toHaveLength(1);
    });

    it('should handle pagination correctly', async () => {
      const visitors = [mockVisitor];
      const total = 25;

      mockPrismaService.visitor.findMany.mockResolvedValue(visitors);
      mockPrismaService.visitor.count.mockResolvedValue(total);

      const result = await service.findAll(3, 10);

      expect(mockPrismaService.visitor.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 20,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result.totalPages).toBe(3);
      expect(result.page).toBe(3);
    });
  });

  describe('findOne', () => {
    it('should return a visitor by id', async () => {
      mockPrismaService.visitor.findUnique.mockResolvedValue(mockVisitor);

      const result = await service.findOne('uuid-test-12345');

      expect(mockPrismaService.visitor.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-test-12345' },
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: mockVisitor.id,
          trafficSource: mockVisitor.trafficSource,
        }),
      );
    });

    it('should throw NotFoundException when visitor not found', async () => {
      mockPrismaService.visitor.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Visitor with ID non-existent-id not found',
      );
    });
  });

  describe('update', () => {
    it('should update a visitor successfully', async () => {
      const updateVisitorDto: UpdateVisitorDto = {
        trafficSource: 'Facebook Ads',
        pagesViewed: 10,
      };

      const updatedVisitor = {
        ...mockVisitor,
        ...updateVisitorDto,
      };

      mockPrismaService.visitor.findUnique.mockResolvedValue(mockVisitor);
      mockPrismaService.visitor.update.mockResolvedValue(updatedVisitor);

      const result = await service.update('uuid-test-12345', updateVisitorDto);

      expect(mockPrismaService.visitor.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-test-12345' },
      });
      expect(mockPrismaService.visitor.update).toHaveBeenCalledWith({
        where: { id: 'uuid-test-12345' },
        data: updateVisitorDto,
      });
      expect(result).toEqual(
        expect.objectContaining({
          trafficSource: 'Facebook Ads',
          pagesViewed: 10,
        }),
      );
    });

    it('should throw NotFoundException when visitor not found for update', async () => {
      const updateVisitorDto: UpdateVisitorDto = {
        trafficSource: 'Facebook Ads',
      };

      mockPrismaService.visitor.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateVisitorDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update('non-existent-id', updateVisitorDto),
      ).rejects.toThrow('Visitor with ID non-existent-id not found');
    });
  });

  describe('remove', () => {
    it('should delete a visitor successfully', async () => {
      mockPrismaService.visitor.findUnique.mockResolvedValue(mockVisitor);
      mockPrismaService.visitor.delete.mockResolvedValue(mockVisitor);

      const result = await service.remove('uuid-test-12345');

      expect(mockPrismaService.visitor.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-test-12345' },
      });
      expect(mockPrismaService.visitor.delete).toHaveBeenCalledWith({
        where: { id: 'uuid-test-12345' },
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: mockVisitor.id,
        }),
      );
    });

    it('should throw NotFoundException when visitor not found for deletion', async () => {
      mockPrismaService.visitor.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove('non-existent-id')).rejects.toThrow(
        'Visitor with ID non-existent-id not found',
      );
    });
  });

  describe('findByCountry', () => {
    it('should return visitors by country', async () => {
      const visitors = [mockVisitor];
      mockPrismaService.visitor.findMany.mockResolvedValue(visitors);

      const result = await service.findByCountry('Russia');

      expect(mockPrismaService.visitor.findMany).toHaveBeenCalledWith({
        where: {
          country: {
            contains: 'Russia',
            mode: 'insensitive',
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          country: 'Russia',
        }),
      );
    });

    it('should return empty array when no visitors found by country', async () => {
      mockPrismaService.visitor.findMany.mockResolvedValue([]);

      const result = await service.findByCountry('NonExistentCountry');

      expect(result).toEqual([]);
    });
  });

  describe('findByTrafficSource', () => {
    it('should return visitors by traffic source', async () => {
      const visitors = [mockVisitor];
      mockPrismaService.visitor.findMany.mockResolvedValue(visitors);

      const result = await service.findByTrafficSource('Google');

      expect(mockPrismaService.visitor.findMany).toHaveBeenCalledWith({
        where: {
          trafficSource: {
            contains: 'Google',
            mode: 'insensitive',
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          trafficSource: 'Google Ads',
        }),
      );
    });

    it('should return empty array when no visitors found by traffic source', async () => {
      mockPrismaService.visitor.findMany.mockResolvedValue([]);

      const result = await service.findByTrafficSource('NonExistentSource');

      expect(result).toEqual([]);
    });
  });

  describe('getStatsByCountry', () => {
    it('should return visitor statistics by country', async () => {
      const mockStats = [
        { country: 'Russia', _count: { id: 45 } },
        { country: 'United States', _count: { id: 32 } },
      ];

      mockPrismaService.visitor.groupBy.mockResolvedValue(mockStats);

      const result = await service.getStatsByCountry();

      expect(mockPrismaService.visitor.groupBy).toHaveBeenCalledWith({
        by: ['country'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      });
      expect(result).toEqual({
        Russia: 45,
        'United States': 32,
      });
    });

    it('should return empty object when no visitors exist', async () => {
      mockPrismaService.visitor.groupBy.mockResolvedValue([]);

      const result = await service.getStatsByCountry();

      expect(result).toEqual({});
    });
  });

  describe('getStatsByDevice', () => {
    it('should return visitor statistics by device', async () => {
      const mockStats = [
        { device: 'Desktop', _count: { id: 65 } },
        { device: 'Mobile', _count: { id: 28 } },
        { device: 'Tablet', _count: { id: 7 } },
      ];

      mockPrismaService.visitor.groupBy.mockResolvedValue(mockStats);

      const result = await service.getStatsByDevice();

      expect(mockPrismaService.visitor.groupBy).toHaveBeenCalledWith({
        by: ['device'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      });
      expect(result).toEqual({
        Desktop: 65,
        Mobile: 28,
        Tablet: 7,
      });
    });
  });

  describe('getStatsByBrowser', () => {
    it('should return visitor statistics by browser', async () => {
      const mockStats = [
        { browser: 'Chrome 120.0', _count: { id: 55 } },
        { browser: 'Firefox 119.0', _count: { id: 25 } },
        { browser: 'Safari 17.1', _count: { id: 15 } },
        { browser: 'Edge', _count: { id: 5 } },
      ];

      mockPrismaService.visitor.groupBy.mockResolvedValue(mockStats);

      const result = await service.getStatsByBrowser();

      expect(mockPrismaService.visitor.groupBy).toHaveBeenCalledWith({
        by: ['browser'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      });
      expect(result).toEqual({
        'Chrome 120.0': 55,
        'Firefox 119.0': 25,
        'Safari 17.1': 15,
        Edge: 5,
      });
    });
  });
});
