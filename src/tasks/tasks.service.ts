import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({ ...dto, userId });
    return this.tasksRepository.save(task);
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) throw new NotFoundException('Tarefa não encontrada.');
    if (task.userId !== userId) throw new ForbiddenException('Acesso negado.');
    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
  }
}
