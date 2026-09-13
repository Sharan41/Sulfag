import React, { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../utils/viewTransition'

// Counts smoothly from the previous value to the new one
const AnimatedNumber = ({ value, duration = 420 }) => {
  const [display, setDisplay] = useState(value)
  const displayRef = useRef(value)

  useEffect(() => {
    const from = displayRef.current
    if (from === value || prefersReducedMotion()) {
      displayRef.current = value
      setDisplay(value)
      return undefined
    }

    let frame
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      const next = Math.round(from + (value - from) * (1 - Math.pow(1 - progress, 3)))
      displayRef.current = next
      setDisplay(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return <span className="animated-number">{display}</span>
}

export default AnimatedNumber
