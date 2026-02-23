import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Mock data
  const services = [
    {
      id: 1,
      icon: '🅿️',
      title: 'Parking Slot Booking',
      features: ['Real-time availability', 'Time-based booking', 'Digital entry confirmation']
    },
    {
      id: 2,
      icon: '🧼',
      title: 'Car Washing Service',
      features: ['Interior & exterior wash', 'Premium detailing', 'Scheduled pickup']
    },
    {
      id: 3,
      icon: '🔧',
      title: 'Car Repair & Inspection',
      features: ['Vehicle inspection', 'Transparent invoices', 'Digital approval']
    }
  ]

  const steps = [
    { number: '1', title: 'Register/Login', description: 'Create your account' },
    { number: '2', title: 'Find Showroom', description: 'Locate nearby service center' },
    { number: '3', title: 'Book Service', description: 'Choose date & time' },
    { number: '4', title: 'Inspection', description: 'Dealer inspects your vehicle' },
    { number: '5', title: 'Invoice', description: 'Review service details' },
    { number: '6', title: 'Payment', description: 'Secure online payment' },
    { number: '7', title: 'Pickup', description: 'Collect your vehicle' }
  ]

  const showrooms = [
    {
      id: 1,
      name: 'Downtown Parking Hub',
      distance: '2.4 km away',
      rating: 4.8,
      address: '123 Main Street',
      services: ['Parking', 'Car Wash', 'Repair'],
      availability: '8 slots available'
    },
    {
      id: 2,
      name: 'Express Auto Care',
      distance: '5.1 km away',
      rating: 4.6,
      address: '456 Oak Avenue',
      services: ['Parking', 'Car Wash', 'Repair'],
      availability: '12 slots available'
    },
    {
      id: 3,
      name: 'Premium Service Center',
      distance: '7.8 km away',
      rating: 4.9,
      address: '789 Pine Road',
      services: ['Parking', 'Car Wash', 'Repair'],
      availability: '5 slots available'
    }
  ]

  const features = [
    { icon: '🔐', title: 'Secure Payments', desc: 'End-to-end encrypted transactions' },
    { icon: '📍', title: 'Location-Based Services', desc: 'Find showrooms near you' },
    { icon: '🧾', title: 'Transparent Invoices', desc: 'Clear pricing breakdown' },
    { icon: '👨‍🔧', title: 'Certified Mechanics', desc: 'Trained professionals' },
    { icon: '⏱', title: 'Time Slot Booking', desc: 'No waiting, instant booking' },
    { icon: '📊', title: 'Real-Time Updates', desc: 'Track service progress' }
  ]

  const stats = [
    { number: '5000+', label: 'Active Users' },
    { number: '200+', label: 'Showrooms' },
    { number: '15000+', label: 'Services Completed' },
    { number: '98%', label: 'Customer Satisfaction' }
  ]

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Customer',
      text: 'Amazing service! Booked a car wash and it was done in time.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Priya Singh',
      role: 'Customer',
      text: 'Very convenient platform. Love the real-time updates.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Amit Patel',
      role: 'Dealer',
      text: 'Great system to manage bookings and invoices seamlessly.',
      rating: 5,
      avatar: '👨‍🔧'
    }
  ]

  return (
    <div className="home-page">
      {/* ====== HERO SECTION ====== */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Smart Parking & Vehicle Service System</h1>
            <p className="hero-tagline">
              Book parking, car wash & repair services near you with just a tap
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/user/login')}
              >
                🔵 Book Now
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => document.querySelector('.showrooms-section').scrollIntoView({ behavior: 'smooth' })}
              >
                🟢 Find Nearby Showrooms
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <span className="car-emoji">🚗</span>
              <span className="parking-emoji">🅿️</span>
              <span className="location-emoji">📍</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== SERVICES SECTION ====== */}
      <section className="services-section">
        <div className="section-header">
          <h2>Our Services</h2>
          <p>Everything you need for your vehicle in one platform</p>
        </div>
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
              <button className="btn btn-outline">Learn More</button>
            </div>
          ))}
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Simple 7-step process to book and manage services</p>
        </div>
        <div className="timeline-container">
          <div className="timeline">
            {steps.map((step, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-marker">
                  <span className="step-number">{step.number}</span>
                </div>
                <div className="timeline-content">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
                {idx < steps.length - 1 && <div className="timeline-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== NEARBY SHOWROOMS ====== */}
      <section className="showrooms-section">
        <div className="section-header">
          <h2>Top Nearby Showrooms</h2>
          <p>Geo-location based service centers closest to you</p>
        </div>
        <div className="showrooms-grid">
          {showrooms.map(showroom => (
            <div key={showroom.id} className="showroom-card">
              <div className="showroom-header">
                <h3>{showroom.name}</h3>
                <span className="rating">⭐ {showroom.rating}</span>
              </div>
              <p className="address">📍 {showroom.address}</p>
              <p className="distance">🚗 {showroom.distance}</p>
              <p className="availability">✓ {showroom.availability}</p>
              <div className="services-list">
                {showroom.services.map((svc, idx) => (
                  <span key={idx} className="service-tag">{svc}</span>
                ))}
              </div>
              <button className="btn btn-primary btn-full">Book Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* ====== WHY CHOOSE US ====== */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Park Plaza?</h2>
          <p>We provide the best experience with industry-leading features</p>
        </div>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== FOR DEALERS SECTION ====== */}
      <section className="dealers-section">
        <div className="dealers-content">
          <div className="dealers-text">
            <h2>Own a Showroom or Service Center?</h2>
            <p>Join our growing network of dealers and expand your business</p>
            <div className="dealer-benefits">
              <div className="benefit">
                <span className="benefit-icon">📊</span>
                <span>Manage all bookings from dashboard</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🧾</span>
                <span>Generate invoices automatically</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">💰</span>
                <span>Track revenue and analytics</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🅿️</span>
                <span>Manage parking slots efficiently</span>
              </div>
            </div>
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/dealer/login')}
            >
              👉 Register as Dealer
            </button>
          </div>
          <div className="dealers-image">
            <div className="dealers-illustration">
              <span>🏢</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== STATISTICS SECTION ====== */}
      <section className="stats-section">
        <div className="section-header">
          <h2>Park Plaza by Numbers</h2>
        </div>
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== TESTIMONIALS SECTION ====== */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Real feedback from our satisfied customers and dealers</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar">{testimonial.avatar}</div>
                <div>
                  <h4>{testimonial.name}</h4>
                  <p className="role">{testimonial.role}</p>
                </div>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="rating-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section className="cta-section">
        <h2>Book Your Slot Today & Save Time</h2>
        <p>Join thousands of users enjoying seamless parking & service booking</p>
        <div className="cta-buttons">
          <button 
            className="btn btn-primary btn-large"
            onClick={() => navigate('/user/login')}
          >
            👉 Get Started as User
          </button>
          <button 
            className="btn btn-secondary btn-large"
            onClick={() => navigate('/dealer/login')}
          >
            👉 Get Started as Dealer
          </button>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-column">
            <h4>Park Plaza</h4>
            <p>Smart Parking & Vehicle Service System</p>
          </div>
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#showrooms">Showrooms</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#facebook">📱</a>
              <a href="#twitter">🐦</a>
              <a href="#instagram">📷</a>
              <a href="#linkedin">💼</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Park Plaza. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
