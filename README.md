
# Allo Reservation System

A modern inventory and reservation management system built using Next.js, Prisma, PostgreSQL, and Tailwind CSS.

---

# Features

## Core Features

* Product Management
* Warehouse Management
* Inventory Tracking
* Reservation Creation
* Reservation Confirmation
* Reservation Release
* Reservation Expiry Handling
* Reserved Stock Management
* Real-time Inventory Updates

---

# Tech Stack

## Frontend

* Next.js 16
* React
* Tailwind CSS

## Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL

## Database

* PostgreSQL (Supabase)

---

# Database Schema

## Models

### Product

Stores product details.

### Warehouse

Stores warehouse information.

### Inventory

Maintains stock availability across warehouses.

### Reservation

Handles reservation lifecycle and statuses.

---

# Reservation Lifecycle

A reservation can move through the following states:

```txt
PENDING → CONFIRMED
PENDING → RELEASED
PENDING → EXPIRED
```

---

# API Endpoints

## Products

### Get Products

```http
GET /api/products
```

---

## Warehouses

### Get Warehouses

```http
GET /api/warehouses
```

---

## Inventory

### Get Inventory

```http
GET /api/inventory
```

---

## Reservations

### Get Reservations

```http
GET /api/reservations
```

### Create Reservation

```http
POST /api/reservations
```

### Sample Request

```json
{
  "productId": "PRODUCT_ID",
  "warehouseId": "WAREHOUSE_ID",
  "quantity": 1
}
```

---

## Confirm Reservation

```http
PATCH /api/reservations/[id]/confirm
```

---

## Release Reservation

```http
PATCH /api/reservations/[id]/release
```

---

## Expire Reservations

```http
POST /api/reservations/expire
```

---

# Business Logic

## Reservation Creation

When a reservation is created:

* Inventory availability is checked.
* Reserved stock is increased.
* Reservation is created with `PENDING` status.
* Expiration timestamp is generated.

---

## Reservation Confirmation

When confirmed:

* Reservation status changes to `CONFIRMED`.
* Reserved stock remains locked.

---

## Reservation Release

When released:

* Reservation status changes to `RELEASED`.
* Reserved stock is reduced.

---

## Reservation Expiry

Expired reservations:

* Automatically become `EXPIRED`
* Reserved stock is restored

---

# Transaction Handling

Prisma transactions are used to:

* Prevent inconsistent inventory updates
* Ensure stock accuracy
* Avoid race conditions

---

# UI Features

* Modern responsive dashboard
* Product cards
* Warehouse cards
* Inventory availability display
* Reservation status badges
* Action buttons for reservation management

---

# Project Structure

```txt
src/
 ├── app/
 │   ├── api/
 │   │   ├── products/
 │   │   ├── warehouses/
 │   │   ├── inventory/
 │   │   └── reservations/
 │   ├── components/
 │   └── page.tsx
 │
 ├── prisma/
 │   ├── schema.prisma
 │   └── seed.ts
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <your-repo-url>
cd allo-reservation-system
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create `.env` file:

```env
DATABASE_URL="postgresql://postgres.ptxqiynlhjntmxfrkayd:FCRr8OAhfe3j04a4@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
```

---

## 4. Run Prisma Migration

```bash
npx prisma migrate dev
```

---

## 5. Generate Prisma Client

```bash
npx prisma generate
```

---

## 6. Seed Database

```bash
npx ts-node prisma/seed.ts
```

---

## 7. Run Development Server

```bash
npm run dev
```

---

# Assumptions

* Reservations are warehouse-specific.
* Inventory is managed independently per warehouse.
* Reserved stock cannot exceed available stock.
* Expired reservations restore inventory.

---

# Future Improvements

* Authentication & Authorization
* Real-time updates with WebSockets
* Automated cron-based expiry handling
* Search and filtering
* Reservation analytics dashboard
* Unit and integration testing
* Docker deployment

---

# Challenges Faced

* Prisma schema synchronization
* Transaction consistency
* Reservation lifecycle handling
* Client vs Server Component handling in Next.js
* Dynamic API route implementation

---



# Author

Saiganesh Shet

---

# Submission Notes

This project was developed as part of the Allo Health Engineering Take-Home Exercise.
