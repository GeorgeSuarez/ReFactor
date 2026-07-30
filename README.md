# ReFactor

A developer-themed e-commerce store built with React, .NET, and SQL Server. Everyday gear — boards, boots, gloves, hats — refactored with the sensibilities of the people who build the web.

## Tech Stack

| Layer            | Technology                                                   |
| ---------------- | ------------------------------------------------------------ |
| Frontend         | React 19, TypeScript, Vite, MUI v9, Redux Toolkit, RTK Query |
| Backend          | .NET 10, ASP.NET Core Web API, Entity Framework Core         |
| Database         | SQL Server 2022                                              |
| Auth             | ASP.NET Core Identity (cookie-based)                         |
| Payments         | Stripe (via backend API + `confirmCardPayment`)              |
| Media            | Cloudinary                                                   |
| Containerization | Docker, docker-compose                                       |

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for SQL Server)
- A Stripe account (test mode) for payment processing
- A Cloudinary account for image uploads (optional — admin product images)

### Setup

1. **Start SQL Server**

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Password@1" \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/azure-sql-edge
```

2. **Configure secrets**

Create `API/.env` (already gitignored):

```env
ConnectionStrings__DefaultConnection=Server=localhost,1433;Database=shop;User Id=sa;Password=Password@1;TrustServerCertificate=True
StripeSettings__PublishableKey=pk_test_...
StripeSettings__SecretKey=sk_test_...
Cloudinary__CloudName=your_cloud_name
Cloudinary__ApiKey=your_api_key
Cloudinary__ApiSecret=your_api_secret
```

Create `frontend/.env.development`:

```env
VITE_API_URL=/api
VITE_STRIPE_PK=pk_test_...
```

3. **Start the API**

```bash
cd API
dotnet watch
```

The API starts on `http://localhost:5000`. On first run it seeds the database with sample products and users:

- **Admin**: `admin@test.com` / `Pa$$w0rd`

4. **Start the frontend**

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`. The Vite dev server proxies `/api` requests to the .NET backend.

### Stripe Test Payments

The checkout flow uses a backend endpoint (`POST /api/payments/test-pm`) that creates a Visa test payment method via `tok_visa`. No manual card entry is needed — clicking "Pay" on the Review step processes the payment automatically using the test card ending in 4242.

## Docker

```bash
docker compose up -d
```

This starts three containers:

- **db** — SQL Server 2022
- **api** — .NET API (port 5000)
- **frontend** — Nginx serving the built app (port 80)

Set Stripe and Cloudinary keys via environment variables or a `.env` file in the project root:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Routes

| Path                | Description                                    | Auth     |
| ------------------- | ---------------------------------------------- | -------- |
| `/`                 | Homepage with featured product hero            | —        |
| `/catalog`          | Product listing with filters, sort, pagination | —        |
| `/catalog/:id`      | Product details                                | —        |
| `/about`            | About the store (principles, team)             | —        |
| `/contact`          | Contact channels and FAQ                       | —        |
| `/basket`           | Shopping cart with coupon support              | —        |
| `/login`            | Sign in                                        | —        |
| `/register`         | Create account                                 | —        |
| `/checkout`         | Checkout flow (Address → Payment → Review)     | Required |
| `/checkout/success` | Order confirmation                             | Required |
| `/orders`           | Order history                                  | Required |
| `/inventory`        | Product management (create, edit, delete)      | Admin    |

## Project Structure

```
API/
├── Controllers/        # API endpoints
├── Data/               # DbContext, migrations, seed data
├── DTOs/               # Data transfer objects
├── Entities/           # Domain models
├── Extensions/         # Query helpers, mapping
├── Middleware/         # Exception handling middleware
├── RequestHelpers/     # Pagination, settings models, mapping profiles
├── Services/           # PaymentsService, ImageService, DiscountService
├── .env.example        # Environment variable template
├── Dockerfile          # Multi-stage .NET 10 build
└── Program.cs          # App startup, DI, middleware pipeline

frontend/
├── src/
│   ├── app/
│   │   ├── api/        # Base API client with error handling
│   │   ├── errors/     # NotFound, ServerError pages
│   │   ├── layout/     # App shell, NavBar, theme.ts, UI slice
│   │   ├── lib/        # Router singleton, utility helpers
│   │   ├── models/     # TypeScript interfaces
│   │   ├── routes/     # Route definitions (RequireAuth guard)
│   │   ├── shared/     # Pagination, form inputs, OrderSummary
│   │   └── store/      # Redux store configuration
│   └── features/
│       ├── about/      # About page (principles, team)
│       ├── account/    # Login, register, user info, address
│       ├── admin/      # Inventory management
│       ├── basket/     # Shopping cart
│       ├── catalog/    # Product grid, filters, product cards
│       ├── checkout/   # Checkout stepper (MUI address form + Stripe)
│       ├── contact/    # Contact page with channels and FAQ
│       ├── home/       # Homepage with featured component hero
│       └── orders/     # Order history and details
├── .env.development    # Frontend env vars (gitignored)
├── Dockerfile          # Multi-stage build (Node → Nginx)
└── nginx.conf          # SPA fallback + /api/ proxy
```

## Design

The visual identity is built around a "build system" concept — clean, informatic, developer-oriented. Products are treated as components with code-comment annotations (`// type`, `// brand`). The color palette is cool-toned (merge-green, link-blue, branch-coral), letting the inherently playful products carry the personality.

- **Display**: DM Mono (monospace for headings, prices, labels, code comments)
- **Body**: Inter (clean readability for descriptions and body text)

## Known Issues

- **Stripe PaymentElement "loaderror"**: Non-blocking warning logged during Stripe iframe initialization. Elements still render and function correctly.
- **Cloudinary not required**: Products with image URLs work without Cloudinary. Only admin product uploads need it.
