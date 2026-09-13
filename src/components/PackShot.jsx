import React from 'react'
import { normalizeCategory } from '../utils/categoryUtils'
import { getFormulation, isLiquidProduct } from '../utils/productDisplay'

// Stand-in pack drawing for products that have no photo in Contentful yet
const ACCENTS = {
  insecticides: '#48501e',
  fungicides: '#66724a',
  herbicides: '#846639',
  specialty: '#6b6e5a',
}

const PackShot = ({ product, className = '' }) => {
  const color = ACCENTS[normalizeCategory(product.category)]
  const label = String(product.brand || product.product || '').split(',')[0].trim()
  const words = label.split(/\s+/)
  const lines = label.length > 8 && words.length > 1 ? [words.slice(0, -1).join(' '), words[words.length - 1]] : [label]
  const longest = Math.max(...lines.map((line) => line.length))
  const fontSize = longest <= 5 ? 22 : longest <= 7 ? 18 : longest <= 9 ? 15 : 12
  const firstLineY = lines.length > 1 ? 136 : 146
  const formulation = getFormulation(product.product)

  return (
    <svg className={`pack-shot ${className}`} viewBox="0 0 200 236" role="img" aria-label={`${label} pack`}>
      <ellipse cx="100" cy="226" rx="58" ry="5" fill="#000" opacity="0.07" />
      {isLiquidProduct(product) ? (
        <>
          <rect x="80" y="12" width="40" height="22" rx="4" fill="#23261a" />
          <rect x="86" y="33" width="28" height="15" fill={color} />
          <path
            d="M86 47 C62 55 50 68 50 90 V204 a14 14 0 0 0 14 14 H136 a14 14 0 0 0 14 -14 V90 C150 68 138 55 114 47 Z"
            fill={color}
          />
          <rect x="56" y="96" width="5" height="104" rx="2.5" fill="#fff" opacity="0.22" />
          <rect x="62" y="106" width="76" height="98" rx="6" fill="#fbfaf4" />
        </>
      ) : (
        <>
          <path d="M50 30 H150 L158 204 a14 14 0 0 1 -14 14 H56 a14 14 0 0 1 -14 -14 Z" fill={color} />
          <rect x="50" y="30" width="100" height="16" fill="#000" opacity="0.16" />
          <circle cx="100" cy="38" r="4" fill="#fbfaf4" />
          <rect x="60" y="104" width="80" height="100" rx="6" fill="#fbfaf4" />
        </>
      )}
      {lines.map((line, index) => (
        <text
          key={line + index}
          x="100"
          y={firstLineY + index * (fontSize + 3)}
          textAnchor="middle"
          fontWeight="700"
          fontSize={fontSize}
          fill={color}
          style={{ fontFamily: 'var(--font-heading)' }}
          {...(line.length > 9 ? { textLength: 66, lengthAdjust: 'spacingAndGlyphs' } : {})}
        >
          {line}
        </text>
      ))}
      {formulation && (
        <text x="100" y="184" textAnchor="middle" fontWeight="700" fontSize="9" letterSpacing="1" fill="#6b6e5a" style={{ fontFamily: 'var(--font-body)' }}>
          {formulation}
        </text>
      )}
      <text x="100" y="196" textAnchor="middle" fontWeight="700" fontSize="7" letterSpacing="1.4" fill="#8e9969" style={{ fontFamily: 'var(--font-body)' }}>
        AG-GROW
      </text>
    </svg>
  )
}

export default PackShot
