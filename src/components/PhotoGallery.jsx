import React, { useState, useEffect, useRef, useCallback } from 'react';
import PhotoCard from './PhotoCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

/**
 * PhotoGallery Component
 * Implements:
 * - Single-column vertical photo gallery
 * - Infinite scrolling with IntersectionObserver and useRef
 * - Search bar to filter loaded photos by author name
 * - Loading skeleton placeholders
 * - Image preview modal with close button
 * - Graceful error handling with retry capability
 */
function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Search query to filter already-loaded photos by author
  const [searchQuery, setSearchQuery] = useState('');

  // Selected photo for modal preview
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Ref tracking current page number to fetch
  const pageRef = useRef(1);

  // Ref lock to prevent duplicate simultaneous API requests
  const isFetchingRef = useRef(false);

  // Ref to sentinel element for IntersectionObserver
  const sentinelRef = useRef(null);

  // Fetch photos from Picsum API
  const fetchPhotos = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    const currentPage = pageRef.current;

    try {
      const response = await fetch(`https://picsum.photos/v2/list?page=${currentPage}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch photos (HTTP status: ${response.status})`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length === 0) {
        setHasMore(false);
      } else if (Array.isArray(data)) {
        setPhotos((prevPhotos) => {
          const existingIds = new Set(prevPhotos.map((p) => p.id));
          const uniqueNewPhotos = data.filter((item) => !existingIds.has(item.id));
          return [...prevPhotos, ...uniqueNewPhotos];
        });
        pageRef.current = currentPage + 1;
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError(err.message || 'Unable to load photos. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [hasMore]);

  // Initial load: Fetch page 1
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Infinite scrolling observer
  useEffect(() => {
    // If all photos have been loaded, don't observe
    if (!hasMore) return;

    const sentinelElement = sentinelRef.current;
    if (!sentinelElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [firstEntry] = entries;
        // Only trigger if sentinel is visible, not currently fetching, no active error, and not filtering
        if (
          firstEntry.isIntersecting &&
          !isFetchingRef.current &&
          hasMore &&
          !error &&
          searchQuery.trim() === ''
        ) {
          fetchPhotos();
        }
      },
      {
        root: null,
        rootMargin: '250px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinelElement);

    return () => {
      observer.unobserve(sentinelElement);
      observer.disconnect();
    };
  }, [fetchPhotos, hasMore, error, searchQuery]);

  // Handle escape key and body scroll lock for preview modal
  useEffect(() => {
    if (!previewPhoto) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPreviewPhoto(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [previewPhoto]);

  // Filter already-loaded photos by author
  const filteredPhotos = photos.filter((photo) =>
    photo.author.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Clear search filter
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Retry fetching
  const handleRetry = () => {
    setError(null);
    fetchPhotos();
  };

  return (
    <div className="gallery-container">
      {/* Search Bar Section */}
      <section className="search-section" aria-label="Search photos by author">
        <div className="search-bar-wrapper">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search photos by author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter photos by author name"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClearSearch}
              aria-label="Clear search query"
              title="Clear search"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>

        {/* Search Results Meta */}
        {searchQuery.trim() !== '' && (
          <div className="search-meta">
            <span>
              Showing {filteredPhotos.length} of {photos.length} loaded photos for "{searchQuery}"
            </span>
          </div>
        )}
      </section>

      {/* Single Vertical Column Photo List */}
      <div className="photos-column">
        {filteredPhotos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onOpenPreview={(selected) => setPreviewPhoto(selected)}
          />
        ))}

        {/* Empty Search Result Message */}
        {filteredPhotos.length === 0 && searchQuery.trim() !== '' && !loading && (
          <div className="no-results-box">
            <p>No photos found by author "{searchQuery}".</p>
            <button
              type="button"
              className="reset-search-btn"
              onClick={handleClearSearch}
            >
              Show all photos
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="skeleton-container" aria-label="Loading photos">
            {[1, 2].map((n) => (
              <div key={n} className="skeleton-card">
                <div className="skeleton-image shimmer" />
                <div className="skeleton-info">
                  <div className="skeleton-line skeleton-author shimmer" />
                  <div className="skeleton-line skeleton-btn shimmer" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error state with retry option */}
      {error && !loading && (
        <div className="gallery-status error-box">
          <p className="error-text">⚠️ {error}</p>
          <button
            type="button"
            className="retry-btn"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      )}

      {/* End of list message when all pages fetched */}
      {!hasMore && (
        <div className="gallery-status end-box">
          <p>🎉 All photos have been loaded. You've reached the end of the journal.</p>
        </div>
      )}

      {/* Sentinel element for infinite scrolling (active when not searching) */}
      {hasMore && !error && searchQuery.trim() === '' && (
        <div
          ref={sentinelRef}
          className="sentinel-element"
          aria-hidden="true"
        />
      )}

      {/* Image Preview Modal */}
      {previewPhoto && (
        <div
          className="preview-modal-backdrop"
          onClick={() => setPreviewPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of photograph by ${previewPhoto.author}`}
        >
          <div
            className="preview-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setPreviewPhoto(null)}
              aria-label="Close image preview"
              title="Close preview (Esc)"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="modal-image-wrapper">
              <img
                src={previewPhoto.download_url}
                alt={`Photograph by ${previewPhoto.author}`}
                className="modal-img"
              />
            </div>

            <div className="modal-caption">
              <span className="modal-author-label">Photographer</span>
              <h3 className="modal-author-name">{previewPhoto.author}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;
