# Thrifteezy - Online Thrift Store

A modern web application for buying and selling second-hand clothing and accessories.

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma (ORM)
- JWT Authentication

## Project Structure
```
thrifteezy/
├── frontend/          # React + Vite frontend application
├── backend/           # Express.js backend server
└── README.md         # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your configuration

4. Start the development servers:
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend server (from frontend directory)
   npm run dev
   ```

## Features
- User authentication (Login/Register)
- Browse and search items
- Add items for sale
- Manage orders and wishlists
- User profiles
- Responsive design