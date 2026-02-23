import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AuthSelection.css'

function AuthSelection() {
  const navigate = useNavigate()

  return (
    <div className="auth-selection">
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
            <h2>User</h2>
            <p>Customer account for booking services</p>
            <button className="btn btn-primary">Access as User</button>
          </div>

          {/* Dealer Option */}
          <div className="selection-card dealer-card" onClick={() => navigate('/dealer/login')}>
            <div className="card-icon">🏢</div>
            <h2>Dealer</h2>
            <p>Manage showroom and services</p>
            <button className="btn btn-primary">Access as Dealer</button>
          </div>

          {/* Admin Option */}
          <div className="selection-card admin-card" onClick={() => navigate('/admin/login')}>
            <div className="card-icon">⚙️</div>
            <h2>Admin</h2>
            <p>System administration and control</p>
            <button className="btn btn-primary">Access as Admin</button>
          </div>
        </div>

        {/* Footer */}
        <div className="selection-footer">
          <p>Don't have an account?</p>
          <button
            onClick={() => navigate('/user/register')}
            className="btn btn-link"
          >
            Register as User
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthSelection
