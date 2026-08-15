# Laravel CRM

**Version:** `0.1.0`

Laravel CRM is a modular, production-ready customer relationship management system built with Laravel, MySQL, React, Tailwind CSS, and Sanctum authentication.

It is structured as a modular monolith with a service-layer backend and API-first module boundaries, so each business area can be maintained and extended independently.

## About

This CRM is designed for teams that need a clean, scalable system for managing:

- Users
- Roles and permissions
- Leads
- Customers
- Contacts
- Activities
- Deals
- Support tickets
- Notifications
- Import and export data
- Reports and analytics

The UI uses a shared component system and consistent layout patterns to keep the product easy to use and easy to extend.

## Features

- Sanctum authentication
- Protected dashboard
- Users management
- Roles and permissions
- Lead lifecycle management
- Customer profiles and contacts
- Activity timeline
- Deal pipeline board
- Ticket tracking
- Notification center
- Data transfer module
- Reports dashboard
- Responsive interface

## Technology Stack

### Backend

- Laravel
- MySQL
- Sanctum

### Frontend

- React
- Tailwind CSS
- Vite
- React Router

### Development Tools

- Composer
- Node.js
- NPM

## Project Structure

- `app/Modules/*` - module-owned backend code
- `resources/js/modules/*` - module-owned frontend screens
- `resources/js/components/*` - shared UI components
- `resources/js/layouts/*` - app and module layouts
- `routes/*` - Laravel route entry points
- `database/*` - framework-level bootstrap data and core structure

## Requirements

- PHP 8.2 or later
- Composer 2 or later
- Node.js 18 or later
- NPM 9 or later
- MySQL 8 or later

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/DevrajJaiswal/laravel-crm.git
cd laravel-crm
```

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
php artisan key:generate
```

Update `.env` with your database credentials, app URL, and queue/session settings.

### 4. Run migrations

```bash
php artisan migrate
```

### 5. Seed the database

```bash
php artisan db:seed
```

### 6. Start the application

```bash
php artisan serve
npm run dev
```

## Default Login

Open the app in your browser and sign in with the default CRM admin account.

- E-mail: admin@example.com
- Password: admin123

## Module Overview

- `Auth` - login and dashboard entry point
- `AccessControl` - roles and permissions
- `Users` - CRM user administration
- `LeadManagement` - lead tracking and conversion
- `CustomerManagement` - customer records
- `ContactManagement` - customer contacts
- `ActivityManagement` - activity timeline
- `DealManagement` - sales pipeline
- `SupportTicketManagement` - support tickets
- `NotificationManagement` - in-app notifications
- `DataTransfer` - import, export, and history
- `ReportsAnalytics` - CRM reporting
- `Core` - shared backend infrastructure

## Development

### Run tests

```bash
php artisan test
```

### Build frontend assets

```bash
npm run build
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

This project is licensed under the MIT License.

## Author

**Devraj Jaiswal**

Full Stack Engineer

GitHub: https://github.com/DevrajJaiswal
