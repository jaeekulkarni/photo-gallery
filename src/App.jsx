
import React, { useState, useEffect } from 'react';
import PhotoGallery from './components/PhotoGallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const currentProgress = (window.scrollY / scrollHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="app-wrapper">

      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin="0"
        aria-valuemax="100"
      />

      <div className="app-container">

        {/* Website Header */}
        <header className="app-header">
          <div className="header-badge">Online Gallery</div>
          <h1 className="app-title">The Photo Journal</h1>
          <p className="app-subtitle">
            Discover beautiful photography from around the world.
          </p>
        </header>

        {/* Photo Gallery */}
        <main className="app-main">
          <PhotoGallery />
        </main>

      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Scroll to top"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}

    </div>
  );
}

export default App;
