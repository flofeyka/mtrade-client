import { Test, TestingModule } from '@nestjs/testing';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { VisitorRdo, VisitorListRdo } from './rdo/visitor.rdo';

describe('VisitorController', () => {
  let controller: VisitorController;
  let service: VisitorService;

  const mockVisitorRdo: VisitorRdo = {
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

  const mockVisitorListRdo: VisitorListRdo = {
    visitors: [mockVisitorRdo],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const mockVisitorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCountry: jest.fn(),
    findByTrafficSource: jest.fn(),
    getStatsByCountry: jest.fn(),
    getStatsByDevice: jest.fn(),
    getStatsByBrowser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitorController],
      providers: [
        {
          provide: VisitorService,
          useValue: mockVisitorService,
        },
      ],
    }).compile();

    controller = module.get<VisitorController>(VisitorController);
    service = module.get<VisitorService>(VisitorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a visitor', async () => {
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

      mockVisitorService.create.mockResolvedValue(mockVisitorRdo);

      const result = await controller.create(createVisitorDto);

      expect(service.create).toHaveBeenCalledWith(createVisitorDto);
      expect(result).toEqual(mockVisitorRdo);
    });
  });

  describe('findAll', () => {
    it('should return paginated visitors without filters', async () => {
      mockVisitorService.findAll.mockResolvedValue(mockVisitorListRdo);

      const result = await controller.findAll(1, 10);

      expect(service.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
        undefined,
        undefined,
      );
      expect(result).toEqual(mockVisitorListRdo);
    });

    it('should return filtered visitors', async () => {
      mockVisitorService.findAll.mockResolvedValue(mockVisitorListRdo);

      const result = await controller.findAll(
        1,
        10,
        'Russia',
        'Desktop',
        'Chrome',
        'Google',
      );

      expect(service.findAll).toHaveBeenCalledWith(
        1,
        10,
        'Russia',
        'Desktop',
        'Chrome',
        'Google',
      );
      expect(result).toEqual(mockVisitorListRdo);
    });
  });

  describe('findOne', () => {
    it('should return a visitor by id', async () => {
      mockVisitorService.findOne.mockResolvedValue(mockVisitorRdo);

      const result = await controller.findOne('uuid-test-12345');

      expect(service.findOne).toHaveBeenCalledWith('uuid-test-12345');
      expect(result).toEqual(mockVisitorRdo);
    });
  });

  describe('update', () => {
    it('should update a visitor', async () => {
      const updateVisitorDto: UpdateVisitorDto = {
        trafficSource: 'Facebook Ads',
        pagesViewed: 10,
      };

      const updatedVisitor = {
        ...mockVisitorRdo,
        ...updateVisitorDto,
      };

      mockVisitorService.update.mockResolvedValue(updatedVisitor);

      const result = await controller.update(
        'uuid-test-12345',
        updateVisitorDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        'uuid-test-12345',
        updateVisitorDto,
      );
      expect(result).toEqual(updatedVisitor);
    });
  });

  describe('remove', () => {
    it('should delete a visitor', async () => {
      mockVisitorService.remove.mockResolvedValue(mockVisitorRdo);

      const result = await controller.remove('uuid-test-12345');

      expect(service.remove).toHaveBeenCalledWith('uuid-test-12345');
      expect(result).toEqual(mockVisitorRdo);
    });
  });

  describe('findByCountry', () => {
    it('should return visitors by country', async () => {
      const visitors = [mockVisitorRdo];
      mockVisitorService.findByCountry.mockResolvedValue(visitors);

      const result = await controller.findByCountry('Russia');

      expect(service.findByCountry).toHaveBeenCalledWith('Russia');
      expect(result).toEqual(visitors);
    });
  });

  describe('findByTrafficSource', () => {
    it('should return visitors by traffic source', async () => {
      const visitors = [mockVisitorRdo];
      mockVisitorService.findByTrafficSource.mockResolvedValue(visitors);

      const result = await controller.findByTrafficSource('Google Ads');

      expect(service.findByTrafficSource).toHaveBeenCalledWith('Google Ads');
      expect(result).toEqual(visitors);
    });
  });

  describe('getStatsByCountry', () => {
    it('should return visitor statistics by country', async () => {
      const stats = {
        Russia: 45,
        'United States': 32,
        Germany: 18,
      };

      mockVisitorService.getStatsByCountry.mockResolvedValue(stats);

      const result = await controller.getStatsByCountry();

      expect(service.getStatsByCountry).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });

  describe('getStatsByDevice', () => {
    it('should return visitor statistics by device', async () => {
      const stats = {
        Desktop: 65,
        Mobile: 28,
        Tablet: 7,
      };

      mockVisitorService.getStatsByDevice.mockResolvedValue(stats);

      const result = await controller.getStatsByDevice();

      expect(service.getStatsByDevice).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });

  describe('getStatsByBrowser', () => {
    it('should return visitor statistics by browser', async () => {
      const stats = {
        'Chrome 120.0': 55,
        'Firefox 119.0': 25,
        'Safari 17.1': 15,
        Edge: 5,
      };

      mockVisitorService.getStatsByBrowser.mockResolvedValue(stats);

      const result = await controller.getStatsByBrowser();

      expect(service.getStatsByBrowser).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });
});
