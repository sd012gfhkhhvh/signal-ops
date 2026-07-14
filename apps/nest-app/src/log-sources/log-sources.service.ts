import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLogSourceDto } from './dto/create-log-source.dto';
import { UpdateLogSourceDto } from './dto/update-log-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LogSource } from './entities/log-source.entity';
import { Repository } from 'typeorm';
import type { ICurrentUser } from '@/auth/current-user.interface';

@Injectable()
export class LogSourcesService {
  constructor(
    @InjectRepository(LogSource)
    private readonly logSourceRepo: Repository<LogSource>,
  ) {}

  async checkName(name: string, ownerId: string) {
    const logSource = await this.logSourceRepo.findOne({
      where: { name, ownerId },
    });
    if (logSource) {
      throw new ConflictException(
        `Log source with name "${name}" already exists`,
      );
    }
  }

  async create(
    createLogSourceDto: CreateLogSourceDto,
    currentUser: ICurrentUser,
  ) {
    await this.checkName(createLogSourceDto.name, currentUser.id);

    const logSource = this.logSourceRepo.create({
      ...createLogSourceDto,
      ownerId: currentUser.id,
    });
    return this.logSourceRepo.save(logSource);
  }

  async findAll(currentUser: ICurrentUser) {
    return this.logSourceRepo.find({ where: { ownerId: currentUser.id } });
  }

  async getById(id: string) {
    const logSource = await this.logSourceRepo.findOne({ where: { id } });
    if (!logSource) {
      throw new NotFoundException(`Log source with ID "${id}" not found`);
    }
    return logSource;
  }

  async isOwner(id: string, currentUser: ICurrentUser) {
    const logSource = await this.getById(id);
    if (logSource.ownerId !== currentUser.id) {
      throw new ForbiddenException(
        `You are not authorized to access this log source`,
      );
    }
    return logSource;
  }

  async findOne(id: string, currentUser: ICurrentUser) {
    await this.isOwner(id, currentUser);

    return this.getById(id);
  }

  async update(
    id: string,
    updateLogSourceDto: UpdateLogSourceDto,
    currentUser: ICurrentUser,
  ) {
    const logSource = await this.isOwner(id, currentUser);

    return this.logSourceRepo.save({ ...logSource, ...updateLogSourceDto });
  }

  async remove(id: string, currentUser: ICurrentUser) {
    await this.isOwner(id, currentUser);

    return this.logSourceRepo.delete(id);
  }
}
