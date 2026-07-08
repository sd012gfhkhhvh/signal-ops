import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RemoteServerStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  UNKNOWN = 'unknown',
  ERROR = 'error',
}

@Entity()
export class RemoteServer {
  @ApiProperty({
    description: 'The ID of the remote server',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The owner ID of the remote server',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column()
  ownerId: string;

  @ApiProperty({
    description: 'The name of the remote server',
    example: 'Production server for the main application',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The description of the remote server',
    example: 'Production server for the main application',
    nullable: true,
    required: false,
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({
    description: 'The configuration of the remote server',
    example: "{ host: '[IP_ADDRESS]', username: 'admin', port: 22 }",
  })
  @Column({ type: 'simple-json' })
  config: Record<string, any>;

  @Column({
    type: 'varchar',
    default: 'unknown',
  })
  @ApiProperty({
    description: 'The status of the remote server',
    example: RemoteServerStatus.CONNECTED,
    enum: RemoteServerStatus,
  })
  status: RemoteServerStatus;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The creation date of the remote server',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'The last update date of the remote server',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
