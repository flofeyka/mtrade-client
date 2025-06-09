import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestRdo, RequestListRdo } from './rdo/request.rdo';
import { ErrorResponseDto } from '../partner/dto/partner-response.dto';
import { FindRequestsDto } from './dto/find-requests.dto';

@ApiTags('requests')
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new request',
    description:
      'Creates a new request with the provided information. All fields except telegram and partnerCode are required.',
  })
  @ApiBody({
    type: CreateRequestDto,
    description: 'Request data to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Request successfully created',
    type: RequestRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation errors',
    type: ErrorResponseDto,
  })
  async create(@Body() dto: CreateRequestDto): Promise<RequestRdo> {
    return this.requestService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all requests with pagination, filters and search',
    description:
      'Retrieves a paginated list of all requests with optional filtering by status, source, date range and search by name/telegram',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Page number',
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Number of items per page',
    example: '15',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS'],
    description: 'Filter by request status',
    example: 'PENDING',
  })
  @ApiQuery({
    name: 'source',
    required: false,
    type: String,
    description: 'Filter by source',
    example: 'Google ads',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in full name, email, phone, or telegram',
    example: 'Иван Иванов',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: String,
    description: 'Filter from date (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: String,
    description: 'Filter to date (ISO string)',
    example: '2024-01-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of requests',
    type: RequestListRdo,
  })
  async findAll(@Query() dto: FindRequestsDto): Promise<RequestListRdo> {
    return this.requestService.findAll(dto);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get request statistics by status',
    description: 'Returns the count of requests grouped by status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request statistics by status',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'number',
      },
      example: {
        PENDING: 15,
        APPROVED: 8,
        REJECTED: 3,
        IN_PROGRESS: 5,
      },
    },
  })
  async getStats(): Promise<Record<string, number>> {
    return this.requestService.getStatsByStatus();
  }

  @Get('by-partner/:partnerCode')
  @ApiOperation({
    summary: 'Get requests by partner code',
    description:
      'Retrieves all requests associated with a specific partner code',
  })
  @ApiParam({
    name: 'partnerCode',
    description: 'The partner code to search for',
    example: 'PARTNER_ABC_2024',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of requests for the partner',
    type: [RequestRdo],
  })
  async findByPartnerCode(
    @Param('partnerCode') partnerCode: string,
  ): Promise<RequestRdo[]> {
    return this.requestService.findByPartnerCode(partnerCode);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get request by ID',
    description: 'Retrieves a specific request by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique request ID',
    example: 1,
    type: 'integer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request found',
    type: RequestRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Request not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID parameter',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RequestRdo> {
    return this.requestService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update request',
    description:
      'Updates an existing request with new information. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique request ID to update',
    example: 1,
    type: 'integer',
  })
  @ApiBody({
    type: UpdateRequestDto,
    description:
      'Request data to update (only provided fields will be updated)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request successfully updated',
    type: RequestRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation errors',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Request not found',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRequestDto,
  ): Promise<RequestRdo> {
    return this.requestService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete request',
    description:
      'Permanently deletes a request from the system. This action cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique request ID to delete',
    example: 1,
    type: 'integer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request successfully deleted',
    type: RequestRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Request not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID parameter',
    type: ErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<RequestRdo> {
    return this.requestService.remove(id);
  }
}
