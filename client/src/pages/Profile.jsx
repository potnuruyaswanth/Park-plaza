import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, loading: authLoading, accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user && accessToken) {
      fetchProfile();
    }
  }, [user, authLoading, accessToken]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const endpoint = user?.role === 'EMPLOYEE' ? '/employee/profile' : '/user/profile';
      const response = await api.get(endpoint);
      setProfile(response.data.user);
    } catch (err) {
      console.error('Profile fetch error:', err.response?.status, err.response?.data);
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
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
    <div className="min-h-screen bg-gray-100 py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-3 md:px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          <Link
            to="/profile/edit"
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-center"
          >
            Edit Profile
          </Link>
        </div>

        <Card>
          <div className="space-y-6">
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                {profile?.username?.[0]?.toUpperCase() || profile?.name?.[0]?.toUpperCase()}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">{profile?.name}</h2>
                <p className="text-gray-600">@{profile?.username}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                  {profile?.role}
                </span>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-6 border-t">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Email</label>
                <p className="text-base sm:text-lg break-all">{profile?.email}</p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Phone</label>
                <p className="text-base sm:text-lg">{profile?.phone}</p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Username</label>
                <p className="text-base sm:text-lg">@{profile?.username}</p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Account Status</label>
                <p className="text-base sm:text-lg">
                  {profile?.isActive ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Inactive</span>
                  )}
                </p>
              </div>

              {profile?.address && (
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Address</label>
                  <p className="text-base sm:text-lg">
                    {profile.address.street && `${profile.address.street}, `}
                    {profile.address.city && `${profile.address.city}, `}
                    {profile.address.state && `${profile.address.state} `}
                    {profile.address.zipCode && `${profile.address.zipCode}, `}
                    {profile.address.country}
                  </p>
                </div>
              )}

              {profile?.showroomId && (
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Assigned Showroom</label>
                  <p className="text-base sm:text-lg">{profile.showroomId.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{profile.showroomId.address}, {profile.showroomId.city}</p>
                </div>
              )}
            </div>

            {/* Account Stats */}
            <div className="pt-6 border-t">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div>
                  <span className="font-medium">Member since:</span>{' '}
                  {new Date(profile?.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Last updated:</span>{' '}
                  {new Date(profile?.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
