<h1 align="center">
  <br>
  <img src="public/logo.png" alt="Tekron Logo" width="120">
  <br>
  Tekron
  <br>
</h1>

<h4 align="center">A full-stack premium tech e-commerce store built with <a href="https://nextjs.org/" target="_blank">Next.js 14</a>.</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-Prisma-2D3748?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/NextAuth.js-4.x-purple?logo=auth0&logoColor=white" alt="NextAuth">
  <img src="https://img.shields.io/badge/Cloudinary-Image_Storage-3448C5?logo=cloudinary&logoColor=white" alt="Cloudinary">
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#database-schema">Database Schema</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#api-routes">API Routes</a> •
  <a href="#admin-dashboard">Admin Dashboard</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Overview

**Tekron** is a fully-featured, production-ready e-commerce web application for premium tech products. Built with the Next.js 14 App Router, it provides a seamless shopping experience for customers and a powerful management dashboard for administrators — all in a single, unified codebase.

From a stunning animated hero slideshow to real-time cart management and full order lifecycle tracking, Tekron has everything needed to run a modern online tech store.

---

## Key Features

### 🛍️ Customer-Facing Storefront
- **Animated Hero Slideshow** — Eye-catching landing page with product highlights
- **Product Catalog** — Browse and filter products by category with responsive grid layout
- **Product Detail Pages** — In-depth product views with images, descriptions, pricing, and stock availability
- **Shopping Cart** — Client-side persistent cart with add/remove/update functionality (via React Context)
- **Checkout Flow** — Complete multi-step checkout with shipping address capture
- **User Authentication** — Secure sign-up, login, and session management via NextAuth.js
- **Order History** — Users can view all past orders and their current statuses
- **Newsletter CTA** — Email subscription section on the homepage
- **About & Contact Pages** — Static informational pages

### 🛠️ Admin Dashboard
- **Dashboard Overview** — Key metrics: revenue, total orders, total customers, and product count
- **Product Management** — Create, edit, and delete products with Cloudinary image uploads
- **Order Management** — View all orders, update order status (`pending` → `processing` → `shipped` → `delivered` → `cancelled`) and payment status
- **Customer Management** — Browse all registered users and their account details
- **Analytics** — Visual breakdowns of sales and order trends
- **Store Settings** — Configure store name, support contact, currency, flat shipping rate, tax rate, and free shipping threshold

