import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let repo: jest.Mocked<Repository<Task>>;

  const userId = 'user-uuid-123';
  const taskId = 'task-uuid-456';

  const mockTask: Task = {
    id: taskId,
    title: 'Estudar NestJS',
    description: 'Praticar Guards e JWT',
    status: TaskStatus.PENDING,
    dueDate: null,
    userId,
    user: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get(getRepositoryToken(Task));
  });

  describe('create', () => {
    it('deve criar e retornar uma tarefa', async () => {
      repo.create.mockReturnValue(mockTask);
      repo.save.mockResolvedValue(mockTask);

      const result = await service.create(userId, { title: 'Estudar NestJS' });

      expect(result).toEqual(mockTask);
      expect(repo.create).toHaveBeenCalledWith({ title: 'Estudar NestJS', userId });
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de tarefas do usuário', async () => {
      repo.find.mockResolvedValue([mockTask]);

      const result = await service.findAll(userId);

      expect(result).toHaveLength(1);
      expect(repo.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar tarefa do usuário', async () => {
      repo.findOneBy.mockResolvedValue(mockTask);

      const result = await service.findOne(taskId, userId);

      expect(result).toEqual(mockTask);
    });

    it('deve lançar NotFoundException se tarefa não existir', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(taskId, userId)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ForbiddenException se tarefa pertencer a outro usuário', async () => {
      repo.findOneBy.mockResolvedValue({ ...mockTask, userId: 'outro-user' });

      await expect(service.findOne(taskId, userId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('deve remover a tarefa corretamente', async () => {
      repo.findOneBy.mockResolvedValue(mockTask);
      repo.remove.mockResolvedValue(mockTask);

      await service.remove(taskId, userId);

      expect(repo.remove).toHaveBeenCalledWith(mockTask);
    });
  });
});
