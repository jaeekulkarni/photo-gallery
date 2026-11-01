import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

/**
 * PhotoCard Component
 * Displays an individual photo in a clean, modern card layout.
 * - Image occupies 100% of card width with height: auto.
 * - Displays photographer's name clearly below the image.
 * - Displays minimal black Font Awesome thumbs-up icon with playful wiggle/bounce on click.
 * - Each photo has an independent like count that increments on every click.
 */
function PhotoCard({ photo, onOpenPreview }) {
  // Initialize like count to 0 for each photo
  const [likes, setLikes] = useState(0);

  // Key tracking clicks to re-trigger the wiggle/bounce animation on every click
  const [animKey, setAnimKey] = useState(0);

  // Increment like count by exactly 1 on every click (no toggle/unlike)
  const handleLike = (e) => {
    e.stopPropagation(); // Avoid triggering preview modal when clicking like
    setLikes((prevLikes) => prevLikes + 1);
    setAnimKey((prevKey) => prevKey + 1);
  };

  return (
    <article className="photo-card">
      {/* Clickable Image Container for Preview */}
      <div
        className="photo-image-wrapper"
        onClick={() => onOpenPreview && onOpenPreview(photo)}
        role="button"
        tabIndex={0}
        title="Click to view larger preview"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenPreview && onOpenPreview(photo);
          }
        }}
      >
        <img
          src={photo.download_url}
          alt={`Photograph by ${photo.author}`}
          loading="lazy"
          className="photo-img"
        />
        <div className="image-hover-overlay">
          <span className="preview-pill">Click to expand preview</span>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="photo-card-info">
        {/* Author name clearly displayed below the image */}
        <div className="photo-author-row">
          <span className="author-label">Author:</span>
          <span className="author-name">{photo.author}</span>
        </div>

        {/* Minimal Black Thumbs-Up Icon & Independent Like Counter */}
        <div className="photo-like-row">
          <button
            type="button"
            className="like-btn"
            onClick={handleLike}
            aria-label={`Like photo by ${photo.author}. Current likes: ${likes}`}
            title="Like this photo"
          >
            <FontAwesomeIcon
              key={animKey}
              icon={faThumbsUp}
              className={`thumbs-up-icon ${animKey > 0 ? 'anim-wiggle' : ''}`}
            />
            <span className="like-count">{likes}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default PhotoCard;
