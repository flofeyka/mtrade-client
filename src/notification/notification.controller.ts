import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRdo, NotificationListRdo } from './rdo/notification.rdo';
import { ErrorResponseDto } from '../partner/dto/partner-response.dto';
import { FindNotificationsDto } from './dto/find-notifcations.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new notification',
    description:
      'Creates a new notification with the provided text and expiration date.',
  })
  @ApiBody({
    type: CreateNotificationDto,
    description: 'Notification data to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Notification successfully created',
    type: NotificationRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation errors',
    type: ErrorResponseDto,
  })
  async create(@Body() dto: CreateNotificationDto): Promise<NotificationRdo> {
    return this.notificationService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all notifications',
    description:
      'Retrieves a list of all notifications with optional search and date filtering, ordered by creation date (newest first)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in notification text',
    example: 'Host',
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
    description: 'List of all notifications with total count',
    type: NotificationListRdo,
  })
  async findAll(
    @Query() dto: FindNotificationsDto,
  ): Promise<NotificationListRdo> {
    return this.notificationService.findAll(dto);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get active notifications',
    description:
      'Retrieves a list of active notifications (not expired) ordered by creation date (newest first)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active notifications with total count',
    type: NotificationListRdo,
  })
  async findActive(): Promise<NotificationListRdo> {
    return this.notificationService.findActive();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get notification by ID',
    description: 'Retrieves a specific notification by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique notification ID',
    example: 1,
    type: 'integer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification found',
    type: NotificationRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Notification not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID parameter',
    type: ErrorResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationRdo> {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update notification',
    description:
      'Updates an existing notification with new information. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique notification ID to update',
    example: 1,
    type: 'integer',
  })
  @ApiBody({
    type: UpdateNotificationDto,
    description:
      'Notification data to update (only provided fields will be updated)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification successfully updated',
    type: NotificationRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation errors',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Notification not found',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNotificationDto,
  ): Promise<NotificationRdo> {
    return this.notificationService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete notification',
    description:
      'Permanently deletes a notification from the system. This action cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique notification ID to delete',
    example: 1,
    type: 'integer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification successfully deleted',
    type: NotificationRdo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Notification not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID parameter',
    type: ErrorResponseDto,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationRdo> {
    return this.notificationService.remove(id);
  }
}
