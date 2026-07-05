import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user
   *
   * @remarks This method is used to create a new user
   *
   * @returns The created user
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Retrieves all users
   *
   * @remarks This method is used to retrieve all users
   *
   * @returns All users
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Retrieves a user by ID
   *
   * @remarks This method is used to retrieve a user by ID
   *
   * @param id The user ID
   * @returns The user
   */
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Updates a user by ID
   *
   * @remarks This method is used to update a user by ID
   *
   * @param id The user ID
   * @param updateUserDto The user data
   * @returns The updated user
   */
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Deletes a user by ID
   * @param id The user ID
   * @returns The deleted user
   */
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.remove(id);
  }
}
