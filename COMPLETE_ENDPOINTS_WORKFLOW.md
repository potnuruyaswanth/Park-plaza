# Park Plaza - Complete Endpoints & Workflow Documentation

## API Base URL
```
http://localhost:5000/api
```

---

## 📋 TABLE OF CONTENTS
1. [Authentication Endpoints](#1-authentication-endpoints)
2. [User Endpoints](#2-user-endpoints)
3. [Employee Endpoints](#3-employee-endpoints)
4. [Admin Endpoints](#4-admin-endpoints)
5. [Product Endpoints](#5-product-endpoints)
6. [Cart Endpoints](#6-cart-endpoints)
7. [Order Endpoints](#7-order-endpoints)
8. [Payment Endpoints](#8-payment-endpoints)

---

## 1. AUTHENTICATION ENDPOINTS

### Base URL: `/api/auth`

#### 1.1 Register User
**Endpoint:** `POST /register` or `POST /register-user`
```
Method: POST
Auth Required: NO
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91-9876543210",
  "showroomId": "64f1a2b3c4d5e6f7g8h9i0j1"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "role": "USER"
  }
}
```

**Workflow:**
1. Frontend form collects user registration details
2. Sends POST request to `/api/auth/register`
3. Backend validates email uniqueness & username uniqueness
4. Hashes password
5. Creates user in MongoDB
6. Sends verification email (if configured)
7. Returns user data
8. Frontend redirects to login page

---

#### 1.2 Login User (Role-based)
**Endpoint:** `POST /login-user` (for regular users)
```
Method: POST
Auth Required: NO
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900
}
```

**Workflow:**
1. User enters email & password in login form
2. Frontend sends POST request to `/api/auth/login-user`
3. Backend validates credentials
4. Generates JWT tokens (access: 15 mins, refresh: 7 days)
5. Returns user object + tokens
6. Frontend stores tokens in localStorage
7. Frontend sets up axios interceptor for token refresh
8. Redirects to dashboard

---

#### 1.3 Login Employee
**Endpoint:** `POST /login-employee`
```
Method: POST
Auth Required: NO
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "employee@example.com",
  "password": "employee123"
}
```

**Response (200 OK):**
Same as user login but with `role: "EMPLOYEE"`

**Workflow:** Same as user login but redirects to employee dashboard

---

#### 1.4 Verify Email
**Endpoint:** `GET /verify-email?token=xxx`
```
Method: GET
Auth Required: NO
Query Params: token (required)
```

**Response (200 OK):**
```json
{
  "message": "Email verified successfully"
}
```

**Workflow:**
1. User receives verification email with token link
2. Clicks link which calls `/verify-email?token=...`
3. Backend validates token & marks email as verified
4. User can now use all features

---

#### 1.5 Forgot Password
**Endpoint:** `POST /password/forgot`
```
Method: POST
Auth Required: NO
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset link sent to email"
}
```

**Workflow:**
1. User clicks "Forgot Password"
2. Enters email
3. Backend generates reset token
4. Sends reset link via email
5. User clicks link
6. Enters new password

---

#### 1.6 Reset Password
**Endpoint:** `POST /password/reset`
```
Method: POST
Auth Required: NO
```

**Request Body:**
```json
{
  "token": "reset_token_xxx",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

**Workflow:**
1. Same as forgot password flow
2. Backend validates reset token
3. Updates password in database
4. Token becomes invalid after use
5. User can login with new password

---

#### 1.7 Check Username Availability
**Endpoint:** `GET /check-username?username=john_doe`
```
Method: GET
Auth Required: NO
Query Params: username (required)
```

**Response (200 OK):**
```json
{
  "available": true
}
```

**Workflow:**
1. User types username in registration form
2. Frontend sends GET request to check availability
3. Backend checks if username exists
4. Returns availability status
5. Frontend enables/disables submit button

---

#### 1.8 Get Showrooms for Registration
**Endpoint:** `GET /showrooms`
```
Method: GET
Auth Required: NO
```

**Response (200 OK):**
```json
{
  "showrooms": [
    {
      "_id": "showroom_id",
      "name": "Park Plaza Mumbai",
      "city": "Mumbai",
      "location": {
        "type": "Point",
        "coordinates": [72.8479, 19.0760]
      }
    }
  ]
}
```

**Workflow:**
1. User sees showroom dropdown in registration
2. Frontend fetches available showrooms
3. User selects showroom
4. Showroom ID sent with registration

---

#### 1.9 Refresh Access Token
**Endpoint:** `POST /refresh-token`
```
Method: POST
Auth Required: NO
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": 900
}
```

**Workflow:**
1. Access token expires (15 mins)
2. Axios interceptor catches 401 error
3. Automatically calls `/refresh-token` with refresh token
4. Backend validates refresh token
5. Generates new access & refresh tokens
6. Returns new tokens
7. Axios retries original request with new token
8. User never needs to login again (until refresh token expires at 7 days)

---

#### 1.10 Logout
**Endpoint:** `POST /logout`
```
Method: POST
Auth Required: YES
Headers: Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

**Workflow:**
1. User clicks logout button
2. Frontend makes POST request to `/logout`
3. Backend invalidates refresh token
4. Frontend clears localStorage (removes tokens & user data)
5. Redirects to login page

---

---

## 2. USER ENDPOINTS

### Base URL: `/api/user`
### Authentication: Required (role: USER)

#### 2.1 Get User Profile
**Endpoint:** `GET /profile`
```
Method: GET
Auth Required: YES (USER role)
Headers: Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "_id": "user_id",
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "profilePicture": "url",
  "role": "USER",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Workflow:**
1. User navigates to Profile page
2. Frontend fetches user profile from `/profile`
3. Backend returns user data from database
4. Frontend displays profile information
5. Shows edit profile button

---

#### 2.2 Update User Profile
**Endpoint:** `PUT /profile`
```
Method: PUT
Auth Required: YES (USER role)
Headers: Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "phone": "+91-9876543211",
  "address": "456 New St",
  "city": "Mumbai",
  "state": "Maharashtra"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "phone": "+91-9876543211",
    "address": "456 New St",
    "city": "Mumbai",
    "state": "Maharashtra"
  }
}
```

**Workflow:**
1. User clicks Edit Profile
2. Form displays current profile data
3. User modifies fields
4. Frontend sends PUT request to `/profile`
5. Backend validates & updates user document
6. Frontend shows success message
7. Updates displayed profile

---

#### 2.3 Search Nearby Showrooms (by Location)
**Endpoint:** `GET /showrooms/nearby?latitude=19.0760&longitude=72.8479&radius=50`
```
Method: GET
Auth Required: YES (USER role)
Query Params: 
  - latitude (required)
  - longitude (required)
  - radius (optional, default: 50 km)
```

**Response (200 OK):**
```json
{
  "showrooms": [
    {
      "_id": "showroom_id",
      "name": "Park Plaza Mumbai",
      "city": "Mumbai",
      "location": { "coordinates": [72.8479, 19.0760] },
      "distance": 5.2
    }
  ]
}
```

**Workflow:**
1. User lands on Book Service page
2. Browser requests location permission (if not granted)
3. Frontend gets latitude & longitude from geolocation API
4. Sends GET request to `/showrooms/nearby?latitude=...&longitude=...`
5. Backend performs geospatial query (with 50km default radius)
6. Returns nearest showrooms with distance
7. Frontend displays showrooms on map/list
8. Falls back to city-based search if location denied

---

#### 2.4 Search Showrooms by City
**Endpoint:** `GET /showrooms/city?city=Mumbai`
```
Method: GET
Auth Required: YES (USER role)
Query Params: city (required)
```

**Response (200 OK):**
```json
{
  "showrooms": [
    {
      "_id": "showroom_id",
      "name": "Park Plaza Mumbai",
      "city": "Mumbai",
      "address": "123 Main St, Mumbai",
      "phone": "+91-9876543210"
    }
  ]
}
```

**Workflow:**
1. User can't get location or prefers manual entry
2. Enters city name in dropdown/search
3. Frontend sends GET request to `/showrooms/city?city=...`
4. Backend queries showrooms matching city
5. Returns list of showrooms
6. User selects showroom

---

#### 2.5 Book Service (Create Booking)
**Endpoint:** `POST /bookings`
```
Method: POST
Auth Required: YES (USER role)
Headers: Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "showroomId": "showroom_id",
  "carBrand": "Honda",
  "carModel": "City",
  "carColor": "Silver",
  "carNumber": "MH-01-AB-1234",
  "serviceType": "MAINTENANCE",
  "description": "Regular maintenance and oil change",
  "estimatedCost": 5000
}
```

**Response (201 Created):**
```json
{
  "message": "Booking successful",
  "booking": {
    "_id": "booking_id",
    "userId": "user_id",
    "showroomId": "showroom_id",
    "slotNumber": 5,
    "status": "PENDING",
    "serviceType": "MAINTENANCE",
    "carNumber": "MH-01-AB-1234",
    "bookingDate": "2024-01-20T10:00:00Z"
  },
  "invoice": {
    "_id": "invoice_id",
    "invoiceNumber": "INV-202401-00001",
    "amount": 5000,
    "status": "GENERATED"
  },
  "slotNumber": 5
}
```

**Workflow:**
1. User selects showroom, fills service details
2. Clicks "Confirm Booking"
3. Frontend sends POST request to `/bookings`
4. Backend:
   - Validates availability (checks open slots)
   - Assigns available slot number (1-50)
   - Saves booking document
   - Auto-generates invoice
   - Auto-creates payment record
   - Returns slotNumber
5. Frontend displays success modal with slot number
6. After 2.5 seconds auto-redirects to bookings list

---

#### 2.6 Get My Bookings (List)
**Endpoint:** `GET /bookings`
```
Method: GET
Auth Required: YES (USER role)
Query Params: Optional filtering/pagination
```

**Response (200 OK):**
```json
{
  "bookings": [
    {
      "_id": "booking_id",
      "status": "PENDING",
      "slotNumber": 5,
      "carNumber": "MH-01-AB-1234",
      "serviceType": "MAINTENANCE",
      "bookingDate": "2024-01-20",
      "showroom": {
        "name": "Park Plaza Mumbai"
      }
    }
  ]
}
```

**Workflow:**
1. User navigates to "My Bookings" page
2. Frontend sends GET to `/bookings`
3. Backend returns all bookings for logged-in user
4. Frontend displays list with status badges
5. Shows buttons: View Details, Pay Invoice, Cancel (if allowed)

---

#### 2.7 Get Booking Details
**Endpoint:** `GET /bookings/:bookingId`
```
Method: GET
Auth Required: YES (USER role)
URL Params: bookingId (required)
```

**Response (200 OK):**
```json
{
  "booking": {
    "_id": "booking_id",
    "userId": "user_id",
    "showroomId": "showroom_id",
    "slotNumber": 5,
    "status": "PENDING",
    "serviceType": "MAINTENANCE",
    "description": "Regular maintenance",
    "carDetails": {
      "carBrand": "Honda",
      "carModel": "City",
      "carColor": "Silver",
      "carNumber": "MH-01-AB-1234"
    },
    "bookingDate": "2024-01-20T10:00:00Z",
    "estimatedCost": 5000
  }
}
```

**Workflow:**
1. User clicks on a booking from list
2. Frontend sends GET to `/bookings/:bookingId`
3. Full booking details displayed
4. Shows invoice if created
5. Shows payment options if not paid

---

#### 2.8 Get My Invoices (List)
**Endpoint:** `GET /invoices`
```
Method: GET
Auth Required: YES (USER role)
```

**Response (200 OK):**
```json
{
  "invoices": [
    {
      "_id": "invoice_id",
      "invoiceNumber": "INV-202401-00001",
      "bookingId": "booking_id",
      "amount": 5000,
      "status": "GENERATED",
      "generatedDate": "2024-01-20",
      "dueDate": "2024-01-27"
    }
  ]
}
```

**Workflow:**
1. User navigates to "Invoices" page
2. Frontend sends GET to `/invoices`
3. Backend returns all invoices for user
4. Display list with status (GENERATED, ACCEPTED, PAID)
5. Show filter options: All, Paid, Pending

---

#### 2.9 Get Invoice Details
**Endpoint:** `GET /invoices/:invoiceId`
```
Method: GET
Auth Required: YES (USER role)
URL Params: invoiceId (required)
```

**Response (200 OK):**
```json
{
  "invoice": {
    "_id": "invoice_id",
    "invoiceNumber": "INV-202401-00001",
    "bookingId": "booking_id",
    "userId": "user_id",
    "amount": 5000,
    "status": "GENERATED",
    "items": [
      {
        "description": "Regular maintenance",
        "quantity": 1,
        "unitPrice": 5000,
        "total": 5000
      }
    ],
    "generatedDate": "2024-01-20",
    "dueDate": "2024-01-27",
    "notes": "Service includes oil change"
  }
}
```

**Workflow:**
1. User clicks "View Invoice" button
2. Frontend sends GET to `/invoices/:invoiceId`
3. Display detailed invoice with breakdown
4. Show payment button if unpaid
5. Show download PDF option

---

#### 2.10 Accept Invoice
**Endpoint:** `POST /invoices/:invoiceId/accept`
```
Method: POST
Auth Required: YES (USER role)
URL Params: invoiceId (required)
```

**Request Body:**
```json
{}
```

**Response (200 OK):**
```json
{
  "message": "Invoice accepted",
  "invoice": {
    "_id": "invoice_id",
    "status": "ACCEPTED"
  }
}
```

**Workflow:**
1. User reviews invoice
2. Clicks "Accept Invoice"
3. Frontend sends POST to `/invoices/:invoiceId/accept`
4. Backend:
   - Validates invoice exists & belongs to user
   - Updates status to "ACCEPTED"
   - Saves accepted date
5. Frontend shows success message
6. Now user can proceed to payment

---

#### 2.11 Create Payment Order (Razorpay)
**Endpoint:** `POST /payments/:invoiceId/order`
```
Method: POST
Auth Required: YES (USER role)
URL Params: invoiceId (required)
```

**Request Body:**
```json
{
  "amount": 5000,
  "currency": "INR"
}
```

**Response (201 Created):**
```json
{
  "orderId": "order_id_from_razorpay",
  "amount": 5000,
  "currency": "INR",
  "key": "razorpay_key_id"
}
```

**Workflow:**
1. User sees "Pay with Razorpay" button on invoice
2. Clicks button
3. Frontend sends POST to `/payments/:invoiceId/order`
4. Backend:
   - Validates invoice amount
   - Creates Razorpay order
   - Returns order ID & key
5. Frontend opens Razorpay payment modal
6. User enters card/UPI details
7. Payment processed

---

#### 2.12 Verify Payment
**Endpoint:** `POST /payments/:invoiceId/verify`
```
Method: POST
Auth Required: YES (USER role)
URL Params: invoiceId (required)
```

**Request Body:**
```json
{
  "razorpayOrderId": "order_id",
  "razorpayPaymentId": "pay_id",
  "razorpaySignature": "signature"
}
```

**Response (200 OK):**
```json
{
  "message": "Payment verified successfully",
  "payment": {
    "_id": "payment_id",
    "amount": 5000,
    "status": "PAID",
    "invoiceId": "invoice_id"
  }
}
```

**Workflow:**
1. After Razorpay payment, frontend receives payment details
2. Sends POST to `/payments/:invoiceId/verify`
3. Backend:
   - Validates Razorpay signature
   - Updates payment status to "PAID"
   - Updates invoice status to "PAID"
   - Generates payment receipt
4. Frontend displays success message
5. User can download receipt

---

#### 2.13 Get Pending Payments
**Endpoint:** `GET /payments/pending`
```
Method: GET
Auth Required: YES (USER role)
```

**Response (200 OK):**
```json
{
  "pendingPayments": [
    {
      "invoiceId": "invoice_id",
      "invoiceNumber": "INV-202401-00001",
      "amount": 5000,
      "dueDate": "2024-01-27",
      "bookingId": "booking_id"
    }
  ]
}
```

**Workflow:**
1. User navigates to "Pending Payments" dashboard
2. Frontend sends GET to `/payments/pending`
3. Shows all unpaid invoices
4. Allows paying from here
5. Prioritized by due date

---

#### 2.14 Get Payment History
**Endpoint:** `GET /payments/history`
```
Method: GET
Auth Required: YES (USER role)
```

**Response (200 OK):**
```json
{
  "payments": [
    {
      "_id": "payment_id",
      "amount": 5000,
      "status": "PAID",
      "paidDate": "2024-01-25",
      "invoiceNumber": "INV-202401-00001",
      "paymentMethod": "RAZORPAY"
    }
  ]
}
```

**Workflow:**
1. User navigates to "Payment History"
2. Frontend sends GET to `/payments/history`
3. Shows all completed payments
4. Filter by date range/amount
5. Download receipts

---

#### 2.15 Get Payment By ID
**Endpoint:** `GET /payments/:paymentId`
```
Method: GET
Auth Required: YES (USER role)
URL Params: paymentId (required)
```

**Response (200 OK):**
```json
{
  "payment": {
    "_id": "payment_id",
    "userId": "user_id",
    "amount": 5000,
    "status": "PAID",
    "paymentMethod": "RAZORPAY",
    "transactionId": "txn_xxx",
    "paidDate": "2024-01-25",
    "invoiceNumber": "INV-202401-00001"
  }
}
```

**Workflow:**
1. User clicks on payment from history
2. Frontend sends GET to `/payments/:paymentId`
3. Shows detailed payment receipt
4. Download/print option

---

---

## 3. EMPLOYEE ENDPOINTS

### Base URL: `/api/employee`
### Authentication: Required (role: EMPLOYEE)

#### 3.1 Get Employee Profile
**Endpoint:** `GET /profile`
```
Method: GET
Auth Required: YES (EMPLOYEE role)
Headers: Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "_id": "employee_id",
  "username": "emp_user",
  "email": "employee@example.com",
  "phone": "+91-9876543210",
  "showroomId": {
    "_id": "showroom_id",
    "name": "Park Plaza Mumbai"
  },
  "role": "EMPLOYEE",
  "joinDate": "2024-01-01"
}
```

**Workflow:**
1. Employee navigates to profile page
2. Frontend sends GET to `/profile`
3. Shows employee details with assigned showroom
4. Edit button redirects to edit profile page

---

#### 3.2 Update Employee Profile
**Endpoint:** `PUT /profile`
```
Method: PUT
Auth Required: YES (EMPLOYEE role)
```

**Request Body:**
```json
{
  "phone": "+91-9876543211",
  "address": "Employee Address"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "employee": { ... }
}
```

**Workflow:** Same as user profile update

---

#### 3.3 Get Employee Dashboard
**Endpoint:** `GET /dashboard`
```
Method: GET
Auth Required: YES (EMPLOYEE role)
```

**Response (200 OK):**
```json
{
  "stats": {
    "totalBookings": 25,
    "completedBookings": 18,
    "pendingBookings": 5,
    "totalRevenue": 125000,
    "pendingPayments": 2
  },
  "recentBookings": [
    {
      "_id": "booking_id",
      "slotNumber": 5,
      "status": "PENDING",
      "carNumber": "MH-01-AB-1234"
    }
  ]
}
```

**Workflow:**
1. Employee logs in
2. Sees dashboard with overview stats
3. Shows pending tasks count
4. Quick links to pending bookings

---

#### 3.4 Get Showroom Bookings
**Endpoint:** `GET /showrooms/:showroomId/bookings`
```
Method: GET
Auth Required: YES (EMPLOYEE role)
URL Params: showroomId (required)
Query Params: status (optional: PENDING, INSPECTED, INVOICED, COMPLETED)
```

**Response (200 OK):**
```json
{
  "bookings": [
    {
      "_id": "booking_id",
      "slotNumber": 5,
      "status": "PENDING",
      "carDetails": {
        "carBrand": "Honda",
        "carModel": "City",
        "carNumber": "MH-01-AB-1234",
        "carColor": "Silver"
      },
      "user": {
        "name": "John Doe",
        "phone": "+91-9876543210"
      },
      "estimatedCost": 5000,
      "description": "Regular maintenance",
      "bookingDate": "2024-01-20",
      "invoice": {
        "_id": "invoice_id",
        "invoiceNumber": "INV-202401-00001"
      }
    }
  ]
}
```

**Workflow:**
1. Employee navigates to "My Bookings"
2. Frontend sends GET to `/showrooms/:showroomId/bookings`
3. Shows all bookings for their showroom
4. Defaults to PENDING & INSPECTED status
5. Rich cards showing full car & customer details
6. Action buttons to inspect, invoice, mark done

---

#### 3.5 Get Booking Details (Employee View)
**Endpoint:** `GET /bookings/:bookingId`
```
Method: GET
Auth Required: YES (EMPLOYEE role)
URL Params: bookingId (required)
```

**Response (200 OK):**
```json
{
  "booking": {
    "_id": "booking_id",
    "slotNumber": 5,
    "status": "PENDING",
    "userId": "user_id",
    "user": {
      "name": "John Doe",
      "phone": "+91-9876543210",
      "email": "john@example.com"
    },
    "carDetails": { ... },
    "estimatedCost": 5000,
    "description": "Regular maintenance",
    "invoiceId": "invoice_id",
    "paymentId": "payment_id"
  }
}
```

**Workflow:**
1. Employee clicks on booking from list
2. Frontend sends GET to `/bookings/:bookingId`
3. Shows detailed booking with all info
4. Shows invoice & payment status
5. Can proceed with inspection or invoicing

---

#### 3.6 Inspect Car
**Endpoint:** `PUT /bookings/:bookingId/inspect`
```
Method: PUT
Auth Required: YES (EMPLOYEE role)
URL Params: bookingId (required)
```

**Request Body:**
```json
{
  "inspectionNotes": "Car in good condition, minor scratches on hood"
}
```

**Response (200 OK):**
```json
{
  "message": "Car inspected successfully",
  "booking": {
    "_id": "booking_id",
    "status": "INSPECTED",
    "inspectionNotes": "Car in good condition..."
  }
}
```

**Workflow:**
1. Employee views booking details
2. Clicks "Start Inspection"
3. Fills inspection form with notes
4. Clicks "Save Inspection"
5. Frontend sends PUT to `/bookings/:bookingId/inspect`
6. Booking status changes to INSPECTED
7. Now ready to generate invoice

---

#### 3.7 Generate Invoice
**Endpoint:** `POST /bookings/:bookingId/invoice/generate`
```
Method: POST
Auth Required: YES (EMPLOYEE role)
URL Params: bookingId (required)
```

**Request Body:**
```json
{
  "repairCost": 5500,
  "notes": "Work description and parts used"
}
```

**Response (201 Created):**
```json
{
  "message": "Invoice generated successfully",
  "invoice": {
    "_id": "invoice_id",
    "invoiceNumber": "INV-202401-00001",
    "bookingId": "booking_id",
    "amount": 5500,
    "status": "GENERATED",
    "generatedDate": "2024-01-20",
    "pdfUrl": "/invoices/invoice.pdf"
  }
}
```

**Workflow:**
1. Employee clicks "Generate Invoice"
2. Fills repair cost & notes
3. Frontend sends POST to `/bookings/:bookingId/invoice/generate`
4. Backend:
   - Creates invoice document
   - Generates PDF
   - Saves to `/invoices` folder
   - Updates booking status to INVOICED
   - Creates payment record
5. Returns invoice with PDF URL
6. Employee can preview or send to customer

---

#### 3.8 Generate Direct Invoice (Walk-in Repair)
**Endpoint:** `POST /invoice/generate-direct`
```
Method: POST
Auth Required: YES (EMPLOYEE role)
```

**Request Body:**
```json
{
  "username": "customer_name",
  "carBrand": "Honda",
  "carModel": "City",
  "carNumber": "MH-01-AB-1234",
  "repairDescription": "Engine oil change and filter replacement",
  "repairCost": 3500,
  "notes": "Used Castrol 10W-30 oil"
}
```

**Response (201 Created):**
```json
{
  "message": "Direct invoice created successfully",
  "invoice": {
    "_id": "invoice_id",
    "invoiceNumber": "INV-202401-00005",
    "amount": 3500,
    "status": "GENERATED",
    "pdfUrl": "/invoices/invoice.pdf"
  }
}
```

**Workflow:**
1. Customer walks in without booking
2. Employee clicks "Create Walk-in Invoice"
3. Fills customer & service details
4. Frontend sends POST to `/invoice/generate-direct`
5. Backend:
   - Creates booking (without slot)
   - Generates invoice
   - Creates payment record
   - Generates PDF
6. Returns invoice
7. Can print/email to customer immediately

---

#### 3.9 Update Invoice
**Endpoint:** `PUT /invoices/:invoiceId`
```
Method: PUT
Auth Required: YES (EMPLOYEE role)
URL Params: invoiceId (required)
```

**Request Body:**
```json
{
  "amount": 6000,
  "notes": "Updated notes"
}
```

**Response (200 OK):**
```json
{
  "message": "Invoice updated successfully",
  "invoice": { ... }
}
```

**Workflow:**
1. Employee realizes incorrect amount in invoice
2. Clicks "Edit Invoice"
3. Updates amount & notes
4. Clicks "Update"
5. Frontend sends PUT to `/invoices/:invoiceId`
6. Backend updates invoice & regenerates PDF
7. Shows updated version

---

#### 3.10 Get Employee Invoices
**Endpoint:** `GET /invoices`
```
Method: GET
Auth Required: YES (EMPLOYEE role)
```

**Response (200 OK):**
```json
{
  "invoices": [
    {
      "_id": "invoice_id",
      "invoiceNumber": "INV-202401-00001",
      "bookingId": "booking_id",
      "amount": 5500,
      "status": "GENERATED",
      "generatedDate": "2024-01-20",
      "user": {
        "name": "John Doe"
      }
    }
  ]
}
```

**Workflow:**
1. Employee navigates to "Invoices" page
2. Frontend sends GET to `/invoices`
3. Shows all invoices generated by employee
4. Filter by status (GENERATED, ACCEPTED, PAID)
5. Download invoice PDF

---

#### 3.11 Update Booking Status
**Endpoint:** `PUT /bookings/:bookingId/status`
```
Method: PUT
Auth Required: YES (EMPLOYEE role)
URL Params: bookingId (required)
```

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

**Response (200 OK):**
```json
{
  "message": "Booking status updated",
  "booking": {
    "_id": "booking_id",
    "status": "COMPLETED"
  }
}
```

**Workflow:**
1. Employee marks booking as completed
2. Frontend sends PUT to `/bookings/:bookingId/status`
3. Updates booking status
4. Booking now shows as done
5. Slot can be restored (see mark-done endpoint)

---

#### 3.12 Mark Work As Done
**Endpoint:** `PUT /bookings/:bookingId/mark-done`
```
Method: PUT
Auth Required: YES (EMPLOYEE role)
URL Params: bookingId (required)
```

**Request Body:**
```json
{}
```

**Response (200 OK):**
```json
{
  "message": "Work marked as complete",
  "booking": {
    "_id": "booking_id",
    "status": "COMPLETED",
    "slotNumber": 5
  }
}
```

**Workflow:**
1. Employee clicks "Mark Done" on booking
2. Frontend sends PUT to `/bookings/:bookingId/mark-done`
3. Backend:
   - Updates booking status to COMPLETED
   - Updates invoice status to PAID
   - Updates payment status to PAID
   - **Restores slot** (makes it available for new bookings)
4. Removes booking from employee's pending list
5. Shows success message
6. Slot now available for new customer

**Key Point:** This endpoint is critical for slot management. Only when work is truly done do we restore the slot.

---

#### 3.13 Get Showroom Pending Payments
**Endpoint:** `GET /payments/pending`
```
Method: GET
Auth Required: YES (EMPLOYEE role)
```

**Response (200 OK):**
```json
{
  "pendingPayments": [
    {
      "_id": "payment_id",
      "invoiceId": "invoice_id",
      "userId": "user_id",
      "amount": 5500,
      "status": "PENDING",
      "dueDate": "2024-01-27",
      "user": {
        "name": "John Doe"
      }
    }
  ]
}
```

**Workflow:**
1. Employee navigates to "Pending Payments"
2. Frontend sends GET to `/payments/pending`
3. Shows all unpaid invoices for their showroom
4. Can follow up with customers
5. Buttons to mark as paid when received

---

#### 3.14 Mark Payment as Paid (Employee Records Cash)
**Endpoint:** `PUT /payments/:paymentId/mark-paid`
```
Method: PUT
Auth Required: YES (EMPLOYEE role)
URL Params: paymentId (required)
```

**Request Body:**
```json
{
  "paymentMethod": "CASH",
  "notes": "Cash received in person"
}
```

**Response (200 OK):**
```json
{
  "message": "Payment marked as paid",
  "payment": {
    "_id": "payment_id",
    "status": "PAID",
    "paidDate": "2024-01-21",
    "paymentMethod": "CASH"
  }
}
```

**Workflow:**
1. Customer pays in cash at showroom
2. Employee clicks "Record Payment"
3. Selects payment method (CASH, CHEQUE, etc.)
4. Adds notes
5. Frontend sends PUT to `/payments/:paymentId/mark-paid`
6. Backend updates payment status to PAID
7. Receipt generated
8. Payment marked as complete

---

---

## 4. ADMIN ENDPOINTS

### Base URL: `/api/admin`
### Authentication: Required (role: ADMIN)

#### 4.1 Create Showroom
**Endpoint:** `POST /showrooms`
```
Method: POST
Auth Required: YES (ADMIN role)
```

**Request Body:**
```json
{
  "name": "Park Plaza Mumbai",
  "city": "Mumbai",
  "address": "123 Main St, Mumbai, Maharashtra",
  "phone": "+91-9876543210",
  "email": "mumbai@parkplaza.com",
  "latitude": 19.0760,
  "longitude": 72.8479,
  "totalSlots": 50
}
```

**Response (201 Created):**
```json
{
  "message": "Showroom created successfully",
  "showroom": {
    "_id": "showroom_id",
    "name": "Park Plaza Mumbai",
    "city": "Mumbai",
    "availableSlots": 50,
    "totalSlots": 50
  }
}
```

**Workflow:**
1. Admin navigates to "Manage Showrooms"
2. Clicks "Add New Showroom"
3. Fills showroom details
4. Frontend sends POST to `/showrooms`
5. Backend validates & creates showroom
6. Initializes 50 available slots
7. Shows success message

---

#### 4.2 Update Showroom
**Endpoint:** `PUT /showrooms/:showroomId`
```
Method: PUT
Auth Required: YES (ADMIN role)
URL Params: showroomId (required)
```

**Request Body:**
```json
{
  "phone": "+91-9876543211",
  "email": "mumbai-new@parkplaza.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Showroom updated successfully",
  "showroom": { ... }
}
```

**Workflow:**
1. Admin clicks on showroom
2. Updates details
3. Clicks "Save"
4. Frontend sends PUT to `/showrooms/:showroomId`
5. Backend updates showroom document

---

#### 4.3 Get All Showrooms
**Endpoint:** `GET /showrooms`
```
Method: GET
Auth Required: YES (ADMIN role)
```

**Response (200 OK):**
```json
{
  "showrooms": [
    {
      "_id": "showroom_id",
      "name": "Park Plaza Mumbai",
      "city": "Mumbai",
      "totalSlots": 50,
      "availableSlots": 42,
      "phone": "+91-9876543210",
      "employees": 5
    }
  ]
}
```

**Workflow:**
1. Admin navigates to "Showrooms" dashboard
2. Frontend sends GET to `/showrooms`
3. Displays all showrooms with key metrics
4. Can filter by city
5. Edit/Delete buttons for each showroom

---

#### 4.4 Get Showroom Stats
**Endpoint:** `GET /showrooms/:showroomId/stats`
```
Method: GET
Auth Required: YES (ADMIN role)
URL Params: showroomId (required)
```

**Response (200 OK):**
```json
{
  "stats": {
    "totalBookings": 150,
    "completedBookings": 120,
    "pendingBookings": 20,
    "totalRevenue": 750000,
    "averageRating": 4.5,
    "employees": 5,
    "lastMonthBookings": 45
  }
}
```

**Workflow:**
1. Admin clicks on specific showroom
2. Frontend sends GET to `/showrooms/:showroomId/stats`
3. Displays detailed metrics and graphs
4. Shows performance analytics

---

#### 4.5 Create Employee
**Endpoint:** `POST /employees`
```
Method: POST
Auth Required: YES (ADMIN role)
```

**Request Body:**
```json
{
  "username": "emp_user",
  "email": "employee@example.com",
  "password": "employee123",
  "phone": "+91-9876543210",
  "showroomId": "showroom_id"
}
```

**Response (201 Created):**
```json
{
  "message": "Employee created successfully",
  "employee": {
    "_id": "employee_id",
    "username": "emp_user",
    "email": "employee@example.com",
    "showroomId": "showroom_id",
    "role": "EMPLOYEE"
  }
}
```

**Workflow:**
1. Admin navigates to "Manage Employees"
2. Clicks "Add New Employee"
3. Fills employee details & selects showroom
4. Frontend sends POST to `/employees`
5. Backend creates employee account
6. Assigns to showroom
7. Sends welcome email with credentials

---

#### 4.6 Get Employees by Showroom
**Endpoint:** `GET /showrooms/:showroomId/employees`
```
Method: GET
Auth Required: YES (ADMIN role)
URL Params: showroomId (required)
```

**Response (200 OK):**
```json
{
  "employees": [
    {
      "_id": "employee_id",
      "username": "emp_user",
      "email": "employee@example.com",
      "phone": "+91-9876543210",
      "totalBookings": 45,
      "rating": 4.7
    }
  ]
}
```

**Workflow:**
1. Admin views showroom details
2. Frontend sends GET to `/showrooms/:showroomId/employees`
3. Lists all employees assigned to showroom
4. Shows performance metrics
5. Can reassign or remove employees

---

#### 4.7 Get All Users
**Endpoint:** `GET /users`
```
Method: GET
Auth Required: YES (ADMIN role)
Query Params: role (optional), search (optional)
```

**Response (200 OK):**
```json
{
  "users": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "USER",
      "totalBookings": 10,
      "joinDate": "2024-01-01"
    }
  ]
}
```

**Workflow:**
1. Admin navigates to "User Management"
2. Frontend sends GET to `/users`
3. Lists all users in system
4. Can filter by role
5. Search functionality
6. Suspend/Delete user options

---

#### 4.8 Update User Role
**Endpoint:** `PUT /users/:userId/role`
```
Method: PUT
Auth Required: YES (ADMIN role)
URL Params: userId (required)
```

**Request Body:**
```json
{
  "role": "EMPLOYEE",
  "showroomId": "showroom_id"
}
```

**Response (200 OK):**
```json
{
  "message": "User role updated",
  "user": {
    "_id": "user_id",
    "role": "EMPLOYEE"
  }
}
```

**Workflow:**
1. Admin selects user from list
2. Changes role from USER to EMPLOYEE
3. Assigns to showroom
4. Frontend sends PUT to `/users/:userId/role`
5. User can now log in as employee

---

#### 4.9 Create User Invoice (Manual)
**Endpoint:** `POST /invoices`
```
Method: POST
Auth Required: YES (ADMIN role)
```

**Request Body:**
```json
{
  "userId": "user_id",
  "bookingId": "booking_id",
  "amount": 7500,
  "description": "Additional repairs"
}
```

**Response (201 Created):**
```json
{
  "message": "Invoice created successfully",
  "invoice": {
    "_id": "invoice_id",
    "invoiceNumber": "INV-202401-00010",
    "amount": 7500
  }
}
```

**Workflow:**
1. Admin needs to create invoice for specific user
2. Fills invoice details
3. Frontend sends POST to `/invoices`
4. Creates manual invoice
5. User gets notification

---

#### 4.10 Get All Pending Payments
**Endpoint:** `GET /payments/pending`
```
Method: GET
Auth Required: YES (ADMIN role)
```

**Response (200 OK):**
```json
{
  "pendingPayments": [
    {
      "_id": "payment_id",
      "invoiceNumber": "INV-202401-00001",
      "userId": "user_id",
      "amount": 5500,
      "dueDate": "2024-01-27",
      "daysOverdue": 2,
      "user": {
        "name": "John Doe",
        "phone": "+91-9876543210"
      }
    }
  ]
}
```

**Workflow:**
1. Admin navigates to "Pending Payments"
2. Frontend sends GET to `/payments/pending`
3. Shows all unpaid invoices system-wide
4. Highlights overdue payments
5. Can follow up with customers

---

#### 4.11 Get Payment History
**Endpoint:** `GET /payments/history`
```
Method: GET
Auth Required: YES (ADMIN role)
Query Params: startDate, endDate, showroomId (optional)
```

**Response (200 OK):**
```json
{
  "payments": [
    {
      "_id": "payment_id",
      "amount": 5500,
      "status": "PAID",
      "paidDate": "2024-01-21",
      "paymentMethod": "RAZORPAY",
      "userId": "user_id",
      "invoiceNumber": "INV-202401-00001"
    }
  ]
}
```

**Workflow:**
1. Admin navigates to "Payment History"
2. Frontend sends GET to `/payments/history`
3. Shows all paid payments
4. Can filter by date range & showroom
5. Export to CSV/PDF for accounting

---

#### 4.12 Mark Payment as Paid (Admin)
**Endpoint:** `PUT /payments/:paymentId/mark-paid`
```
Method: PUT
Auth Required: YES (ADMIN role)
URL Params: paymentId (required)
```

**Request Body:**
```json
{
  "paymentMethod": "CHEQUE",
  "transactionId": "CHQ-12345"
}
```

**Response (200 OK):**
```json
{
  "message": "Payment marked as paid",
  "payment": {
    "_id": "payment_id",
    "status": "PAID"
  }
}
```

**Workflow:**
1. Admin receives payment proof from showroom
2. Manually marks payment as received
3. Frontend sends PUT to `/payments/:paymentId/mark-paid`
4. Backend records payment
5. Receipt generated

---

#### 4.13 Get Admin Dashboard
**Endpoint:** `GET /dashboard`
```
Method: GET
Auth Required: YES (ADMIN role)
```

**Response (200 OK):**
```json
{
  "stats": {
    "totalBookings": 500,
    "completedBookings": 450,
    "pendingBookings": 30,
    "totalRevenue": 2500000,
    "pendingPayments": 15,
    "totalUsers": 200,
    "totalEmployees": 25,
    "totalShowrooms": 5
  },
  "topShowrooms": [
    {
      "name": "Park Plaza Mumbai",
      "bookings": 150,
      "revenue": 750000
    }
  ],
  "recentPayments": [ ... ],
  "recentBookings": [ ... ]
}
```

**Workflow:**
1. Admin logs in
2. Frontend sends GET to `/dashboard`
3. Displays complete system overview
4. Quick stats & graphs
5. Recent activity feed

---

---

## 5. PRODUCT ENDPOINTS

### Base URL: `/api/products`
### Most routes are public (no auth required)

#### 5.1 Get All Products
**Endpoint:** `GET /`
```
Method: GET
Auth Required: NO
Query Params: category (optional), search (optional), page (optional)
```

**Response (200 OK):**
```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "Engine Oil 10W-30",
      "description": "High-quality engine oil",
      "price": 500,
      "category": "OILS",
      "stock": 100,
      "image": "url"
    }
  ],
  "total": 50
}
```

**Workflow:**
1. User navigates to "Shop" page
2. Frontend sends GET to `/products`
3. Displays product list
4. Pagination for performance
5. Filter by category

---

#### 5.2 Get Featured Products
**Endpoint:** `GET /featured`
```
Method: GET
Auth Required: NO
```

**Response (200 OK):**
```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "Premium Oil Change Kit",
      "price": 1200,
      "featured": true,
      "image": "url"
    }
  ]
}
```

**Workflow:**
1. User lands on home page
2. Frontend sends GET to `/featured`
3. Shows recommended products
4. Quick shopping section

---

#### 5.3 Get Product Categories
**Endpoint:** `GET /categories`
```
Method: GET
Auth Required: NO
```

**Response (200 OK):**
```json
{
  "categories": ["OILS", "FILTERS", "PARTS", "ACCESSORIES"]
}
```

**Workflow:**
1. Product filter component loads
2. Frontend sends GET to `/categories`
3. Displays category filter options
4. Users filter products by category

---

#### 5.4 Get Product by ID
**Endpoint:** `GET /:productId`
```
Method: GET
Auth Required: NO
URL Params: productId (required)
```

**Response (200 OK):**
```json
{
  "product": {
    "_id": "product_id",
    "name": "Engine Oil 10W-30",
    "description": "High-quality mineral engine oil",
    "price": 500,
    "category": "OILS",
    "stock": 100,
    "specifications": { ... },
    "image": "url",
    "reviews": [ ... ]
  }
}
```

**Workflow:**
1. User clicks product from list
2. Frontend sends GET to `/products/:productId`
3. Shows detailed product page
4. Add to cart button available
5. Shows reviews & ratings

---

#### 5.5 Create Product (Admin Only)
**Endpoint:** `POST /`
```
Method: POST
Auth Required: YES (ADMIN role)
```

**Request Body:**
```json
{
  "name": "Engine Oil 10W-30",
  "description": "High-quality engine oil",
  "price": 500,
  "category": "OILS",
  "stock": 100,
  "image": "base64_or_url"
}
```

**Response (201 Created):**
```json
{
  "message": "Product created successfully",
  "product": { ... }
}
```

**Workflow:**
1. Admin navigates to "Product Management"
2. Clicks "Add Product"
3. Fills product details
4. Frontend sends POST to `/products`
5. Backend validates & creates product
6. Product available for purchase

---

#### 5.6 Update Product (Admin Only)
**Endpoint:** `PUT /:productId`
```
Method: PUT
Auth Required: YES (ADMIN role)
URL Params: productId (required)
```

**Request Body:**
```json
{
  "price": 550,
  "stock": 95,
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "message": "Product updated successfully",
  "product": { ... }
}
```

**Workflow:**
1. Admin clicks on product
2. Updates details (price, stock, etc.)
3. Clicks "Save"
4. Frontend sends PUT to `/products/:productId`
5. Backend updates product document

---

#### 5.7 Delete Product (Admin Only)
**Endpoint:** `DELETE /:productId`
```
Method: DELETE
Auth Required: YES (ADMIN role)
URL Params: productId (required)
```

**Response (200 OK):**
```json
{
  "message": "Product deleted successfully"
}
```

**Workflow:**
1. Admin clicks delete on product
2. Confirmation modal appears
3. Frontend sends DELETE to `/products/:productId`
4. Backend removes product
5. Product no longer available

---

---

## 6. CART ENDPOINTS

### Base URL: `/api/cart`
### Authentication: Required (User must be logged in)

#### 6.1 Get Cart
**Endpoint:** `GET /`
```
Method: GET
Auth Required: YES
```

**Response (200 OK):**
```json
{
  "cart": {
    "_id": "cart_id",
    "userId": "user_id",
    "items": [
      {
        "productId": "product_id",
        "product": {
          "name": "Engine Oil 10W-30",
          "price": 500,
          "image": "url"
        },
        "quantity": 2,
        "total": 1000
      }
    ],
    "totalItems": 1,
    "totalPrice": 1000
  }
}
```

**Workflow:**
1. User navigates to "Cart" page
2. Frontend sends GET to `/cart`
3. Displays all items in cart
4. Shows subtotal, tax, total
5. Shows checkout button

---

#### 6.2 Add to Cart
**Endpoint:** `POST /add`
```
Method: POST
Auth Required: YES
```

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "message": "Item added to cart",
  "cart": { ... }
}
```

