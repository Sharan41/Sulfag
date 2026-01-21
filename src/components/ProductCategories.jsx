import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldIcon, MushroomIcon, LeafIcon, BoxIcon } from './Icons'
import './ProductCategories.css'

const ProductCategories = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const categories = [
    {
      id: 'insecticides',
      Icon: ShieldIcon,
      title: 'INSECTICIDES',
      link: '/products?category=insecticides',
      description: 'Protect crops from harmful insects',
      image: 'https://plus.unsplash.com/premium_photo-1661942064041-a15c0c93d2a5?fm=jpg&q=80&w=1200&fit=crop&ixlib=rb-4.1.0'
    },
    {
      id: 'fungicides',
      Icon: MushroomIcon,
      title: 'FUNGICIDES',
      link: '/products?category=fungicides',
      description: 'Control fungal diseases effectively',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&h=800&fit=crop&q=90&auto=format'
    },
    {
      id: 'herbicides',
      Icon: LeafIcon,
      title: 'HERBICIDES',
      link: '/products?category=herbicides',
      description: 'Manage weeds and unwanted plants',
      image: 'https://tse1.mm.bing.net/th/id/OIP.UHaGoa9dW6pXDCap41rHyAHaE8?pid=Api&rs=1'
    },
    {
      id: 'specialty',
      Icon: BoxIcon,
      title: 'SPECIALTY',
      link: '/products?category=specialty',
      description: 'Specialized solutions for unique needs',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=800&fit=crop&q=90&auto=format'
    }
  ]

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
    <section className="product-categories" ref={sectionRef}>
      <div className="categories-container">
        <h2 className="categories-title">Our Product Range</h2>
        <div className="categories-title-underline"></div>
        
        <div className={`categories-grid ${isVisible ? 'animate-in' : ''}`}>
          {categories.map((category, index) => {
            const IconComponent = category.Icon
            return (
              <Link 
                key={category.id} 
                to={category.link}
                className="category-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="category-image-wrapper">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="category-image"
                    loading="lazy"
                  />
                  <div className="category-image-overlay"></div>
                </div>
                <div className="category-content">
                  <h3 className="category-title">{category.title}</h3>
                  <p className="category-description">{category.description}</p>
                  <span className="category-link-btn">
                    View All
                    <span className="arrow">→</span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProductCategories

