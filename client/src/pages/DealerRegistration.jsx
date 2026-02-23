import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/DealerRegistration.css'

export default function DealerRegistration() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    dealerName: '',
    username: '',
    email: '',
    phone: '',
    addressStreet: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.dealerName.trim()) {
      newErrors.dealerName = 'Dealer/Showroom name is required'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits'
    }

    if (!formData.addressStreet.trim()) {
      newErrors.addressStreet = 'Street address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required'
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // TODO: Send registration request to backend
      console.log('Dealer Registration Request:', formData)

      // Simulate API call
      setTimeout(() => {
        setSubmitted(true)
        setLoading(false)
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/')
        }, 3000)
      }, 1000)
    } catch (error) {
      console.error('Error submitting registration:', error)
      setLoading(false)
      alert('Error submitting registration. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="registration-page">
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h2>Registration Request Submitted Successfully!</h2>
          <p>Thank you for registering as a dealer with Park Plaza.</p>
          <div className="success-details">
            <p>📋 Your registration request has been submitted for admin verification.</p>
            <p>⏱ We will verify your details and conduct a background check.</p>
            <p>✉️ You will receive an email at <strong>{formData.email}</strong> once your request is approved or rejected.</p>
          </div>
          <p className="redirect-message">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="form-header">
          <h1>Become a Park Plaza Dealer</h1>
          <p>Register your showroom and manage parking, car wash & repair services</p>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          {/* ====== BUSINESS INFORMATION ====== */}
          <fieldset className="form-section">
            <legend>Business Information</legend>

            <div className="form-group">
              <label htmlFor="dealerName">Dealer/Showroom Name *</label>
              <input
                type="text"
                id="dealerName"
                name="dealerName"
                placeholder="Enter your showroom name"
                value={formData.dealerName}
                onChange={handleChange}
                className={errors.dealerName ? 'input-error' : ''}
              />
              {errors.dealerName && <span className="error-text">{errors.dealerName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'input-error' : ''}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'input-error' : ''}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </fieldset>

          {/* ====== SHOWROOM ADDRESS ====== */}
          <fieldset className="form-section">
            <legend>Showroom Address</legend>

            <div className="form-group">
              <label htmlFor="addressStreet">Street Address *</label>
              <input
                type="text"
                id="addressStreet"
                name="addressStreet"
                placeholder="123 Main Street"
                value={formData.addressStreet}
                onChange={handleChange}
                className={errors.addressStreet ? 'input-error' : ''}
              />
              {errors.addressStreet && <span className="error-text">{errors.addressStreet}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'input-error' : ''}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? 'input-error' : ''}
                />
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code *</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  placeholder="6-digit postal code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={errors.postalCode ? 'input-error' : ''}
                />
                {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="country">Country *</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={handleChange}
                  className={errors.country ? 'input-error' : ''}
                />
                {errors.country && <span className="error-text">{errors.country}</span>}
              </div>
            </div>
          </fieldset>

          {/* ====== FORM ACTIONS ====== */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-submit"
              disabled={loading}
            >
              {loading ? '⏳ Submitting...' : '✅ Submit Registration Request'}
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => navigate('/auth')}
              disabled={loading}
            >
              ← Back to Login Options
            </button>
            <button
              type="button"
              className="btn btn-home"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              🏠 Return to Home
            </button>
          </div>

          {/* ====== NOTICE ====== */}
          <div className="form-notice">
            <p>🔍 <strong>Verification Process:</strong> After submission, our admin team will verify your details and conduct a background check. You will receive an email notification with the status of your application.</p>
            <p>⚡ <strong>Note:</strong> Approval may take 2-3 business days. Make sure all information is accurate.</p>
          </div>
        </form>
      </div>
    </div>
  )
}
