import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './AboutSnippet.css'

const AboutSnippet = () => {
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
    <section className="about-snippet" ref={sectionRef}>
      <div className="about-container">
        <div className={`about-content ${isVisible ? 'animate-in' : ''}`}>
          <div className="about-image">
            <div className="image-overlay"></div>
            <img 
              src="https://plus.unsplash.com/premium_photo-1661825521051-94a8ad2ad079?fm=jpg&q=80&w=1200&fit=crop&ixlib=rb-4.1.0" 
              alt="A person spraying pesticide on a field" 
            />
          </div>
          <div className="about-text">
            <div className="section-badge">About Us</div>
            <h2 className="about-title">About Sulfag Products</h2>
            <p className="about-description">
              M/s Sulfag Products Limited is a formulator of public health and 
              agrochemicals with 39 years of experience. We are experienced in 
              the field of formulating and distribution of Pesticides such as 
              Insecticides, Fungicides, Herbicides etc.
            </p>
            <p className="about-description">
              Being one of the pioneers in pesticides manufacturing, the company 
              has always placed emphasis on having classic infrastructure to 
              formulate pesticides. The company is continuously upgrading and 
              updating its infrastructure to offer quality pesticides to farmers.
            </p>
            <Link to="/about-us" className="about-link">
              Learn More
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSnippet

