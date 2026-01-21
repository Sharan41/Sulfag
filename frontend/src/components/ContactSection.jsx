import React, { useEffect, useRef, useState } from 'react'
import { EmailIcon, LocationIcon } from './Icons'
import './ContactSection.css'

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section className="contact-section" ref={sectionRef}>
      <div className="contact-section-container">
        <div className={`contact-info-cards ${isVisible ? 'animate-in' : ''}`}>
          <div className="contact-card" style={{ animationDelay: '0.1s' }}>
            <div className="contact-card-icon-wrapper">
              <EmailIcon className="contact-card-icon" size={32} />
            </div>
            <h3 className="contact-card-title">Email Us</h3>
            <p className="contact-card-description">Send us an email anytime</p>
            <a href="mailto:agroproducts.ch@gmail.com" className="contact-card-link">
              agroproducts.ch@gmail.com
            </a>
          </div>

          <div className="contact-card" style={{ animationDelay: '0.2s' }}>
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
        </div>
      </div>
    </section>
  )
}

export default ContactSection