**Workflow:**
1. User clicks "Add to Cart" on product
2. Frontend sends POST to `/cart/add`
3. Backend adds item to user's cart
4. If product already in cart, increases quantity
5. Shows success message
6. Updates cart icon with count

---

#### 6.3 Update Cart Item
**Endpoint:** `PUT /update`
```
Method: PUT
Auth Required: YES
```

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 5
}
```

**Response (200 OK):**
```json
{
  "message": "Cart updated",
  "cart": { ... }
}
```

**Workflow:**
1. User updates quantity in cart
2. Frontend sends PUT to `/cart/update`
3. Backend updates item quantity
4. Recalculates totals
5. Displays updated cart

---

#### 6.4 Remove from Cart
**Endpoint:** `DELETE /remove/:productId`
```
Method: DELETE
Auth Required: YES
URL Params: productId (required)
```

**Response (200 OK):**
```json
{
  "message": "Item removed from cart",
  "cart": { ... }
}
```

**Workflow:**
1. User clicks "Remove" on item
2. Frontend sends DELETE to `/cart/remove/:productId`
3. Backend removes item from cart
4. Recalculates totals
5. Updates display

---

#### 6.5 Clear Cart
**Endpoint:** `DELETE /clear`
```
Method: DELETE
Auth Required: YES
```

**Response (200 OK):**
```json
{
  "message": "Cart cleared successfully",
  "cart": {
    "items": [],
    "totalPrice": 0
  }
}
```

**Workflow:**
1. User clicks "Clear Cart"
2. Confirmation modal
3. Frontend sends DELETE to `/cart/clear`
4. Backend clears all items
5. Cart is now empty

---

---

## 7. ORDER ENDPOINTS

### Base URL: `/api/orders`
### Authentication: Required

#### 7.1 Create Order
**Endpoint:** `POST /`
```
Method: POST
Auth Required: YES
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 500
    }
  ],
  "shippingAddress": "123 Main St, Mumbai",
  "paymentMethod": "RAZORPAY"
}
```

**Response (201 Created):**
```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "order_id",
    "orderNumber": "ORD-202401-00001",
    "totalAmount": 1000,
    "status": "PENDING",
    "items": [ ... ],
    "createdAt": "2024-01-20"
  }
}
```

**Workflow:**
1. User clicks "Checkout" from cart
2. Frontend displays order summary
3. User fills shipping address
4. Selects payment method
5. Clicks "Place Order"
6. Frontend sends POST to `/orders`
7. Backend:
   - Creates order document
   - Links to cart items
   - Sets order status to PENDING
   - Creates payment order
8. Returns order details
9. Redirects to payment page

---

#### 7.2 Verify Order Payment
**Endpoint:** `POST /verify-payment`
```
Method: POST
Auth Required: YES
```

**Request Body:**
```json
{
  "orderId": "order_id",
  "razorpayOrderId": "order_id_from_razorpay",
  "razorpayPaymentId": "pay_id",
  "razorpaySignature": "signature"
}
```

**Response (200 OK):**
```json
{
  "message": "Payment verified successfully",
  "order": {
    "_id": "order_id",
    "status": "CONFIRMED",
    "paymentStatus": "PAID"
  }
}
```

**Workflow:**
1. Razorpay payment completes
2. Frontend receives payment details
3. Sends POST to `/orders/verify-payment`
4. Backend validates Razorpay signature
5. Updates order status to CONFIRMED
6. Updates payment status to PAID
7. Clears cart
8. Frontend: Shows order confirmation page
9. Sends order confirmation email

---

#### 7.3 Get My Orders
**Endpoint:** `GET /`
```
Method: GET
Auth Required: YES
Query Params: status (optional), page (optional)
```

**Response (200 OK):**
```json
{
  "orders": [
    {
      "_id": "order_id",
      "orderNumber": "ORD-202401-00001",
      "totalAmount": 1000,
      "status": "CONFIRMED",
      "createdAt": "2024-01-20",
      "itemCount": 2
    }
  ]
}
```

**Workflow:**
1. User navigates to "My Orders"
2. Frontend sends GET to `/orders`
3. Shows all orders for logged-in user
4. Can filter by status (PENDING, CONFIRMED, SHIPPED, DELIVERED)
5. Shows most recent orders first

---

#### 7.4 Get Order Details
**Endpoint:** `GET /:orderId`
```
Method: GET
Auth Required: YES
URL Params: orderId (required)
```

**Response (200 OK):**
```json
{
  "order": {
    "_id": "order_id",
    "orderNumber": "ORD-202401-00001",
    "userId": "user_id",
    "items": [
      {
        "productId": "product_id",
        "product": {
          "name": "Engine Oil",
          "price": 500
        },
        "quantity": 2,
        "total": 1000
      }
    ],
    "totalAmount": 1000,
    "status": "CONFIRMED",
    "shippingAddress": "123 Main St",
    "paymentStatus": "PAID",
    "trackingNumber": "TRACK-123",
    "createdAt": "2024-01-20",
    "estimatedDelivery": "2024-01-25"
  }
}
```

**Workflow:**
1. User clicks on order from list
2. Frontend sends GET to `/orders/:orderId`
3. Shows detailed order page
4. Item breakdown with prices
5. Tracking information
6. Payment receipt download

---

#### 7.5 Cancel Order
**Endpoint:** `PUT /:orderId/cancel`
```
Method: PUT
Auth Required: YES
URL Params: orderId (required)
```

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response (200 OK):**
```json
{
  "message": "Order cancelled successfully",
  "order": {
    "_id": "order_id",
    "status": "CANCELLED",
    "refundAmount": 1000
  }
}
```

**Workflow:**
1. User clicks "Cancel Order"
2. Selects reason for cancellation
3. Frontend sends PUT to `/orders/:orderId/cancel`
4. Backend:
   - Validates order can be cancelled (not shipped)
   - Updates status to CANCELLED
   - Initiates refund
   - Restores product stock
5. Frontend shows refund details
6. User receives refund email
7. Refund processed in 3-5 business days

---

---

## 8. PAYMENT ENDPOINTS

### Base URL: `/api/payments`
### Authentication: Required

#### 8.1 Record Manual Cash Payment
**Endpoint:** `POST /manual`
```
Method: POST
Auth Required: YES (Any authenticated user)
```

**Request Body:**
```json
{
  "invoiceId": "invoice_id",
  "amount": 5500,
  "paymentMethod": "CASH",
  "notes": "Paid in person at showroom"
}
```

**Response (201 Created):**
```json
{
  "message": "Cash payment recorded successfully",
  "payment": {
    "_id": "payment_id",
    "status": "PAID",
    "transactionId": "CASH-12345",
    "paidDate": "2024-01-21"
  }
}
```

**Workflow:**
1. Employee receives cash payment
2. Clicks "Record Payment"
3. Selects invoice & payment method
4. Frontend sends POST to `/payments/manual`
5. Backend creates payment record
6. Updates invoice status to PAID
7. Updates booking status (if applicable)
8. Generates receipt
9. Shows confirmation to employee

---

---

## COMPLETE FLOW EXAMPLES

### Example 1: User Books Service to Completion

```
1. User Registration
   ├─ POST /api/auth/register
   ├─ Verify Email (GET /api/auth/verify-email)
   └─ Account Created

