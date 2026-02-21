import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState({ loading: true, message: '', success: false });

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus({ loading: false, message: 'Verification token is missing.', success: false });
        return;
      }

      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        setStatus({ loading: false, message: res.data.message || 'Email verified.', success: true });
      } catch (err) {
        setStatus({
          loading: false,
          message: err.response?.data?.message || 'Verification failed.',
          success: false
        });
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

        {status.loading ? (
          <p className="text-gray-600">Verifying your email...</p>
        ) : (
          <>
            <p className={status.success ? 'text-green-600' : 'text-red-600'}>{status.message}</p>
            <div className="mt-6">
              <Link to="/login/user">
                <Button className="w-full">Go to Login</Button>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default VerifyEmail;
