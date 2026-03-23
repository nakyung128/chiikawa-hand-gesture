/**
 * Hand Tracking Module
 * ─────────────────────────────────────────────────────────────
 * MediaPipe Tasks-Vision の HandLandmarker を使って
 * 손의 21개 landmark를 실시간으로 추출하는 모듈.
 *
 * 주요 흐름:
 *   initHandTracker() → HandLandmarker 인스턴스 생성
 *   detectHands()     → 비디오 프레임에서 landmark 감지
 */
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// CDN에서 WASM 런타임 및 모델 로드 (로컬 번들 없이 사용)
const WASM_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';

const MODEL_PATH =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

/**
 * MediaPipe HandLandmarker를 초기화합니다.
 * 최초 호출 시 WASM 및 모델 파일을 CDN에서 다운로드합니다.
 *
 * @param {number} numHands - 동시에 감지할 최대 손 개수 (기본: 1)
 * @returns {Promise<HandLandmarker>}
 */
export async function initHandTracker(numHands = 1) {
  // 1) WASM 런타임 로드
  const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

  // 2) HandLandmarker 생성 (VIDEO 모드 = 타임스탬프 기반 실시간 처리)
  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MODEL_PATH,
      delegate: 'GPU', // GPU 가속 (GPU 없으면 자동으로 CPU fallback)
    },
    runningMode: 'VIDEO',
    numHands,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  return handLandmarker;
}

/**
 * 비디오 프레임에서 손 landmark를 감지합니다.
 * VIDEO 모드에서는 매 프레임마다 단조 증가하는 타임스탬프를 전달해야 합니다.
 *
 * @param {HandLandmarker} handLandmarker - 초기화된 HandLandmarker 인스턴스
 * @param {HTMLVideoElement} videoElement - 분석할 비디오 엘리먼트
 * @returns {HandLandmarkerResult} 감지 결과 { landmarks, worldLandmarks, handedness }
 */
export function detectHands(handLandmarker, videoElement) {
  // performance.now()는 단조 증가(monotonic)를 보장하므로 VIDEO 모드에 적합
  return handLandmarker.detectForVideo(videoElement, performance.now());
}

/**
 * MediaPipe Hands landmark 인덱스 참조표
 * (코드 가독성을 위한 상수 export)
 */
export const LANDMARK_INDEX = {
  WRIST: 0,
  THUMB_CMC: 1,  THUMB_MCP: 2,  THUMB_IP: 3,   THUMB_TIP: 4,
  INDEX_MCP: 5,  INDEX_PIP: 6,  INDEX_DIP: 7,  INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13,  RING_PIP: 14,  RING_DIP: 15,  RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
};

/**
 * 손 골격을 캔버스에 그리는 유틸리티
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} landmarks - 21개의 {x, y} landmark (정규화 0~1)
 * @param {number} width - 캔버스 너비 (px)
 * @param {number} height - 캔버스 높이 (px)
 */
export function drawHandOnCanvas(ctx, landmarks, width, height) {
  // 연결선 정의 (MediaPipe 공식 골격 topology)
  const CONNECTIONS = [
    [0,1],[1,2],[2,3],[3,4],           // 엄지
    [0,5],[5,6],[6,7],[7,8],           // 검지
    [0,9],[9,10],[10,11],[11,12],      // 중지
    [0,13],[13,14],[14,15],[15,16],    // 약지
    [0,17],[17,18],[18,19],[19,20],    // 새끼
    [5,9],[9,13],[13,17],              // 손바닥 횡선
  ];

  // 연결선 그리기
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.8)';
  ctx.lineWidth = 2;
  for (const [a, b] of CONNECTIONS) {
    ctx.beginPath();
    ctx.moveTo(landmarks[a].x * width, landmarks[a].y * height);
    ctx.lineTo(landmarks[b].x * width, landmarks[b].y * height);
    ctx.stroke();
  }

  // landmark 점 그리기
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i];
    ctx.beginPath();
    // 손가락 끝(TIP)은 크게, 나머지는 작게
    const radius = [4, 8, 12, 16, 20].includes(i) ? 5 : 3;
    ctx.arc(lm.x * width, lm.y * height, radius, 0, 2 * Math.PI);
    ctx.fillStyle = [4, 8, 12, 16, 20].includes(i) ? '#FF4466' : '#FFFFFF';
    ctx.fill();
  }
}