2. User Login
   ├─ POST /api/auth/login-user
   ├─ Get Tokens (access + refresh)
   └─ Redirect to Dashboard

3. Search Showroom
   ├─ GET /api/user/showrooms/nearby (with location)
   │  OR
   ├─ GET /api/user/showrooms/city?city=Mumbai
   └─ Display showrooms

4. Book Service
   ├─ POST /api/user/bookings
   ├─ Slot Assigned (1-50)
   ├─ Invoice Auto-Created
   ├─ Payment Record Auto-Created
   └─ Success Modal with Slot #

5. Accept Invoice
   ├─ GET /api/user/invoices (to see invoice)
   ├─ POST /api/user/invoices/:invoiceId/accept
   └─ Invoice Status → ACCEPTED

6. Pay Invoice
   ├─ POST /api/user/payments/:invoiceId/order (Razorpay)
   ├─ User enters card/UPI
   ├─ Razorpay processes payment
   ├─ POST /api/user/payments/:invoiceId/verify (verify signature)
   └─ Invoice Status → PAID

7. Track Booking
   ├─ GET /api/user/bookings (to see booking status)
   ├─ GET /api/user/bookings/:bookingId (detailed view)
   └─ Once COMPLETED, slot becomes available again
```

### Example 2: Employee Completes Work

```
1. Employee Login
   ├─ POST /api/auth/login-employee
   └─ Get Tokens

