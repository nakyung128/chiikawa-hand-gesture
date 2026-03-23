/**
 * Feature Extraction Module
 * ─────────────────────────────────────────────────────────────
 * MediaPipe의 원시 landmark 좌표를 유사도 비교에 적합한
 * 정규화된 특징 벡터(feature vector)로 변환하는 모듈.
 *
 * 정규화 전략:
 *   1) 평행이동(Translation) 불변: 손목(landmark 0)을 원점으로 이동
 *   2) 스케일(Scale) 불변: 손목↔중지MCP 거리를 1로 정규화
 *   3) Y축 반전: MediaPipe의 y는 아래가 +이므로, 위가 +가 되도록 반전
 *
 * 결과: 42차원 벡터 [x0, y0, x1, y1, ..., x20, y20]
 * → 위치/크기에 무관한 손 모양의 기하학적 특징을 표현
 */

const WRIST_IDX     = 0;  // 손목 인덱스
const MIDDLE_MCP_IDX = 9; // 정규화 스케일 기준: 손목 ↔ 중지MCP

/**
 * 21개 landmark 배열을 42차원 정규화 특징 벡터로 변환합니다.
 *
 * @param {Array<{x:number, y:number, z:number}>} landmarks - MediaPipe 원시 landmark
 * @returns {number[]|null} 42차원 float 배열, 변환 실패 시 null
 */
export function extractFeatures(landmarks) {
  if (!landmarks || landmarks.length !== 21) return null;

  const wrist     = landmarks[WRIST_IDX];
  const middleMCP = landmarks[MIDDLE_MCP_IDX];

  // 스케일 기준 거리 계산 (손목 → 중지MCP)
  const dx = middleMCP.x - wrist.x;
  const dy = middleMCP.y - wrist.y;
  const refDist = Math.sqrt(dx * dx + dy * dy);

  // 거리가 0에 가까우면 손이 제대로 인식되지 않은 것
  if (refDist < 1e-6) return null;

  // 각 landmark를 정규화
  const vector = [];
  for (const lm of landmarks) {
    // 손목 중심으로 평행이동 + 스케일 정규화
    const nx =  (lm.x - wrist.x) / refDist;
    // MediaPipe y는 아래 방향이 +이므로 반전하여 위 방향을 + 로 만듦
    const ny = -(lm.y - wrist.y) / refDist;
    vector.push(nx, ny);
  }

  return vector; // length = 21 * 2 = 42
}

/**
 * MediaPipe HandLandmarker 결과 객체에서 특징 벡터를 추출합니다.
 * 여러 손이 감지된 경우 첫 번째 손만 사용합니다.
 *
 * @param {HandLandmarkerResult} results - detectForVideo() 반환값
 * @returns {number[]|null}
 */
export function extractFeaturesFromResults(results) {
  if (!results?.landmarks || results.landmarks.length === 0) return null;
  return extractFeatures(results.landmarks[0]);
}

/**
 * 특징 벡터에서 손가락별 굽힘 각도(curl) 를 계산합니다.
 * 디버깅 및 시각화에 활용할 수 있습니다.
 *
 * @param {Array<{x,y,z}>} landmarks
 * @returns {{ thumb, index, middle, ring, pinky }} 각 0~1 (0=펼침, 1=완전히 굽힘)
 */
export function estimateFingerCurls(landmarks) {
  if (!landmarks || landmarks.length !== 21) return null;

  // 각 손가락의 [MCP, PIP, TIP] 인덱스
  const FINGERS = {
    thumb:  [2, 3, 4],
    index:  [5, 6, 8],
    middle: [9, 10, 12],
    ring:   [13, 14, 16],
    pinky:  [17, 18, 20],
  };

  const curls = {};
  for (const [name, [mcp, pip, tip]] of Object.entries(FINGERS)) {
    // MCP → PIP → TIP 벡터 간 각도로 curl 추정
    const v1x = landmarks[pip].x - landmarks[mcp].x;
    const v1y = landmarks[pip].y - landmarks[mcp].y;
    const v2x = landmarks[tip].x - landmarks[pip].x;
    const v2y = landmarks[tip].y - landmarks[pip].y;

    const dot  = v1x * v2x + v1y * v2y;
    const mag1 = Math.sqrt(v1x ** 2 + v1y ** 2);
    const mag2 = Math.sqrt(v2x ** 2 + v2y ** 2);

    const cosAngle = mag1 * mag2 > 1e-6 ? dot / (mag1 * mag2) : 1;
    // cosAngle: 1=straight(펼침), -1=folded(굽힘) → 0~1 범위로 변환
    curls[name] = (1 - cosAngle) / 2;
  }

  return curls;
}
