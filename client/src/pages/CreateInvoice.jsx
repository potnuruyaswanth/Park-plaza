import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    repairDescription: '',
    repairCost: '',
    carNumber: '',
    carModel: '',
    carColor: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameValid, setUsernameValid] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Check username validity when it changes
    if (name === 'username' && value.length >= 3) {
      checkUsername(value);
    } else if (name === 'username') {
      setUsernameValid(null);
    }
  };

  const checkUsername = async (username) => {
    setUsernameChecking(true);
    try {
      const response = await api.get(`/auth/check-username?username=${username}`);
      // If username is available, it means user doesn't exist
      setUsernameValid(!response.data.available);
      setError(response.data.available ? 'User not found. Please enter a registered username.' : '');
    } catch (err) {
      setUsernameValid(null);
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.username || formData.username.length < 3) {
      setError('Please enter a valid username');
      setLoading(false);
      return;
    }

    if (!formData.repairDescription || formData.repairDescription.trim().length < 5) {
      setError('Please provide a detailed repair description (at least 5 characters)');
      setLoading(false);
      return;
    }

    if (!formData.repairCost || Number(formData.repairCost) <= 0) {
      setError('Please enter a valid repair cost');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        repairDescription: formData.repairDescription,
        repairCost: Number(formData.repairCost),
        carDetails: {
          carNumber: formData.carNumber || 'N/A',
          carModel: formData.carModel,
          carColor: formData.carColor
        },
        notes: formData.notes
      };

      const response = await api.post('/employee/invoice/generate-direct', payload);
      
      alert(`Invoice generated successfully!\nInvoice Number: ${response.data.invoice.invoiceNumber}\nAmount: ₹${response.data.invoice.totalAmount}\n\nThe invoice will appear in ${formData.username}'s pending payments.`);
      
      // Reset form
      setFormData({
        username: '',
        repairDescription: '',
        repairCost: '',
        carNumber: '',
        carModel: '',
        carColor: '',
        notes: ''
      });
      setUsernameValid(null);
      
      // Optionally navigate to invoices list
      navigate('/employee/invoices');
    } catch (err) {
      console.error('Invoice generation failed:', err);
      setError(err.response?.data?.message || 'Failed to generate invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Generate Invoice</h1>
            <Button 
              onClick={() => navigate('/employee/dashboard')}
              className="bg-gray-500 hover:bg-gray-600"
            >
              ← Back
            </Button>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>Instructions:</strong> Enter the customer's username, describe the repair problem, and specify the cost. 
              A unique invoice ID will be generated and the invoice will appear in the customer's pending payments section.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Username */}
            <div>
              <Input
                label="Customer Username *"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter registered username"
                required
                pattern="[a-zA-Z0-9_]{3,30}"
                title="Username must be 3-30 characters"
              />
              {formData.username && (
                <div className="mt-1 text-sm">
                  {usernameChecking && (
                    <span className="text-gray-500">Checking username...</span>
                  )}
                  {!usernameChecking && usernameValid === true && (
                    <span className="text-green-600">✓ User found</span>
                  )}
                  {!usernameChecking && usernameValid === false && (
                    <span className="text-red-600">✗ User not found</span>
                  )}
                </div>
              )}
            </div>

            {/* Car Details Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Car Details (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Car Number"
                  type="text"
                  name="carNumber"
                  value={formData.carNumber}
                  onChange={handleChange}
                  placeholder="e.g., MH01AB1234"
                />
                <Input
                  label="Car Model"
                  type="text"
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  placeholder="e.g., Honda City"
                />
                <Input
                  label="Car Color"
                  type="text"
                  name="carColor"
                  value={formData.carColor}
                  onChange={handleChange}
                  placeholder="e.g., White"
                />
              </div>
            </div>

            {/* Repair Details Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Repair Details</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repair Problem / Description *
                </label>
                <textarea
                  name="repairDescription"
                  value={formData.repairDescription}
                  onChange={handleChange}
                  placeholder="Describe the car repair problem in detail (e.g., Engine oil change, Brake pad replacement, AC servicing)"
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  minLength="5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 5 characters required
                </p>
              </div>

              <Input
                label="Cost of Repair (₹) *"
                type="number"
                name="repairCost"
                value={formData.repairCost}
                onChange={handleChange}
                placeholder="Enter total repair cost"
                required
                min="1"
                step="0.01"
              />
            </div>

            {/* Additional Notes Section */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes or special instructions"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Summary */}
            {formData.repairCost && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Invoice Summary</h4>
                <div className="space-y-1 text-sm">
                  {formData.username && <div><span className="font-medium">Customer:</span> @{formData.username}</div>}
                  {formData.repairDescription && <div><span className="font-medium">Service:</span> {formData.repairDescription.substring(0, 50)}{formData.repairDescription.length > 50 ? '...' : ''}</div>}
                  <div className="text-lg font-bold text-green-700 mt-2">
                    Total Amount: ₹{Number(formData.repairCost).toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || !usernameValid}
                className="flex-1"
              >
                {loading ? 'Generating Invoice...' : 'Generate Invoice & Create Payment'}
              </Button>
              <Button
                type="button"
                onClick={() => navigate('/employee/dashboard')}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateInvoice;
