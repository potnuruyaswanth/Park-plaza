import { useNavigate } from 'react-router-dom'
import '../styles/Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-emoji">🚗</span>
          <span className="logo-text">Park Plaza</span>
        </div>
        <div className="navbar-buttons">
          <button 
            className="btn btn-outline-nav"
            onClick={() => navigate('/auth')}
          >
            🔐 Login
          </button>
          <button 
            className="btn btn-primary-nav"
            onClick={() => navigate('/user/register')}
          >
            📝 Register as User
          </button>
        </div>
      </div>
    </nav>
  )
}
