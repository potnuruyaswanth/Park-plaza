import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AuthSelection from './pages/AuthSelection'
import UserLogin from './pages/UserLogin'
import DealerLogin from './pages/DealerLogin'
import AdminLogin from './pages/AdminLogin'
import UserRegister from './pages/UserRegister'
import DealerRegistration from './pages/DealerRegistration'
import './styles/App.css'

function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthSelection />} />
        <Route path="/user/login" element={<UserLogin setUser={setUser} />} />
        <Route path="/dealer/login" element={<DealerLogin setUser={setUser} />} />
        <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/dealer-registration" element={<DealerRegistration />} />
      </Routes>
    </Router>
  )
}

export default App
