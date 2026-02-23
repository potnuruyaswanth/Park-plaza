import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Login.css'

function UserLogin({ setUser }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // TODO: Connect to backend API
    // For now, just show success message
    console.log('User Login:', formData)
    
    // Simulate login
    setTimeout(() => {
      setUser({ role: 'USER', email: formData.email })
      setLoading(false)
      navigate('/user/dashboard')
    }, 1500)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon">👤</div>
          <h1>User Login</h1>
          <p>Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Links */}
        <div className="login-links">
          <Link to="/forgot-password" className="link">Forgot Password?</Link>
        </div>

        {/* Register Link */}
        <div className="login-footer">
          <p>Don't have an account?</p>
          <Link to="/user/register" className="link">Register here</Link>
        </div>

        {/* Back Link */}
        <div className="back-link">
          <Link to="/" className="link small">← Back to Login Options</Link>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
