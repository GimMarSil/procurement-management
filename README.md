This project is a Next.js application.

## Prerequisites

- **Node.js**: version 18 or higher.
- **pnpm**: used as the package manager.

Install pnpm if you don't have it installed:

```bash
npm install -g pnpm
```

## Installation

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values. The API routes
use these variables for email and database access:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` – settings for
  Nodemailer.
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SERVER` – credentials for connecting
  to SQL Server. `DB_SERVER` defaults to `localhost` if not set.

## npm Scripts

- `pnpm dev` – Starts the development server with Next.js.
- `pnpm build` – Builds the production version of the application.
- `pnpm start` – Runs the built application in production mode.
- `pnpm lint` – Runs Next.js linting.
