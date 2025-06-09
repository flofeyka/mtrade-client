import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationRdo {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier of the notification',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The text content of the notification',
    example: 'System maintenance will begin at 2 AM tomorrow',
  })
  text: string;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'The end date and time when the notification expires',
    example: '2024-12-31T23:59:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  end: Date;

  @Expose()
  @Type(() => Date)
  @ApiProperty({
    description: 'Timestamp when the notification was created',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}

export class NotificationListRdo {
  @Expose()
  @Type(() => NotificationRdo)
  @ApiProperty({
    description: 'List of notifications',
    type: [NotificationRdo],
  })
  notifications: NotificationRdo[];

  @Expose()
  @ApiProperty({
    description: 'Total number of notifications',
    example: 15,
  })
  total: number;
}
