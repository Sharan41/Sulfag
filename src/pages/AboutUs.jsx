import React, { useEffect, useRef, useState } from 'react'
import ContactCTA from '../components/ContactCTA'
import { ShieldCheckIcon, LiquidIcon, PowderIcon, CapsuleIcon, GranuleIcon } from '../components/Icons'
import './AboutUs.css'

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef(null)
  const sectionRefs = useRef([])

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
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            sectionObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) sectionObserver.observe(ref)
    })

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) sectionObserver.unobserve(ref)
      })
    }
  }, [])

  return (
    <div className="about-us-page">
      {/* Page Hero */}
      <section className="page-hero" ref={heroRef}>
        <div className="page-hero-overlay"></div>
        <div className={`page-hero-content ${isVisible ? 'animate-in' : ''}`}>
          <h1 className="page-hero-title">About Sulfag Products</h1>
          <p className="page-hero-subtitle">Pioneers Since 1987</p>
          <nav className="breadcrumb">
            <a href="/">Home</a> <span> &gt; </span> About Us
          </nav>
        </div>
      </section>

      {/* Company Intro */}
      <section className="company-intro" ref={(el) => (sectionRefs.current[0] = el)}>
        <div className="content-container">
          <div className="intro-content">
            <div className="intro-image">
              <div className="image-overlay"></div>
              <img 
                src="https://plus.unsplash.com/premium_photo-1661825521051-94a8ad2ad079?fm=jpg&q=80&w=1200&fit=crop&ixlib=rb-4.1.0" 
                alt="A person spraying pesticide on a field" 
              />
            </div>
            <div className="intro-text">
              <div className="section-badge">About Us</div>
              <h2 className="section-title">Our Story</h2>
              <div className="section-text-wrapper">
                <p className="section-text">
                  M/s Sulfag Products Limited a Limited Company, formulating Public health 
                  and a wide range of Agro chemicals.
                </p>
                <p className="section-text">
                  We are experienced in the field of formulating and distribution of Pesticides 
                  such as Insecticides, Fungicides, Herbicides etc., for about 39 years.
                </p>
                <p className="section-text">
                  Being one of the pioneers in pesticides manufacturing, the company has always 
                  placed a lot of emphasis on having a classic infrastructure to formulate 
                  pesticides in liquid, powder, capsules etc.
                </p>
                <p className="section-text highlight">
                  The company is continuously upgrading and updating its infrastructure to offer 
                  quality pesticides to farmers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Intro Section */}
      <section className="industry-intro" ref={(el) => (sectionRefs.current[1] = el)}>
        <div className="content-container">
          <div className="section-header">
            <div className="section-badge">Industry Overview</div>
            <h2 className="section-title">Protecting Crops, Feeding the World</h2>
            <p className="section-text">
              The agrochemical industry plays a vital role in modern agriculture by protecting crops from pests, 
              weeds, and plant diseases, ultimately helping farmers improve quality and quantity. 
              By safeguarding plants at every stage of growth, it ensures that farmers can meet 
              the increasing food demands of a growing population, making it an essential 
              pillar of global food security.
            </p>
          </div>
        </div>
      </section>

      {/* Regulation Section */}
      <section className="industry-regulation" ref={(el) => (sectionRefs.current[2] = el)}>
        <div className="content-container">
          <div className="regulation-content">
            <div className="regulation-icon-wrapper">
              <ShieldCheckIcon className="regulation-icon" size={80} />
            </div>
            <div className="regulation-text">
              <div className="section-badge">Compliance</div>
              <h3 className="subsection-title">A Highly Regulated Industry</h3>
              <p className="section-text">
                The industry is one of the most closely regulated sectors, with strict 
                standards for safety, efficacy, and environmental impact. Over the years, it 
                has evolved significantly as both government bodies and consumers have become 
                more conscious of health and sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="infrastructure-section" ref={(el) => (sectionRefs.current[3] = el)}>
        <div className="content-container">
          <div className="section-header">
            <div className="section-badge">Capabilities</div>
            <h2 className="section-title">Our Infrastructure</h2>
            <p className="section-subtitle">
              Being one of the pioneers in pesticides manufacturing, the company has always 
              placed emphasis on having classic infrastructure to formulate pesticides in:
            </p>
          </div>
          <div className="infrastructure-grid">
            <div className="infrastructure-card">
              <div className="infrastructure-icon-wrapper">
                <LiquidIcon className="infrastructure-icon" size={56} />
              </div>
              <div className="infrastructure-label">Liquid</div>
              <div className="infrastructure-description">Suspension & Emulsion formulations</div>
            </div>
            <div className="infrastructure-card">
              <div className="infrastructure-icon-wrapper">
                <PowderIcon className="infrastructure-icon" size={56} />
              </div>
              <div className="infrastructure-label">Powder</div>
              <div className="infrastructure-description">Wettable & Soluble powders</div>
            </div>
            <div className="infrastructure-card">
              <div className="infrastructure-icon-wrapper">
                <CapsuleIcon className="infrastructure-icon" size={56} />
              </div>
              <div className="infrastructure-label">Capsules</div>
              <div className="infrastructure-description">Controlled release formulations</div>
            </div>
            <div className="infrastructure-card">
              <div className="infrastructure-icon-wrapper">
                <GranuleIcon className="infrastructure-icon" size={56} />
              </div>
              <div className="infrastructure-label">Granules</div>
              <div className="infrastructure-description">Ready-to-use granular products</div>
            </div>
          </div>
          <p className="section-text-center">
            The company is continuously upgrading and updating its infrastructure to offer 
            quality pesticides to farmers.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="industry-stats" ref={(el) => (sectionRefs.current[4] = el)}>
        <div className="content-container">
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">30-40%</div>
              <div className="stat-label">Crop Loss</div>
              <div className="stat-description">Without Protection</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">GLOBAL</div>
              <div className="stat-label">MARKET</div>
              <div className="stat-description">DRIVEN</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">FOOD</div>
              <div className="stat-label">SECURITY</div>
              <div className="stat-description">ENABLER</div>
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />
    </div>
  )
}

export default AboutUs

