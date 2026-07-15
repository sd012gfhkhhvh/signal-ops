import { Test, TestingModule } from '@nestjs/testing';
import { LogSourcesController } from './log-sources.controller';
import { LogSourcesService } from './log-sources.service';
import { LogSource, LogSourceType } from './entities/log-source.entity';
import { ICurrentUser } from '@/auth/current-user.interface';
import { CreateLogSourceDto } from './dto/create-log-source.dto';
import { UpdateLogSourceDto } from './dto/update-log-source.dto';

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
      const createDto: CreateLogSourceDto = {
        name: 'test',
        type: LogSourceType.ZABBIX,
      };
      const mockLogSource = mock<LogSource>();
      service.create.mockResolvedValue(mockLogSource);

      const result = await controller.create(createDto, currentUser);

      expect(result).toEqual(mockLogSource);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createDto, currentUser);
    });
  });

  describe('findAll', () => {
    it('should retrieve all log sources for the current user', async () => {
      const mockLogSources = [mock<LogSource>(), mock<LogSource>()];
      service.findAll.mockResolvedValue(mockLogSources);

      const result = await controller.findAll(currentUser);

      expect(result).toEqual(mockLogSources);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(currentUser);
    });
  });

  describe('findOne', () => {
    it('should retrieve a log source by ID', async () => {
      const mockId = crypto.randomUUID();
      const mockLogSource = mock<LogSource>();
      service.findOne.mockResolvedValue(mockLogSource);

      const result = await controller.findOne(mockId, currentUser);

      expect(result).toEqual(mockLogSource);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(mockId, currentUser);
    });
  });

  describe('update', () => {
    it('should update a log source by ID', async () => {
      const mockId = crypto.randomUUID();
      const updateDto: UpdateLogSourceDto = {
        name: 'updated-name',
      };
      const mockLogSource = mock<LogSource>();
      service.update.mockResolvedValue(mockLogSource);

      const result = await controller.update(mockId, updateDto, currentUser);

      expect(result).toEqual(mockLogSource);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(mockId, updateDto, currentUser);
    });
  });

  describe('remove', () => {
    it('should remove a log source by ID', async () => {
      const mockId = crypto.randomUUID();
      service.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockId, currentUser);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(mockId, currentUser);
    });
  });
});
