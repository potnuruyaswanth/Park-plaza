import React, { useState } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const RecordCash = () => {
  const [form, setForm] = useState({ invoiceId: '', amount: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!form.invoiceId) {
      setMessage({ type: 'error', text: 'Invoice ID is required' });
      return;
    }

    setLoading(true);
    try {
      const payload = { invoiceId: form.invoiceId };
      if (form.amount) payload.amount = Number(form.amount);
      if (form.note) payload.note = form.note;

      const res = await api.post('/payments/manual', payload);
      setMessage({ type: 'success', text: res.data.message });
      setForm({ invoiceId: '', amount: '', note: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Record Cash Payment</h2>

          {message && (
            <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Invoice ID"
              name="invoiceId"
              value={form.invoiceId}
              onChange={handleChange}
              required
            />

            <Input
              label="Amount (optional, defaults to invoice total)"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              type="number"
              min="0"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Recording...' : 'Record Cash Payment'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RecordCash;
