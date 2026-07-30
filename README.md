# ReFactor

A developer-themed e-commerce store built with React, .NET, and SQL Server. Everyday gear — boards, boots, gloves, hats — refactored with the sensibilities of the people who build the web.

## Tech Stack

| Layer            | Technology                                                                    |
| ---------------- | ----------------------------------------------------------------------------- |
| Frontend         | React 19, TypeScript, Vite, MUI v9, Redux Toolkit, RTK Query, Stripe Elements |
| Backend          | .NET 10, ASP.NET Core Web API, Entity Framework Core                          |
| Database         | SQL Server 2022                                                               |
| Auth             | ASP.NET Core Identity (cookie-based)                                          |
| Payments         | Stripe                                                                        |
| Media            | Cloudinary                                                                    |
| Containerization | Docker, docker-compose                                                        |

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for SQL Server)
- A Stripe account (test mode) for payment processing
- A Cloudinary account for image uploads

### Setup

1. **Start SQL Server**

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Password@1" \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/azure-sql-edge
```

2. **Start the API**

```bash
cd API
dotnet watch
```

The API starts on `http://localhost:5000`. On first run it seeds the database with sample products and users:

- **Admin**: `admin@test.com` / `Pa$$w0rd`
- **User**: `george@test.com` / `Pa$$w0rd`

3. **Start the frontend**

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`. The Vite dev server proxies `/api` requests to the .NET backend.

### Required Configuration

Set these environment variables or add them to `frontend/.env.development`:

```env
VITE_API_URL=/api
VITE_STRIPE_PK=pk_test_...
```

Set these in `API/appsettings.Development.json`:

```json
{
  "StripeSettings": {
    "PublishableKey": "pk_test_...",
    "SecretKey": "sk_test_...",
    "WhSecret": ""
  },
  "Cloudinary": {
    "CloudName": "",
    "ApiKey": "",
    "ApiSecret": ""
  }
}
```

## Docker

Build and run all services with docker-compose:

```bash
docker compose up -d
```

This starts three containers:

- **db** — SQL Server 2022
- **api** — .NET API (port 5000)
- **frontend** — Nginx serving the built app (port 80)

## Routes

| Path           | Description                                | Auth     |
| -------------- | ------------------------------------------ | -------- |
| `/`            | Homepage with featured product hero        | —        |
| `/catalog`     | Product listing with filters               | —        |
| `/catalog/:id` | Product details                            | —        |
| `/about`       | About the store                            | —        |
| `/contact`     | Contact channels and FAQ                   | —        |
| `/basket`      | Shopping cart                              | —        |
| `/login`       | Sign in                                    | —        |
| `/register`    | Create account                             | —        |
| `/checkout`    | Checkout flow (Address → Payment → Review) | Required |
| `/orders`      | Order history                              | Required |
| `/inventory`   | Product management                         | Admin    |

## Project Structure

```
API/
├── Controllers/        # API endpoints
├── Data/               # DbContext, migrations, seed data
├── DTOs/               # Data transfer objects
├── Entities/           # Domain models
├── Extensions/         # Query helpers, mapping
├── Middleware/         # Error handling middleware
├── RequestHelpers/     # Pagination, settings models
├── Services/           # Business logic (Payments, Images, Discounts)
├── appsettings.json    # Production config
└── appsettings.Development.json  # Local development config

frontend/
├── src/
│   ├── app/
│   │   ├── api/        # Base API client with error handling
│   │   ├── errors/     # Error pages (Not Found, Server Error)
│   │   ├── layout/     # App shell, NavBar, theme, UI state
│   │   ├── lib/        # Router, utility helpers
│   │   ├── models/     # TypeScript interfaces
│   │   ├── routes/     # Route definitions
│   │   ├── shared/     # Shared UI components
│   │   └── store/      # Redux store configuration
│   └── features/
│       ├── about/      # About page
│       ├── account/    # Login, register, user info
│       ├── admin/      # Inventory management
│       ├── basket/     # Shopping cart
│       ├── catalog/    # Product grid, filters, product cards
│       ├── checkout/   # Checkout stepper with Stripe
│       ├── contact/    # Contact page
│       ├── home/       # Homepage
│       └── orders/     # Order history
└── index.html
```

## Design

The visual identity is built around a "build system" concept — clean, informatic, developer-oriented. Products are treated as components with spec annotations. The palette uses merge-green, link-blue, and branch-coral — cool tones that let the inherently playful products (a "TypeScript Hat," "React Board") carry the personality.

- **Display**: DM Mono (monospace for headings, prices, labels)
- **Body**: Inter (clean readability)
