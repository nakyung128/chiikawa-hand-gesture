/**
 * ImageCard Component
 * 매칭된 제스처 하나를 카드 형태로 표시합니다.
 * 유사도 점수, 순위 배지, 프로그레스 바를 포함합니다.
 */
import React from 'react';

export default function ImageCard({ gesture, score, distance, rank }) {
  const percentage = Math.round(score * 100);
  const isTop = rank === 1;

  // 이미지 로드 실패 시 SVG fallback으로 전환
  const handleImgError = (e) => {
    if (gesture.fallbackPath && e.target.src !== window.location.origin + gesture.fallbackPath) {
      e.target.src = gesture.fallbackPath;
    }
  };

  return (
    <div className={`image-card ${isTop ? 'image-card--top' : ''}`}>
      {/* 순위 배지 */}
      <div className="card-rank">
        <span className={`rank-badge rank-${rank}`}>
          {rank === 1 ? '🏆 Best' : rank === 2 ? '🥈 2nd' : '🥉 3rd'}
        </span>
      </div>

      {/* 제스처 이미지 */}
      <div className="card-image-wrapper">
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
            <span className="similarity-score">{percentage}% 유사</span>
            <span className="similarity-dist">거리: {distance.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
