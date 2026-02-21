import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const EmployeeInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, paid, pending

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/employee/invoices');
        setInvoices(res.data.invoices || []);
      } catch (err) {
        console.error('Failed fetching employee invoices', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const getStatusColor = (status) => {
    if (status === 'PAID') return 'bg-green-100 text-green-800';
    if (status === 'ACCEPTED') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'paid') return inv.status === 'PAID';
    if (filter === 'pending') return inv.status !== 'PAID';
    return true;
  });

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const paidCount = invoices.filter(i => i.status === 'PAID').length;
  const pendingCount = invoices.length - paidCount;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">Invoices Generated</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600">{invoices.length}</div>
            <p className="text-gray-600 mt-2">Total Invoices</p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600">{paidCount}</div>
            <p className="text-gray-600 mt-2">Completed (Paid)</p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-orange-600">{pendingCount}</div>
            <p className="text-gray-600 mt-2">Pending (Not Paid)</p>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'}`}
          >
            All ({invoices.length})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded ${filter === 'paid' ? 'bg-green-600 text-white' : 'bg-white border border-gray-300'}`}
          >
            Completed ({paidCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-white border border-gray-300'}`}
          >
            Pending ({pendingCount})
          </button>
        </div>

        {/* Invoices List */}
        {filteredInvoices.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600">
              {filter === 'all' ? 'No invoices found.' : `No ${filter} invoices found.`}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map(inv => (
              <Card key={inv._id}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-lg">{inv.invoiceNumber || inv._id}</div>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <div>Service: {inv.bookingId?.serviceType}</div>
                      <div>Total: <span className="font-bold">₹{inv.totalAmount}</span></div>
                      <div>Generated: {new Date(inv.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className={`px-3 py-1 rounded text-sm font-medium inline-block ${getStatusColor(inv.status)}`}>
                      {inv.status === 'PAID' ? '✓ Completed' : inv.status === 'ACCEPTED' ? 'Accepted' : 'Pending'}
                    </div>
                    <div>
                      <Link to={`/invoices/${inv._id}`}>
                        <Button variant="outline" className="text-sm">View Invoice</Button>
                      </Link>
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

export default EmployeeInvoices;
