import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check username availability when username changes
    if (name === 'username' && value.length >= 3) {
      checkUsernameAvailability(value);
    } else if (name === 'username') {
      setUsernameStatus({ checking: false, available: null, message: '' });
    }
  };

  const checkUsernameAvailability = async (username) => {
    setUsernameStatus({ checking: true, available: null, message: 'Checking...' });
    
    try {
      const response = await api.get(`/auth/check-username?username=${username}`);
      const { available, message } = response.data;
      
      setUsernameStatus({
        checking: false,
        available,
        message
      });
    } catch (err) {
      setUsernameStatus({
        checking: false,
        available: null,
        message: 'Error checking username'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Username validation
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    if (usernameStatus.available === false) {
      setError('Username is already taken. Please choose a different username.');
      setLoading(false);
      return;
    }

    if (!/^[A-Z0-9._%+-]+@gmail\.com$/i.test(formData.email)) {
      setError('Email must be a valid @gmail.com address');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register-user', formData);
      navigate('/login/user', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a unique username"
              required
              pattern="[a-zA-Z0-9_]{3,30}"
              title="Username must be 3-30 characters and can only contain letters, numbers, and underscores"
            />
            {formData.username && (
              <div className="mt-1 text-sm">
                {usernameStatus.checking && (
                  <span className="text-gray-500">{usernameStatus.message}</span>
                )}
                {!usernameStatus.checking && usernameStatus.available === true && (
                  <span className="text-green-600">✓ {usernameStatus.message}</span>
                )}
                {!usernameStatus.checking && usernameStatus.available === false && (
                  <span className="text-red-600">✗ {usernameStatus.message}</span>
                )}
              </div>
            )}
          </div>

          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />

          <Input
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login/user" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
