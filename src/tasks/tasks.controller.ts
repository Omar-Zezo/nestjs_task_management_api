import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';
import { TasksService } from './tasks.service';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  // Method POST
  // Route /tasks Private
  // Desc: Create new task
  @Post()
  createTask(@Body() createDto: CreateDto, @CurrentUser('id') userId: string) {
    return this.taskService.create(createDto, userId);
  }

  // Method GET
  // Route /tasks Private
  // Desc: Get All tasks
  @Get()
  getAll(@CurrentUser('id') userId: string) {
    return this.taskService.getAll(userId);
  }

  // Method PATCH
  // Route /tasks/:id Private
  // Desc: Update specific task
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.taskService.update(id, updateDto, userId);
  }

  // Method GET
  // Route /tasks/:id Private
  // Desc: Get specific task
  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.taskService.getOne(id, userId);
  }

  // Method DELETE
  // Route /tasks/:id Private
  // Desc: Delete specific task
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.taskService.delete(id, userId);
  }
}
