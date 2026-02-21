# Park Plaza - Complete Features Documentation

## Overview
Park Plaza is a comprehensive smart parking and vehicle service management system with integrated e-commerce functionality for car parts and accessories.

---

## 🔐 Authentication & User Management

### Username-based Authentication
- **Unique Username**: Every user must choose a unique username during registration
- **Real-time Username Validation**: System checks username availability as you type
- **Flexible Login**: Users can log in with either username OR email
- **Error Messages**: Clear feedback if username is already taken: "Username already taken. Please choose a different username."

### User Registration
- **Required Fields**:
  - Username (unique, 3-30 characters, alphanumeric + underscore)
  - Full Name
  - Email (unique)
  - Phone Number (10 digits)
  - Password (minimum 6 characters)
  - Role (USER, EMPLOYEE, ADMIN)
  
- **Optional Fields**:
  - Address (street, city, state, ZIP code, country)
  - Showroom ID (required for EMPLOYEE role)

### User Roles
1. **USER** - Regular customers
2. **EMPLOYEE** - Showroom staff
3. **ADMIN** - System administrators

---

## 👤 User Profile Management

### View Profile (`/profile`)
- **Read-only profile page** displaying:
  - Profile picture/avatar (initials)
  - Username
  - Full name
  - Email
  - Phone number
  - Complete address
  - Account status (Active/Inactive)
  - Member since date
  - Last updated date
  - Assigned showroom (for employees)

### Edit Profile (`/profile/edit`)
- **Editable fields**:
  - Full name
  - Phone number
  - Complete address (street, city, state, ZIP, country)
  - Profile image
- **Save functionality**: Changes only saved when "Save" button is clicked
- **Cancel option**: Discard changes and return to profile view

### Profile Dropdown (Top Right Corner)
Accessible from any page when logged in:
- **Username display**: @username
- **Email display**: user@email.com
- **Quick Actions**:
  - 📊 Dashboard
  - 👤 View Profile
  - ✏️ Edit Profile
  - 📦 My Orders
  - 🚪 Logout

---

## 💳 Payment Management System

### Pending Payments (`/payments/pending`)

#### For Regular Users:
- **Payment List Display**:
  - Payment ID (last 8 characters)
  - Status badge (PENDING)
  - Invoice number
  - Amount in ₹
  - Showroom name
  - Service type
  - Creation date & time

- **Payment Actions**:
  - **💳 Pay Now**: 
    - Integrated with online payment gateway (Razorpay)
    - Supports credit/debit cards, UPI, net banking
    - For now, offline payments also supported
  - **👁️ View Details**: See complete payment information

#### For Admin/Employee:
- **View Pending Payments**: See all pending payments for their showroom
- **Mark as Paid**: 
  - For cash payments received offline
  - Updates payment status to SUCCESS
  - Updates invoice and booking status
  - Removes from pending payments list
  - Adds amount to database revenue tracking
  - Creates audit trail with employee/admin ID

### Payment Status Flow:
1. **PENDING** → User needs to pay
2. **SUCCESS** → Payment completed
3. **FAILED** → Payment failed
4. **REFUNDED** → Payment refunded

### Payment Tracking:
- All payments tracked in database
- Payment method recorded (RAZORPAY, UPI, CARD, NET_BANKING, CASH)
- Transaction IDs stored
- Payment date & time logged
- Audit trail for admin actions

---

## 🛒 E-Commerce Platform

### Car Parts Shop (`/shop`)

#### Product Categories:
- 🔧 Engine Parts
- 🛞 Tires & Wheels
- 🔋 Batteries
- 🛑 Brakes
- 🛢️ Oils & Fluids
- ✨ Accessories
- ⚡ Electrical
- 🔩 Suspension
- 🚗 Body Parts
- 📦 Other

#### Features:
- **Search Functionality**: Search products by name, description, or tags
- **Category Filter**: Filter products by category
- **Price Display**: 
  - Current price
  - Original price (if discounted)
  - Discount indicator
- **Stock Status**: Real-time stock availability
- **Featured Products**: Highlighted special products
- **Product Grid**: Responsive grid layout
- **Pagination**: Navigate through product pages
- **Add to Cart**: One-click add to shopping cart
- **View Details**: See full product specifications

#### Product Information:
- Product name & description
- Brand
- Price (with discount if applicable)
- Stock availability
- SKU (Stock Keeping Unit)
- Specifications
- Compatibility (make, model, year)
- Images (multiple images supported)
- Rating & review count

### Shopping Cart (`/cart`)
- View all cart items
- Update quantities
- Remove items
- See total price
- Proceed to checkout

### Orders (`/orders`)
- Create orders from cart
- Choose shipping address
- Select payment method (Online/COD)
- Track order status
- View order history
- Cancel orders (if not shipped)

#### Order Status Flow:
1. **PENDING** → Order placed
2. **CONFIRMED** → Payment verified
3. **PROCESSING** → Being prepared
4. **SHIPPED** → On the way
5. **DELIVERED** → Completed
6. **CANCELLED** → Cancelled by user

---

## 📍 Showroom Location Features

### Find Nearby Showrooms
- **Location-based Search**:
  - Enter your location (latitude/longitude)
  - Set search radius (default: 10km)
  - See distance to each showroom
  - Results sorted by proximity

### Showroom Information:
- Name
- Complete address
- City
- Phone number
- Operating hours
- Available parking slots
- Total parking capacity
- Facilities available:
  - WiFi
  - Waiting lounge
  - Coffee
  - Car wash
  - Restrooms

### Map Integration:
- View showrooms on map
- Get directions
- See exact coordinates

---

## 🚗 Booking & Service Management

