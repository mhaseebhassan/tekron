# Tekron

A full-stack premium tech e-commerce store built with **Next.js 14**.

![alt text](image.png)!

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v4 (JWT + Prisma Adapter)
- **Styling:** Tailwind CSS v3
- **Image Storage:** Cloudinary
- **Icons:** Heroicons

## Features

**Storefront**
- Animated hero slideshow & featured product grid
- Product catalog with category filtering
- Shopping cart (React Context, client-side persistent)
- Checkout with shipping address collection
- Order history for logged-in users
- User authentication (register / login)

**Admin Dashboard** (`/admin` — admin role required)
- Overview metrics (revenue, orders, customers, products)
- Product CRUD with Cloudinary image upload
- Order management with status updates
- Customer list & analytics
- Store settings (currency, tax, shipping rates)

## Getting Started

1. **Clone & install**
   ```bash
   git clone https://github.com/mhaseebhassan/tekron.git
   cd tekron
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Fill in your values
   ```

3. **Set up the database**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Generate `NEXTAUTH_SECRET` with:
```bash
openssl rand -base64 32
```

## Creating an Admin User

After registering, run in Prisma Studio or SQL:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

## Deployment

**Vercel (recommended):** Import repo → add env vars → deploy.

**AWS EC2:** Install Node.js + PM2, build with `npm run build`, serve with `pm2 start npm -- start`, proxy via Nginx.

**AWS Elastic Beanstalk:**
```bash
eb init tekron --platform "Node.js 18"
eb create tekron-production
eb setenv DATABASE_URL="..." NEXTAUTH_SECRET="..." # etc.
eb deploy
```

---

Built by [Muhammad Haseeb Hassan](https://github.com/mhaseebhassan)
