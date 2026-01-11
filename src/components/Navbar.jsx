import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    // Navbar is floating on all pages
    setIsFixed(false)
  }, [location])

  return (
    <nav className={`navbar ${isFixed ? 'fixed' : ''}`} role="navigation" aria-label="Main navigation">
      <Link to="/" className="logo-container" aria-label="Sulfag Home">
        <div className="logo-wrapper">
          <img 
            src="/brand logo.jpeg" 
            alt="Sulfag Logo" 
            className="logo-image"
            onError={(e) => {
              e.target.src = '/logo.jpeg';
            }}
          />
        </div>
        <span className="logo-text">Sulfag Products Ltd</span>
      </Link>
      
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
        </li>
        <li>
          <Link to="/products" className={isActive('/products') ? 'active' : ''}>Products</Link>
        </li>
        <li>
          <Link to="/about-us" className={isActive('/about-us') ? 'active' : ''}>About Us</Link>
        </li>
        <li>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar

