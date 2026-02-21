import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const GenerateInvoice = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({ itemsDescription: [], partsCost: 0, laborCost: 0, tax: 0, discount: 0, notes: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/employee/bookings/${bookingId}`);
        setBooking(res.data.booking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const totalAmount = (Number(form.partsCost) || 0) + (Number(form.laborCost) || 0) + (Number(form.tax) || 0) - (Number(form.discount) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { itemsDescription: [], partsCost: Number(form.partsCost) || 0, laborCost: Number(form.laborCost) || 0, tax: Number(form.tax) || 0, discount: Number(form.discount) || 0, notes: form.notes };
      await api.post(`/employee/bookings/${bookingId}/invoice/generate`, payload);
      navigate('/employee/invoices');
    } catch (err) {
      console.error('Invoice generation failed', err);
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!booking) return <Card>Booking not found.</Card>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-4">
          <h2 className="text-2xl font-bold mb-6">Generate Invoice</h2>

          {/* Customer & Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Name:</span> {booking.userId?.name}</div>
                <div><span className="font-medium">Email:</span> {booking.userId?.email}</div>
                <div><span className="font-medium">Phone:</span> {booking.userId?.phone}</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Service Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Booking ID:</span> {booking._id}</div>
                <div><span className="font-medium">Problem/Service:</span> {booking.serviceType}</div>
                <div><span className="font-medium">Car Details:</span> {booking.carDetails}</div>
                {booking.description && <div><span className="font-medium">Description:</span> {booking.description}</div>}
              </div>
            </div>
          </div>

          <hr className="mb-6" />

          {/* Invoice Form */}
          <form onSubmit={handleSubmit}>
            <h3 className="font-bold text-lg mb-4">Invoice Amount</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input 
                label="Parts Cost (₹)" 
                name="partsCost" 
                value={form.partsCost} 
                onChange={handleChange} 
                type="number"
                step="0.01"
                min="0"
              />
              <Input 
                label="Labor Cost (₹)" 
                name="laborCost" 
                value={form.laborCost} 
                onChange={handleChange} 
                type="number"
                step="0.01"
                min="0"
              />
              <Input 
                label="Tax (₹)" 
                name="tax" 
                value={form.tax} 
                onChange={handleChange} 
                type="number"
                step="0.01"
                min="0"
              />
              <Input 
                label="Discount (₹)" 
                name="discount" 
                value={form.discount} 
                onChange={handleChange} 
                type="number"
                step="0.01"
                min="0"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
              <div className="text-lg font-bold text-blue-900">
                Total Amount: ₹{totalAmount.toFixed(2)}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea 
                name="notes" 
                value={form.notes} 
                onChange={handleChange} 
                placeholder="Any additional notes for this invoice"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows="3"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Generate Invoice</Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </form>
        </Card>
        <p className="text-sm text-gray-600 text-center">Invoice ID will be auto-generated upon submission</p>
      </div>
    </div>
  );
};

export default GenerateInvoice;
