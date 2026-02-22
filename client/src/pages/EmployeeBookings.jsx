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
  const [markingDone, setMarkingDone] = useState({});
  const [success, setSuccess] = useState(null);
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

  const handleMarkAsDone = async (bookingId) => {
    setMarkingDone(prev => ({ ...prev, [bookingId]: true }));
    try {
      const response = await api.put(`/employee/bookings/${bookingId}/mark-done`, {
        notes: 'Work completed'
      });

      // Show success message
      setSuccess({
        bookingId,
        message: response.data.message,
        slotsRestored: response.data.slotsRestored
      });

      // Remove the booking from the list
      setBookings(prev => prev.filter(b => b._id !== bookingId));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark work as done');
    } finally {
      setMarkingDone(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user?.showroomId) return <Card>Please ask admin to assign you to a showroom.</Card>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pending Work Tasks</h1>
          <p className="text-sm text-gray-600 mt-1">Services waiting to be completed. Mark as done when finished.</p>
        </div>

        {/* Success Message */}
        {success && (
          <Card className="bg-green-50 border-l-4 border-green-600 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-green-700">{success.message}</p>
                <p className="text-sm text-green-600">Slot has been restored for next booking</p>
              </div>
            </div>
          </Card>
        )}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Pending Work!</h2>
            <p className="text-gray-600">All bookings have been completed. Great job! 🎉</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id} className="border-l-4 border-orange-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Booking Details */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        🚗 Booking #{booking._id.slice(-8).toUpperCase()}
                      </h3>
                      
                      {/* Slot Number Badge */}
                      {booking.slotNumber && (
                        <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                          Slot #{booking.slotNumber}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Customer</p>
                        <p className="text-gray-900 font-medium">{booking.userId?.name}</p>
                        <p className="text-sm text-gray-600">{booking.userId?.phone}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Service Type</p>
                          <p className="text-gray-900 font-medium">
                            {booking.serviceType === 'PARKING' && '🅿️ Parking'}
                            {booking.serviceType === 'WASH' && '🧼 Wash'}
                            {booking.serviceType === 'REPAIR' && '🔧 Repair'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Duration</p>
                          <p className="text-gray-900 font-medium">{booking.duration}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Car Details</p>
                        <p className="text-gray-900 font-medium">{booking.carDetails?.carNumber}</p>
                        <p className="text-sm text-gray-600">
                          {booking.carDetails?.carModel && `${booking.carDetails.carModel} • `}
                          {booking.carDetails?.carColor}
                        </p>
                      </div>

                      {booking.description && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes</p>
                          <p className="text-sm text-gray-600 italic">{booking.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Actions & Cost */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Estimated Cost</p>
                        <p className="text-3xl font-bold text-blue-700">₹{booking.estimatedCost}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Status</p>
                        <div className="inline-block">
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ⏳ {booking.status || 'PENDING'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 mt-4">
                      <Button
                        onClick={() => handleMarkAsDone(booking._id)}
                        disabled={markingDone[booking._id]}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {markingDone[booking._id] ? '⏳ Marking Done...' : '✅ Mark Work Done'}
                      </Button>
                      <Button
                        onClick={() => navigate(`/employee/bookings/${booking._id}/invoice`)}
                        variant="secondary"
                        className="w-full"
                      >
                        📄 View Invoice & Payment
                      </Button>
                    </div>
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
