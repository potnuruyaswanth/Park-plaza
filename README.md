# Park Plaza - Vehicle Service Management System

A full-stack application for managing vehicle parking and service bookings with employee management.

## 🏗️ Project Structure

```
Park_plaza_2/
├── client/                 # React frontend
│   ├── src/               # Source code (to be built feature by feature)
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── src/               # Source code (to be built feature by feature)
│   ├── package.json
│   └── server.js
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📋 Features (To Be Implemented)

- [ ] Authentication System
- [ ] Showroom Management
- [ ] Booking System
- [ ] Employee Management
- [ ] Invoice Generation
- [ ] Payment Processing
- [ ] Dashboard Analytics
- [ ] Product Shop
- [ ] Order Management

## 🔄 Git Workflow

Features are built using feature branches:
```
main (stable)
└── develop (feature branch working area)
    ├── feature/authentication
    ├── feature/showroom-management
    ├── feature/booking-system
    └── ...
```

Each feature is built and merged back to main after approval.

---

**Built with:** React.js, Express.js, MongoDB, Tailwind CSS
