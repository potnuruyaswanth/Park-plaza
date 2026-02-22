import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const BookService = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showroom = location.state?.showroom || null;

  const [formData, setFormData] = useState({
    serviceType: 'PARKING',
    duration: 'HOURLY',
    carNumber: '',
    carModel: '',
    carColor: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);

    if (!showroom?._id) {
      setError('Please choose a showroom from the dashboard.');
      setLoading(false);
      return;
    }

    if (!formData.carNumber) {
      setError('Car number is required.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/user/bookings', {
        showroomId: showroom._id,
        serviceType: formData.serviceType,
        duration: formData.duration,
        carDetails: {
          carNumber: formData.carNumber,
          carModel: formData.carModel,
          carColor: formData.carColor
        },
        description: formData.description
      });

      // Show success message with booking details
      const booking = response.data.booking;
      setSuccess({
        message: response.data.message,
        slotNumber: booking.slotNumber,
        bookingId: booking._id
      });

      // Redirect after 2.5 seconds
      setTimeout(() => {
        navigate('/bookings');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!showroom) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Select a Showroom</h1>
          <p className="text-gray-600 mb-4">Please choose a showroom from the dashboard to book a service.</p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-700 mb-4">{success.message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Slot Number</p>
              <p className="text-3xl font-bold text-green-600">#{success.slotNumber}</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">Redirecting to your bookings...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          </Card>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Book Service</h1>
          <p className="text-sm text-gray-600 mt-1">Complete the details to book a service at your selected showroom.</p>
        </div>

        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Selected Showroom</h2>
            <p className="text-gray-700">{showroom.name} — {showroom.city}</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="PARKING">Parking</option>
                  <option value="WASH">Wash</option>
                  <option value="REPAIR">Repair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="HOURLY">Hourly</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Car Number *"
                name="carNumber"
                value={formData.carNumber}
                onChange={handleChange}
                placeholder="e.g., AP30 Q 4355"
                required
              />
              <Input
                label="Car Model"
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                placeholder="e.g., Honda City"
              />
              <Input
                label="Car Color"
                name="carColor"
                value={formData.carColor}
                onChange={handleChange}
                placeholder="e.g., Black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Any specific details or issues"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
              <Button type="button" onClick={() => navigate('/dashboard')} className="bg-gray-600 hover:bg-gray-700">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BookService;
