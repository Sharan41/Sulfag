import React from 'react'
import { ShieldCheckIcon, LiquidIcon, PowderIcon, CapsuleIcon, GranuleIcon } from '../components/Icons'
import './AboutIndustry.css'

const AboutIndustry = () => {
  return (
    <div className="about-industry-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <h1 className="page-hero-title">About the Agrochemical Industry</h1>
          <nav className="breadcrumb">
            <a href="/">Home</a> <span> &gt; </span> About the Industry
          </nav>
        </div>
      </section>

      {/* Intro Section */}
      <section className="industry-intro">
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
      <section className="industry-regulation">
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

      {/* Formulations Section */}
      <section className="industry-formulations">
        <div className="content-container">
          <div className="section-header">
            <div className="section-badge">Formulations</div>
            <h2 className="section-title">The Art of Formulation</h2>
            <p className="section-subtitle">
              The agro-chemical formulations industry manufactures pesticide products such as 
              insecticides, herbicides, weedicides and fungicides by converting technical-grade 
              active ingredients into usable forms:
            </p>
          </div>
          <div className="formulations-grid">
            <div className="formulation-card">
              <div className="formulation-icon-wrapper">
                <LiquidIcon className="formulation-icon" size={56} />
              </div>
              <h3 className="formulation-label">LIQUIDS</h3>
              <p className="formulation-description">Suspension & Emulsion</p>
            </div>
            <div className="formulation-card">
              <div className="formulation-icon-wrapper">
                <PowderIcon className="formulation-icon" size={56} />
              </div>
              <h3 className="formulation-label">POWDERS</h3>
              <p className="formulation-description">Wettable & Soluble</p>
            </div>
            <div className="formulation-card">
              <div className="formulation-icon-wrapper">
                <CapsuleIcon className="formulation-icon" size={56} />
              </div>
              <h3 className="formulation-label">CAPSULES</h3>
              <p className="formulation-description">Controlled Release</p>
            </div>
            <div className="formulation-card">
              <div className="formulation-icon-wrapper">
                <GranuleIcon className="formulation-icon" size={56} />
              </div>
              <h3 className="formulation-label">GRANULES</h3>
              <p className="formulation-description">Ready-to-Use</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="industry-stats">
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
    </div>
  )
}

export default AboutIndustry

