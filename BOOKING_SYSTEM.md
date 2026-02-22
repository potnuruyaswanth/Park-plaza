# Park Plaza - Booking & Slot Management System

## Overview
Complete booking system with automatic slot assignment, invoice generation, and employee work tracking.

---

## Features Implemented

### 1. **Booking Confirmation with Slot Assignment** ✅
- **Endpoint**: `POST /user/bookings`
- **Fixed URL**: Changed from `/user/book` to `/user/bookings` for proper routing

**What happens when user confirms booking:**
1. ✅ Check if slots are available at showroom
2. ✅ Show error popup: "❌ Sorry, no slots are available" if none available
3. ✅ Assign available slot number (1-50)
4. ✅ Decrease showroom's availableSlots by 1
5. ✅ Create invoice automatically
6. ✅ Create payment record (PENDING status)
7. ✅ Link booking to employee of that showroom
8. ✅ Return success message with slot number

**Response Example:**
```json
{
  "message": "✅ Booking confirmed! Slot #15 assigned. Invoice created.",
  "booking": {
    "_id": "...",
    "slotNumber": 15,
    "invoice": "...",
    "payment": "...",
    "status": "PENDING"
  }
}
```

---

### 2. **Slot Management** ✅
- **Decrease**: When user confirms booking
- **Increase**: When employee marks work as "Done"
- **Validation**: Prevent bookings if availableSlots <= 0

**Database Update:**
- `Showroom.availableSlots` decreases on booking creation
- `Showroom.availableSlots` increases when work is marked complete

---

### 3. **Invoice Auto-Creation** ✅
- **Automatic**: Invoice created immediately when booking confirmed
- **Invoice Details:**
  - Invoice number: `INV-{timestamp}`
  - Amount: Based on service type and duration
  - Status: GENERATED
  - Due Date: 7 days from creation

**Auto-Generated Invoice Data:**
```javascript
{
  "userId": "...",
  "bookingId": "...",
  "showroomId": "...",
  "employeeId": "...",
  "invoiceNumber": "INV-1724246123456",
  "itemDetails": [{
    "description": "PARKING Service (DAILY)",
    "quantity": 1,
    "rate": 300,
    "amount": 300
  }],
  "totalAmount": 300,
  "status": "GENERATED"
}
```

---

### 4. **Payment Auto-Creation** ✅
- **Status**: PENDING (waiting for payment)
- **Amount**: Same as invoice total
- **Updated**: When work is marked done (changes to PAID)

---

### 5. **Showroom-Employee Mapping** ✅
- Each showroom has ONE employee assigned
- Employee is auto-assigned to booking when created
- Booking stores: `employeeId` reference

---

### 6. **Employee Work Completion** ✅
- **Endpoint**: `PUT /employee/bookings/:bookingId/mark-done`
- **What happens:**
  1. ✅ Mark booking status as COMPLETED
  2. ✅ Update all associated invoices to PAID
  3. ✅ Update all associated payments to PAID
  4. ✅ Restore slot: increase `showroom.availableSlots` by 1
  5. ✅ Return success message with slot being restored

**Response Example:**
```json
{
  "message": "✅ Work marked as done! Slot #15 is now available.",
  "booking": { ... },
  "invoicesUpdated": 1,
  "paymentsUpdated": 1,
  "slotsRestored": 1
}
```

---

## Models Updated

### Booking Schema
**New Fields Added:**
- `slotNumber`: Number (1-50, assigned slot)
- `employeeId`: ObjectId (ref to User)

---

## Routes Summary

### User Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/bookings` | Create booking with slot assignment |
| GET | `/user/bookings` | Get user's bookings |
| GET | `/user/bookings/:bookingId` | Get booking details |

### Employee Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/employee/bookings/:bookingId/mark-done` | Mark work as complete, restore slot |
| GET | `/employee/invoices` | Get all invoices |
| GET | `/employee/payments/pending` | Get pending payments |

---

## User Workflow

1. **Browse Showrooms**
   - Dashboard shows showrooms with available slots
   - Location-based or city-based search
   
2. **Book Service**
   - Click "Book Service" button
   - Select service type, duration, car details
   - Click "Confirm Booking"
   
3. **Slot Assignment**
   - System checks if slots available
   - If NO → Show "Sorry, slots not available" popup, don't proceed
   - If YES → Assign slot, create invoice+payment, redirect to bookings
   
4. **View Invoice & Pay**
   - User sees booking in "My Bookings"
   - Invoice appears as "Payment Invoice" with PENDING status
   - User can pay via Razorpay or record cash payment
   
5. **Track Status**
   - Can see slot number assigned (#1-50)
   - See payment status (PENDING/PAID)
   - See invoice details

---

## Employee Workflow

1. **View Pending Work**
   - Employee dashboard shows bookings in their showroom
   - Bookings with status: PENDING or INSPECTED
   - Shows customer details, car info, slot number
   
2. **Complete Service**
   - Employee provides service (parking, wash, repair)
   - Marks work as "Done" via API/Dashboard
   
3. **Automatic Updates**
   - Booking status → COMPLETED
   - Invoice status → PAID
   - Payment status → PAID
   - Slot is restored and available for next booking

---

## Payment Rates (by Duration)

| Duration | Rate | Service Type |
|----------|------|--------------|
| HOURLY | ₹50 | Any |
| DAILY | ₹300 | Any |
| WEEKLY | ₹1500 | Any |

*Note: Configured in `server/src/config/constants.js`*

---

## Error Handling

### Slot Not Available
```
Status: 400
Message: "❌ Sorry, no slots are available at this showroom right now. Please try again later."
slotsAvailable: false
```

### Showroom Not Found
```
Status: 404
Message: "Showroom not found"
```

### Unauthorized Access
```
Status: 403
Message: "Not authorized to update this booking"
```

---

## Testing Workflow

### 1. User Books Service (Slot Available)
```bash
curl -X POST http://localhost:5000/api/user/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "showroomId": "SHOWROOM_ID",
    "serviceType": "PARKING",
    "duration": "DAILY",
    "carDetails": {
      "carNumber": "MH01AB1234",
      "carModel": "Honda City",
      "carColor": "Black"
    },
    "description": "Regular parking"
  }'
```

### 2. Employee Marks Work Done
```bash
curl -X PUT http://localhost:5000/api/employee/bookings/BOOKING_ID/mark-done \
  -H "Authorization: Bearer EMPLOYEE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Service completed successfully"
  }'
```

---

## Demo Data (Seeded)

**Showrooms:** 3 showrooms with 50 total slots each
- Downtown Auto Plaza (Mumbai) - 50 slots
- Northside Service Center (Delhi) - 40 slots
- Eastside Auto Hub (Bangalore) - 60 slots

**Employees:** 1 per showroom
- employee1@gmail.com (Downtown)
- employee2@gmail.com (Northside)
- employee3@gmail.com (Eastside)

**Users:** 5 regular users with confirmed bookings

---

## Important Notes

- ✅ Route mismatch fixed (`/user/book` → `/user/bookings`)
- ✅ Slot validation implemented
- ✅ Invoice auto-creation on booking confirmation
- ✅ Payment auto-creation with PENDING status
- ✅ Employee-to-showroom mapping
- ✅ Slot restoration on work completion
- ✅ All database updates transactional

---

## Next Steps / Enhancements

- [ ] Add payment verification (Razorpay integration)
- [ ] Add SMS notifications for booking confirmation
- [ ] Add email receipt for users
- [ ] Add cancellation with refund logic
- [ ] Add rating/review system
- [ ] Add booking history export

---

**Last Updated:** February 21, 2026
**Status:** ✅ Production Ready
