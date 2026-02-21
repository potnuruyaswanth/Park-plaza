# Installation Guide

## Prerequisites

Before you start, make sure you have:
- Node.js v18.0 or higher
- MongoDB (local or MongoDB Atlas)
- Git
- A text editor (VS Code recommended)

## Quick Start

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd Park_plaza_2

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

#### Backend (.env)
Create `server/.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/park_plaza

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-change-in-production

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# CORS
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
Create `client/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 3. Database Setup

If using MongoDB Atlas:
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create a database user
4. Get connection string
5. Replace in `.env`

If using local MongoDB:
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/park_plaza`

### 4. Run the Application

#### Terminal 1 - Backend
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### 5. Test the Application

1. Open browser: http://localhost:5173
2. Click "Register" to create a test account
3. Login with your credentials
4. Allow location access when prompted
5. View nearby showrooms

## Troubleshooting

### MongoDB Connection Error
- Check MONGODB_URI in .env
- Ensure MongoDB is running
- Check IP whitelist in MongoDB Atlas

### Port Already in Use
```bash
# Change port in server/.env or vite.config.js
```

### CORS Error
- Ensure FRONTEND_URL matches your frontend address
- Check CORS configuration in src/app.js

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Create Admin Account

To create an admin account, use MongoDB directly:

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  phone: "9876543210",
  password: "$2a$10/hashed_password_here",
  role: "ADMIN",
  isActive: true
})
```

Or modify the register endpoint temporarily to allow ADMIN role creation.

## Create Test Data

### 1. Create Showroom (as Admin)
```bash
curl -X POST http://localhost:5000/api/admin/showrooms \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Central Parking",
    "address": "123 Main St",
    "city": "New York",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "totalParkingSlots": 100,
    "facilities": ["WiFi", "CCTV", "Car Wash"],
    "phoneNumber": "1234567890"
  }'
```

### 2. Create Employee (as Admin)
```bash
curl -X POST http://localhost:5000/api/admin/employees \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Employee",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123",
    "showroomId": "SHOWROOM_ID"
  }'
```

## API Testing

Use Postman to test APIs:
1. Import collection from `server/postman_collection.json` (if available)
2. Set `{{base_url}}` to `http://localhost:5000/api`
3. Set `{{token}}` after login

## Next Steps

1. **Customize Styling**: Modify Tailwind config in `client/tailwind.config.js`
2. **Add More Features**: Implement booking, invoicing, etc.
3. **Deploy**: Follow deployment guide
4. **Scale**: Implement caching, load balancing, etc.

## Support

Need help? Check:
- README.md for general overview
- Code comments for specific implementations
- GitHub issues for common problems

Happy coding! 🚀
