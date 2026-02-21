import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { formatCurrency, formatDate } from '../utils/helpers';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/user/invoices');
        setInvoices(res.data.invoices || res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading invoices...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <Link to="/record-cash">
            <Button>Record Cash</Button>
          </Link>
        </div>

        {invoices.length === 0 ? (
          <Card>No invoices found.</Card>
        ) : (
          <div className="space-y-4">
            {invoices.map((inv) => (
              <Card key={inv._id}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{inv.invoiceNumber || inv._id}</div>
                    <div className="text-sm text-gray-600">Status: {inv.status}</div>
                    <div className="text-sm text-gray-600">Total: {formatCurrency(inv.totalAmount)}</div>
                    <div className="text-sm text-gray-600">Date: {formatDate(inv.generatedDate)}</div>
                  </div>
                  <div className="space-x-2">
                    <Link to={`/invoices/${inv._id}`}>
                      <Button variant="outline">View</Button>
                    </Link>
                    {inv.payments && inv.payments.length > 0 && inv.payments[0].receiptUrl && (
                      <a
                        href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${inv.payments[0].receiptUrl}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button>Receipt</Button>
                      </a>
                    )}
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

export default InvoiceList;
