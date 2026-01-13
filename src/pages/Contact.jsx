import React, { useEffect, useRef, useState } from 'react'
import { EmailIcon, LocationIcon, PhoneIcon, ClockIcon, InfoIcon } from '../components/Icons'
import './Contact.css'

const Contact = () => {
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
          {/* Contact Information Cards */}
          <div className="contact-cards-grid">
            <div className="contact-card">
              <div className="contact-card-icon-wrapper">
                <EmailIcon className="contact-card-icon" size={32} />
              </div>
              <h3 className="contact-card-title">Email Us</h3>
              <p className="contact-card-description">Send us an email anytime</p>
              <a href="mailto:agroproducts.ch@gmail.com" className="contact-card-link">
                agroproducts.ch@gmail.com
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon-wrapper">
                <LocationIcon className="contact-card-icon" size={32} />
              </div>
              <h3 className="contact-card-title">Visit Us</h3>
              <p className="contact-card-description">Our manufacturing facility</p>
              <p className="contact-card-text">
                SIDCO Industrial Estate,<br />
                Vichoor, Chennai
              </p>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon-wrapper">
                <ClockIcon className="contact-card-icon" size={32} />
              </div>
              <h3 className="contact-card-title">Business Hours</h3>
              <p className="contact-card-description">Contact us for operating hours</p>
              <div className="contact-card-hours">
                <p className="contact-card-text">
                  Please email us to inquire about our business hours and availability.
                </p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="contact-map-section">
            <h2 className="section-title">Find Us on Map</h2>
            <p className="section-subtitle">Visit our facility or get directions</p>
            <div className="contact-map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d80.0!3d13.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAwJzAwLjAiTiA4MMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sulfag Products Location"
              ></iframe>
              <div className="map-actions">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=SIDCO+Industrial+Estate+Vichoor+Chennai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-button"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>

          {/* Why Contact Us Section */}
          <div className="contact-info-section">
            <div className="info-section-header">
              <InfoIcon className="info-section-icon" size={40} />
              <h2 className="section-title">Why Contact Us?</h2>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <h3 className="info-item-title">Product Inquiries</h3>
                <p className="info-item-text">
                  Learn about our comprehensive range of insecticides, fungicides, herbicides, and specialty products for your agricultural needs.
                </p>
              </div>
              <div className="info-item">
                <h3 className="info-item-title">Technical Support</h3>
                <p className="info-item-text">
                  Get expert advice on product selection, application methods, and crop protection strategies from our experienced team.
                </p>
              </div>
              <div className="info-item">
                <h3 className="info-item-title">Bulk Orders</h3>
                <p className="info-item-text">
                  Contact us for wholesale pricing, bulk orders, and distribution partnerships. We offer competitive rates for large quantities.
                </p>
              </div>
              <div className="info-item">
                <h3 className="info-item-title">Partnership Opportunities</h3>
                <p className="info-item-text">
                  Explore dealer, distributor, and partnership opportunities with Sulfag Products. Join our network of agricultural solutions providers.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact CTA */}
          <div className="contact-cta-section">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Get Started?</h2>
              <p className="cta-text">
                Reach out to us via email for product inquiries, technical support, or business partnerships. Our team is ready to assist you with all your crop protection needs.
              </p>
              <a href="mailto:agroproducts.ch@gmail.com" className="cta-button">
                Send Us an Email →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
