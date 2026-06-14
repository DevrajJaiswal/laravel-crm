# Laravel CRM

A modern, modular, and scalable Customer Relationship Management (CRM) system built with Laravel and React.

This project is designed using a feature-based modular architecture with a reusable component-driven frontend and a centralized design system. It provides a strong foundation for managing customers, leads, contacts, data transfers, and future ERP capabilities.

---

## Features

### Dashboard

* Business overview dashboard
* KPI and statistics cards
* Quick actions
* Responsive design

### Customer Management

* Customer records management
* Customer profiles
* Search and filtering
* Customer lifecycle tracking

### Lead Management

* Lead creation and management
* Lead status tracking
* Assignment workflows
* Follow-up management

### Contact Management

* Centralized contact database
* Contact relationship management
* Search and filtering

### Data Transfer

* Import data from external sources
* Export data for reporting and migration
* Extensible import/export architecture
* Module-based data transfer support

### User Management

* User authentication
* Authorization and access control
* Role and permission support

---

## Architecture

### Backend

* Laravel
* Modular Architecture
* Service-Oriented Design
* SOLID Principles
* Clean Separation of Concerns

### Frontend

* React
* Feature-Based Module Structure
* Reusable Component Architecture
* Shared Layout System
* Centralized Design System

---

## Technology Stack

### Backend

* PHP
* Laravel
* MySQL

### Frontend

* React
* JavaScript
* Vite

### Development Tools

* Composer
* NPM
* Git

---

## Installation

### Clone Repository

```bash
git clone https://github.com/DevrajJaiswal/laravel-crm.git
cd laravel-crm
```

### Install Dependencies

```bash
composer install
npm install
```

### Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Update database credentials inside the `.env` file.

### Run Database Migrations

```bash
php artisan migrate
```

### Start Development Server

```bash
php artisan serve
npm run dev
```
---

## Future Enhancements

* Workflow Automation
* Activity Timeline
* Notification System
* Reporting & Analytics

---

## Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License

This project is licensed under the MIT License.

---

## Author

**Devraj Jaiswal**

Full Stack Engineer

GitHub: https://github.com/DevrajJaiswal
