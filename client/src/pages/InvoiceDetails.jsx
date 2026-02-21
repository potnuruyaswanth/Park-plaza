import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { formatCurrency, formatDate } from '../utils/helpers';

const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/user/invoices/${invoiceId}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [invoiceId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  const { invoice, payments } = data;

  const primaryPayment = payments && payments.length > 0 ? payments[0] : null;

  const receiptUrl = primaryPayment?.receiptUrl
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${primaryPayment.receiptUrl}`
    : null;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>

          <div className="mb-4">
            <div className="text-sm text-gray-600">Invoice No: {invoice.invoiceNumber}</div>
            <div className="text-sm text-gray-600">Status: {invoice.status}</div>
            <div className="text-sm text-gray-600">Total: {formatCurrency(invoice.totalAmount)}</div>
            <div className="text-sm text-gray-600">Generated: {formatDate(invoice.generatedDate)}</div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Items</h3>
            <ul className="list-disc ml-6">
              {invoice.itemsDescription?.map((it, idx) => (
                <li key={idx}>
                  {it.description} — {it.quantity} × {formatCurrency(it.unitPrice)} = {formatCurrency(it.amount)}
                </li>
              ))}
            </ul>
          </div>

          {primaryPayment ? (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Payment</h3>
              <div className="text-sm text-gray-600">Method: {primaryPayment.paymentMethod}</div>
              <div className="text-sm text-gray-600">Amount: {formatCurrency(primaryPayment.amount)}</div>
              <div className="text-sm text-gray-600">Date: {formatDate(primaryPayment.paymentDate)}</div>

              {receiptUrl && (
                <div className="mt-4">
                  <a href={receiptUrl} target="_blank" rel="noreferrer">
                    <Button variant="outline">Download Receipt (PDF)</Button>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-4 text-gray-600">No payment recorded yet.</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InvoiceDetails;
