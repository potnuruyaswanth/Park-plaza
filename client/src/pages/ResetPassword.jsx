import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ message: '', isError: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: '', isError: false });

    if (!token) {
      setStatus({ message: 'Reset token is missing.', isError: true });
      return;
    }

    if (password.length < 6) {
      setStatus({ message: 'Password must be at least 6 characters.', isError: true });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ message: 'Passwords do not match.', isError: true });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/password/reset', { token, password });
      setStatus({ message: res.data.message || 'Password reset successfully.', isError: false });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || 'Failed to reset password.',
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>

        {status.message && (
          <div className={`border px-4 py-3 rounded-lg mb-4 ${status.isError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="New Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Reset Password'}
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

export default ResetPassword;
