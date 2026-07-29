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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Close menu when clicking outside or on a link
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navbar')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    // Navbar is floating on all pages
    setIsFixed(false)
  }, [location])

  return (
    <nav className={`navbar ${isFixed ? 'fixed' : ''}`} role="navigation" aria-label="Main navigation">
      <Link to="/" className="logo-container" aria-label="AG-GROW PRODUCTS LIMITED Home">
        <div className="logo-wrapper">
          <img 
            src="/ag-logo.png" 
            alt="AG-GROW PRODUCTS LIMITED Logo" 
            className="logo-image"
          />
        </div>
        <span className="logo-text">AG-GROW PRODUCTS LIMITED</span>
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
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMobileMenu}>Home</Link>
        </li>
        <li>
          <Link to="/products" className={isActive('/products') ? 'active' : ''} onClick={closeMobileMenu}>Products</Link>
        </li>
        <li>
          <Link to="/about-us" className={isActive('/about-us') ? 'active' : ''} onClick={closeMobileMenu}>About Us</Link>
        </li>
      </ul>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </nav>
  )
}

export default Navbar

