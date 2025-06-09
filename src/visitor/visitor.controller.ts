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
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { VisitorRdo, VisitorListRdo } from './rdo/visitor.rdo';

@ApiTags('visitors')
@Controller('visitors')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new visitor' })
  @ApiResponse({
    status: 201,
    description: 'The visitor has been successfully created.',
    type: VisitorRdo,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createVisitorDto: CreateVisitorDto): Promise<VisitorRdo> {
    return this.visitorService.create(createVisitorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all visitors with pagination and filters' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'country',
    required: false,
    type: String,
    description: 'Filter by country',
    example: 'Russia',
  })
  @ApiQuery({
    name: 'device',
    required: false,
    type: String,
    description: 'Filter by device',
    example: 'Desktop',
  })
  @ApiQuery({
    name: 'browser',
    required: false,
    type: String,
    description: 'Filter by browser',
    example: 'Chrome',
  })
  @ApiQuery({
    name: 'trafficSource',
    required: false,
    type: String,
    description: 'Filter by traffic source',
    example: 'Google',
  })
  @ApiResponse({
    status: 200,
    description: 'List of visitors retrieved successfully.',
    type: VisitorListRdo,
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('country') country?: string,
    @Query('device') device?: string,
    @Query('browser') browser?: string,
    @Query('trafficSource') trafficSource?: string,
  ): Promise<VisitorListRdo> {
    return this.visitorService.findAll(
      page,
      limit,
      country,
      device,
      browser,
      trafficSource,
    );
  }

  @Get('stats/country')
  @ApiOperation({ summary: 'Get visitor statistics by country' })
  @ApiResponse({
    status: 200,
    description: 'Visitor statistics by country retrieved successfully.',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'number',
      },
      example: {
        Russia: 45,
        'United States': 32,
        Germany: 18,
      },
    },
  })
  getStatsByCountry(): Promise<Record<string, number>> {
    return this.visitorService.getStatsByCountry();
  }

  @Get('stats/device')
  @ApiOperation({ summary: 'Get visitor statistics by device' })
  @ApiResponse({
    status: 200,
    description: 'Visitor statistics by device retrieved successfully.',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'number',
      },
      example: {
        Desktop: 65,
        Mobile: 28,
        Tablet: 7,
      },
    },
  })
  getStatsByDevice(): Promise<Record<string, number>> {
    return this.visitorService.getStatsByDevice();
  }

  @Get('stats/browser')
  @ApiOperation({ summary: 'Get visitor statistics by browser' })
  @ApiResponse({
    status: 200,
    description: 'Visitor statistics by browser retrieved successfully.',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'number',
      },
      example: {
        'Chrome 120.0': 55,
        'Firefox 119.0': 25,
        'Safari 17.1': 15,
        Edge: 5,
      },
    },
  })
  getStatsByBrowser(): Promise<Record<string, number>> {
    return this.visitorService.getStatsByBrowser();
  }

  @Get('search/country/:country')
  @ApiOperation({ summary: 'Find visitors by country' })
  @ApiParam({
    name: 'country',
    description: 'Country name to search for',
    example: 'Russia',
  })
  @ApiResponse({
    status: 200,
    description: 'Visitors found by country.',
    type: [VisitorRdo],
  })
  findByCountry(@Param('country') country: string): Promise<VisitorRdo[]> {
    return this.visitorService.findByCountry(country);
  }

  @Get('search/traffic-source/:trafficSource')
  @ApiOperation({ summary: 'Find visitors by traffic source' })
  @ApiParam({
    name: 'trafficSource',
    description: 'Traffic source to search for',
    example: 'Google Ads',
  })
  @ApiResponse({
    status: 200,
    description: 'Visitors found by traffic source.',
    type: [VisitorRdo],
  })
  findByTrafficSource(
    @Param('trafficSource') trafficSource: string,
  ): Promise<VisitorRdo[]> {
    return this.visitorService.findByTrafficSource(trafficSource);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a visitor by id' })
  @ApiParam({
    name: 'id',
    description: 'Visitor unique identifier',
    example: 'uuid-string-12345',
  })
  @ApiResponse({
    status: 200,
    description: 'The visitor has been successfully retrieved.',
    type: VisitorRdo,
  })
  @ApiResponse({ status: 404, description: 'Visitor not found.' })
  findOne(@Param('id') id: string): Promise<VisitorRdo> {
    return this.visitorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a visitor' })
  @ApiParam({
    name: 'id',
    description: 'Visitor unique identifier',
    example: 'uuid-string-12345',
  })
  @ApiResponse({
    status: 200,
    description: 'The visitor has been successfully updated.',
    type: VisitorRdo,
  })
  @ApiResponse({ status: 404, description: 'Visitor not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(
    @Param('id') id: string,
    @Body() updateVisitorDto: UpdateVisitorDto,
  ): Promise<VisitorRdo> {
    return this.visitorService.update(id, updateVisitorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a visitor' })
  @ApiParam({
    name: 'id',
    description: 'Visitor unique identifier',
    example: 'uuid-string-12345',
  })
  @ApiResponse({
    status: 200,
    description: 'The visitor has been successfully deleted.',
    type: VisitorRdo,
  })
  @ApiResponse({ status: 404, description: 'Visitor not found.' })
  remove(@Param('id') id: string): Promise<VisitorRdo> {
    return this.visitorService.remove(id);
  }
}
