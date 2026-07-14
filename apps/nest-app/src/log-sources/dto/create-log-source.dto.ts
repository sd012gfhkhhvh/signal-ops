import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LogSourceType, LogSourceStatus } from '../entities/log-source.entity';

export class CreateLogSourceDto {
  @ApiProperty({
    description: 'The name of the log source',
    example: 'Production server for the main application',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the log source',
    example: 'Production server for the main application',
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The type of the log source',
    example: LogSourceType.ZABBIX,
    enum: LogSourceType,
  })
  @IsEnum(LogSourceType)
  type: LogSourceType;

  @ApiProperty({
    description: 'The status of the log source',
    example: LogSourceStatus.ONLINE,
    enum: LogSourceStatus,
  })
  @IsEnum(LogSourceStatus)
  @IsOptional()
  status?: LogSourceStatus;

  @ApiProperty({
    description: 'The configuration of the log source',
    example: { host: 'https://zabbix.example.com', token: '1234567890' },
  })
  @IsObject()
  @IsOptional()
  configs?: Record<string, any>;
}
