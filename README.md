# Student Expense Tracker

A personal finance tracker for students built with **Laravel 12**, **Inertia + React**, **Tailwind CSS** and **MySQL**. Authentication is provided by Laravel Breeze.

## Features

- Register / login / logout (Breeze)
- Dashboard: total expenses, current-month spending, remaining budget, category chart, recent transactions
- Transactions: create, view, edit, delete; search by title; filter by category, payment method and date range; paginated
- Monthly budgets (one per user per month, enforced by a unique constraint)
- Reports: spending by category (month or whole year) and a monthly summary with budget comparison
- Settings: profile and password management
- Responsive sidebar layout, toast notifications, delete confirmation, empty/loading states

## Security model

- Every transaction and budget belongs to a user; `user_id` is never accepted from the client.
- Lists are queried through the authenticated user's relationships; update/delete/edit go through `TransactionPolicy` / `BudgetPolicy` (403 for other users' records).
- Inputs are validated by Form Requests; CSRF protection and session auth are Laravel defaults.
- Money is stored as `DECIMAL(12,2)`; totals are computed on the backend.

## Requirements

- PHP 8.2+ with `pdo_mysql` and `bcmath`
- Composer, Node.js 18+ and npm
- MySQL 5.7+/MariaDB 10.4+ (XAMPP works)

## Setup

```bash
# 1. Install dependencies
composer install
npm install

# 2. Environment
cp .env.example .env        # Windows: copy .env.example .env
php artisan key:generate
```

Create the database (phpMyAdmin or CLI):

```sql
CREATE DATABASE student_expense_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configure `.env`:

```env
APP_NAME="Student Expense Tracker"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=student_expense_tracker
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations:

```bash
php artisan migrate
```

## Development

```bash
php artisan serve     # http://localhost:8000
npm run dev           # Vite dev server (hot reload)
```

Production build:

```bash
npm run build
```

## Tests

Tests run against an in-memory SQLite database (configured in `phpunit.xml`):

```bash
php artisan test
```

## Notes

- Currency is formatted as Philippine peso (₱, PHP) in `resources/js/lib/format.js`; change the `currency` constant there to switch.
- The session, cache and queue drivers use the database; the tables are created by the default migrations.
