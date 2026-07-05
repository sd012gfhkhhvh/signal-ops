import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUserDto);

      return await this.usersRepository.save(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === 'SQLITE_CONSTRAINT_UNIQUE'
      ) {
        throw new ConflictException('User with this email already exists.');
      }

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    if (!id) {
      throw new NotFoundException('id is required');
    }

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!id) {
      throw new NotFoundException('id is required');
    }

    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`User #${id} not found`);
      }

      Object.assign(user, updateUserDto);

      await this.usersRepository.save(user);

      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === 'SQLITE_CONSTRAINT_UNIQUE'
      ) {
        throw new ConflictException('User with this email already exists.');
      }

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    if (!id) {
      throw new NotFoundException('id is required');
    }

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return await this.usersRepository.delete(id);
  }
}
