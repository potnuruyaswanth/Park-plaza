# Register & Invoice Generation Fixes

## Issues Fixed

### 1. **Employee Registration Issue**
**Problem:** Registration form only allowed "USER" role. Showroom workers couldn't register themselves as employees.

**Solution:**
- Updated [Register.jsx](client/src/pages/Register.jsx) to include both "Customer" and "Showroom Employee" role options
- When employee role is selected, a showroom selection dropdown appears (required field)
- Added `useEffect` to fetch available showrooms from the server
- Updated form submission logic to validate showroomId for employees

**Files Modified:**
- [client/src/pages/Register.jsx](client/src/pages/Register.jsx)

### 2. **Backend Registration Controller**
**Problem:** Server wasn't validating or accepting showroomId during employee registration.

**Solution:**
- Updated [authController.js](server/src/controllers/authController.js) to:
  - Accept `showroomId` from registration form for employees
  - Validate that showroom exists before creating employee
  - Assign showroomId to user record for employees
  - Users (customers) don't get a showroom assigned

**Files Modified:**
- [server/src/controllers/authController.js](server/src/controllers/authController.js)

### 3. **Public Showroom Fetch Endpoint**
**Problem:** Client couldn't fetch list of showrooms during registration (required auth).

**Solution:**
- Added public endpoint `GET /auth/showrooms` in [authController.js](server/src/controllers/authController.js)
- Created `getShowroomsForRegistration()` function
- Registered route in [authRoutes.js](server/src/routes/authRoutes.js)
- Updated client to use `/auth/showrooms` instead of `/admin/showrooms`

**Files Modified:**
- [server/src/controllers/authController.js](server/src/controllers/authController.js)
- [server/src/routes/authRoutes.js](server/src/routes/authRoutes.js)
- [client/src/pages/Register.jsx](client/src/pages/Register.jsx)

### 4. **Invoice Generation for Users**
**Problem:** No way to generate invoices for users except through booking flow (limited use case).

**Solution:**
- Added new admin endpoint `POST /admin/invoices` to generate invoices directly
- Created `createUserInvoice()` function in [adminController.js](server/src/controllers/adminController.js)
- Allows admin/employees to create invoices with:
  - userId (required - who the invoice is for)
  - showroomId (required - which showroom)
  - items, costs, taxes, discounts
  - Optional bookingId (if linked to a booking)
- Automatically calculates total amount and updates booking status if provided

**Files Modified:**
- [server/src/controllers/adminController.js](server/src/controllers/adminController.js)
- [server/src/routes/adminRoutes.js](server/src/routes/adminRoutes.js)

## How to Use

### For Showroom Workers:
1. Go to Register page
2. Select "Showroom Employee" role
3. Choose your showroom from the dropdown
4. Complete registration

### For Admins (Creating Invoices):
**API Endpoint:** `POST /api/admin/invoices`

**Request Body:**
```json
{
  "userId": "user_id_here",
  "showroomId": "showroom_id_here",
  "itemsDescription": [
    {
      "description": "Oil Change",
      "quantity": 1,
      "unitPrice": 500,
      "amount": 500
    }
  ],
  "partsCost": 1000,
  "laborCost": 1500,
  "tax": 400,
  "discount": 200,
  "bookingId": "booking_id_optional",
  "notes": "Service performed on 2026-02-10"
}
```

**Response:**
```json
{
  "message": "Invoice created successfully",
  "invoice": {
    "_id": "invoice_id",
    "invoiceNumber": "INV-202602-00001",
    "totalAmount": 3200,
    "status": "GENERATED",
    "userId": "user_id",
    "showroomId": "showroom_id",
    ...
  }
}
```

## Related Fix
Previous fix for invalid invoice ID validation has been applied. Now when users try to record cash payment with invalid invoice ID, they get a clear error message instead of a crash.
