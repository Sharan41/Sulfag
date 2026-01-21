import React, { useEffect, useRef, useState } from 'react'
import './HeritageStats.css'

const HeritageStats = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [countedValues, setCountedValues] = useState({ years: 0, products: 0 })
  const sectionRef = useRef(null)

  const stats = [
    {
      number: '39',
      label: 'YEARS',
      description: 'Pioneer in Indian Agrochemicals',
      type: 'number',
      target: 39
    },
    {
      number: '30+',
      label: 'PRODUCTS',
      description: 'Comprehensive Range for Every Crop',
      type: 'number',
      target: 30,
      suffix: '+'
    },
    {
      number: 'CHENNAI',
      label: 'MANUFACTURING',
      description: 'Quality Infrastructure Since 1987',
      type: 'text'
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 seconds
    const steps = 60 // 60 frames
    const stepDuration = duration / steps

    // Animate years
    let yearsStep = 0
    const yearsInterval = setInterval(() => {
      yearsStep++
      const progress = Math.min(yearsStep / steps, 1)
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCountedValues(prev => ({
        ...prev,
        years: Math.floor(39 * easeOutQuart)
      }))

      if (yearsStep >= steps) {
        clearInterval(yearsInterval)
        setCountedValues(prev => ({ ...prev, years: 39 }))
      }
    }, stepDuration)

    // Animate products
    let productsStep = 0
    const productsInterval = setInterval(() => {
      productsStep++
      const progress = Math.min(productsStep / steps, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCountedValues(prev => ({
        ...prev,
        products: Math.floor(30 * easeOutQuart)
      }))

      if (productsStep >= steps) {
        clearInterval(productsInterval)
        setCountedValues(prev => ({ ...prev, products: 30 }))
      }
    }, stepDuration)

    return () => {
      clearInterval(yearsInterval)
      clearInterval(productsInterval)
    }
  }, [isVisible])

  return (
    <section className="heritage-stats" ref={sectionRef}>
      <div className="stats-container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">
                {stat.type === 'number' ? (
                  <>
                    {stat.number === '39' ? countedValues.years : countedValues.products}
                    {stat.suffix || ''}
                  </>
                ) : (
                  stat.number
                )}
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeritageStats

