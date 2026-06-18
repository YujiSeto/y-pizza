# 🍕 Y Pizza

A full-stack pizza ordering application with integrated Stripe payments, built with **Next.js**, **Prisma**, and **PostgreSQL**.

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (Turbopack) + React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Payments**: [Stripe](https://stripe.com/) (Checkout Sessions)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Auth**: Token-based authentication with [bcryptjs](https://www.npmjs.com/package/bcryptjs)

## Features

- 🍕 Browse pizza menu with images, ingredients and prices
- 🛒 Shopping cart with quantity management
- 🔐 User registration and authentication
- 💳 Stripe Checkout integration for payments
- 📦 Order history page ("My Orders") with options to pay or cancel pending orders
- ✅ Order confirmation page reading real-time status from the database (via Webhooks)
- 🌙 Dark/Light theme toggle

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running
- [Stripe account](https://dashboard.stripe.com/register) (for payments)

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

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/ypizza?schema=public"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_BASE_URL` | Base URL of the application |
| `STRIPE_SECRET_KEY` | Stripe secret key (from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

### 5. Run migrations and seed the database

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signin/         # POST - User login
│   │   │   ├── signup/         # POST - User registration
│   │   │   └── validate_email/ # POST - Email validation
│   │   ├── order/
│   │   │   ├── cancel/         # POST - Cancel an initialized order
│   │   │   ├── new/            # POST - Create order + Stripe checkout
│   │   │   └── pay/            # POST - Generate Stripe checkout for pending order
│   │   ├── pizzas/             # GET  - List products
│   │   └── webhook/
│   │       └── stripe/         # POST - Stripe webhook handler (updates DB)
│   ├── orders/                 # Order history page
│   ├── success/                # Order confirmation page
│   ├── layout.tsx              # Root layout with theme provider
│   └── page.tsx                # Home page
├── components/
│   ├── cart/                   # Shopping cart (drawer, list, product)
│   ├── home/                   # Home page components
│   ├── layout/                 # Header & Footer
│   ├── login-area/             # Auth dialog (sign in/sign up)
│   ├── theme/                  # Theme toggle & provider
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── axios.ts                # Axios instance configuration
│   ├── prisma.ts               # Prisma client singleton
│   ├── stripe.ts               # Stripe client instance
│   └── utils.ts                # Utility functions
├── services/
│   ├── auth.ts                 # Authentication logic
│   ├── order.ts                # Order creation logic
│   └── product.ts              # Product queries
├── stores/
│   ├── auth.ts                 # Auth state (Zustand)
│   ├── cart.ts                 # Cart state (Zustand)
│   └── products.ts             # Products state (Zustand)
└── types/
    └── cart-item.ts            # CartItem type definition
```

## Database Schema

| Model | Description |
|---|---|
| **Product** | Pizza menu items (name, price, image, ingredients) |
| **User** | Registered users (name, email, password, auth token) |
| **Order** | Customer orders with status tracking and subtotal |
| **OrderProducts** | Links orders to products with quantity and unit price |

### Order Status Flow

```
INITIALIZED → IN_REVIEW → PAID → SENT → DELIVERED
```

An order can be `CANCELED` at any point.

## Payment Flow

1. User adds pizzas to cart
2. User clicks "Finish Order" → API creates an `Order` in the database
3. API creates a Stripe Checkout Session with the order items
4. User is redirected to Stripe's hosted checkout page
5. After payment, user is redirected to `/success` with the session ID
6. Stripe Webhook receives the `checkout.session.completed` event and updates the `Order` status to `PAID` in the database
7. Success page reads the `order_id` from the session and retrieves the real-time status from the database

### Testing Payments (Stripe Test Mode)

While running the project in development with Stripe test keys, you can use the following test credit cards to simulate different scenarios:

**Successful Payment**
- **Card Number**: `4242 4242 4242 4242`
- **Expiration Date**: Any date in the future (e.g., `12/32`)
- **CVC**: Any 3 digits (e.g., `123`)

**Declined Payment (Card Declined)**
- **Card Number**: `4000 0000 0000 9995`
- **Expiration Date**: Any date in the future
- **CVC**: Any 3 digits (e.g., `123`)

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