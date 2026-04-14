# TicketHub — Ticket Booking System

A full‑stack ticket booking platform with **User** and **Admin** roles.

- **Users** can browse events, view seats, reserve seats, pay using wallet balance, view bookings, and request refunds.
- **Admins** can create events, auto‑generate seats in bulk, monitor platform bookings/transactions, and approve refunds.

---

## Tech stack used in this project

### Frontend
- **React** (SPA UI)
- **Vite** (dev server + build)
- **React Router DOM** (routing)
- **Axios** (API requests)
- **Tailwind CSS** (styling)
- **socket.io-client** (installed; can be used for realtime updates)

Frontend location: `Frontend/frontend`

### Backend
- **Node.js + Express** (REST API)
- **MongoDB + Mongoose** (database + ODM)
- **JWT (jsonwebtoken)** (authentication)
- **bcryptjs** (password hashing)
- **cors** (CORS handling)
- **dotenv** (environment variables)
- **nodemon** (dev reload)

Backend location: `Backend`

---

## Project structure (high level)

```text
Ticket_Booking_System/
  Backend/                  # Express API + MongoDB (Mongoose)
  Frontend/
    frontend/               # React + Vite + Tailwind UI
```

---

## Features

### Authentication & roles
- User/Admin signup + login
- JWT based auth (`Authorization: Bearer <token>`)
- Role middleware to protect admin/user routes

### User flow
- View events
- View seats for an event
- Reserve seats
- Book seats (wallet debit)
- Wallet top‑up + transaction history
- Booking history
- Request refund for a booking

### Admin flow
- Create event
- Bulk create seats for an event
- View own events
- Monitor all bookings
- Monitor all transactions
- View refund requests
- Approve refund (cancels booking, releases seats, credits wallet, adds transaction record)

### Seat reservation auto-expiry
Backend clears expired reservations periodically (see `Backend/server.js`).

---

## API overview

Base URL: `http://localhost:3000`

### User routes (`/api/v1/user`)
- `POST /user/signup`
- `POST /login`
- `GET /data/events` (auth)
- `GET /data/seats/:eventId` (auth)
- `POST /data/wallet/add` (auth + user)
- `GET /data/wallet/history` (auth + user)
- `POST /data/reserve` (auth + user)
- `POST /data/book` (auth + user)
- `GET /data/bookings` (auth + user)
- `POST /data/refund/request` (auth + user)

### Admin routes (`/api/v1/Admin`)
- `POST /admin/signup`
- `POST /login`
- `POST /data/event` (auth + admin)
- `GET /data/event` (auth + admin)
- `PUT /data/event/:id` (auth + admin)
- `DELETE /data/event/:id` (auth + admin)
- `POST /data/seats/bulk` (auth + admin)
- `GET /data/bookings` (auth + admin)
- `GET /data/transactions` (auth + admin)
- `GET /data/refund/requests` (auth + admin)
- `POST /data/refund` (auth + admin)

---

## Setup & run (local development)

### Prerequisites
- **Node.js** installed (recommended: latest LTS)
- A **MongoDB** database (local MongoDB or MongoDB Atlas)

### 1) Backend setup

```bash
cd Backend
npm install
```

Create `Backend/.env` (or edit your existing one):

```env
PORT=3000
MONGODB_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-secret>
```

Run backend:

```bash
npm run dev
```

Backend runs at: `http://localhost:3000`

> Important: **Do not commit secrets** (database URL, JWT secret). Keep `.env` private.

### 2) Frontend setup

```bash
cd Frontend/frontend
npm install
```

Create `Frontend/frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Run frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## How authentication works (quick)

1. Login returns a `token` and `role`.
2. Frontend stores `token` in `localStorage`.
3. Axios interceptor sends it as:
   - `Authorization: Bearer <token>`
4. Backend middleware validates JWT and sets `req.user`.

---

## Notes / common issues

- **401 Unauthorized**: usually means token missing/expired or wrong header format. This project expects `Bearer <token>`.
- **Admin pages empty**: make sure you are logged in as **admin** (role check is enforced).
- **Favicon/title caching**: after updating favicon/title, hard refresh (Ctrl+F5) or clear site data.

