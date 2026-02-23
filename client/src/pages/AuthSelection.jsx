import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/AuthSelection.css'

function AuthSelection() {
  const navigate = useNavigate()

  return (
    <div className="auth-selection">
      <Navbar />
      <div className="selection-container">
        {/* Header */}
        <div className="selection-header">
          <h1 className="app-title">🚗 Park Plaza</h1>
          <p className="app-subtitle">Vehicle Management System</p>
        </div>

        {/* Selection Cards */}
        <div className="selection-grid">
          {/* User Option */}
          <div className="selection-card user-card">
            <div className="card-icon">👤</div>
            <h2>User / Customer</h2>
            <p>Book parking, car wash & repair services</p>
            <div className="card-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/user/login')}
              >
                Login
              </button>
              <span className="divider-text">or</span>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/user/register')}
              >
                Register
              </button>
            </div>
          </div>

          {/* Dealer Option */}
          <div className="selection-card dealer-card">
            <div className="card-icon">🏢</div>
            <h2>Dealer / Showroom</h2>
            <p>Manage showroom and services</p>
            <div className="card-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/dealer/login')}
              >
                Login
              </button>
              <span className="divider-text">or</span>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/dealer-registration')}
              >
                Register
              </button>
            </div>
          </div>

          {/* Admin Option */}
          <div className="selection-card admin-card">
            <div className="card-icon">⚙️</div>
            <h2>Admin</h2>
            <p>System administration and control</p>
            <div className="card-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/admin/login')}
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="selection-footer">
          <button
            onClick={() => navigate('/')}
            className="btn btn-home"
          >
            🏠 Return to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthSelection
