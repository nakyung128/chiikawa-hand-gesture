/**
 * ResultPanel Component
 * 유사도 Top-K 매칭 결과를 오른쪽 패널에 표시합니다.
 */
import React from 'react';
import ImageCard from './ImageCard';

export default function ResultPanel({ matches, isHandDetected }) {
  return (
    <div className="result-panel">
      {/* 헤더 */}
      <div className="panel-header">
        <h2>유사한 제스처</h2>
        {matches.length > 0 && (
          <span className="result-count">Top {matches.length}</span>
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="result-content">
        {!isHandDetected ? (
          /* 손 미감지 상태 */
          <div className="empty-state">
            <div className="empty-icon">👋</div>
            <p>손을 카메라에 보여주세요</p>
            <small>손이 감지되면 유사한 제스처를 찾아드립니다</small>
          </div>
        ) : matches.length === 0 ? (
          /* 분석 중 */
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>분석 중…</p>
          </div>
        ) : (
          /* 결과 카드 목록 */
          <div className="result-list">
            {matches.map((match, idx) => (
              <ImageCard
                key={match.gesture.id}
                gesture={match.gesture}
                score={match.score}
                distance={match.distance}
                rank={idx + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* 하단 설명 */}
      <div className="result-footer">
        <small>
          유사도 계산: Euclidean Distance on 42-dim normalized landmark vectors
        </small>
      </div>
    </div>
  );
}
