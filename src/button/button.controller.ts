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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ButtonService } from './button.service';
import { CreateButtonDto } from './dto/create-button.dto';
import { UpdateButtonDto } from './dto/update-button.dto';
import { FindButtonsDto } from './dto/find-buttons.dto';
import { ButtonRdo } from './rdo/button.rdo';
import { ButtonListRdo } from './rdo/button-list.rdo';

@ApiTags('buttons')
@Controller('buttons')
export class ButtonController {
  constructor(private readonly buttonService: ButtonService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new button' })
  @ApiResponse({
    status: 201,
    description: 'Button created successfully',
    type: ButtonRdo,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createButtonDto: CreateButtonDto): Promise<ButtonRdo> {
    return this.buttonService.create(createButtonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all buttons with pagination and filtering' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'dateFrom',
    description: 'Start date for filtering buttons (ISO 8601 format)',
    required: false,
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'dateTo',
    description: 'End date for filtering buttons (ISO 8601 format)',
    required: false,
    example: '2024-12-31T23:59:59.999Z',
  })
  @ApiQuery({
    name: 'filterByUpdated',
    description: 'Filter by updated date instead of created date',
    required: false,
    example: 'true',
  })
  @ApiResponse({
    status: 200,
    description: 'List of buttons retrieved successfully',
    type: ButtonListRdo,
  })
  findAll(@Query() dto: FindButtonsDto): Promise<ButtonListRdo> {
    return this.buttonService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a button by ID' })
  @ApiParam({ name: 'id', description: 'Button ID' })
  @ApiResponse({
    status: 200,
    description: 'Button retrieved successfully',
    type: ButtonRdo,
  })
  @ApiResponse({ status: 404, description: 'Button not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ButtonRdo> {
    return this.buttonService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a button' })
  @ApiParam({ name: 'id', description: 'Button ID' })
  @ApiResponse({
    status: 200,
    description: 'Button updated successfully',
    type: ButtonRdo,
  })
  @ApiResponse({ status: 404, description: 'Button not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateButtonDto: UpdateButtonDto,
  ): Promise<ButtonRdo> {
    return this.buttonService.update(id, updateButtonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a button' })
  @ApiParam({ name: 'id', description: 'Button ID' })
  @ApiResponse({ status: 204, description: 'Button deleted successfully' })
  @ApiResponse({ status: 404, description: 'Button not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.buttonService.remove(id);
  }

  @Post(':id/click')
  @ApiOperation({ summary: 'Increment button click count' })
  @ApiParam({ name: 'id', description: 'Button ID' })
  @ApiResponse({
    status: 200,
    description: 'Button click count incremented successfully',
    type: ButtonRdo,
  })
  @ApiResponse({ status: 404, description: 'Button not found' })
  incrementClick(@Param('id', ParseIntPipe) id: number): Promise<ButtonRdo> {
    return this.buttonService.incrementClickCount(id);
  }

  @Post('track-click')
  @ApiOperation({
    summary:
      'Track button click (create button if not exists and increment click count)',
  })
  @ApiResponse({
    status: 200,
    description: 'Button click tracked successfully',
    type: ButtonRdo,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  trackClick(
    @Body() trackClickDto: { name: string; type?: string; url?: string },
  ): Promise<ButtonRdo> {
    return this.buttonService.trackClick(
      trackClickDto.name,
      trackClickDto.type,
      trackClickDto.url,
    );
  }

  @Get('stats/clicks')
  @ApiOperation({ summary: 'Get button click statistics by type' })
  @ApiQuery({
    name: 'dateFrom',
    description: 'Start date for filtering buttons (ISO 8601 format)',
    required: false,
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'dateTo',
    description: 'End date for filtering buttons (ISO 8601 format)',
    required: false,
    example: '2024-12-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Click statistics retrieved successfully',
  })
  getClickStats(@Query() dto: { dateFrom?: string; dateTo?: string }) {
    return this.buttonService.getClickStats(dto.dateFrom, dto.dateTo);
  }
}
