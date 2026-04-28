import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'uuid-123',
    name: 'Nicolas',
    email: 'nicolas@email.com',
    password: '$2b$10$hashedpassword',
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-token') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('deve criar usuário e retornar access_token', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        name: 'Nicolas',
        email: 'nicolas@email.com',
        password: '123456',
      });

      expect(result).toHaveProperty('access_token');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('deve lançar ConflictException se e-mail já existir', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({ name: 'Nicolas', email: 'nicolas@email.com', password: '123456' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('deve retornar access_token com credenciais válidas', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.login({ email: 'nicolas@email.com', password: '123456' });

      expect(result).toHaveProperty('access_token');
    });

    it('deve lançar UnauthorizedException se usuário não existir', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nao@existe.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException se senha estiver errada', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(
        service.login({ email: 'nicolas@email.com', password: 'errada' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
