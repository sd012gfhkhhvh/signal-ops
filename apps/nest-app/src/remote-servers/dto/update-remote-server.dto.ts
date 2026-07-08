import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { RemoteServerStatus } from '../entities/remote-server.entity';

export class UpdateRemoteServerDto {
  @ApiProperty({
    description: 'The name of the remote server',
    example: 'AWS EC2 Instance',
  })
  @IsOptional()
  @IsString()
  name?: string;

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
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiProperty({
    description: 'The status of the remote server',
    enum: RemoteServerStatus,
    example: RemoteServerStatus.CONNECTED,
  })
  @IsOptional()
  @IsEnum(RemoteServerStatus)
  status?: RemoteServerStatus;
}
