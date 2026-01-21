import React from 'react'
import Hero from '../components/Hero'
import ProductCategories from '../components/ProductCategories'
import HeritageStats from '../components/HeritageStats'
import AboutSnippet from '../components/AboutSnippet'
import ContactCTA from '../components/ContactCTA'
import ContactSection from '../components/ContactSection'
import './Home.css'

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <ProductCategories />
      <HeritageStats />
      <AboutSnippet />
      <ContactCTA />
      <ContactSection />
    </div>
  )
}

export default Home








