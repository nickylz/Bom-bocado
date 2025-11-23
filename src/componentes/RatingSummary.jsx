import React from 'react';
import './RatingSummary.css';

const RatingSummary = () => {
  const ratings = [
    { stars: 5, percentage: 67 },
    { stars: 4, percentage: 22 },
    { stars: 3, percentage: 11 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ];

  return (
    <div className="rating-summary-container">
      <h2 className="rating-summary-title">Opiniones de nuestros clientes</h2>
      <div className="rating-summary-card">
        <div className="rating-summary-average">
          <div className="average-score">4.6</div>
          <div className="star-rating">
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9734;</span>
          </div>
          <div className="total-ratings">9 calificaciones</div>
        </div>
        <div className="rating-summary-breakdown">
          {ratings.map((rating) => (
            <div key={rating.stars} className="rating-bar-container">
              <div className="star-label">{rating.stars} {rating.stars > 1 ? 'estrellas' : 'estrella'}</div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${rating.percentage}%` }}
                ></div>
              </div>
              <div className="percentage-label">{rating.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
