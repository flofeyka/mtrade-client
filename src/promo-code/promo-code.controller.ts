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
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { PromoCodeService } from './promo-code.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';
import { PromoCodeRdo, PromoCodeListRdo } from './rdo/promo-code.rdo';

@ApiTags('promo-codes')
@Controller('promo-codes')
@UseInterceptors(ClassSerializerInterceptor)
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new promo code' })
  @ApiResponse({
    status: 201,
    description: 'Promo code created successfully',
    type: PromoCodeRdo,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createPromoCodeDto: CreatePromoCodeDto) {
    return this.promoCodeService.create(createPromoCodeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all promo codes with pagination' })
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
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of promo codes retrieved successfully',
    type: PromoCodeListRdo,
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('isActive', new ParseBoolPipe({ optional: true }))
    isActive?: boolean,
  ) {
    return this.promoCodeService.findAll(page, limit, isActive);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get promo code by ID' })
  @ApiResponse({
    status: 200,
    description: 'Promo code retrieved successfully',
    type: PromoCodeRdo,
  })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promoCodeService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get promo code by code value' })
  @ApiResponse({
    status: 200,
    description: 'Promo code retrieved successfully',
    type: PromoCodeRdo,
  })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  async findByCode(@Param('code') code: string) {
    return this.promoCodeService.findByCode(code);
  }

  @Post('validate/:code')
  @ApiOperation({ summary: 'Validate promo code' })
  @ApiResponse({
    status: 200,
    description: 'Promo code validation result',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
      },
    },
  })
  async validatePromoCode(@Param('code') code: string) {
    const isValid = await this.promoCodeService.validatePromoCode(code);
    return { isValid };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update promo code' })
  @ApiResponse({
    status: 200,
    description: 'Promo code updated successfully',
    type: PromoCodeRdo,
  })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePromoCodeDto: UpdatePromoCodeDto,
  ) {
    return this.promoCodeService.update(id, updatePromoCodeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete promo code' })
  @ApiResponse({
    status: 200,
    description: 'Promo code deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.promoCodeService.remove(id);
  }
}
