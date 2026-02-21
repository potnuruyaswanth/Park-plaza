import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const renderQuickActions = () => {
    if (!isAuthenticated) return null;

    if (user?.role === 'EMPLOYEE') {
      return (
        <Card className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Employee Quick Actions</h2>
          <p className="text-sm text-gray-600 mb-4">Generate invoices and manage showroom work in one place.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link to="/employee/dashboard">
              <Button className="w-full">View Dashboard</Button>
            </Link>
            <Link to="/employee/bookings">
              <Button className="w-full" variant="outline">Pending Bookings</Button>
            </Link>
            <Link to="/employee/invoices">
              <Button className="w-full" variant="secondary">Invoices</Button>
            </Link>
          </div>
        </Card>
      );
    }

    if (user?.role === 'ADMIN') {
      return (
        <Card className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Admin Quick Actions</h2>
          <p className="text-sm text-gray-600 mb-4">Review platform performance and manage operations.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/admin/dashboard">
              <Button className="w-full">Go to Admin Dashboard</Button>
            </Link>
          </div>
        </Card>
      );
    }

    return (
      <Card className="mb-10">
        <h2 className="text-2xl font-bold mb-3">Welcome Back</h2>
        <p className="text-sm text-gray-600 mb-4">Manage your bookings, payments, and invoices quickly.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link to="/dashboard">
            <Button className="w-full">Find Showrooms</Button>
          </Link>
          <Link to="/bookings">
            <Button className="w-full" variant="outline">My Bookings</Button>
          </Link>
          <Link to="/payments/pending">
            <Button className="w-full" variant="secondary">Pending Payments</Button>
          </Link>
        </div>
      </Card>
    );
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        {renderQuickActions()}
      </div>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Smart Parking & Vehicle Service System
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Book parking slots, wash your car, and get professional repair services - all in one place!
            </p>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <Link to={user?.role === 'EMPLOYEE' ? '/employee/dashboard' : user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}>
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="lg" variant="outline">Create Account</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="text-6xl text-center">
            🅿️
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <div className="text-5xl mb-4">🅿️</div>
              <h3 className="text-2xl font-bold mb-3">Smart Parking</h3>
              <p className="text-gray-600">
                Book parking slots by the hour, day, or week. Get real-time availability and find slots near you.
              </p>
            </Card>
            <Card className="text-center">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="text-2xl font-bold mb-3">Car Services</h3>
              <p className="text-gray-600">
                Professional car washing and maintenance at our trusted service centers.
              </p>
            </Card>
            <Card className="text-center">
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="text-2xl font-bold mb-3">Car Repair</h3>
              <p className="text-gray-600">
                Expert repair services with transparent pricing and detailed invoices.
              </p>
            </Card>
            <Card className="text-center hover:shadow-xl transition border-2 border-blue-200">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-2xl font-bold mb-3 text-blue-600">Car Parts Shop</h3>
              <p className="text-gray-600 mb-4">
                Browse and buy quality car parts, accessories, and supplies online!
              </p>
              <Link to="/shop">
                <Button className="w-full">Shop Now</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Find', desc: 'Locate nearby showrooms' },
              { step: 2, title: 'Book', desc: 'Select service & duration' },
              { step: 3, title: 'Service', desc: 'Professional care for your car' },
              { step: 4, title: 'Pay', desc: 'Easy payment options' }
            ].map(item => (
              <Card key={item.step} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
              <p className="text-xl mb-6">Book parking or shop for car parts today!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/login">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Book Parking
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button size="lg" className="bg-blue-700 hover:bg-blue-800 border-2 border-white">
                    Shop Parts
                  </Button>
                </Link>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl">🚘</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
