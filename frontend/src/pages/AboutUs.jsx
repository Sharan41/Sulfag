import React, { useEffect, useRef, useState } from 'react'
import ContactCTA from '../components/ContactCTA'
import { ShieldCheckIcon } from '../components/Icons'
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
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
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
        <div className="industry-intro-background"></div>
        <div className="content-container">
          <div className="section-header">
            <div className="section-badge">Industry Overview</div>
            <h2 className="section-title">Protecting Crops, Feeding the World</h2>
            <div className="industry-content-wrapper">
              <div className="industry-intro-main">
                <p className="section-text lead">
                  The agrochemical industry plays a vital role in modern agriculture by protecting crops from pests,
                  weeds, and plant diseases, ultimately helping farmers improve quality and quantity.
                  By safeguarding plants at every stage of growth, it ensures that farmers can meet
                  the increasing food demands of a growing population, making it an essential
                  pillar of global food security.
                </p>
              </div>
              <div className="industry-highlights">
                <div className="highlight-box">
                  <h4 className="highlight-title">Strictly Regulated</h4>
                  <p className="highlight-text">
                    Operating under strict regulations, the industry ensures that pesticides are effective while
                    minimizing risks to humans and the environment.
                  </p>
                </div>
                <div className="highlight-box">
                  <h4 className="highlight-title">Market Driven</h4>
                  <p className="highlight-text">
                    Market drivers include increasing food demand, growing agricultural intensification, 
                    and the need for reliable crop protection solutions.
                  </p>
                </div>
                <div className="highlight-box">
                  <h4 className="highlight-title">Global Reach</h4>
                  <p className="highlight-text">
                    Major players include multinational crop-science companies and regional manufacturers
                    supplying both domestic and export markets.
                  </p>
                </div>
              </div>
            </div>
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
        <div className="infrastructure-background"></div>
        <div className="content-container">
          <div className="section-header">
            <div className="section-badge">Capabilities</div>
            <h2 className="section-title">Our Infrastructure</h2>
            <div className="section-subtitle-wrapper">
              <p className="section-subtitle">
                The agro-chemical formulations industry manufactures pesticide products such as 
                insecticides, herbicides, weedicides and fungicides by converting technical-grade 
                active ingredients into usable forms like liquids, powders, and granules.
              </p>
              <p className="section-subtitle">
                It plays a vital role in modern agriculture by protecting crops from pests, weeds, 
                and diseases, helping increase yields and ensure food security.
              </p>
            </div>
          </div>
          <div className="infrastructure-grid">
            <div className="infrastructure-card">
              <div className="infrastructure-image-wrapper">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1661962514374-442d58a10c91?fm=jpg&q=80&w=1200&fit=crop&ixlib=rb-4.1.0" 
                  alt="Liquid pesticide formulation"
                  className="infrastructure-image"
                />
              </div>
              <div className="infrastructure-label">Liquid</div>
              <div className="infrastructure-description">Suspension & Emulsion formulations</div>
            </div>
            <div className="infrastructure-card">
              <div className="infrastructure-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?fm=jpg&q=80&w=1200&fit=crop&ixlib=rb-4.1.0" 
                  alt="Powder pesticide formulation"
                  className="infrastructure-image"
                />
              </div>
              <div className="infrastructure-label">Powder</div>
              <div className="infrastructure-description">Wettable & Soluble powders</div>
            </div>
            <div className="infrastructure-card">
              <div className="infrastructure-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1702353531290-8fe0bfbf2732?fm=jpg&q=80&w=1200&fit=crop&ixlib=rb-4.1.0" 
                  alt="Capsule pesticide formulation"
                  className="infrastructure-image"
                />
              </div>
              <div className="infrastructure-label">Capsules</div>
              <div className="infrastructure-description">Controlled release formulations</div>
            </div>
            <div className="infrastructure-card">
              <div className="infrastructure-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1757670919588-1fe3b3df3dfa?fm=jpg&q=80&w=1200&fit=crop&ixlib=rb-4.1.0" 
                  alt="Granule pesticide formulation"
                  className="infrastructure-image"
                />
              </div>
              <div className="infrastructure-label">Granules</div>
              <div className="infrastructure-description">Ready-to-use granular products</div>
            </div>
          </div>
          <p className="section-text-center infrastructure-impact">
            These formulations are crucial for increasing agricultural yields and ensuring food security.
          </p>
        </div>
      </section>


      <ContactCTA />
    </div>
  )
}

export default AboutUs

