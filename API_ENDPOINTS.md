# API Endpoints Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "USER", // or "EMPLOYEE", "ADMIN"
  "showroomId": "showroom_id", // Required for EMPLOYEE role
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

---

### POST /api/auth/login
Login with username OR email and password.

**Request Body:**
```json
{
  "emailOrUsername": "johndoe", // or "john@example.com"
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

---

### GET /api/auth/check-username
Check if username is available.

**Query Parameters:**
- `username`: The username to check

**Response:**
```json
{
  "available": true,
  "message": "Username is available"
}
```

---

## User Profile Endpoints

### GET /api/user/profile
Get current user's profile (requires authentication).

**Response:**
```json
{
  "message": "Profile fetched successfully",
  "user": {
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": { ... },
    "role": "USER",
    ...
  }
}
```

---

### PUT /api/user/profile
Update user profile (requires authentication).

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "9999999999",
  "address": {
    "street": "456 New St",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "country": "India"
  },
  "profileImage": "url_to_image"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## Payment Endpoints (User)

### GET /api/user/payments/pending
Get all pending payments for the current user.

**Response:**
```json
{
  "message": "Pending payments fetched successfully",
  "count": 2,
  "payments": [
    {
      "_id": "payment_id",
      "amount": 1200,
      "status": "PENDING",
      "invoiceId": { ... },
      "bookingId": { ... },
      "showroomId": { ... }
    }
  ]
}
```

---

### GET /api/user/payments/history
Get payment history for the current user.

**Response:**
```json
{
  "message": "Payment history fetched successfully",
  "count": 10,
  "payments": [ ... ]
}
```

---

### GET /api/user/payments/:paymentId
Get details of a specific payment.

**Response:**
```json
{
  "message": "Payment details fetched successfully",
  "payment": { ... }
}
```

---

### POST /api/user/payments/:invoiceId/order
Create a payment order for an invoice (Razorpay integration).

**Response:**
```json
{
  "message": "Payment order created successfully",
  "razorpayOrderId": "order_id",
  "amount": 1200,
  "paymentId": "payment_id",
  "keyId": "razorpay_key"
}
```

---

### POST /api/user/payments/verify
Verify payment after Razorpay payment.

**Request Body:**
```json
{
  "razorpayOrderId": "order_id",
  "razorpayPaymentId": "payment_id",
  "razorpaySignature": "signature",
  "paymentId": "payment_id"
}
```

---

## E-Commerce Endpoints

### GET /api/products
Get all products with filtering and pagination.

**Query Parameters:**
- `category`: Filter by category
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `search`: Search term
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sort`: Sort field (default: '-createdAt')
- `featured`: 'true' for featured products only

**Response:**
```json
{
  "message": "Products fetched successfully",
  "products": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 100,
    "productsPerPage": 20
  }
}
```

---

### GET /api/products/featured
Get featured products.

**Response:**
```json
{
  "message": "Featured products fetched successfully",
  "products": [ ... ]
}
```

---

### GET /api/products/categories
Get all product categories.

**Response:**
```json
{
  "message": "Categories fetched successfully",
  "categories": [
    { "value": "ENGINE_PARTS", "label": "Engine Parts" },
    { "value": "TIRES", "label": "Tires & Wheels" },
    ...
  ]
}
```

---

### GET /api/products/:productId
Get details of a specific product.

**Response:**
```json
{
  "message": "Product fetched successfully",
  "product": {
    "name": "Premium Engine Oil",
    "description": "...",
    "price": 1200,
    "stock": 50,
    ...
  }
}
```

---

## Cart Endpoints

### GET /api/cart
Get user's cart (requires authentication).

**Response:**
```json
{
  "message": "Cart fetched successfully",
  "cart": {
    "items": [
      {
        "product": { ... },
        "quantity": 2
      }
    ]
  },
  "total": 2400
}
```

---

### POST /api/cart/add
Add item to cart.

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

---

### PUT /api/cart/update
Update cart item quantity.

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 3
}
```

---

### DELETE /api/cart/remove/:productId
Remove item from cart.

---

### DELETE /api/cart/clear
Clear all items from cart.

---

## Order Endpoints

### POST /api/orders
Create order from cart.

**Request Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "phone": "9876543210"
  },
  "paymentMethod": "RAZORPAY" // or "CASH_ON_DELIVERY"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": { ... },
  "razorpayOrderId": "order_id",
  "keyId": "razorpay_key"
}
```

---

### POST /api/orders/verify-payment
Verify order payment.

**Request Body:**
```json
{
  "orderId": "order_id",
  "razorpayOrderId": "razorpay_order_id",
  "razorpayPaymentId": "payment_id",
  "razorpaySignature": "signature"
}
```

---

### GET /api/orders
Get user's orders.

**Response:**
```json
{
  "message": "Orders fetched successfully",
  "count": 5,
  "orders": [ ... ]
}
```

---

### GET /api/orders/:orderId
Get order details.

**Response:**
```json
{
  "message": "Order fetched successfully",
  "order": { ... }
}
```

---

### PUT /api/orders/:orderId/cancel
Cancel an order.

---

## Admin Endpoints

### GET /api/admin/payments/pending
Get all pending payments (with optional showroom filter).

**Query Parameters:**
- `showroomId`: Filter by showroom

**Response:**
```json
{
  "message": "Pending payments fetched successfully",
  "count": 10,
  "payments": [ ... ]
}
```

---

### PUT /api/admin/payments/:paymentId/mark-paid
Mark a payment as paid (for cash payments).

**Response:**
```json
{
  "message": "Payment marked as paid successfully",
  "payment": { ... }
}
```

---

### GET /api/admin/payments/history
Get payment history with filters.

**Query Parameters:**
- `showroomId`: Filter by showroom
- `status`: Filter by status
- `startDate`: Start date
- `endDate`: End date

**Response:**
```json
{
  "message": "Payment history fetched successfully",
  "count": 50,
  "totalRevenue": 125000,
  "payments": [ ... ]
}
```

---

## Employee Endpoints

### GET /api/employee/payments/pending
Get pending payments for employee's showroom.

**Response:**
```json
{
  "message": "Pending payments fetched successfully",
  "count": 5,
  "payments": [ ... ]
}
```

---

### PUT /api/employee/payments/:paymentId/mark-paid
Mark payment as paid (employee can only mark payments for their showroom).

**Response:**
```json
{
  "message": "Payment marked as paid successfully",
  "payment": { ... }
}
```

---

## Showroom Endpoints

### GET /api/user/showrooms/nearby
Search for nearby showrooms.

**Query Parameters:**
- `lat`: Latitude
- `lng`: Longitude
- `radiusKm`: Search radius in kilometers (default: 10)

**Response:**
```json
{
  "message": "Nearby showrooms fetched successfully",
  "count": 3,
  "showrooms": [
    {
      "name": "Downtown Auto Plaza",
      "address": "123 Main Street",
      "city": "Mumbai",
      "distance": 2.5,
      ...
    }
  ]
}
```

---

## Authentication Headers

All protected endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created successfully
- `400`: Bad request (validation error)
- `401`: Unauthorized (invalid or missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found
- `500`: Internal server error
