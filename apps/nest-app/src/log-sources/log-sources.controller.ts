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
import { LogSourcesService } from './log-sources.service';
import { CreateLogSourceDto } from './dto/create-log-source.dto';
import { UpdateLogSourceDto } from './dto/update-log-source.dto';
import { CurrentUser } from '@/auth/create-user.decorator';
import type { ICurrentUser } from '@/auth/current-user.interface';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LogSource } from './entities/log-source.entity';

@Controller('log-sources')
export class LogSourcesController {
  constructor(private readonly logSourcesService: LogSourcesService) {}

  /**
   * Creates a new log source for the current user
   *
   * @param createLogSourceDto The log source creation data
   * @param currentUser The current authenticated user
   * @returns The created log source
   */
  @ApiOperation({
    summary: 'Create a new log source',
    description: 'Creates a new log source for the current user',
  })
  @ApiCreatedResponse({
    description: 'The log source has been successfully created.',
    type: LogSource,
  })
  @ApiNotFoundResponse({ description: 'Current user not found.' })
  @ApiConflictResponse({
    description: 'A log source with this name already exists for the user.',
  })
  @Post()
  create(
    @Body() createLogSourceDto: CreateLogSourceDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.logSourcesService.create(createLogSourceDto, currentUser);
  }

  /**
   * Retrieve all log sources owned by the current user
   *
   * @param currentUser The current authenticated user
   * @returns List of log sources
   */
  @ApiOperation({
    summary: 'Retrieve all log sources owned by user',
    description: 'Retrieves all log sources owned by the current user',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all log sources.',
    type: [LogSource],
  })
  @ApiNotFoundResponse({ description: 'Current user not found.' })
  @Get()
  findAll(@CurrentUser() currentUser: ICurrentUser) {
    return this.logSourcesService.findAll(currentUser);
  }

  /**
   * Retrieve a log source by ID if it belongs to the current user
   *
   * @param id The log source ID
   * @param currentUser The current authenticated user
   * @returns The log source
   */
  @ApiOperation({
    summary: 'Retrieve a log source by ID',
    description:
      'Retrieves a log source by ID if it belongs to the current user',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the log source.',
    type: LogSource,
  })
  @ApiNotFoundResponse({ description: 'Log source not found.' })
  @ApiForbiddenResponse({
    description: 'Log source does not belong to the user.',
  })
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.logSourcesService.findOne(id, currentUser);
  }

  /**
   * Update a log source by ID if it belongs to the current user
   *
   * @param id The log source ID
   * @param updateLogSourceDto The log source update data
   * @param currentUser The current authenticated user
   * @returns The updated log source
   */
  @ApiOperation({
    summary: 'Update a log source by ID',
    description: 'Updates a log source by ID if it belongs to the current user',
  })
  @ApiOkResponse({
    description: 'The log source has been successfully updated.',
    type: LogSource,
  })
  @ApiNotFoundResponse({ description: 'Log source not found.' })
  @ApiForbiddenResponse({
    description: 'Log source does not belong to the user.',
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLogSourceDto: UpdateLogSourceDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.logSourcesService.update(id, updateLogSourceDto, currentUser);
  }

  /**
   * Delete a log source by ID if it belongs to the current user
   *
   * @param id The log source ID
   * @param currentUser The current authenticated user
   * @returns The deletion result
   */
  @ApiOperation({
    summary: 'Delete a log source by ID',
    description: 'Deletes a log source by ID if it belongs to the current user',
  })
  @ApiOkResponse({
    description: 'The log source has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Log source not found.' })
  @ApiForbiddenResponse({
    description: 'Log source does not belong to the user.',
  })
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.logSourcesService.remove(id, currentUser);
  }
}
