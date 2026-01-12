# Sulfag Frontend

React-based frontend application for Sulfag Products Limited website.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Hero.jsx          # Main hero section component
│   │   ├── Hero.css          # Hero section styles
│   │   ├── Navbar.jsx        # Navigation bar component
│   │   └── Navbar.css        # Navbar styles
│   ├── assets/
│   │   └── logo.jpeg         # Sulfag logo
│   ├── App.jsx               # Main app component
│   ├── App.css               # App styles
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies and scripts
```

## Features

- Modern React 18 with Vite
- Responsive hero section with curved SVG overlay
- Floating navbar (Cargill-style)
- Brand-consistent styling with Sulfag colors
- Playfair Display and Source Sans 3 typography

## Brand Colors

- Primary Green: `#00703C`
- Light Green: `#8DC63F`
- Dark: `#1A1A1A`
- Cream: `#F5F5F0`


