import React from 'react'
import { Link } from 'react-router-dom'
import { EmailIcon, LocationIcon } from './Icons'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-column">
            <div className="footer-logo">
              <img 
                src="/brand logo.jpeg" 
                alt="Sulfag Logo" 
                onError={(e) => {
                  e.target.src = '/logo.jpeg';
                }}
              />
            </div>
            <p className="footer-tagline">
              Pioneer in Agrochemicals since 1987
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div className="footer-column">
            <h3 className="footer-heading">Products</h3>
            <ul className="footer-links">
              <li><Link to="/products?category=insecticides">Insecticides</Link></li>
              <li><Link to="/products?category=fungicides">Fungicides</Link></li>
              <li><Link to="/products?category=herbicides">Herbicides</Link></li>
              <li><Link to="/products?category=specialty">Specialty</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column">
            <h3 className="footer-heading">Contact</h3>
            <ul className="footer-contact">
              <li>
                <EmailIcon className="footer-icon" size={18} />
                <a href="mailto:agroproducts.ch@gmail.com">agroproducts.ch@gmail.com</a>
              </li>
              <li>
                <LocationIcon className="footer-icon" size={18} />
                <span>SIDCO Industrial Estate,<br />Vichoor, Chennai</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Sulfag Products Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

