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
          <div className="selection-card user-card" onClick={() => navigate('/user/login')}>
            <div className="card-icon">👤</div>
            <h2>User / Customer</h2>
            <p>Book parking, car wash & repair services</p>
          </div>

          {/* Dealer Option */}
          <div className="selection-card dealer-card" onClick={() => navigate('/dealer/login')}>
            <div className="card-icon">🏢</div>
            <h2>Dealer / Showroom</h2>
            <p>Manage showroom and services</p>
          </div>

          {/* Admin Option */}
          <div className="selection-card admin-card" onClick={() => navigate('/admin/login')}>
            <div className="card-icon">⚙️</div>
            <h2>Admin</h2>
            <p>System administration and control</p>
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
