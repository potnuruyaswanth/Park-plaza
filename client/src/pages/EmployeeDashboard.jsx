import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Card from '../components/Card';

const EmployeeDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/employee/dashboard');
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Employee Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Track bookings, invoices, and payments for your showroom.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-4xl font-bold text-blue-600">
              {dashboard?.totalBookings || 0}
            </div>
            <p className="text-gray-600 mt-2">Total Bookings</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl font-bold text-orange-600">
              {dashboard?.pendingBookings || 0}
            </div>
            <p className="text-gray-600 mt-2">Pending</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl font-bold text-green-600">
              {dashboard?.completedBookings || 0}
            </div>
            <p className="text-gray-600 mt-2">Completed</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl font-bold text-purple-600">
              {dashboard?.totalInvoicesGenerated || 0}
            </div>
            <p className="text-gray-600 mt-2">Invoices</p>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-700">
              ₹{dashboard?.totalRevenue || 0}
            </div>
            <p className="text-gray-600 mt-2">Total Revenue</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => window.location.href = '/employee/bookings'} className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">
              📋 View Pending Bookings
            </button>
            <button onClick={() => window.location.href = '/employee/invoice/create'} className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700">
              📄 Generate Invoice
            </button>
            <button onClick={() => window.location.href = '/employee/invoices'} className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700">
              💰 View Payments
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
