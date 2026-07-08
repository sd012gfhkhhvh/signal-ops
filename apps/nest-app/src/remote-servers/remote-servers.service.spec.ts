import { Test, TestingModule } from '@nestjs/testing';
import { RemoteServersService } from './remote-servers.service';
import type { Repository } from 'typeorm';
import {
  RemoteServer,
  RemoteServerStatus,
} from './entities/remote-server.entity';
import type { Mocked } from 'vitest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRemoteServerDto } from './dto/create-remote-server.dto';
import { ICurrentUser } from 'src/auth/current-user.interface';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('RemoteServersService', () => {
  let service: RemoteServersService;
  let repo: Mocked<Repository<RemoteServer>>;
  const currentUser: ICurrentUser = {
    id: 'owner-uuid',
    name: 'test',
    email: 'test',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoteServersService,
        {
          provide: getRepositoryToken(RemoteServer),
          useValue: mock<Repository<RemoteServer>>(),
        },
      ],
    }).compile();

    service = module.get<RemoteServersService>(RemoteServersService);
    repo = module.get<Mocked<Repository<RemoteServer>>>(
      getRepositoryToken(RemoteServer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new remote server', async () => {
      const remoteServer = mock<RemoteServer>();

      repo.create.mockReturnValue(remoteServer);
      repo.save.mockResolvedValue(remoteServer);

      const createRemoteServerDto: CreateRemoteServerDto = {
        name: 'test',
        description: 'test',
        config: {
          type: 'test',
          host: 'test',
          port: 22,
          username: 'test',
          password: 'test',
        },
        status: RemoteServerStatus.UNKNOWN,
      };

      expect(await service.create(createRemoteServerDto, currentUser)).toBe(
        remoteServer,
      );
      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(repo.create).toHaveBeenCalledWith({
        ...createRemoteServerDto,
        ownerId: currentUser.id,
      });
      expect(repo.save).toHaveBeenCalledTimes(1);
      expect(repo.save).toHaveBeenCalledWith(remoteServer);
    });

    it('should throw error if remote server with same name already exists', async () => {
      const remoteServer = mock<RemoteServer>();
      repo.findOne.mockResolvedValue(remoteServer);

      const createRemoteServerDto: CreateRemoteServerDto = {
        name: 'test',
        description: 'test',
        config: {
          type: 'test',
          host: 'test',
          port: 22,
          username: 'test',
          password: 'test',
        },
        status: RemoteServerStatus.UNKNOWN,
      };

      await expect(
        service.create(createRemoteServerDto, currentUser),
      ).rejects.toThrow(
        new ConflictException(
          `Remote server with name "${createRemoteServerDto.name}" already exists for user "${currentUser.id}"`,
        ),
      );

      expect(repo.findOne).toHaveBeenCalledTimes(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: {
          ownerId: currentUser.id,
          name: createRemoteServerDto.name,
        },
      });

      expect(repo.create).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if current user id is not present', async () => {
      const createRemoteServerDto: CreateRemoteServerDto = {
        name: 'test',
        description: 'test',
        config: {
          type: 'test',
          host: 'test',
          port: 22,
          username: 'test',
          password: 'test',
        },
        status: RemoteServerStatus.UNKNOWN,
      };

      await expect(
        service.create(createRemoteServerDto, {
          ...currentUser,
          id: undefined,
        } as any),
      ).rejects.toThrow(new NotFoundException('Current user not found'));

      expect(repo.findOne).not.toHaveBeenCalled();
      expect(repo.create).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all remote servers belonging to user', async () => {
      const mockServers = [{ id: '1', name: 'Server 1' }] as any;
      repo.find.mockResolvedValue(mockServers);

      const result = await service.findAll(currentUser);
      expect(result).toBe(mockServers);
      expect(repo.find).toHaveBeenCalledTimes(1);
      expect(repo.find).toHaveBeenCalledWith({
        where: { ownerId: currentUser.id },
      });
    });

    it('should throw NotFoundException if current user id is not present', async () => {
      await expect(
        service.findAll({ ...currentUser, id: undefined } as any),
      ).rejects.toThrow(new NotFoundException('Current user not found'));

      expect(repo.find).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return the remote server if it exists and belongs to the user', async () => {
      const mockServer = {
        id: '1',
        ownerId: currentUser.id,
        name: 'Server 1',
      } as any;
      repo.findOneBy.mockResolvedValue(mockServer);

      const result = await service.findOne('1', currentUser);
      expect(result).toBe(mockServer);
      expect(repo.findOneBy).toHaveBeenCalledTimes(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw NotFoundException if the remote server is not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('1', currentUser)).rejects.toThrow(
        new NotFoundException('Remote server #1 not found'),
      );
      expect(repo.findOneBy).toHaveBeenCalledTimes(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw ForbiddenException if the remote server belongs to another user', async () => {
      const mockServer = {
        id: '1',
        ownerId: 'other-user-uuid',
        name: 'Server 1',
      } as any;
      repo.findOneBy.mockResolvedValue(mockServer);

      await expect(service.findOne('1', currentUser)).rejects.toThrow(
        new ForbiddenException(
          'Remote server #1 does not belong to user #owner-uuid',
        ),
      );
      expect(repo.findOneBy).toHaveBeenCalledTimes(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('update', () => {
    it('should successfully update and return the remote server', async () => {
      const mockServer = {
        id: '1',
        ownerId: currentUser.id,
        name: 'Server 1',
      } as any;
      const updateDto = { name: 'Updated Server' };
      const updatedServer = { ...mockServer, ...updateDto };

      repo.findOneBy.mockResolvedValue(mockServer);
      repo.save.mockResolvedValue(updatedServer);

      const result = await service.update('1', updateDto, currentUser);
      expect(result).toBe(updatedServer);
      expect(repo.findOneBy).toHaveBeenCalledTimes(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(repo.save).toHaveBeenCalledTimes(1);
      expect(repo.save).toHaveBeenCalledWith(updatedServer);
    });

    it('should propagate NotFoundException if findOne throws NotFoundException', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.update('1', {}, currentUser)).rejects.toThrow(
        new NotFoundException('Remote server #1 not found'),
      );
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should propagate ForbiddenException if findOne throws ForbiddenException', async () => {
      const mockServer = {
        id: '1',
        ownerId: 'other-user-uuid',
        name: 'Server 1',
      } as any;
      repo.findOneBy.mockResolvedValue(mockServer);

      await expect(service.update('1', {}, currentUser)).rejects.toThrow(
        new ForbiddenException(
          'Remote server #1 does not belong to user #owner-uuid',
        ),
      );
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should successfully delete the remote server', async () => {
      const mockServer = {
        id: '1',
        ownerId: currentUser.id,
        name: 'Server 1',
      } as any;
      const deleteResult = { affected: 1 } as any;

      repo.findOneBy.mockResolvedValue(mockServer);
      repo.delete.mockResolvedValue(deleteResult);

      const result = await service.remove('1', currentUser);
      expect(result).toBe(deleteResult);
      expect(repo.findOneBy).toHaveBeenCalledTimes(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(repo.delete).toHaveBeenCalledTimes(1);
      expect(repo.delete).toHaveBeenCalledWith('1');
    });

    it('should propagate NotFoundException if findOne throws NotFoundException', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.remove('1', currentUser)).rejects.toThrow(
        new NotFoundException('Remote server #1 not found'),
      );
      expect(repo.delete).not.toHaveBeenCalled();
    });

    it('should propagate ForbiddenException if findOne throws ForbiddenException', async () => {
      const mockServer = {
        id: '1',
        ownerId: 'other-user-uuid',
        name: 'Server 1',
      } as any;
      repo.findOneBy.mockResolvedValue(mockServer);

      await expect(service.remove('1', currentUser)).rejects.toThrow(
        new ForbiddenException(
          'Remote server #1 does not belong to user #owner-uuid',
        ),
      );
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });
});
