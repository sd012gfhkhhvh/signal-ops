import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRemoteServerDto } from './dto/create-remote-server.dto';
import { UpdateRemoteServerDto } from './dto/update-remote-server.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RemoteServer } from './entities/remote-server.entity';
import type { ICurrentUser } from 'src/auth/current-user.interface';

@Injectable()
export class RemoteServersService {
  constructor(
    @InjectRepository(RemoteServer)
    private readonly repository: Repository<RemoteServer>,
  ) {}

  async create(
    createRemoteServerDto: CreateRemoteServerDto,
    currentUser: ICurrentUser,
  ) {
    if (!currentUser.id) {
      throw new NotFoundException('Current user not found');
    }

    const name = createRemoteServerDto.name;

    const existingRemoteServer = await this.repository.findOne({
      where: { ownerId: currentUser.id, name: name },
    });
    if (existingRemoteServer) {
      throw new ConflictException(
        `Remote server with name "${name}" already exists for user "${currentUser.id}"`,
      );
    }
    const remoteServer = this.repository.create({
      ...createRemoteServerDto,
      ownerId: currentUser.id,
    });
    return await this.repository.save(remoteServer);
  }

  async findAll(currentUser: ICurrentUser) {
    if (!currentUser.id) {
      throw new NotFoundException('Current user not found');
    }
    return await this.repository.find({
      where: { ownerId: currentUser.id },
    });
  }

  async findOne(id: string, currentUser: ICurrentUser) {
    const remoteServer = await this.repository.findOneBy({ id });
    if (!remoteServer) {
      throw new NotFoundException(`Remote server #${id} not found`);
    }

    if (remoteServer.ownerId !== currentUser.id) {
      throw new ForbiddenException(
        `Remote server #${id} does not belong to user #${currentUser.id}`,
      );
    }
    return remoteServer;
  }

  async update(
    id: string,
    updateRemoteServerDto: UpdateRemoteServerDto,
    currentUser: ICurrentUser,
  ) {
    const remoteServer = await this.findOne(id, currentUser);
    return await this.repository.save({
      ...remoteServer,
      ...updateRemoteServerDto,
    });
  }

  async remove(id: string, currentUser: ICurrentUser) {
    await this.findOne(id, currentUser);
    return await this.repository.delete(id);
  }
}
