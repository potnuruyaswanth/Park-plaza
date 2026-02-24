import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl md:text-2xl font-bold flex-shrink-0">
            <span className="hidden sm:inline">🅿️ Park Plaza</span>
            <span className="sm:hidden">🅿️</span>
          </Link>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-6">
              {/* Shop Link */}
              <NavLink 
                to="/shop" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                }
              >
                🛒 Shop
              </NavLink>

              {/* Role-specific links */}
              {user?.role === 'ADMIN' && (
                <>
                  <NavLink 
                    to="/admin/dashboard"
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink 
                    to="/admin/payments/pending"
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                    }
                  >
                    Pending Payments
                  </NavLink>
                </>
              )}

              {user?.role === 'EMPLOYEE' && (
                <>
                  <NavLink 
                    to="/employee/dashboard"
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink 
                    to="/employee/payments/pending"
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                    }
                  >
                    Pending Payments
                  </NavLink>
                </>
              )}

              {user?.role === 'USER' && (
                <>
                  <NavLink 
                    to="/bookings"
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                    }
                  >
                    My Bookings
                  </NavLink>
                  <NavLink 
                    to="/cart"
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                    }
                  >
                    🧺 My Cart
                  </NavLink>
                  <NavLink 
                    to="/payments/pending"
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                    }
                  >
                    Pending Payments
                  </NavLink>
                </>
              )}

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    {user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">
                    {user?.username || user?.name}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800">@{user?.username || user?.email}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <Link
                      to={user?.role === 'EMPLOYEE' ? '/employee/dashboard' : user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      📊 Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      👤 View Profile
                    </Link>

                    <Link
                      to="/profile/edit"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      ✏️ Edit Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      📦 My Orders
                    </Link>

                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex space-x-2 md:space-x-4">
              <Link
                to="/login"
                className="px-3 md:px-4 py-2 hover:bg-blue-700 rounded-lg transition text-sm md:text-base"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 md:px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition text-sm md:text-base"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}

          {/* Mobile Login/Register Links */}
          {!isAuthenticated && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 rounded-lg hover:bg-blue-700 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/shop"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) => 
                    `block px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                  }
                >
                  🛒 Shop
                </NavLink>

                {user?.role === 'ADMIN' && (
                  <>
                    <NavLink 
                      to="/admin/dashboard"
                      onClick={() => setShowMobileMenu(false)}
                      className={({ isActive }) => 
                        `block px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                      }
                    >
                      Dashboard
                    </NavLink>
                    <NavLink 
                      to="/admin/payments/pending"
                      onClick={() => setShowMobileMenu(false)}
                      className={({ isActive }) => 
                        `block px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                      }
                    >
                      Pending Payments
                    </NavLink>
                  </>
                )}

                {user?.role === 'EMPLOYEE' && (
                  <>
                    <NavLink 
                      to="/employee/dashboard"
                      onClick={() => setShowMobileMenu(false)}
                      className={({ isActive }) => 
                        `block px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                      }
                    >
                      Dashboard
                    </NavLink>
                    <NavLink 
                      to="/employee/payments/pending"
                      onClick={() => setShowMobileMenu(false)}
                      className={({ isActive }) => 
                        `block px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                      }
                    >
                      Pending Payments
                    </NavLink>
                  </>
                )}

                {user?.role === 'USER' && (
                  <>
                    <NavLink 
                      to="/bookings"
                      onClick={() => setShowMobileMenu(false)}
                      className={({ isActive }) => 
                        `block px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                      }
                    >
                      My Bookings
                    </NavLink>
                    <NavLink 
                      to="/cart"
                      onClick={() => setShowMobileMenu(false)}
                      className={({ isActive }) => 
                        `block px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                      }
                    >
                      🧺 My Cart
                    </NavLink>
                    <NavLink 
                      to="/payments/pending"
                      onClick={() => setShowMobileMenu(false)}
                      className={({ isActive }) => 
                        `block px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
                      }
                    >
                      Pending Payments
                    </NavLink>
                  </>
                )}

                <Link
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  👤 View Profile
                </Link>

                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-red-200 hover:bg-red-600 transition"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
