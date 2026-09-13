import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import AboutUs from './pages/AboutUs'
import './App.css'

function App() {
  return (
    <Router>
    <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* One route so the listing stays mounted while a product opens over it */}
          <Route path="/products/:category?/:slug?" element={<Products />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
        <Footer />
    </div>
    </Router>
  )
}

export default App
