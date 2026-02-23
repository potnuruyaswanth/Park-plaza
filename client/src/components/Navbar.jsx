import { useNavigate } from 'react-router-dom'
import '../styles/Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className="logo-emoji">🚗</span>
          <span className="logo-text">Park Plaza</span>
        </div>
      </div>
    </nav>
  )
}
