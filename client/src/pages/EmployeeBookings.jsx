import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const EmployeeBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      if (!user?.showroomId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/employee/showrooms/${user.showroomId}/bookings`);
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error('Failed fetching bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user?.showroomId) return <Card>Please ask admin to assign you to a showroom.</Card>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Pending / Inspected Bookings</h1>
        {bookings.length === 0 ? (
          <Card>No bookings found.</Card>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <Card key={b._id}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{b._id}</div>
                    <div className="text-sm text-gray-600">{b.userId?.name} - {b.userId?.phone}</div>
                    <div className="text-sm text-gray-600">Service: {b.serviceType}</div>
                  </div>
                  <div className="space-x-2">
                    <Button onClick={() => navigate(`/employee/bookings/${b._id}/invoice`)}>Generate Invoice</Button>
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

export default EmployeeBookings;
