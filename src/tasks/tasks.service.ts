import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  create(dto: CreateDto, userId: string) {
    const task = this.taskRepository.create({ ...dto, user: { id: userId } });

    return this.taskRepository.save(task);
  }

  getAll(userId: string) {
    return this.taskRepository.find({ where: { user: { id: userId } } });
  }

  async getOne(id: string, userId: string) {
    const task = await this.taskRepository.findOneBy({
      id,
      user: { id: userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, dto: UpdateDto, userId: string) {
    const result = await this.taskRepository.update(
      { id, user: { id: userId } },
      dto,
    );

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }

    return this.taskRepository.findOneBy({ id, user: { id: userId } });
  }

  async delete(id: string, userId: string) {
    const result = await this.taskRepository.delete({
      id,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }

    return { message: 'Task deleted successfully' };
  }
}
