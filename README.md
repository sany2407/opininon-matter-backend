# Blog Backend API

A TypeScript Express.js backend with Bun runtime, Supabase PostgreSQL, JWT authentication, Zod validation, and Swagger documentation for a blog application.

## Tech Stack

- **Runtime**: Bun.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL via Supabase
- **Validation**: Zod
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI

## Installation

1. Install dependencies:
```bash
bun install
```

2. Copy the environment template and configure:
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Database Setup

1. Run the SQL schema in your Supabase SQL editor:
```bash
cat schema.sql
```

2. Seed the admin user:
```bash
bun run src/seedAdmin.ts
```

Default admin credentials:
- Username: `admin`
- Password: `admin123`

## Running the Application

Development:
```bash
bun run dev
```

Production:
```bash
bun run start
```

The API will be available at `http://localhost:5000`
Swagger documentation at `http://localhost:5000/api-docs`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login, returns JWT token

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe email to newsletter

### Blogs
- `GET /api/blogs` - Get all blogs with pagination, search, and category filter
  - Query params: `page`, `limit`, `search`, `category_id`
- `POST /api/blogs` - Create new blog (admin only)
- `PUT /api/blogs/:id` - Update blog (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category (admin only)

## Project Structure

```
src/
├── config/
│   ├── database.ts          # Supabase connection
│   └── env.ts               # Environment variables validation
├── middleware/
│   ├── auth.ts              # JWT authentication middleware
│   ├── errorHandler.ts      # Global error handling
│   └── validation.ts        # Zod validation middleware
├── routes/
│   ├── newsletter.ts        # Newsletter subscriber routes
│   ├── blogs.ts             # Blog CRUD routes
│   ├── categories.ts        # Category CRUD routes
│   └── auth.ts              # Admin login route
├── controllers/
│   ├── newsletterController.ts
│   ├── blogController.ts
│   └── categoryController.ts
├── validators/
│   ├── newsletterValidator.ts
│   ├── blogValidator.ts
│   └── categoryValidator.ts
├── types/
│   └── index.ts             # TypeScript types
├── index.ts                 # App entry point
└── seedAdmin.ts             # Admin user seed script
```
