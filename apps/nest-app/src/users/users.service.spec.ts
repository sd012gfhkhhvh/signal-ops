import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mock<Repository<User>>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Mocked<Repository<User>>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'test@test.com',
      password: 'password',
    };

    const mockUser = {
      id: 'some-uuid',
      ...createUserDto,
    } as any;
    repo.create.mockReturnValue(mockUser);
    repo.save.mockResolvedValue(mockUser);

    const result = await service.create(createUserDto);

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledWith(createUserDto);

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should find all users', async () => {
    const mockUsers = [{} as any];
    repo.find.mockResolvedValue(mockUsers);

    const result = await service.findAll();

    expect(repo.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsers);
  });

  it('should find user by id', async () => {
    const mockUser = {} as any;
    repo.findOneBy.mockResolvedValue(mockUser);

    const result = await service.findOne('1');

    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(result).toEqual(mockUser);
  });

  it('should throw error if user not found when finding', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toThrow('User #1 not found');
  });

  it('should update user by id', async () => {
    const mockUser = {} as any;
    repo.findOneBy.mockResolvedValue(mockUser);
    repo.save.mockResolvedValue(mockUser);
    repo.findOneByOrFail.mockResolvedValue(mockUser);

    const result = await service.update('1', {} as any);

    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(mockUser);
    expect(repo.findOneByOrFail).toHaveBeenCalledTimes(1);
    expect(repo.findOneByOrFail).toHaveBeenCalledWith({ id: '1' });
    expect(result).toEqual(mockUser);
  });

  it('should throw error if user not found when updating', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.update('1', {} as any)).rejects.toThrow(
      'User #1 not found',
    );
  });

  it('should remove user by id', async () => {
    const mockUser = {} as any;
    repo.findOneBy.mockResolvedValue(mockUser);
    repo.delete.mockResolvedValue({ raw: [] as any[], affected: 1 } as any);

    const result = await service.remove('1');

    expect(repo.findOneBy).toHaveBeenCalledTimes(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(repo.delete).toHaveBeenCalledTimes(1);
    expect(repo.delete).toHaveBeenCalledWith('1');
    expect(result).toEqual({ raw: [], affected: 1 });
  });

  it('should throw error if user not found when removing', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.remove('1')).rejects.toThrow('User #1 not found');
  });
});
