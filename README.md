Allo Reservation System

A full-stack inventory reservation system built with Next.js App Router, TypeScript, Prisma, and Supabase PostgreSQL for managing product reservations across multiple warehouses.

This project was built as part of the Allo Engineering Take-Home Exercise.

Features
Multi-warehouse inventory management
Product stock tracking
Reservation lifecycle management
Reservation expiry handling
Real-time stock updates
Modern responsive UI
Concurrency-safe reservation logic using Prisma transactions
Dynamic API routes with Next.js App Router
Tech Stack
Next.js 16 (App Router)
TypeScript
Prisma ORM
Supabase PostgreSQL
Tailwind CSS
Thunder Client (API testing)
Database Models

The application includes the following models:

Product
Warehouse
Inventory
Reservation

Reservation statuses:

PENDING
CONFIRMED
RELEASED
EXPIRED
API Endpoints
Products
GET /api/products

Returns all products.

Warehouses
GET /api/warehouses

Returns all warehouses.

Inventory
GET /api/inventory

Returns inventory details with:

product info
warehouse info
available stock
Reservations
GET /api/reservations

Returns all reservations.

POST /api/reservations

Creates a reservation.

Request Body
{
  "productId": "PRODUCT_ID",
  "warehouseId": "WAREHOUSE_ID",
  "quantity": 1
}
Responses
200 → Reservation created
409 → Insufficient stock
400 → Validation error
Confirm Reservation
POST /api/reservations/[id]/confirm

Confirms a reservation after payment success.

Responses
200 → Reservation confirmed
410 → Reservation expired
Release Reservation
POST /api/reservations/[id]/release

Releases reserved stock when payment fails or user cancels.

Expire Reservations
POST /api/reservations/expire

Automatically expires old pending reservations and restores stock.

Concurrency Handling

The reservation flow is protected using Prisma database transactions.

Inside the transaction:

Inventory row is fetched
Available stock is calculated
Stock validation happens
Reserved stock is incremented
Reservation is created

This ensures that if multiple users attempt to reserve the last unit simultaneously, only one reservation succeeds while others fail safely.

Reservation Expiry Mechanism

An expiry endpoint is implemented:

POST /api/reservations/expire

The endpoint:

finds expired pending reservations
marks them as EXPIRED
restores reserved stock back to inventory

In production, this endpoint can be triggered using:

Vercel Cron Jobs
Background Workers
Scheduled server jobs
Frontend Features
Product listing dashboard
Warehouse inventory display
Available stock calculation
Reservation cards
Reservation status badges
Confirm / Release buttons
Responsive modern UI
Automatic UI refresh after actions
Running Locally
1. Clone Repository
git clone YOUR_GITHUB_REPO_URL
cd allo-reservation-system
2. Install Dependencies
npm install
3. Configure Environment Variables

Create .env

DATABASE_URL="postgresql://postgres.ptxqiynlhjntmxfrkayd:FCRr8OAhfe3j04a4@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
4. Run Prisma Migration
npx prisma migrate dev
5. Seed Database
npx prisma db seed
6. Start Development Server
npm run dev

Open:

http://localhost:3000
Project Structure
src/
 ├── app/
 │   ├── api/
 │   │   ├── products/
 │   │   ├── warehouses/
 │   │   ├── inventory/
 │   │   └── reservations/
 │   ├── layout.tsx
 │   └── page.tsx
 │
prisma/
 ├── schema.prisma
 └── seed.ts
Trade-offs & Improvements

Due to time constraints, the following improvements can be added later:

Idempotency support
Authentication
Redis distributed locking
Optimistic UI updates
Pagination
Search & filtering
WebSocket real-time updates
Better loading/error states
Unit & integration tests
Notes
Hosted PostgreSQL database used via Supabase as required in the assignment.
App Router architecture implemented using Next.js.
Reservation expiry handling implemented according to assignment requirements.
Author

Saiganesh Shet
