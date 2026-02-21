import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [status, setStatus] = useState({ message: '', isError: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: '', isError: false });
    setLoading(true);

    try {
      const res = await api.post('/auth/password/forgot', {
        emailOrUsername: identifier
      });
      setStatus({ message: res.data.message || 'Check your email for the reset link.', isError: false });
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || 'Failed to request password reset.',
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>

        {status.message && (
          <div className={`border px-4 py-3 rounded-lg mb-4 ${status.isError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email or Username"
            type="text"
            name="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="email@gmail.com or username"
            required
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm">
          Back to{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPassword;
