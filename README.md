# Smart Parking & Vehicle Service System

A full-stack web application for managing parking slots, car washing, and repair services.

## Tech Stack

### Frontend
- **React** (Vite) - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Razorpay** - Payment processing
- **Puppeteer** - PDF generation

## Project Structure

```
Park_plaza_2/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── razorpay.js
│   │   │   └── constants.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Showroom.js
│   │   │   ├── Booking.js
│   │   │   ├── Invoice.js
│   │   │   └── Payment.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── employeeController.js
│   │   │   └── adminController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── employeeRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── distance.js
│   │   │   └── invoiceGenerator.js
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Card.jsx
    │   │   ├── Modal.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── EmployeeDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── helpers.js
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── tsconfig.json
    ├── package.json
    └── .env.example
```

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables:
```
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

5. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Features

### User Features
- ✅ Register and login
- 📍 Find nearby showrooms (within specified radius)
- 📅 Book parking slots (hourly, daily, weekly)
- 💼 Book car washing and repair services
- 📄 View invoices
- 💳 Online payment (Razorpay)
- 📊 View booking history

### Employee Features
- 👀 View pending bookings
- 🔍 Inspect cars
- 📋 Generate invoices
- 💰 Track earnings
- 📊 Dashboard with statistics

### Admin Features
- 🏢 Manage showrooms
- 👥 Manage employees
- 📊 View system statistics
- 💹 Revenue tracking
- ⚙️ System settings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user

### User Routes
- `GET /api/user/showrooms/nearby` - Get nearby showrooms
- `POST /api/user/bookings` - Create booking
- `GET /api/user/bookings` - Get user bookings
- `GET /api/user/bookings/:bookingId` - Get booking details
- `GET /api/user/invoices` - Get user invoices
- `POST /api/user/invoices/:invoiceId/accept` - Accept invoice
- `POST /api/user/payments/:invoiceId/order` - Create payment order
- `POST /api/user/payments/verify` - Verify payment

### Employee Routes
- `GET /api/employee/showrooms/:showroomId/bookings` - Get showroom bookings
- `PUT /api/employee/bookings/:bookingId/inspect` - Inspect car
- `POST /api/employee/bookings/:bookingId/invoice/generate` - Generate invoice
- `PUT /api/employee/invoices/:invoiceId` - Update invoice
- `PUT /api/employee/bookings/:bookingId/status` - Update booking status
- `GET /api/employee/dashboard` - Get dashboard data

### Admin Routes
- `POST /api/admin/showrooms` - Create showroom
- `GET /api/admin/showrooms` - Get all showrooms
- `PUT /api/admin/showrooms/:showroomId` - Update showroom
- `GET /api/admin/showrooms/:showroomId/stats` - Get showroom stats
- `POST /api/admin/employees` - Create employee
- `GET /api/admin/showrooms/:showroomId/employees` - Get employees
- `GET /api/admin/dashboard` - Get admin dashboard

## Workflow

### Parking/Service Booking Flow
1. User logs in
2. User shares location
3. System shows nearby showrooms
4. User books a service (parking, washing, repair)
5. Booking created with PENDING status
6. Employee inspects vehicle → status becomes INSPECTED
7. Employee generates invoice → status becomes INVOICED
8. User reviews and accepts invoice
9. User makes payment via Razorpay
10. Payment verified → status becomes PAID
11. Service completed → status becomes COMPLETED

## Database Models

### User
```javascript
{
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  role: "USER" | "EMPLOYEE" | "ADMIN",
  location: { lat, lng },
  showroomId: ObjectId,
  profileImage: String,
  isActive: Boolean,
  refreshToken: String
}
```

### Showroom
```javascript
{
  name: String,
  address: String,
  city: String,
  location: { type: "Point", coordinates: [lng, lat] },
  totalParkingSlots: Number,
  availableSlots: Number,
  facilities: [String],
  phoneNumber: String,
  operatingHours: { open, close },
  rating: Number,
  totalReviews: Number
}
```

### Booking
```javascript
{
  userId: ObjectId,
  showroomId: ObjectId,
  carDetails: { carNumber, carModel, carColor, carImage },
  serviceType: "PARKING" | "WASH" | "REPAIR",
  duration: "HOURLY" | "DAILY" | "WEEKLY",
  bookingDate: Date,
  durationStartDate: Date,
  durationEndDate: Date,
  estimatedCost: Number,
  status: "PENDING" | "INSPECTED" | "INVOICED" | "PAID" | "COMPLETED",
  notes: String
}
```

### Invoice
```javascript
{
  bookingId: ObjectId,
  userId: ObjectId,
  employeeId: ObjectId,
  showroomId: ObjectId,
  invoiceNumber: String (unique),
  itemsDescription: [{ description, quantity, unitPrice, amount }],
  partsCost: Number,
  laborCost: Number,
  tax: Number,
  discount: Number,
  totalAmount: Number,
  status: "GENERATED" | "ACCEPTED" | "PAID",
  pdfUrl: String
}
```

### Payment
```javascript
{
  invoiceId: ObjectId,
  bookingId: ObjectId,
  userId: ObjectId,
  amount: Number,
  paymentMethod: "RAZORPAY" | "UPI" | "CARD" | "NET_BANKING" | "CASH",
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED",
  paymentDate: Date
}
```

## Authentication & Authorization

- **JWT Authentication**: Access tokens (15 min) and refresh tokens (7 days)
- **Role-Based Access Control**: USER, EMPLOYEE, ADMIN with different permissions
- **Token Refresh**: Automatic token refresh on expiry
- **Secure Password**: Hashed with bcryptjs

## Payment Integration

- **Razorpay Integration**: Secure online payments
- **Order Creation**: Backend creates order and provides order ID
- **Payment Verification**: Signature verification for security
- **Order Status Updates**: Automatic status updates after payment

## Distance Calculation

- **Haversine Formula**: Calculates great-circle distance between coordinates
- **Nearby Showrooms**: Shows all showrooms within specified radius
- **Sorted Results**: Results sorted by distance (nearest first)

## Error Handling

- Comprehensive error handling with meaningful messages
- Validation for all inputs
- MongoDB-specific error handling (duplicate keys, validation errors)
- JWT error handling (expired, invalid tokens)

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Render)
1. Push to GitHub
2. Create new Web Service on Render
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Add IP whitelist
4. Use connection string in backend

## Future Enhancements

- 🗺️ Google Maps integration for better location display
- 📱 Mobile app (React Native)
- 📧 Email notifications
- 🔔 Real-time notifications (Socket.io)
- ⭐ Rating and review system
- 🎟️ Promo codes and discounts
- 📞 Customer support chat
- 🚗 Multiple vehicle management
- 📱 SMS notifications
- 🤖 AI-based pricing

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC

## Support

For support, email support@parkplaza.com or create an issue.

---

**Made with ❤️ by Coder**
