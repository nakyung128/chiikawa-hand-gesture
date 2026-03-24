import React from 'react';

export default function ImageCard({ gesture, score, distance, rank }) {
  const percentage = Math.round(score * 100);
  const characterClass = gesture.character ? `image-card--${gesture.character}` : '';

  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';

  const handleImgError = (e) => {
    if (gesture.fallbackPath && e.target.src !== window.location.origin + gesture.fallbackPath) {
      e.target.src = gesture.fallbackPath;
    }
  };

  return (
    <div className={`image-card ${characterClass}`}>
      {/* 제스처 이미지 */}
      <div className="card-image-wrapper">
        <span className="rank-overlay">{rankEmoji}</span>
        <img
          src={gesture.imagePath}
          alt={gesture.name}
          className="card-image"
          onError={handleImgError}
        />
        <span className="card-emoji">{gesture.emoji}</span>
      </div>

      {/* 텍스트 정보 */}
      <div className="card-info">
        <h3 className="card-name">{gesture.name}</h3>
        <p className="card-desc">{gesture.description}</p>

        {/* 유사도 프로그레스 바 */}
        <div className="similarity-section">
          <div className="similarity-bar-bg">
            <div
              className="similarity-bar-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="similarity-labels">
            <span className="similarity-score">💕 {percentage}% 닮았어요</span>
            <span className="similarity-dist">거리 {distance.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
