import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { CreateRequestDto, RequestStatus } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

describe('RequestController', () => {
  let controller: RequestController;
  let mockRequestService: any;

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
    mockRequestService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByPartnerCode: jest.fn(),
      getStatsByStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        {
          provide: RequestService,
          useValue: mockRequestService,
        },
      ],
    }).compile();

    controller = module.get<RequestController>(RequestController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a request successfully', async () => {
      mockRequestService.create.mockResolvedValue(mockRequest);

      const result = await controller.create(createRequestDto);

      expect(mockRequestService.create).toHaveBeenCalledWith(createRequestDto);
      expect(result).toEqual(mockRequest);
    });

    it('should pass through service errors', async () => {
      const error = new Error('Service error');
      mockRequestService.create.mockRejectedValue(error);

      await expect(controller.create(createRequestDto)).rejects.toThrow(
        'Service error',
      );
      expect(mockRequestService.create).toHaveBeenCalledWith(createRequestDto);
    });
  });

  describe('findAll', () => {
    const mockRequestListRdo = {
      requests: [mockRequest, { ...mockRequest, id: 2 }],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    it('should return paginated list of requests with default parameters', async () => {
      mockRequestService.findAll.mockResolvedValue(mockRequestListRdo);

      const result = await controller.findAll();

      expect(mockRequestService.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
      );
      expect(result).toEqual(mockRequestListRdo);
    });

    it('should return paginated list with custom parameters', async () => {
      mockRequestService.findAll.mockResolvedValue(mockRequestListRdo);

      const result = await controller.findAll('2', '5', 'PENDING', 'Website');

      expect(mockRequestService.findAll).toHaveBeenCalledWith(
        2,
        5,
        'PENDING',
        'Website',
      );
      expect(result).toEqual(mockRequestListRdo);
    });

    it('should handle invalid page/limit parameters by passing NaN', async () => {
      mockRequestService.findAll.mockResolvedValue(mockRequestListRdo);

      const result = await controller.findAll('invalid', 'invalid');

      expect(mockRequestService.findAll).toHaveBeenCalledWith(
        NaN,
        NaN,
        undefined,
        undefined,
      );
      expect(result).toEqual(mockRequestListRdo);
    });

    it('should return empty list when no requests', async () => {
      const emptyResult = {
        requests: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      mockRequestService.findAll.mockResolvedValue(emptyResult);

      const result = await controller.findAll();

      expect(mockRequestService.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
      );
      expect(result).toEqual(emptyResult);
    });
  });

  describe('getStats', () => {
    it('should return request statistics by status', async () => {
      const mockStats = {
        PENDING: 15,
        APPROVED: 8,
        REJECTED: 3,
        IN_PROGRESS: 5,
      };
      mockRequestService.getStatsByStatus.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(mockRequestService.getStatsByStatus).toHaveBeenCalledWith();
      expect(result).toEqual(mockStats);
    });

    it('should return empty stats when no requests', async () => {
      const emptyStats = {};
      mockRequestService.getStatsByStatus.mockResolvedValue(emptyStats);

      const result = await controller.getStats();

      expect(mockRequestService.getStatsByStatus).toHaveBeenCalledWith();
      expect(result).toEqual(emptyStats);
    });
  });

  describe('findByPartnerCode', () => {
    it('should find requests by partner code successfully', async () => {
      const requests = [mockRequest, { ...mockRequest, id: 2 }];
      mockRequestService.findByPartnerCode.mockResolvedValue(requests);

      const result = await controller.findByPartnerCode('PARTNER_ABC_2024');

      expect(mockRequestService.findByPartnerCode).toHaveBeenCalledWith(
        'PARTNER_ABC_2024',
      );
      expect(result).toEqual(requests);
    });

    it('should return empty array when no requests found for partner code', async () => {
      mockRequestService.findByPartnerCode.mockResolvedValue([]);

      const result = await controller.findByPartnerCode('NONEXISTENT');

      expect(mockRequestService.findByPartnerCode).toHaveBeenCalledWith(
        'NONEXISTENT',
      );
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a request by id', async () => {
      mockRequestService.findOne.mockResolvedValue(mockRequest);

      const result = await controller.findOne(1);

      expect(mockRequestService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRequest);
    });

    it('should pass through service errors when request not found', async () => {
      const error = new Error('Request not found');
      mockRequestService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(999)).rejects.toThrow(
        'Request not found',
      );
      expect(mockRequestService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    const updateRequestDto: UpdateRequestDto = {
      fullName: 'Updated Name',
      status: RequestStatus.APPROVED,
    };

    it('should update a request successfully', async () => {
      const updatedRequest = { ...mockRequest, ...updateRequestDto };
      mockRequestService.update.mockResolvedValue(updatedRequest);

      const result = await controller.update(1, updateRequestDto);

      expect(mockRequestService.update).toHaveBeenCalledWith(
        1,
        updateRequestDto,
      );
      expect(result).toEqual(updatedRequest);
    });

    it('should pass through service errors', async () => {
      const error = new Error('Update failed');
      mockRequestService.update.mockRejectedValue(error);

      await expect(controller.update(1, updateRequestDto)).rejects.toThrow(
        'Update failed',
      );
      expect(mockRequestService.update).toHaveBeenCalledWith(
        1,
        updateRequestDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a request successfully', async () => {
      mockRequestService.remove.mockResolvedValue(mockRequest);

      const result = await controller.remove(1);

      expect(mockRequestService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRequest);
    });

    it('should pass through service errors', async () => {
      const error = new Error('Delete failed');
      mockRequestService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow('Delete failed');
      expect(mockRequestService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('should be defined', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
});
