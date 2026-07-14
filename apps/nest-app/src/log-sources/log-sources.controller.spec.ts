import { Test, TestingModule } from '@nestjs/testing';
import { LogSourcesController } from './log-sources.controller';
import { LogSourcesService } from './log-sources.service';
import { LogSource, LogSourceType } from './entities/log-source.entity';
import { ICurrentUser } from '@/auth/current-user.interface';
import { CreateLogSourceDto } from './dto/create-log-source.dto';
import { UnprocessableEntityException } from '@nestjs/common';
import { error } from 'console';

describe('LogSourcesController', () => {
  let controller: LogSourcesController;
  let service: Mocked<LogSourcesService>;

  const currentUser: ICurrentUser = {
    id: crypto.randomUUID(),
    name: 'test',
    email: 'test@gmail.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogSourcesController],
      providers: [
        { provide: LogSourcesService, useValue: mock<LogSourcesService>() },
      ],
    }).compile();

    controller = module.get<LogSourcesController>(LogSourcesController);
    service = module.get<Mocked<LogSourcesService>>(LogSourcesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new log source', async () => {
      const mockCreateLogSourceDto: CreateLogSourceDto = {
        name: 'test',
        type: LogSourceType.ZABBIX,
      };
      const mockLogSource = mock<LogSource>();
      service.create.mockResolvedValue(mockLogSource);

      const result = await controller.create(
        mockCreateLogSourceDto,
        currentUser,
      );

      expect(result).toEqual(mockLogSource);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(
        mockCreateLogSourceDto,
        currentUser,
      );
    });

    it('should throw error if name is not provided', async () => {
      const createDto: CreateLogSourceDto = {
        name: '',
        type: LogSourceType.ZABBIX,
      };
      service.create.mockRejectedValue(new Error('Name is required'));

      await expect(controller.create(createDto, currentUser)).rejects.toThrow();
    });

    it('should throw error if type is not provided', async () => {
      const createDto: CreateLogSourceDto = {
        name: 'test',
        type: undefined as any,
      };

      service.create.mockRejectedValue(new Error('Type is required'));
      await expect(controller.create(createDto, currentUser)).rejects.toThrow();
    });

    it('should throw error if ownerId is not provided', async () => {
      const createDto: CreateLogSourceDto = {
        name: 'test',
        type: LogSourceType.ZABBIX,
      };

      service.create.mockRejectedValue(new Error('Owner ID is required'));
      await expect(
        controller.create(createDto, {
          ...currentUser,
          id: '',
        } as ICurrentUser),
      ).rejects.toThrow();
    });

    it('should throw error if log source name already exists', async () => {
      const createDto: CreateLogSourceDto = {
        name: 'test',
        type: LogSourceType.ZABBIX,
      };

      service.create.mockRejectedValue(new Error('Log source already exists'));
      await expect(controller.create(createDto, currentUser)).rejects.toThrow();
    });
  });
});
