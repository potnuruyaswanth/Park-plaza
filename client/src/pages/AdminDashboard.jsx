import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('USER');
  const [showrooms, setShowrooms] = useState([]);
  const [showroomId, setShowroomId] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchShowrooms();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShowrooms = async () => {
    try {
      const response = await api.get('/admin/showrooms');
      setShowrooms(response.data.showrooms || []);
    } catch (error) {
      console.error('Failed to fetch showrooms:', error);
    }
  };

  const handleSearchUsers = async () => {
    setUserError('');
    setUserLoading(true);
    setSelectedUser(null);
    try {
      const response = await api.get('/admin/users', {
        params: { search: userSearch }
      });
      setUsers(response.data.users || []);
      if ((response.data.users || []).length === 0) {
        setUserError('No users found');
      }
    } catch (error) {
      setUserError(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setUserLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setRole(user.role);
    setShowroomId(user.showroomId?._id || '');
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) {
      setUserError('Please select a user');
      return;
    }

    if (role === 'EMPLOYEE' && !showroomId) {
      setUserError('Please select a showroom for employee role');
      return;
    }

    try {
      setUserError('');
      const payload = { role };
      if (role === 'EMPLOYEE') {
        payload.showroomId = showroomId;
      }
      const response = await api.put(`/admin/users/${selectedUser._id}/role`, payload);
      const updated = response.data.user;
      setUsers(prev => prev.map(u => (u._id === updated._id ? updated : u)));
      setSelectedUser(updated);
    } catch (error) {
      setUserError(error.response?.data?.message || 'Failed to update user role');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage showrooms, employees, and user roles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-4xl font-bold text-blue-600">
              {dashboard?.totalShowrooms || 0}
            </div>
            <p className="text-gray-600 mt-2">Showrooms</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl font-bold text-green-600">
              {dashboard?.totalEmployees || 0}
            </div>
            <p className="text-gray-600 mt-2">Employees</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl font-bold text-purple-600">
              {dashboard?.totalUsers || 0}
            </div>
            <p className="text-gray-600 mt-2">Users</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl font-bold text-orange-600">
              {dashboard?.totalBookings || 0}
            </div>
            <p className="text-gray-600 mt-2">Bookings</p>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-700">
              ₹{dashboard?.totalRevenue || 0}
            </div>
            <p className="text-gray-600 mt-2">Total Revenue</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl">📊</div>
            <p className="text-gray-600 mt-2">Analytics</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">
              🏢 Manage Showrooms
            </button>
            <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700">
              👥 Manage Employees
            </button>
            <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700">
              📊 View Statistics
            </button>
            <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700">
              ⚙️ Settings
            </button>
          </div>
        </Card>

        <Card className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Change User Role</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="Search by username/email/name"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="e.g., yash or yash@email.com"
            />
            <div className="flex items-end">
              <Button onClick={handleSearchUsers} disabled={userLoading}>
                {userLoading ? 'Searching...' : 'Search Users'}
              </Button>
            </div>
          </div>

          {userError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4">
              {userError}
            </div>
          )}

          {users.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {users.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={`text-left p-3 rounded-lg border transition ${selectedUser?._id === user._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <div className="font-semibold text-gray-900">@{user.username || user.email}</div>
                  <div className="text-sm text-gray-600">{user.name} • {user.email}</div>
                  <div className="text-xs text-gray-500 mt-1">Role: {user.role}</div>
                </button>
              ))}
            </div>
          )}

          {selectedUser && (
            <div className="border-t pt-4">
              <div className="mb-2 text-sm text-gray-600">Selected user:</div>
              <div className="font-medium text-gray-900 mb-4">{selectedUser.name} (@{selectedUser.username || selectedUser.email})</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="USER">User</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                {role === 'EMPLOYEE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Showroom</label>
                    <select
                      value={showroomId}
                      onChange={(e) => setShowroomId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select a showroom</option>
                      {showrooms.map((s) => (
                        <option key={s._id} value={s._id}>{s.name} ({s.city})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-end">
                  <Button onClick={handleUpdateRole}>Update Role</Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
