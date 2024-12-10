# Nest.js REST API Starter (Work in Progress)

A minimal starter template for building RESTful APIs with Nest.js, Prisma, and PostgreSQL.

## Features

- Authentication (Register, Login, Refresh)
- CRUD operations for Todos and Users
- Prisma ORM integration
- PostgreSQL database support
- Scalable project structure

## Prerequisites

- Node.js (v20.x recommended)
- PNPM, NPM, or Yarn
- PostgreSQL (v13 or later)

### Database Setup

1. Create a new PostgreSQL database
2. Configure your connection string in `.env`

### Instalation

#### Using PNPM (recommended)

```bash
# Clone the repository
git clone https://github.com/bnhr/nest-starter-rest-api.git your-project-name
cd your-project-name

# Install dependencies
pnpm install

# Generate Prisma client
pnpm dlx prisma generate

# Copy and edit environment file
cp .env.example .env
# Edit .env with your database credentials

# Start development server
pnpm run dev
```

After installation, make sure to remove the Git history to start fresh:

```bash
rm -rf .git
```

### API Endpoints

#### Authentication

- POST /api/auth/register: Register a new user
- POST /api/auth/login: User login
- GET /api/auth/me: Get current user profile
- POST /api/auth/refresh: Refresh authentication token

#### Todos

- GET /api/todos: List all todos
- GET /api/todos/:id: Get a specific todo
- POST /api/todos: Create a new todo
- PATCH /api/todos/:id: Update a todo
- DELETE /api/todos/:id: Delete a todo

#### Users

- GET /api/users: List all users
- GET /api/users/:id: Get a specific user
- POST /api/users: Create a new user
- PATCH /api/users/:id: Update a user
- DELETE /api/users/:id: Delete a user