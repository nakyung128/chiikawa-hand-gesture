/**
 * useHandTracking Custom Hook
 * ─────────────────────────────────────────────────────────────
 * 웹캠 초기화 + MediaPipe 손 감지 + 특징 벡터 추출을
 * 하나의 React 커스텀 훅으로 통합합니다.
 *
 * 반환값:
 *   videoRef      - <video> 엘리먼트 ref
 *   canvasRef     - <canvas> 엘리먼트 ref (랜드마크 오버레이용)
 *   isLoading     - 초기화 진행 중 여부
 *   error         - 오류 메시지 (null = 정상)
 *   featureVector - 42차원 특징 벡터 (손 미감지 시 null)
 *   isHandDetected - 손 감지 여부
 */
import { useState, useEffect, useRef, useCallback } from 'react';

import { startWebcam, stopWebcam }       from '../modules/webcam';
import { initHandTracker, detectHands, drawHandOnCanvas } from '../modules/handTracking';
import { extractFeaturesFromResults }    from '../modules/featureExtraction';

export function useHandTracking() {
  const videoRef          = useRef(null);
  const canvasRef         = useRef(null);
  const handLandmarkerRef = useRef(null);
  const animFrameRef      = useRef(null);
  const isRunningRef      = useRef(false);

  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState(null);
  const [featureVector, setFeatureVector] = useState(null);
  const [isHandDetected, setIsHandDetected] = useState(false);

  // ────────────────────────────────────────
  // 감지 루프 (requestAnimationFrame 기반)
  // ────────────────────────────────────────
  const detect = useCallback(() => {
    if (!isRunningRef.current) return;

    const video        = videoRef.current;
    const canvas       = canvasRef.current;
    const landmarker   = handLandmarkerRef.current;

    // 비디오가 아직 준비되지 않았으면 다음 프레임에 재시도
    if (!video || !canvas || !landmarker || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(detect);
      return;
    }

    // ── 손 감지 실행 ──
    const results = detectHands(landmarker, video);

    // ── 캔버스 설정 및 초기화 ──
    const ctx = canvas.getContext('2d');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.landmarks && results.landmarks.length > 0) {
      // 손이 감지된 경우: 랜드마크 그리기 + 특징 벡터 추출
      drawHandOnCanvas(ctx, results.landmarks[0], canvas.width, canvas.height);

      const vector = extractFeaturesFromResults(results);
      setFeatureVector(vector);
      setIsHandDetected(true);
    } else {
      // 손이 없는 경우: 상태 초기화
      setFeatureVector(null);
      setIsHandDetected(false);
    }

    animFrameRef.current = requestAnimationFrame(detect);
  }, []); // ref만 사용하므로 deps 불필요

  // ────────────────────────────────────────
  // 초기화 & 정리
  // ────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        setIsLoading(true);
        setError(null);

        // 1) MediaPipe HandLandmarker 초기화 (CDN에서 WASM 다운로드)
        handLandmarkerRef.current = await initHandTracker(1);

        // 2) 웹캠 시작
        if (videoRef.current) {
          await startWebcam(videoRef.current);
        }

        if (mounted) {
          isRunningRef.current = true;
          setIsLoading(false);
          // 3) 감지 루프 시작
          animFrameRef.current = requestAnimationFrame(detect);
        }
      } catch (err) {
        if (mounted) {
          console.error('[useHandTracking] 초기화 실패:', err);
          setError(err.message || '초기화에 실패했습니다.');
          setIsLoading(false);
        }
      }
    }

    initialize();

    // 컴포넌트 언마운트 시 정리
    return () => {
      mounted = false;
      isRunningRef.current = false;

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (videoRef.current) {
        stopWebcam(videoRef.current);
      }
    };
  }, [detect]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    error,
    featureVector,
    isHandDetected,
  };
}
