/**
 * App Component - 루트 컴포넌트
 * ─────────────────────────────────────────────────────────────
 * 전체 레이아웃 구성:
 *   Left Panel  : WebcamView (실시간 웹캠 + 랜드마크 오버레이)
 *   Right Panel : ResultPanel (유사도 Top-3 결과)
 *
 * 데이터 흐름:
 *   useHandTracking → featureVector → findTopMatches → matches → ResultPanel
 */
import React, { useState, useEffect, useRef } from 'react';

import { useHandTracking }  from './hooks/useHandTracking';
import WebcamView           from './components/WebcamView';
import ResultPanel          from './components/ResultPanel';
import { gestureDatabase }  from './data/gestureDatabase';
import { findTopMatches }   from './modules/similarity';

// 유사도 업데이트 간격 (ms) - 실시간성과 성능의 균형
const MATCH_INTERVAL_MS = 80;  // ~12fps
const TOP_K = 3;

export default function App() {
  const {
    videoRef,
    canvasRef,
    isLoading,
    error,
    featureVector,
    isHandDetected,
  } = useHandTracking();

  const [topMatches,   setTopMatches]   = useState([]);
  const lastUpdateRef = useRef(0);

  // featureVector가 변경될 때마다 유사도 계산
  // 단, MATCH_INTERVAL_MS마다 한 번만 계산하여 성능 최적화
  useEffect(() => {
    if (!featureVector) {
      setTopMatches([]);
      return;
    }

    const now = Date.now();
    if (now - lastUpdateRef.current < MATCH_INTERVAL_MS) return;
    lastUpdateRef.current = now;

    const matches = findTopMatches(featureVector, gestureDatabase, TOP_K);
    setTopMatches(matches);
  }, [featureVector]);

  return (
    <div className="app">
      {/* 헤더 */}
      <header className="app-header">
        <div className="header-content">
          <h1>🐾 치이카와 제스처 매처</h1>
          <p>✨ 손 모양을 카메라에 보여주면 닮은 치이카와를 찾아줘요!</p>
        </div>
      </header>

      {/* 메인 레이아웃: 좌측 웹캠 / 우측 결과 */}
      <main className="app-main">
        <section className="left-panel">
          <WebcamView
            videoRef={videoRef}
            canvasRef={canvasRef}
            isLoading={isLoading}
            error={error}
            isHandDetected={isHandDetected}
          />
        </section>

        <section className="right-panel">
          <ResultPanel
            matches={topMatches}
            isHandDetected={isHandDetected}
          />
        </section>
      </main>

      {/* 푸터 */}
      <footer className="app-footer">
        <small>
          🌸 치이카와 · 우사기 · 하치와레 — MediaPipe Hands로 만든 손 모양 인식 앱 🌸
        </small>
      </footer>
    </div>
  );
}
