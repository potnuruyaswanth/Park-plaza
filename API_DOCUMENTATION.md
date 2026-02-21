# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Include JWT token in headers:
```
Authorization: Bearer <access_token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "USER"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Login successful",
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "..."
}

Response: 200 OK
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Logout successful"
}
```

---

## User Endpoints

### Get Nearby Showrooms
```http
GET /user/showrooms/nearby?lat=40.7128&lng=-74.0060&radiusKm=10
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Nearby showrooms fetched successfully",
  "count": 5,
  "showrooms": [
    {
      "_id": "...",
      "name": "Central Parking",
      "city": "New York",
      "distance": 2.5,
      "availableSlots": 45,
      "totalParkingSlots": 100
    }
  ]
}
```

### Create Booking
```http
POST /user/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "showroomId": "...",
  "serviceType": "PARKING",
  "duration": "HOURLY",
  "carDetails": {
    "carNumber": "MH01AB1234",
    "carModel": "Toyota Fortuner",
    "carColor": "White",
    "carImage": "..."
  },
  "description": "Regular parking",
  "durationStartDate": "2024-01-15T10:00:00",
  "durationEndDate": "2024-01-15T11:00:00"
}

Response: 201 Created
{
  "message": "Booking created successfully",
  "booking": { ... }
}
```

### Get User Bookings
```http
GET /user/bookings
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Bookings fetched successfully",
  "count": 3,
  "bookings": [ ... ]
}
```

### Get Booking Details
```http
GET /user/bookings/:bookingId
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Booking details fetched successfully",
  "booking": { ... },
  "invoice": { ... }
}
```

### Get User Invoices
```http
GET /user/invoices
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Invoices fetched successfully",
  "count": 2,
  "invoices": [ ... ]
}
```

### Accept Invoice
```http
POST /user/invoices/:invoiceId/accept
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Invoice accepted successfully",
  "invoice": { ... }
}
```

### Create Payment Order
```http
POST /user/payments/:invoiceId/order
Authorization: Bearer <token>

Response: 201 Created
{
  "message": "Payment order created successfully",
  "razorpayOrderId": "order_...",
  "amount": 1500,
  "paymentId": "...",
  "keyId": "..."
}
```

### Verify Payment
```http
POST /user/payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpayOrderId": "order_...",
  "razorpayPaymentId": "pay_...",
  "razorpaySignature": "...",
  "paymentId": "..."
}

Response: 200 OK
{
  "message": "Payment verified successfully",
  "payment": { ... }
}
```

---

## Employee Endpoints

### Get Showroom Bookings
```http
GET /employee/showrooms/:showroomId/bookings
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Bookings fetched successfully",
  "count": 5,
  "bookings": [ ... ]
}
```

### Inspect Car
```http
PUT /employee/bookings/:bookingId/inspect
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Car in good condition, no damages"
}

Response: 200 OK
{
  "message": "Car inspection completed",
  "booking": { ... }
}
```

### Generate Invoice
```http
POST /employee/bookings/:bookingId/invoice/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "itemsDescription": [
    {
      "description": "Parking charges",
      "quantity": 1,
      "unitPrice": 50,
      "amount": 50
    }
  ],
  "partsCost": 0,
  "laborCost": 0,
  "tax": 9,
  "discount": 0,
  "notes": "Invoice for 1 hour parking"
}

Response: 201 Created
{
  "message": "Invoice generated successfully",
  "invoice": { ... }
}
```

### Update Invoice
```http
PUT /employee/invoices/:invoiceId
Authorization: Bearer <token>
Content-Type: application/json

{
  "itemsDescription": [ ... ],
  "partsCost": 100,
  "laborCost": 500,
  "tax": 90,
  "discount": 0,
  "notes": "Updated invoice"
}

Response: 200 OK
{
  "message": "Invoice updated successfully",
  "invoice": { ... }
}
```

### Update Booking Status
```http
PUT /employee/bookings/:bookingId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "COMPLETED"
}

Response: 200 OK
{
  "message": "Booking status updated successfully",
  "booking": { ... }
}
```

### Get Employee Dashboard
```http
GET /employee/dashboard
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Dashboard data fetched successfully",
  "dashboard": {
    "totalBookings": 45,
    "pendingBookings": 5,
    "completedBookings": 40,
    "totalInvoicesGenerated": 40,
    "totalRevenue": 15000
  }
}
```

---

## Admin Endpoints

### Create Showroom
```http
POST /admin/showrooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Central Parking",
  "address": "123 Main Street",
  "city": "New York",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "totalParkingSlots": 100,
  "facilities": ["WiFi", "CCTV", "Car Wash"],
  "phoneNumber": "1234567890",
  "operatingHours": {
    "open": "06:00",
    "close": "22:00"
  }
}

Response: 201 Created
{
  "message": "Showroom created successfully",
  "showroom": { ... }
}
```

### Get All Showrooms
```http
GET /admin/showrooms
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Showrooms fetched successfully",
  "count": 5,
  "showrooms": [ ... ]
}
```

### Update Showroom
```http
PUT /admin/showrooms/:showroomId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Central Parking - Updated",
  "availableSlots": 50
}

Response: 200 OK
{
  "message": "Showroom updated successfully",
  "showroom": { ... }
}
```

### Get Showroom Stats
```http
GET /admin/showrooms/:showroomId/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Showroom stats fetched successfully",
  "stats": {
    "showroomName": "Central Parking",
    "totalBookings": 100,
    "completedBookings": 95,
    "totalInvoices": 95,
    "totalRevenue": 35000,
    "employees": 5,
    "averageRating": 4.5
  }
}
```

### Create Employee
```http
POST /admin/employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Employee",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "showroomId": "..."
}

Response: 201 Created
{
  "message": "Employee created successfully",
  "employee": { ... }
}
```

### Get Employees by Showroom
```http
GET /admin/showrooms/:showroomId/employees
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Employees fetched successfully",
  "count": 5,
  "employees": [ ... ]
}
```

### Get Admin Dashboard
```http
GET /admin/dashboard
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Dashboard data fetched successfully",
  "dashboard": {
    "totalShowrooms": 5,
    "totalEmployees": 20,
    "totalUsers": 500,
    "totalBookings": 1500,
    "totalRevenue": 500000,
    "topPerformingShowrooms": [ ... ]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide email and password"
}
```

### 401 Unauthorized
```json
{
  "message": "Token is not valid"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Required role: ADMIN"
}
```

### 404 Not Found
```json
{
  "message": "Booking not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

**Last Updated**: February 9, 2026
