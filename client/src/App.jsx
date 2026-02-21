import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import UserLogin from './pages/UserLogin';
import EmployeeLogin from './pages/EmployeeLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Shop from './pages/Shop';
import PendingPayments from './pages/PendingPayments';
import MyBookings from './pages/MyBookings';
import BookService from './pages/BookService';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RecordCash from './pages/RecordCash';
import InvoiceDetails from './pages/InvoiceDetails';
import InvoiceList from './pages/InvoiceList';
import EmployeeBookings from './pages/EmployeeBookings';
import GenerateInvoice from './pages/GenerateInvoice';
import CreateInvoice from './pages/CreateInvoice';
import EmployeeInvoices from './pages/EmployeeInvoices';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/employee" element={<EmployeeLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/shop" element={<Shop />} />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/payments/pending"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <PendingPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-service"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <BookService />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/bookings"
            element={
              <ProtectedRoute allowedRoles={[ 'EMPLOYEE' ]}>
                <EmployeeBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/bookings/:bookingId/invoice"
            element={
              <ProtectedRoute allowedRoles={[ 'EMPLOYEE' ]}>
                <GenerateInvoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/invoice/create"
            element={
              <ProtectedRoute allowedRoles={[ 'EMPLOYEE' ]}>
                <CreateInvoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/invoices"
            element={
              <ProtectedRoute allowedRoles={[ 'EMPLOYEE' ]}>
                <EmployeeInvoices />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Common Protected Routes */}
          <Route path="/record-cash" element={
            <ProtectedRoute>
              <RecordCash />
            </ProtectedRoute>
          } />
          <Route path="/invoices" element={<ProtectedRoute><InvoiceList/></ProtectedRoute>} />
          <Route path="/invoices/:invoiceId" element={<ProtectedRoute><InvoiceDetails/></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
