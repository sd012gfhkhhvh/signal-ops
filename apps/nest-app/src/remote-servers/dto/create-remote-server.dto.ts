import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RemoteServerStatus } from '../entities/remote-server.entity';

export class CreateRemoteServerDto {
  @ApiProperty({
    description: 'The name of the remote server',
    example: 'AWS EC2 Instance',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the remote server',
    example: 'Production server for the main application',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The configuration of the remote server',
    example: { host: '[IP_ADDRESS]', username: 'admin', port: 22 },
  })
  @IsObject()
  @IsNotEmpty()
  config: Record<string, any>;

  @ApiProperty({
    description: 'The status of the remote server',
    enum: RemoteServerStatus,
    example: RemoteServerStatus.UNKNOWN,
    default: RemoteServerStatus.UNKNOWN,
  })
  @IsOptional()
  @IsEnum(RemoteServerStatus)
  status?: RemoteServerStatus = RemoteServerStatus.UNKNOWN;
}
