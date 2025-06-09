import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, PaymentStatus } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRdo, PaymentListRdo, PaymentStatsRdo } from './rdo/payment.rdo';

@ApiTags('payments')
@Controller('payments')
@UseInterceptors(ClassSerializerInterceptor)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    type: PaymentRdo,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments with pagination and filtering' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: PaymentStatus,
    description: 'Filter by payment status',
    example: PaymentStatus.PENDING,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in full name, email, product, or source',
    example: 'ivan@example.com',
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
    status: 200,
    description: 'List of payments retrieved successfully',
    type: PaymentListRdo,
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('status') status?: PaymentStatus,
    @Query('search') search?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.paymentService.findAll(
      page,
      limit,
      status,
      search,
      dateFrom,
      dateTo,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get payment statistics' })
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
    status: 200,
    description: 'Payment statistics retrieved successfully',
    type: PaymentStatsRdo,
  })
  async getStats(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.paymentService.getStats(dateFrom, dateTo);
  }

  @Get('by-email/:email')
  @ApiOperation({ summary: 'Get payments by email with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Payments by email retrieved successfully',
    type: PaymentListRdo,
  })
  async findByEmail(
    @Param('email') email: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.paymentService.findByEmail(email, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully',
    type: PaymentRdo,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment updated successfully',
    type: PaymentRdo,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.remove(id);
  }
}
