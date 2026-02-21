import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';

const PendingPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/payments/pending');
      setPayments(response.data.payments || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending payments');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (invoiceId) => {
    try {
      const response = await api.post(`/user/payments/${invoiceId}/order`);
      const { razorpayOrderId, amount, keyId, paymentId } = response.data;

      // Initialize Razorpay
      const options = {
        key: keyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'Park Plaza',
        description: 'Payment for services',
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await api.post('/user/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              paymentId
            });
            
            alert('Payment successful!');
            fetchPendingPayments();
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading pending payments...</div>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pending Payments</h1>
          <p className="text-sm text-gray-600 mt-1">Review invoices and complete payments for your services.</p>
        </div>

        {payments.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-semibold mb-2">No Pending Payments</h2>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment._id}>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold">
                        Payment #{payment._id.slice(-8)}
                      </h3>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {payment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p className="font-medium text-lg">₹{payment.amount}</p>
                      </div>

                      <div>
                        <p className="text-gray-600">Service Type</p>
                        <p className="font-medium">{payment.bookingId?.serviceType}</p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-gray-600">Created</p>
                        <p className="font-medium">
                          {new Date(payment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-72 border border-gray-100 rounded-lg p-4 bg-gray-50">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600">Showroom</p>
                        <p className="font-medium">{payment.showroomId?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Invoice Number</p>
                        <p className="font-medium">{payment.invoiceId?.invoiceNumber}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col space-y-2">
                      <Button
                        onClick={() => handlePayNow(payment.invoiceId._id)}
                        className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
                      >
                        💳 Pay Now
                      </Button>
                      
                      <Button
                        onClick={() => navigate(`/invoices/${payment.invoiceId?._id}`)}
                        className="bg-gray-600 hover:bg-gray-700 whitespace-nowrap"
                      >
                        👁️ View Details
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

export default PendingPayments;