### Service Types:
1. **PARKING** - Park your vehicle
2. **MAINTENANCE** - Regular maintenance
3. **REPAIR** - Repair services
4. **CAR_WASH** - Washing services

### Duration Options:
- **HOURLY** - Pay per hour
- **DAILY** - Daily rate
- **WEEKLY** - Weekly package

### Booking Flow:
1. Select showroom
2. Choose service type
3. Select duration
4. Enter car details
5. Confirm booking
6. Receive confirmation

---

## 🏢 Admin Dashboard Features

### Overview Statistics:
- Total showrooms
- Total employees
- Total users
- Total bookings
- Total revenue
- Top performing showrooms

### Showroom Management:
- Create new showrooms
- Update showroom details
- View showroom statistics
- Manage showroom employees

### Employee Management:
- Create employee accounts
- Assign to showrooms
- View employee performance

### Payment Management:
- View all pending payments
- Filter by showroom
- Mark cash payments as paid
- View payment history
- Generate reports
- Track revenue

### Invoice Management:
- Create invoices for users
- View all invoices
- Track payment status

---

## 👨‍💼 Employee Dashboard Features

### Showroom Operations:
- View showroom bookings
- Inspect customer vehicles
- Generate invoices
- Update booking status

### Payment Handling:
- View pending payments for showroom
- Mark cash payments as paid
- View payment history

### Invoice Generation:
- Create detailed invoices
- Add parts cost
- Add labor cost
- Calculate tax
- Apply discounts
- Generate PDF invoices

---

## 🎨 User Interface Features

### Navigation Bar:
- **Logo**: Park Plaza branding
- **Shop Link**: Quick access to e-commerce (🛒)
- **Role-based Navigation**:
  - Users: My Bookings, Pending Payments
  - Employees: Dashboard, Pending Payments
  - Admins: Dashboard, Pending Payments
- **Profile Dropdown**: User menu in top right
- **Responsive Design**: Works on all devices

### Home Page (`/`):
- **Hero Section**: Welcome message and call-to-action
- **Features Showcase**:
  - Smart Parking
  - Car Services
  - Car Repair
  - **Car Parts Shop** (highlighted with special styling)
- **How It Works**: 4-step process explanation
- **Call-to-Action**: Multiple CTAs for booking and shopping

### Design Elements:
- Clean, modern interface
- Blue color scheme
- Card-based layouts
- Responsive grid system
- Loading states
- Error handling
- Success messages
- Form validation

---

## 🔒 Security Features

### Authentication:
- JWT-based authentication
- Access tokens (short-lived)
- Refresh tokens (long-lived)
- Secure password hashing (bcrypt)
- Password minimum length requirement

### Authorization:
- Role-based access control
- Route protection
- API endpoint protection
- User-specific data access

### Data Validation:
- Email format validation
- Phone number validation (10 digits)
- Username format validation (alphanumeric + underscore)
- Password strength requirements
- Required field validation

---

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Touch-friendly** interface
- **Optimized images**
- **Fast loading times**

---

## 🗄️ Database Models

### User Model:
- Username (unique, indexed)
- Name
- Email (unique, indexed)
- Phone
- Password (hashed)
- Role
- Address (embedded document)
- Location (lat/lng)
- Showroom ID (for employees)
- Profile image
- Active status
- Timestamps

### Product Model:
- Name
- Description
- Category
- Price
- Original price (for discounts)
- Images (array)
- Brand
- Stock quantity
- SKU
- Specifications (map)
- Compatibility (array)
- Rating
- Active status
- Featured flag
- Tags (for search)

### Order Model:
- Order number (unique)
- User ID
- Items (array of products with quantities)
- Total amount
- Shipping address
- Payment method
- Payment status
- Order status
- Razorpay integration fields
- Tracking number
- Delivery date

### Payment Model:
- Invoice ID
- Booking ID
- User ID
- Showroom ID
- Amount
- Payment method
- Razorpay fields
- Status
- Payment date
- Transaction ID
- Receipt URL

---

## 🚀 Getting Started

### Prerequisites:
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation:

1. **Clone the repository**
2. **Install server dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**:
   ```bash
   cd client
   npm install
   ```

4. **Set up environment variables**:
   Create `.env` file in server directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/park_plaza
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

5. **Seed the database** (optional, for testing):
   ```bash
   cd server
   npm run seed
   ```

6. **Start the development servers**:
   
   Server:
   ```bash
   cd server
   npm run dev
   ```
   
   Client:
   ```bash
   cd client
   npm run dev
   ```

### Test Accounts (after seeding):
- **Admin**: username: `admin`, password: `admin123`
- **Employee1**: username: `employee1`, password: `employee123`
- **Employee2**: username: `employee2`, password: `employee123`
- **Employee3**: username: `employee3`, password: `employee123`
- **User1-5**: username: `user1` to `user5`, password: `user123`

---

## 📝 Special Notes

### Username Uniqueness:
- Real-time checking as user types
- Clear error messages
- Username validation on both frontend and backend
- Case-insensitive storage (converted to lowercase)

### Payment Flow:
- Users see pending payments in their dashboard
- Admin/Employees can mark offline cash payments as paid
- Online payments integrated with Razorpay
- Payment audit trail maintained
- Revenue tracking in database

### E-Commerce Integration:
- Fully integrated shopping experience
- Highlighted in navbar with 🛒 icon
- Featured prominently on home page
- Separate from parking/service bookings
- Complete order management system

### Profile Management:
- Clear separation between view and edit modes
- Read-only profile view
- Editable profile with save/cancel options
- Profile dropdown for quick access
- Shows user information consistently across app

This comprehensive system provides a complete solution for parking management, vehicle services, and car parts e-commerce all in one platform!
