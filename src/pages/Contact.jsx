import React, { useState, useEffect, useRef } from 'react'
import { EmailIcon, LocationIcon } from '../components/Icons'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.3 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const contentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            contentObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    if (contentRef.current) {
      contentObserver.observe(contentRef.current)
    }

    return () => {
      if (contentRef.current) {
        contentObserver.unobserve(contentRef.current)
      }
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    })
  }

  return (
    <div className="contact-page">
      {/* Page Hero */}
      <section className="page-hero" ref={heroRef}>
        <div className="page-hero-overlay"></div>
        <div className={`page-hero-content ${isVisible ? 'animate-in' : ''}`}>
          <h1 className="page-hero-title">Get in Touch</h1>
          <p className="page-hero-subtitle">
            We're here to help with your crop protection needs
          </p>
          <nav className="breadcrumb">
            <a href="/">Home</a> <span> &gt; </span> Contact
          </nav>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content" ref={contentRef}>
        <div className="content-container">
          <div className="contact-layout">
            {/* Contact Info */}
            <div className="contact-info">
              <div className="contact-item">
                <EmailIcon className="contact-icon" size={24} />
                <div className="contact-details">
                  <h3 className="contact-label">EMAIL</h3>
                  <a href="mailto:agroproducts.ch@gmail.com" className="contact-value">
                    agroproducts.ch@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <LocationIcon className="contact-icon" size={24} />
                <div className="contact-details">
                  <h3 className="contact-label">ADDRESS</h3>
                  <p className="contact-value">
                    SIDCO Industrial Estate,<br />
                    Vichoor, Chennai
                  </p>
                </div>
              </div>

              <div className="contact-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d80.0!3d13.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAwJzAwLjAiTiA4MMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sulfag Products Location"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2 className="form-title">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="form-submit">
                  Send Message →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact

