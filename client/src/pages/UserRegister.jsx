import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Register.css'

function UserRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // Step 1: Basic Info, Step 2: Address
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Address
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.phone) newErrors.phone = 'Phone is required'
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits'
    }
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.street.trim()) newErrors.street = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep2()) return

    setLoading(true)
    
    // TODO: Connect to backend API
    console.log('Register User:', formData)

    // Simulate registration
    setTimeout(() => {
      setLoading(false)
      alert('Registration successful! Please login.')
      navigate('/user/login')
    }, 1500)
  }

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="register-icon">📝</div>
          <h1>Create Account</h1>
          <p>Join Park Plaza as a user</p>
        </div>

        {/* Progress Indicator */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Basic Info</p>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Address</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="form-step">
              <h2>Basic Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="username">Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                  />
                  {errors.username && <span className="error">{errors.username}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="btn btn-primary btn-block"
              >
                Next Step →
              </button>
            </div>
          )}

          {/* Step 2: Address Information */}
          {step === 2 && (
            <div className="form-step">
              <h2>Address Information</h2>

              <div className="form-group">
                <label htmlFor="street">Street Address *</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                />
                {errors.street && <span className="error">{errors.street}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                  />
                  {errors.city && <span className="error">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                  />
                  {errors.state && <span className="error">{errors.state}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="400001"
                  />
                  {errors.postalCode && <span className="error">{errors.postalCode}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                  />
                  {errors.country && <span className="error">{errors.country}</span>}
                </div>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn btn-secondary"
                >
                  ← Previous
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Login Link */}
        <div className="register-footer">
          <p>Already have an account?</p>
          <Link to="/user/login" className="link">Login here</Link>
        </div>

        {/* Back Link */}
        <div className="back-link">
          <Link to="/" className="link small">← Back to Login Options</Link>
        </div>
      </div>
    </div>
  )
}

export default UserRegister