### 🔒 Security
- **Role-Based Access Control** — Middleware-enforced admin-only routes (`/admin/*`)
- **JWT Session Tokens** — Secure, stateless authentication powered by NextAuth
- **Password Hashing** — `bcryptjs` for secure credential storage
- **Protected API Routes** — Server-side session validation on all mutation endpoints

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | JavaScript (JSX) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) with custom utility classes |
| **Database** | PostgreSQL |
| **ORM** | [Prisma v5](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) with Prisma Adapter |
| **Image Storage** | [Cloudinary](https://cloudinary.com/) |
| **Password Hashing** | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **UI Icons** | [@heroicons/react](https://heroicons.com/) |
| **Notifications** | [react-hot-toast](https://react-hot-toast.com/) |

---

## Project Structure

```
tekron/
├── app/
│   ├── (site)/                  # Customer-facing routes (route group)
│   │   ├── page.js              # Homepage (hero, featured products, benefits)
│   │   ├── layout.jsx           # Site layout (Navbar + Footer)
│   │   ├── about/               # About page
│   │   ├── auth/                # Login & Register pages
│   │   ├── cart/                # Shopping cart page
│   │   ├── checkout/            # Checkout & order confirmation
│   │   ├── contact/             # Contact page
│   │   └── products/            # Product listing & detail pages
│   ├── admin/                   # Admin dashboard (protected)
│   │   ├── page.jsx             # Admin overview / metrics
│   │   ├── layout.jsx           # Admin sidebar layout
│   │   ├── analytics/           # Sales & order analytics
│   │   ├── customers/           # Customer list
│   │   ├── orders/              # Order management
│   │   ├── products/            # Product CRUD
│   │   └── settings/            # Store settings
│   ├── api/                     # Next.js API Routes (REST)
│   │   ├── auth/                # NextAuth handlers
│   │   ├── products/            # Products CRUD API
│   │   ├── orders/              # Orders API
│   │   ├── upload/              # Cloudinary image upload API
│   │   └── admin/               # Admin-specific APIs (analytics, customers, settings)
│   ├── globals.css              # Global styles & Tailwind directives
│   ├── layout.jsx               # Root app layout
│   └── providers.jsx            # Client providers (SessionProvider, CartProvider, Toaster)
├── components/                  # Reusable UI components
│   ├── Navbar.jsx               # Responsive navigation with search overlay & cart
│   ├── Footer.jsx               # Site footer with links
│   ├── HeroSlideshow.js         # Auto-advancing animated hero banner
│   ├── ProductCard.js           # Reusable product card with add-to-cart
│   ├── SearchOverlay.jsx        # Full-screen search overlay
│   ├── SectionDivider.jsx       # Decorative themed section separators
│   ├── Logo.jsx                 # SVG brand logo
│   ├── Skeleton.jsx             # Loading skeleton component
│   ├── Confetti.jsx             # Order success confetti animation
│   ├── BackgroundShapes.jsx     # Decorative background elements
│   └── admin/                   # Admin-specific components (sidebar, charts, etc.)
├── context/
│   └── CartContext.jsx          # Global cart state (add, remove, update, persist)
├── lib/
│   └── prisma.js                # Prisma client singleton
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Prisma migration history
├── public/                      # Static assets (images, icons)
├── scripts/                     # Utility scripts (e.g., seed data)
├── middleware.js                # Route protection middleware
├── tailwind.config.js           # Tailwind configuration
├── jsconfig.json                # JS path aliases (@/)
└── .env.example                 # Environment variable template
```

---

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models:

```
User ──────────── Order ──────────── OrderItem ──── Product
  │                 │
  └─ Account        └─ (shipping address fields)
  └─ Session

StoreSettings (singleton)
```

### Models

| Model | Description |
|-------|-------------|
| `User` | Registered customers with `user` or `admin` role |
| `Product` | Store products with name, price, stock, category, image |
| `Order` | Customer orders with status and flattened shipping address |
| `OrderItem` | Line items within an order (product + quantity + price) |
| `StoreSettings` | Singleton store configuration (currency, rates, contact) |
| `Account` | NextAuth OAuth account links |
| `Session` | NextAuth active sessions |
| `VerificationToken` | Email verification tokens |

### Order Status Flow
```
pending → processing → shipped → delivered
                              ↘ cancelled
```

### Payment Status
```
pending → completed
       ↘ failed
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- **PostgreSQL** database (local or cloud, e.g., AWS RDS, Supabase, Neon)
- **Cloudinary** account for image storage

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mhaseebhassan/tekron.git
   cd tekron
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your credentials in `.env` (see [Environment Variables](#environment-variables)).

4. **Set up the database:**
   ```bash
   # Apply all migrations
   npx prisma migrate deploy

   # Generate the Prisma client
   npx prisma generate
   ```

5. **Seed initial data (optional):**
   ```bash
   node scripts/seed.js
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# PostgreSQL Connection String (Prisma format)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"

# NextAuth Configuration
NEXTAUTH_SECRET="your_generated_secret_here"   # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"            # Your app's public URL in production

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

> **Note:** `NEXTAUTH_SECRET` must be a strong, random string. Generate one with:
> ```bash
> openssl rand -base64 32
> ```

---

## API Routes

All API routes are located under `app/api/`.

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/products` | List all products | Public |
| `GET` | `/api/products/[id]` | Get single product | Public |
| `POST` | `/api/products` | Create a product | Admin |
| `PUT` | `/api/products/[id]` | Update a product | Admin |
| `DELETE` | `/api/products/[id]` | Delete a product | Admin |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/orders` | List user's orders | User |
| `POST` | `/api/orders` | Place a new order | User |
| `GET` | `/api/orders/[id]` | Get order details | User/Admin |
| `PUT` | `/api/orders/[id]` | Update order status | Admin |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/analytics` | Sales & order analytics | Admin |
| `GET` | `/api/admin/customers` | All registered users | Admin |
| `GET/PUT` | `/api/admin/settings` | Store settings | Admin |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `*` | `/api/auth/[...nextauth]` | NextAuth handler (login, logout, session) |

### Upload
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/upload` | Upload image to Cloudinary | Admin |

---

## Admin Dashboard

Access the admin dashboard at `/admin`. **Admin users only** — enforced by JWT middleware.

### Creating an Admin User

After registering a user account, update the `role` in your database:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'admin@example.com';
```

Or using Prisma Studio:
```bash
npx prisma studio
```

Navigate to the `User` model and change the `role` field from `user` to `admin`.

### Dashboard Sections

| Section | Path | Description |
|---------|------|-------------|
| Overview | `/admin` | Revenue, orders, customers, product count |
| Products | `/admin/products` | Add, edit, delete products |
| Orders | `/admin/orders` | View & update all orders |
| Customers | `/admin/customers` | View registered users |
| Analytics | `/admin/analytics` | Sales trends and charts |
| Settings | `/admin/settings` | Store configuration |

---

## Deployment

### Option 1: Vercel (Recommended)

1. Push your repository to GitHub.
2. Import the project on [Vercel](https://vercel.com/).
3. Add all environment variables in the Vercel dashboard.
4. Deploy — Vercel auto-detects Next.js and configures everything.

```bash
# Run migrations against your production database before first deploy
DATABASE_URL="your_production_db_url" npx prisma migrate deploy
```

### Option 2: AWS EC2 (IaaS)

1. Launch an EC2 instance (Ubuntu 22.04 LTS recommended).
2. Install Node.js and PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pm2
   ```
3. Clone the repo and install dependencies.
4. Build the application:
   ```bash
   npm run build
   ```
5. Start with PM2:
   ```bash
   pm2 start npm --name "tekron" -- start
   pm2 save && pm2 startup
   ```
6. Configure Nginx as a reverse proxy to port 3000.

### Option 3: AWS Elastic Beanstalk (PaaS)

1. Install the AWS EB CLI and configure credentials.
2. Initialize:
   ```bash
   eb init tekron --platform "Node.js 18" --region us-east-1
   ```
3. Create environment:
   ```bash
   eb create tekron-production --instance-type t3.small
   ```
4. Set environment variables:
   ```bash
   eb setenv DATABASE_URL="..." NEXTAUTH_SECRET="..." NEXTAUTH_URL="..." \
     CLOUDINARY_CLOUD_NAME="..." CLOUDINARY_API_KEY="..." CLOUDINARY_API_SECRET="..."
   ```
5. Deploy:
   ```bash
   eb deploy
   ```

### Database

For production, use a managed PostgreSQL service:
- **AWS RDS** — Fully managed, great for AWS deployments
- **Supabase** — Free tier available, easy setup
- **Neon** — Serverless PostgreSQL, generous free tier

After setting up your database, run migrations:
```bash
npx prisma migrate deploy
```

---

## Screenshots

> 🖼️ *Add screenshots of your storefront, product pages, cart, and admin dashboard here for a polished README.*

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/mhaseebhassan">Muhammad Haseeb Hassan</a>
</p>
