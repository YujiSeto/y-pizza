# 🍕 Y Pizza

A full-stack pizza ordering application built with **Next.js**, **Prisma**, and **PostgreSQL**.

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) + React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YujiSeto/y-pizza.git
cd y-pizza
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a PostgreSQL database named `ypizza`:

```sql
CREATE DATABASE ypizza;
```

### 4. Configure environment variables

Copy the example environment file and update it with your credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your PostgreSQL username and password:

```
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/ypizza?schema=public"
```

### 5. Run migrations and seed the database

```bash
npx prisma migrate dev
npx prisma db seed
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

| Model | Description |
|---|---|
| **Product** | Pizza menu items (name, price, image, ingredients) |
| **User** | Registered users (name, email, password) |
| **Order** | Customer orders with status tracking |
| **OrderProducts** | Junction table linking orders to products with quantity |

### Order Status Flow

`INITIALIZED` → `IN_REVIEW` → `PAID` → `SENT` → `DELIVERED`

An order can be `CANCELED` at any point.

## Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npx prisma studio` | Open Prisma Studio (visual DB editor) |
| `npx prisma migrate dev` | Apply database migrations |
| `npx prisma db seed` | Seed the database with sample data |
| `npx prisma generate` | Regenerate Prisma Client |