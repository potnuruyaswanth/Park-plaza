import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Choose Login Type</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="text-center">
            <div className="text-5xl mb-4">🧑‍💼</div>
            <h2 className="text-xl font-semibold mb-3">User Login</h2>
            <p className="text-sm text-gray-600 mb-4">Book services, manage payments, and track invoices.</p>
            <Link to="/login/user">
              <Button className="w-full">Login as User</Button>
            </Link>
          </Card>

          <Card className="text-center">
            <div className="text-5xl mb-4">🧰</div>
            <h2 className="text-xl font-semibold mb-3">Employee Login</h2>
            <p className="text-sm text-gray-600 mb-4">Generate invoices and manage showroom bookings.</p>
            <Link to="/login/employee">
              <Button className="w-full" variant="outline">Login as Employee</Button>
            </Link>
          </Card>
        </div>

        <p className="text-center mt-6">
          Need an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register as User
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
