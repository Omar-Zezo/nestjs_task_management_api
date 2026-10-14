<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Task Management API

A REST API for managing tasks, built with **NestJS**, **TypeORM**, and **PostgreSQL**, with JWT authentication. Each user can register, log in, and manage only their own tasks.

## Features

- **Authentication:** register and login with `bcrypt`-hashed passwords and JWT tokens.
- **Secure by default:** a global `AuthGuard` protects every route; open routes are marked with `@Public()`.
- **Tasks CRUD:** create, list, get, update, and delete tasks.
- **Data isolation:** every query is scoped to the authenticated user, so other users' tasks return `404`.
- **Validation:** global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform`.
- **Config:** environment variables read via `ConfigService.getOrThrow` (fails fast if any is missing).

## Tech Stack

NestJS · TypeScript · TypeORM · PostgreSQL · JWT · bcrypt · class-validator

## Project Structure

```
src/
├── auth/         # register/login, JWT guard, DTOs
├── tasks/        # entity, controller, service, DTOs
├── users/        # user entity
├── decorators/   # @Public(), @CurrentUser()
├── app.module.ts
└── main.ts
```

## Data Model

One user has many tasks.

- **users:** `id` (uuid), `name`, `email` (unique), `password` (`select: false`), `createdAt`
- **tasks:** `id` (uuid), `title`, `description`, `status` (`pending` | `in_progress` | `completed`), `priority` (`low` | `medium` | `high`), `dueDate`, `createdAt`, `updatedAt`, `user_id` (FK)

## Endpoints

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Create a new user |
| POST | `/auth/login` | Public | Log in and receive a token |
| POST | `/tasks` | Private | Create a task |
| GET | `/tasks` | Private | List your tasks |
| GET | `/tasks/:id` | Private | Get a task |
| PATCH | `/tasks/:id` | Private | Update a task |
| DELETE | `/tasks/:id` | Private | Delete a task |

Private routes require the header `Authorization: Bearer <token>`.

### Example

```http
POST /tasks
{
  "title": "Finish documentation",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2026-10-20T12:00:00.000Z"
}
```

## Getting Started

```bash
npm install
npm run start:dev
```

Create a `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
JWT_EXPIRE=1d
```

The API runs at `http://localhost:3000`.
