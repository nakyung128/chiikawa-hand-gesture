/**
 * WebcamView Component
 * 웹캠 비디오와 손 랜드마크 오버레이 캔버스를 표시합니다.
 * video와 canvas에 CSS scaleX(-1)을 적용하여 거울 효과를 구현합니다.
 */
import React from 'react';

export default function WebcamView({
  videoRef,
  canvasRef,
  isLoading,
  error,
  isHandDetected,
}) {
  return (
    <div className="webcam-container">
      {/* 헤더 */}
      <div className="panel-header">
        <h2>웹캠 입력</h2>
        <span className={`status-badge ${isHandDetected ? 'detected' : 'waiting'}`}>
          <span className="status-dot" />
          {isHandDetected ? '손 감지됨' : '손을 올려주세요'}
        </span>
      </div>

      {/* 비디오 영역 */}
      <div className="webcam-wrapper">
        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="overlay">
            <div className="spinner" />
            <p>MediaPipe 초기화 중…</p>
            <small>최초 실행 시 모델을 다운로드합니다</small>
          </div>
        )}

        {/* 에러 오버레이 */}
        {error && (
          <div className="overlay overlay-error">
            <p>⚠️ 오류 발생</p>
            <small>{error}</small>
            <small>카메라 권한을 확인해 주세요</small>
          </div>
        )}

        {/*
          video: 셀피 거울 효과 (CSS transform scaleX(-1))
          canvas: 랜드마크 오버레이 (같은 거울 변환 적용)
          두 요소를 absolute로 겹쳐서 배치
        */}
        <video
          ref={videoRef}
          className="webcam-video"
          autoPlay
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="webcam-canvas"
        />
      </div>

      {/* 힌트 */}
      <p className="webcam-hint">
        카메라에 손을 가까이 대고 명확하게 제스처를 만들어 보세요
      </p>
    </div>
  );
}
