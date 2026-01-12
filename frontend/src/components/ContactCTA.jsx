import React from 'react'
import { Link } from 'react-router-dom'
import './ContactCTA.css'

const ContactCTA = () => {
  return (
    <section className="contact-cta">
      <div className="cta-overlay"></div>
      <div className="cta-content">
        <h2 className="cta-title">Ready to Protect Your Crops?</h2>
        <p className="cta-description">Get in touch with our team</p>
        <Link to="/contact" className="cta-button">
          Contact Us →
        </Link>
      </div>
    </section>
  )
}

export default ContactCTA


