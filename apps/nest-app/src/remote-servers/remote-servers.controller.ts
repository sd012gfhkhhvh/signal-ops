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
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { RemoteServersService } from './remote-servers.service';
import { CreateRemoteServerDto } from './dto/create-remote-server.dto';
import { UpdateRemoteServerDto } from './dto/update-remote-server.dto';
import { RemoteServer } from './entities/remote-server.entity';
import type { ICurrentUser } from 'src/auth/current-user.interface';
import { CurrentUser } from 'src/auth/create-user.decorator';

@ApiTags('Remote Servers')
@Controller('remote-servers')
export class RemoteServersController {
  constructor(private readonly remoteServersService: RemoteServersService) {}

  /**
   * Creates a new remote server for the current user
   *
   * @param createRemoteServerDto The remote server creation data
   * @param currentUser The current authenticated user
   * @returns The created remote server
   */
  @Post()
  @ApiOperation({ summary: 'Create a new remote server' })
  @ApiCreatedResponse({
    description: 'The remote server has been successfully created.',
    type: RemoteServer,
  })
  @ApiNotFoundResponse({ description: 'Current user not found.' })
  @ApiConflictResponse({ description: 'A remote server with this name already exists for the user.' })
  create(
    @Body() createRemoteServerDto: CreateRemoteServerDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.remoteServersService.create(createRemoteServerDto, currentUser);
  }

  /**
   * Retrieves all remote servers owned by the current user
   *
   * @param currentUser The current authenticated user
   * @returns List of remote servers
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all remote servers owned by user' })
  @ApiOkResponse({
    description: 'Successfully retrieved all remote servers.',
    type: [RemoteServer],
  })
  @ApiNotFoundResponse({ description: 'Current user not found.' })
  findAll(@CurrentUser() currentUser: ICurrentUser) {
    return this.remoteServersService.findAll(currentUser);
  }

  /**
   * Retrieves a remote server by ID if it belongs to the current user
   *
   * @param id The remote server UUID
   * @param currentUser The current authenticated user
   * @returns The remote server
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a remote server by ID' })
  @ApiOkResponse({
    description: 'Successfully retrieved the remote server.',
    type: RemoteServer,
  })
  @ApiNotFoundResponse({ description: 'Remote server not found.' })
  @ApiForbiddenResponse({ description: 'Remote server does not belong to the user.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.remoteServersService.findOne(id, currentUser);
  }

  /**
   * Updates a remote server by ID if it belongs to the current user
   *
   * @param id The remote server UUID
   * @param updateRemoteServerDto The remote server update data
   * @param currentUser The current authenticated user
   * @returns The updated remote server
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a remote server by ID' })
  @ApiOkResponse({
    description: 'The remote server has been successfully updated.',
    type: RemoteServer,
  })
  @ApiNotFoundResponse({ description: 'Remote server not found.' })
  @ApiForbiddenResponse({ description: 'Remote server does not belong to the user.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRemoteServerDto: UpdateRemoteServerDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.remoteServersService.update(
      id,
      updateRemoteServerDto,
      currentUser,
    );
  }

  /**
   * Deletes a remote server by ID if it belongs to the current user
   *
   * @param id The remote server UUID
   * @param currentUser The current authenticated user
   * @returns The deletion result
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a remote server by ID' })
  @ApiOkResponse({
    description: 'The remote server has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Remote server not found.' })
  @ApiForbiddenResponse({ description: 'Remote server does not belong to the user.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.remoteServersService.remove(id, currentUser);
  }
}
