import React from 'react'
import './HeritageStats.css'

const HeritageStats = () => {
  const stats = [
    {
      number: '39',
      label: 'YEARS',
      description: 'Pioneer in Indian Agrochemicals'
    },
    {
      number: '67+',
      label: 'PRODUCTS',
      description: 'Comprehensive Range for Every Crop'
    },
    {
      number: 'CHENNAI',
      label: 'MANUFACTURING',
      description: 'Quality Infrastructure Since 1987'
    }
  ]

  return (
    <section className="heritage-stats">
      <div className="stats-container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
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


