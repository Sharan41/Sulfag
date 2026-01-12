import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Intersection Observer for fade-in animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (contentRef.current) {
      observer.observe(contentRef.current)
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current)
      }
    }
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      {/* Background Image with Subtle Parallax */}
      <div 
        className="hero-background"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`, // Reduced from 0.5 to 0.3 for subtlety
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80" 
          alt="Agricultural field" 
        />
      </div>


      {/* Curved Shape Overlay (SVG) - Dual Layer Organic Waves */}
      <div className="hero-shape">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0 0 2200 991" fill="none" preserveAspectRatio="xMinYMax slice">
          {/* Layer 1: Light green accent (behind, shifted up to peek out) */}
          <g transform="scale(1.1) translate(30, -45)">
            <path 
              opacity="0.8" 
              d="M768.27 939.827C727.562 935.274 686.625 932.183 646.189 925.958C323.264 876.311 47.3345 742.158 -150.689 473.685C-245.952 344.523 -295.62 198.152 -295.286 36.303C-295.286 28.9301 -295.348 21.5573 -295.39 12.9103C-289.73 11.6572 -285.594 10.1743 -281.396 9.90271C-103.11 -2.35759 74.1947 -3.61081 247.572 50.297C400.544 97.8762 542.843 168.242 680.275 249.302C800.623 320.295 917.461 397.366 1045.06 455.597C1118.64 489.182 1193.12 519.927 1273.36 533.503C1374.58 550.651 1471.08 530.955 1565.15 494.154C1696.48 442.773 1800.68 355.217 1885.02 244.791C1940.27 172.461 1988.68 94.8269 2038.79 18.696C2047.79 5.01546 2056.19 -0.686502 2072.33 0.0653918C2099.15 1.29769 2126.07 0.190702 2156.9 0.0653992C2151.89 11.0099 2148.27 19.6359 2144.08 27.9487C2008.15 297.049 1824.24 525.713 1574.32 697.462C1388.89 824.889 1184.62 904.425 960.257 929.927C935.152 932.788 910.109 936.151 885.045 939.284C846.134 939.472 807.202 939.639 768.291 939.827
                 L768 1500
                 L-300 1300
                 L-300 
                 Z" 
              fill="#8E9969"
            />
          </g>
          {/* Layer 2: Dark green main curve (front) */}
          <g transform=" scale(1.1)translate(10, -50)">
            <path 
              d="M857.141 991C816.288 987.972 775.267 986.384 734.622 981.664C410.089 943.985 129.377 820.129 -78.4218 559.132C-178.384 433.584 -233.441 289.134 -239.08 127.39C-239.33 120.017 -239.685 112.644 -240.041 104.018C-234.422 102.556 -230.349 100.927 -226.172 100.488C-48.4706 81.6489 128.687 73.8374 303.924 121.312C458.546 163.189 603.372 228.271 743.687 304.193C866.561 370.675 986.178 443.401 1115.84 496.87C1190.61 527.719 1266.18 555.686 1346.86 566.297C1448.64 579.685 1544.35 556.438 1637 516.19C1766.35 459.985 1867.23 368.649 1947.45 255.173C2000 180.859 2045.49 101.491 2092.78 23.5641C2101.28 9.54931 2109.45 3.55492 2125.61 3.7011C2152.45 3.95178 2179.33 1.84228 2210.12 0.547302C2205.5 11.6797 2202.22 20.4102 2198.32 28.8901C2072.42 302.836 1897.1 538.142 1653.69 718.997C1473.1 853.213 1271.92 940.246 1048.63 974.02C1023.65 977.8 998.751 982.082 973.813 986.134C934.922 987.742 896.032 989.371 857.162 991
                 L857 1400
                 L-300 1400
                 L-300 1500
                 Z" 
              fill="#48501e"
            />
          </g>
        </svg>
      </div>

      {/* Hero Content with Scroll Animation */}
      <div className="hero-content" ref={contentRef}>
        {/* Company Name - Subtle but present */}
        <div className="hero-company-name">
          <span className="company-name-text">Sulfag Products Limited</span>
        </div>
        
        <h1 className="hero-title">
          <span className="title-line">Protecting Crops,</span>
          <br />
          <em className="title-line title-line-delay">Nurturing Growth</em>
        </h1>
        <p className="hero-description">At the forefront of agrochemical innovation since 1987, helping farmers protect their harvests and feed the nation.</p>
        <Link to="/products" className="hero-btn" aria-label="Explore our products">
          Explore Our Products
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
          </svg>
        </Link>
      </div>
    </section>
  )
}

export default Hero

