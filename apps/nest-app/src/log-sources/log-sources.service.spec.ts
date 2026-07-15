import { Test, TestingModule } from '@nestjs/testing';
import { LogSourcesService } from './log-sources.service';
import { Repository } from 'typeorm';
import { LogSource, LogSourceType } from './entities/log-source.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateLogSourceDto } from './dto/create-log-source.dto';
import { ICurrentUser } from '@/auth/current-user.interface';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { Mocked } from 'vitest';

describe('LogSourcesService', () => {
  let service: LogSourcesService;
  let repo: Mocked<Repository<LogSource>>;
  const currentUser: ICurrentUser = {
    id: 'owner-uuid',
    name: 'test',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogSourcesService,
        {
          provide: getRepositoryToken(LogSource),
          useValue: mock<Repository<LogSource>>(),
        },
      ],
    }).compile();

    service = module.get<LogSourcesService>(LogSourcesService);
    repo = module.get<Mocked<Repository<LogSource>>>(
      getRepositoryToken(LogSource),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new log source', async () => {
      const createDto: CreateLogSourceDto = {
        name: 'test',
        type: LogSourceType.ZABBIX,
        configs: {},
      };
      const logSource = mock<LogSource>();

      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(logSource);
      repo.save.mockResolvedValue(logSource);

      const result = await service.create(createDto, currentUser);

      expect(result).toBe(logSource);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { name: createDto.name, ownerId: currentUser.id },
      });
      expect(repo.create).toHaveBeenCalledWith({
        ...createDto,
        ownerId: currentUser.id,
      });
      expect(repo.save).toHaveBeenCalledWith(logSource);
    });

    it('should throw ConflictException if name already exists', async () => {
      const createDto: CreateLogSourceDto = {
        name: 'test',
        type: LogSourceType.ZABBIX,
        configs: {},
      };

      repo.findOne.mockResolvedValue(mock<LogSource>());

      await expect(service.create(createDto, currentUser)).rejects.toThrow(
        new ConflictException(
          `Log source with name "${createDto.name}" already exists`,
        ),
      );

      expect(repo.create).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all log sources for current user', async () => {
      const mockLogSources = [mock<LogSource>()];
      repo.find.mockResolvedValue(mockLogSources);

      const result = await service.findAll(currentUser);

      expect(result).toBe(mockLogSources);
      expect(repo.find).toHaveBeenCalledWith({
        where: { ownerId: currentUser.id },
      });
    });
  });

  describe('findOne', () => {
    it('should return log source if exists and belongs to user', async () => {
      const logSource = { id: '1', ownerId: currentUser.id } as LogSource;
      repo.findOne.mockResolvedValue(logSource);

      const result = await service.findOne('1', currentUser);

      expect(result).toBe(logSource);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repo.findOne).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('1', currentUser)).rejects.toThrow(
        new NotFoundException(`Log source with ID "1" not found`),
      );
    });

    it('should throw ForbiddenException if belongs to another user', async () => {
      const logSource = { id: '1', ownerId: 'other-user' } as LogSource;
      repo.findOne.mockResolvedValue(logSource);

      await expect(service.findOne('1', currentUser)).rejects.toThrow(
        new ForbiddenException(
          `You are not authorized to access this log source`,
        ),
      );
    });
  });

  describe('update', () => {
    it('should successfully update and return the log source', async () => {
      const logSource = { id: '1', ownerId: currentUser.id } as LogSource;
      const updateDto = { name: 'updated' };
      const updatedLogSource = { ...logSource, ...updateDto } as LogSource;

      repo.findOne.mockResolvedValue(logSource);
      repo.save.mockResolvedValue(updatedLogSource);

      const result = await service.update('1', updateDto, currentUser);

      expect(result).toEqual(updatedLogSource);
      expect(repo.save).toHaveBeenCalledWith(updatedLogSource);
    });

    it("should throw ForbiddenException if updating another user's log source", async () => {
      const logSource = { id: '1', ownerId: 'other-user' } as LogSource;
      repo.findOne.mockResolvedValue(logSource);

      await expect(service.update('1', {}, currentUser)).rejects.toThrow(
        new ForbiddenException(
          `You are not authorized to access this log source`,
        ),
      );
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should successfully delete the log source', async () => {
      const logSource = { id: '1', ownerId: currentUser.id } as LogSource;
      const deleteResult = { affected: 1 } as any;

      repo.findOne.mockResolvedValue(logSource);
      repo.delete.mockResolvedValue(deleteResult);

      const result = await service.remove('1', currentUser);

      expect(result).toBe(deleteResult);
      expect(repo.delete).toHaveBeenCalledWith('1');
    });

    it("should throw ForbiddenException if deleting another user's log source", async () => {
      const logSource = { id: '1', ownerId: 'other-user' } as LogSource;
      repo.findOne.mockResolvedValue(logSource);

      await expect(service.remove('1', currentUser)).rejects.toThrow(
        new ForbiddenException(
          `You are not authorized to access this log source`,
        ),
      );
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});