2. See Pending Bookings
   ├─ GET /api/employee/showrooms/:showroomId/bookings
   └─ Display all pending tasks

3. Inspect Car
   ├─ PUT /api/employee/bookings/:bookingId/inspect
   ├─ Add inspection notes
   └─ Status → INSPECTED

4. Generate Invoice
   ├─ POST /api/employee/bookings/:bookingId/invoice/generate
   ├─ Enter repair cost & notes
   ├─ PDF Generated
   ├─ Payment Record Created
   └─ Status → INVOICED

5. Mark Work Done
   ├─ PUT /api/employee/bookings/:bookingId/mark-done
   ├─ Booking Status → COMPLETED
   ├─ Invoice Status → PAID
   ├─ Payment Status → PAID
   ├─ **Slot Restored** (1-50 now has 1 more available)
   └─ Removed from pending list

6. Record Cash Payment (if paid in cash)
   ├─ PUT /api/employee/payments/:paymentId/mark-paid
   ├─ Payment Method: CASH
   └─ Receipt Generated
```

### Example 3: Admin Manages System

```
1. Admin Login
   ├─ POST /api/auth/login (or separate admin login)
   └─ Get Admin Tokens

2. View Dashboard
   ├─ GET /api/admin/dashboard
   └─ Overall system statistics

