import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/user/bookings');
        setBookings(response.data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading your bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md">
          <div className="text-red-600">{error}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-600 mt-1">View your previous bookings and create a new one.</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} className="whitespace-nowrap">
            ➕ Book New Service
          </Button>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-semibold mb-2">No Bookings Yet</h2>
              <p className="text-gray-600 mb-4">Start by booking a service at a nearby showroom.</p>
              <Button onClick={() => navigate('/dashboard')}>Book Your First Service</Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Booking ID</div>
                    <div className="font-medium text-gray-900">{booking._id}</div>

                    <div className="mt-2 text-sm text-gray-600">
                      <div><span className="font-medium">Service:</span> {booking.serviceType}</div>
                      <div><span className="font-medium">Showroom:</span> {booking.showroomId?.name}</div>
                      <div><span className="font-medium">City:</span> {booking.showroomId?.city}</div>
                      <div><span className="font-medium">Status:</span> {booking.status}</div>
                      <div><span className="font-medium">Booked:</span> {new Date(booking.createdAt).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => navigate('/dashboard')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Book Again
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
