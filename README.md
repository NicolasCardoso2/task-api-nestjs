# Task API — NestJS + PostgreSQL + JWT

API REST para gerenciamento de tarefas com autenticação via JWT, construída com NestJS e TypeScript, seguindo boas práticas de arquitetura modular.

## Tecnologias

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

## Funcionalidades

- **Autenticação JWT** — registro, login e proteção de rotas com Bearer token
- **CRUD de tarefas** — criar, listar, buscar por ID, atualizar e deletar
- **Isolamento por usuário** — cada usuário vê e gerencia apenas suas próprias tarefas
- **Validação** — DTOs com `class-validator` em todas as entradas
- **Testes unitários** — cobertura dos serviços de autenticação e tarefas

## Rotas da API

Base URL: `/api/v1`

### Auth

| Método | Rota              | Descrição              | Auth |
|--------|-------------------|------------------------|------|
| POST   | `/auth/register`  | Cria conta e retorna token | ❌  |
| POST   | `/auth/login`     | Login e retorna token  | ❌   |

### Tasks

| Método | Rota           | Descrição                    | Auth |
|--------|----------------|------------------------------|------|
| POST   | `/tasks`       | Cria uma nova tarefa         | ✅   |
| GET    | `/tasks`       | Lista todas as tarefas       | ✅   |
| GET    | `/tasks/:id`   | Busca tarefa por ID          | ✅   |
| PATCH  | `/tasks/:id`   | Atualiza tarefa              | ✅   |
| DELETE | `/tasks/:id`   | Remove tarefa                | ✅   |

## Status de tarefa

| Valor         | Descrição      |
|---------------|----------------|
| `pending`     | Pendente       |
| `in_progress` | Em andamento   |
| `done`        | Concluída      |

## Como rodar localmente

**Pré-requisitos:** Node.js 18+, Docker

```bash
# 1. Clone o repositório
git clone https://github.com/NicolasCardoso2/task-api-nestjs.git
cd task-api-nestjs

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 3. Suba o banco de dados
docker-compose up -d

# 4. Instale as dependências
npm install

# 5. Inicie em modo desenvolvimento
npm run start:dev
```

A API estará disponível em `http://localhost:3000/api/v1`.

## Variáveis de ambiente

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=taskdb

JWT_SECRET=sua_chave_secreta_aqui
```

## Exemplo de uso

**Criar conta:**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Nicolas",
  "email": "nicolas@email.com",
  "password": "123456"
}
```

**Criar tarefa (com token):**
```http
POST /api/v1/tasks
Authorization: Bearer <seu_token>
Content-Type: application/json

{
  "title": "Estudar NestJS",
  "description": "Praticar Guards e JWT",
  "status": "in_progress",
  "dueDate": "2026-05-01"
}
```

## Testes

```bash
# Testes unitários
npm run test

# Cobertura de testes
npm run test:cov

# Testes e2e
npm run test:e2e
```

## Estrutura do projeto

```
src/
├── auth/
│   ├── dto/            # LoginDto, RegisterDto
│   ├── guards/         # JwtAuthGuard
│   ├── strategies/     # JwtStrategy
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── auth.service.spec.ts
├── tasks/
│   ├── dto/            # CreateTaskDto, UpdateTaskDto
│   ├── entities/       # Task (TypeORM)
│   ├── tasks.controller.ts
│   ├── tasks.module.ts
│   ├── tasks.service.ts
│   └── tasks.service.spec.ts
├── users/
│   ├── entities/       # User (TypeORM)
│   ├── users.module.ts
│   └── users.service.ts
├── app.module.ts
└── main.ts
```

## CI/CD

O projeto inclui um `Jenkinsfile` configurado para pipeline de build e um `Dockerfile` para containerização.

---

Feito por [Nicolas Cardoso](https://github.com/NicolasCardoso2) · [LinkedIn](https://www.linkedin.com/in/nicolas-cardoso-vilha-do-lago/)
