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
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import {
  PartnerResponseDto,
  ErrorResponseDto,
} from './dto/partner-response.dto';
import { PartnerRdo, PartnerListRdo } from './rdo/partner.rdo';
import { FindPartnersDto } from './dto/find-partners.dto';

@ApiTags('partners')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new partner',
    description:
      'Creates a new partner with the provided information. Username and code must be unique across all partners.',
  })
  @ApiBody({
    type: CreatePartnerDto,
    description: 'Partner data to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Partner successfully created',
    type: PartnerRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation errors',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Partner with this username or code already exists',
    type: ErrorResponseDto,
  })
  async create(@Body() dto: CreatePartnerDto): Promise<PartnerRdo> {
    return this.partnerService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all partners',
    description:
      'Retrieves a list of all partners ordered by creation date (newest first)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all partners with total count',
    type: PartnerListRdo,
  })
  async findAll(@Query() dto: FindPartnersDto): Promise<PartnerListRdo> {
    return this.partnerService.findAll(dto);
  }

  @Get('search/by-code')
  @ApiOperation({
    summary: 'Find partner by code',
    description: 'Searches for a partner using their unique partner code',
  })
  @ApiQuery({
    name: 'code',
    description: 'The unique partner code to search for',
    example: 'PARTNER_JD_2024',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Partner found',
    type: PartnerRdo,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Partner not found (returns null)',
    schema: { type: 'null' },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid code parameter',
    type: ErrorResponseDto,
  })
  async findByCode(@Query('code') code: string): Promise<PartnerRdo | null> {
    return this.partnerService.findByCode(code);
  }

  @Get('search/by-username')
  @ApiOperation({
    summary: 'Find partner by username',
    description: 'Searches for a partner using their unique username',
  })
  @ApiQuery({
    name: 'username',
    description: 'The unique username to search for',
    example: 'johndoe_trading',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Partner found',
    type: PartnerRdo,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Partner not found (returns null)',
    schema: { type: 'null' },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid username parameter',
    type: ErrorResponseDto,
  })
  async findByUsername(
    @Query('username') username: string,
  ): Promise<PartnerRdo | null> {
    return this.partnerService.findByUsername(username);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get partner by ID',
    description: 'Retrieves a specific partner by their unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique partner ID',
    example: 1,
    type: 'integer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Partner found',
    type: PartnerRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Partner not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID parameter',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PartnerRdo> {
    return this.partnerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update partner',
    description:
      'Updates an existing partner with new information. Only provided fields will be updated. Username and code must remain unique.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique partner ID to update',
    example: 1,
    type: 'integer',
  })
  @ApiBody({
    type: UpdatePartnerDto,
    description:
      'Partner data to update (only provided fields will be updated)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Partner successfully updated',
    type: PartnerRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation errors',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Partner not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Username or code already exists',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePartnerDto,
  ): Promise<PartnerRdo> {
    return this.partnerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete partner',
    description:
      'Permanently deletes a partner from the system. This action cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique partner ID to delete',
    example: 1,
    type: 'integer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Partner successfully deleted',
    type: PartnerRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Partner not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID parameter',
    type: ErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<PartnerRdo> {
    return this.partnerService.remove(id);
  }
}
