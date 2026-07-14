import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  UpdateDateColumn,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm';

export enum LogSourceType {
  ZABBIX = 'zabbix',
  PROMETHEUS = 'prometheus',
}

export enum LogSourceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  UNKNOWN = 'unknown',
}

@Entity()
export class LogSource {
  @ApiProperty({
    description: 'The ID of the log source',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The owner ID of the log source',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column()
  ownerId: string;

  @ApiProperty({
    description: 'The name of the log source',
    example: 'Production server for the main application',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The description of the log source',
    example: 'Production server for the main application',
    nullable: true,
    required: false,
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({
    description: 'The type of the log source',
    example: LogSourceType.ZABBIX,
    enum: LogSourceType,
  })
  @Column()
  type: LogSourceType;

  @ApiProperty({
    description: 'The status of the log source',
    example: LogSourceStatus.ONLINE,
    enum: LogSourceStatus,
  })
  @Column({ default: LogSourceStatus.UNKNOWN })
  status: LogSourceStatus;

  @ApiProperty({
    description: 'The configuration of the log source',
    example: { host: 'https://zabbix.example.com', token: '1234567890' },
  })
  @Column({ type: 'simple-json', default: {} })
  configs: Record<string, any>;

  @ApiProperty({
    description: 'The creation date of the log source',
    example: '2022-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the log source',
    example: '2022-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'The deletion date of the log source',
    example: '2022-01-01T00:00:00.000Z',
  })
  @DeleteDateColumn()
  deletedAt: Date;
}
