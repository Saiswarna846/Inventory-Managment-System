# Inventory Management System

A full-stack inventory management application built with React, Supabase, and Firebase Hosting. This system allows users to manage products, track stock levels, and record inventory transactions.

## Features

- **User Authentication** (Email/Password)
- **Product Management**
  - Add/edit products (name, SKU, category, stock)
  - View all products with current stock levels
- **Transaction Tracking**
  - Record stock movements (IN/OUT)
  - View transaction history per product
- **Responsive UI** works on desktop and mobile

## Technologies Used

- **Frontend**: React.js, HTML5
- **Backend**: Supabase (PostgreSQL database + Auth)
- **Hosting**: Firebase Hosting
- **Additional Libraries**: 
  - @supabase/supabase-js
  - React Hooks

## Live Demo

[View Live Application](https://inventory-managment-syst-c79d9.web.app)

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- Firebase CLI
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/inventory-management.git
   cd inventory-management 


### Install dependencies
```
npm install
```
### Set up environment variables

- Create a .env file in the root directory:
```
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_KEY=your-supabase-key
```
### Initialize Supabase

Create a new project at supabase.com
Run the SQL setup script from supabase/setup.sql

### Running Locally
```
npm start   (Runs the app in development mode at http://localhost:3000)

npm run build (Builds the app for production to the build folder.)
```
### Deployment

- Install Firebase CLI
```
npm install -g firebase-tools

firebase login

firebase init hosting

npm run build

firebase deploy
```
### Default Credentials
```
Email: admin@inventory1.com
Password: password
```
### Contact

For support, please contact saisumanth437@gmail.com

