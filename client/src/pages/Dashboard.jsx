import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentLocation } from '../utils/helpers';
import api from '../utils/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const Dashboard = () => {
  const [showrooms, setShowrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(10);
  const [manualCity, setManualCity] = useState('');
  const [locationAttempted, setLocationAttempted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      setLocationAttempted(true);
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
      await fetchNearbyShowrooms(currentLocation);
    } catch (error) {
      // Location denied or unavailable - user will use manual input instead
      setLocationAttempted(true);
    }
  };

  const fetchNearbyShowrooms = async (currentLocation) => {
    setLoading(true);
    try {
      const response = await api.get('/user/showrooms/nearby', {
        params: {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          radiusKm: radius
        }
      });
      setShowrooms(response.data.showrooms);
    } catch (error) {
      alert('Failed to fetch showrooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchShowroomsByCity = async () => {
    if (!manualCity.trim()) {
      alert('Please enter a city name');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/user/showrooms/city', {
        params: {
          city: manualCity,
          radiusKm: radius
        }
      });
      setShowrooms(response.data.showrooms);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to fetch showrooms for this city');
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (e) => {
    const newRadius = e.target.value;
    setRadius(newRadius);
    if (location) {
      fetchNearbyShowrooms({ ...location });
    }
  };

  const handleRefresh = () => {
    if (location) {
      fetchNearbyShowrooms(location);
    } else if (manualCity.trim()) {
      fetchShowroomsByCity();
    } else {
      alert('Please enable location or enter a city name');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Find Nearby Showrooms</h1>

        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Radius (km)
              </label>
              <Input
                type="number"
                value={radius}
                onChange={handleRadiusChange}
                min="1"
                max="50"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleRefresh} className="flex-1">
                🔄 Refresh
              </Button>
              {!location && (
                <Button onClick={getLocation} variant="secondary" className="flex-1">
                  📍 Request Location
                </Button>
              )}
            </div>
          </div>

          {/* Manual Location Input */}
          {locationAttempted && !location && (
            <div className="mt-6 pt-6 border-t border-gray-300">
              <h3 className="font-semibold mb-3">
                Search by City Name Instead
              </h3>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchShowroomsByCity()}
                />
                <Button onClick={fetchShowroomsByCity} className="flex-shrink-0">
                  🔍 Search
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Couldn't access your location? Search by city name to find nearby showrooms.
              </p>
            </div>
          )}
        </Card>

        {location && (
          <Card className="mb-8 bg-blue-50 border-l-4 border-blue-600">
            <p className="text-sm text-gray-700">
              📍 <strong>Current Location:</strong> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          </Card>
        )}

        {loading ? (
          <Card className="text-center py-12">
            <p>Loading showrooms...</p>
          </Card>
        ) : showrooms.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600">
              {location 
                ? `No showrooms found within ${radius} km` 
                : 'Enable location access or search by city name to find showrooms'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showrooms.map(showroom => (
              <Card key={showroom._id}>
                <h3 className="text-xl font-bold mb-2">{showroom.name}</h3>
                <p className="text-gray-600 text-sm mb-3">📍 {showroom.city}</p>
                <p className="text-lg font-semibold text-blue-600">
                  {showroom.distance} km away
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Available Slots: {showroom.availableSlots}/{showroom.totalParkingSlots}
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {showroom.facilities && showroom.facilities.map((facility, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {facility}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    size="sm"
                    onClick={() => navigate('/book-service', { state: { showroom } })}
                  >
                    📅 Book Service
                  </Button>
                  <Button variant="secondary" className="flex-1" size="sm">
                    ℹ️ Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