3. Manage Showrooms
   ├─ GET /api/admin/showrooms
   ├─ POST /api/admin/showrooms (create new)
   ├─ PUT /api/admin/showrooms/:showroomId (update)
   └─ GET /api/admin/showrooms/:showroomId/stats (view metrics)

4. Manage Employees
   ├─ POST /api/admin/employees (create)
   ├─ GET /api/admin/showrooms/:showroomId/employees (list)
   └─ PUT /api/users/:userId/role (convert user to employee)

5. Manage Payments
   ├─ GET /api/admin/payments/pending (follow up on unpaid)
   ├─ GET /api/admin/payments/history (accounting)
   └─ PUT /api/admin/payments/:paymentId/mark-paid (manual record)
```

---

## KEY WORKFLOW PATTERNS

### Pattern 1: Authentication & Token Management
```
Login → Access Token (15 min) + Refresh Token (7 days)
  ↓
If 401 Error → Auto-refresh token
  ↓
Retry Request with New Token
  ↓
User continues without re-login (until refresh token expires)
```

### Pattern 2: Booking Lifecycle
```
PENDING (new booking)
   ↓
INSPECTED (employee inspects car)
   ↓
INVOICED (employee generates invoice)
   ↓
COMPLETED (employee marks done, slot restored)
```

### Pattern 3: Invoice & Payment Lifecycle
```
GENERATED (auto-created with booking)
   ↓
ACCEPTED (user accepts invoice)
   ↓
PAID (payment processed or recorded)
```

### Pattern 4: Slot Management
```
Create Booking → Assign Slot (1-50)
                      ↓
Mark Work Done → Restore Slot (available again)
```

---

## SUMMARY TABLE

| Role | Main Tasks | Key Endpoints |
|------|-----------|---|
| **User** | Book service, pay invoices, track bookings | `/api/user/bookings`, `/api/user/invoices`, `/api/user/payments` |
| **Employee** | View bookings, inspect cars, generate invoices, record payments | `/api/employee/bookings`, `/api/employee/invoices`, `/api/employee/payments` |
| **Admin** | Manage showrooms, employees, users, view system stats | `/api/admin/showrooms`, `/api/admin/employees`, `/api/admin/dashboard` |
| **Public** | View products | `/api/products` |

---

Now you have complete documentation of all endpoints with workflows. You can modify any endpoint, add new ones, or change workflows based on your requirements!
