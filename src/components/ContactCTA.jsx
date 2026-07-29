import React, { useEffect, useRef, useState } from 'react'
import './ContactCTA.css'

const ContactCTA = () => {
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
    <section className="contact-cta" ref={sectionRef}>
      <div className="cta-overlay"></div>
      <div className={`cta-content ${isVisible ? 'animate-in' : ''}`}>
        <h2 className="cta-title">Ready to Protect Your Crops?</h2>
        <p className="cta-description">Get in touch with our team</p>
        <a href="mailto:yourcropcare@gmail.com" className="cta-button">
          Contact Us →
        </a>
      </div>
    </section>
  )
}

export default ContactCTA

