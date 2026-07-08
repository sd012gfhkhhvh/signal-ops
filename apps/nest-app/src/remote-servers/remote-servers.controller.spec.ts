import { Test, TestingModule } from '@nestjs/testing';
import { RemoteServersController } from './remote-servers.controller';
import { RemoteServersService } from './remote-servers.service';
import { ICurrentUser } from 'src/auth/current-user.interface';
import { CreateRemoteServerDto } from './dto/create-remote-server.dto';
import {
  RemoteServer,
  RemoteServerStatus,
} from './entities/remote-server.entity';
import { UpdateRemoteServerDto } from './dto/update-remote-server.dto';

describe('RemoteServersController', () => {
  let controller: RemoteServersController;
  let service: Mocked<RemoteServersService>;
  const mockCurrentUser: ICurrentUser = {
    id: 'abc-123',
    name: 'John Doe',
    email: 'test@test.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemoteServersController],
      providers: [
        {
          provide: RemoteServersService,
          useValue: mock<RemoteServersService>(),
        },
      ],
    }).compile();

    controller = module.get<RemoteServersController>(RemoteServersController);
    service = module.get<Mocked<RemoteServersService>>(RemoteServersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create remote server', async () => {
      const mockRemoteServer = {} as RemoteServer;
      service.create.mockResolvedValue(mockRemoteServer);

      const mockCreateRemoteServerDto: CreateRemoteServerDto = {
        name: 'Remote Server 1',
        description: 'Remote Server 1',
        config: {},
        status: RemoteServerStatus.UNKNOWN,
      };

      const result = await controller.create(
        mockCreateRemoteServerDto,
        mockCurrentUser,
      );

      expect(result).toEqual(mockRemoteServer);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(
        mockCreateRemoteServerDto,
        mockCurrentUser,
      );
    });
  });

  describe('findAll', () => {
    it('should find all remote servers', async () => {
      const mockRemoteServers = [mock<RemoteServer>()];
      service.findAll.mockResolvedValue(mockRemoteServers);

      const result = await controller.findAll(mockCurrentUser);

      expect(result).toBe(mockRemoteServers);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(mockCurrentUser);
    });
  });

  describe('findOne', () => {
    it('should find one remote server', async () => {
      const mockRemoteServer = mock<RemoteServer>();
      service.findOne.mockResolvedValue(mockRemoteServer);

      const result = await controller.findOne('1', mockCurrentUser);

      expect(result).toBe(mockRemoteServer);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith('1', mockCurrentUser);
    });
  });

  describe('update', () => {
    it('should update remote server', async () => {
      const mockRemoteServer = mock<RemoteServer>();
      service.update.mockResolvedValue(mockRemoteServer);

      const updateDto = {} as UpdateRemoteServerDto;
      const result = await controller.update('1', updateDto, mockCurrentUser);

      expect(result).toBe(mockRemoteServer);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        '1',
        updateDto,
        mockCurrentUser,
      );
    });
  });

  describe('remove', () => {
    it('should delete remote server', async () => {
      const mockRemoteServer = mock<RemoteServer>();
      service.remove.mockResolvedValue(mockRemoteServer);

      const result = await controller.remove('1', mockCurrentUser);

      expect(result).toBe(mockRemoteServer);
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith('1', mockCurrentUser);
    });
  });
});
