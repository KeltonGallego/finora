# Finora

> A modern personal finance dashboard built to make financial tracking simple, visual and intuitive.

![Finora Dashboard](./src/assets/hero.png)

## Overview

Finora is a modern personal finance dashboard designed to help users manage, track and understand their financial activity from a single interface.

The application provides a clean and responsive experience for managing transactions, monitoring budgets, visualizing financial data and configuring personal preferences.

This project was built as a full frontend application with a focus on:

- Clean and maintainable React architecture
- Reusable components
- Context-based state management
- Responsive design
- Interactive data visualization
- Modern UI/UX principles

---

## Features

### Dashboard

Get an overview of your financial situation with:

- Total balance
- Income overview
- Expense overview
- Recent transactions
- Financial summaries
- Interactive charts

### Transaction Management

Manage your financial activity through:

- Add new transactions
- Edit existing transactions
- Delete transactions
- Income and expense tracking
- Transaction categories
- Search functionality
- Type filtering
- Category filtering

### Budget Management

Create and monitor personal budgets with:

- Custom budget categories
- Spending progress tracking
- Remaining budget calculation
- Budget usage indicators
- Visual progress bars
- Over-budget states

### Analytics

Understand your financial habits through:

- Income and expense charts
- Category-based spending analysis
- Visual financial data
- Monthly financial insights

### Authentication

The application includes authentication-related flows such as:

- Login
- Registration
- Protected application structure
- Authentication context management

### Settings

Manage application preferences including:

- Theme preferences
- Currency settings
- Notification preferences
- Data management options
- Application settings

---

## Tech Stack

### Frontend

- React
- JavaScript
- Vite
- CSS

### State Management

- React Context API
- Custom React Hooks

### Data Visualization

- Recharts

### Development Tools

- ESLint
- Vite
- Git
- GitHub

---

## Project Structure

```text
finora/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   │
│   ├── assets/
│   │   └── hero.png
│   │
│   ├── components/
│   │   ├── AddTransactionModal.jsx
│   │   ├── ExpenseChart.jsx
│   │   ├── Header.jsx
│   │   ├── IncomeExpenseChart.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── TransactionItem.jsx
│   │   └── TransactionList.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── FinanceContext.jsx
│   │
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   │
│   ├── pages/
│   │   ├── Analytics.jsx
│   │   ├── Budgets.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Settings.jsx
│   │   └── Transactions.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── transactionService.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
