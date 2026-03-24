/**
 * Similarity Module
 * ─────────────────────────────────────────────────────────────
 * 특징 벡터 간 유사도(similarity)를 계산하는 모듈.
 *
 * 두 가지 메트릭 제공:
 *   - Cosine Similarity  : 벡터 방향의 유사도 (범위: -1 ~ 1)
 *   - Euclidean Distance : 벡터 공간에서의 직선 거리 (범위: 0 ~ ∞)
 *
 * 최종 매칭에는 Euclidean Distance 기반 유사도 점수를 사용합니다.
 * (위치 정보까지 함께 고려하므로 제스처 구분에 더 효과적)
 */

/**
 * 두 벡터 간 코사인 유사도를 계산합니다.
 * 벡터의 방향(shape)만 비교하며 크기는 무시합니다.
 *
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number} -1 ~ 1 (1 = 동일 방향)
 */
export function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;

  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom < 1e-10 ? 0 : dot / denom;
}

/**
 * 두 벡터 간 유클리드 거리를 계산합니다.
 * 값이 작을수록 더 유사합니다.
 *
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number} 0 ~ ∞
 */
export function euclideanDistance(a, b) {
  if (a.length !== b.length) return Infinity;

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

/**
 * 유클리드 거리를 [0, 1] 범위의 유사도 점수로 변환합니다.
 * 지수 감쇠 함수 사용: score = exp(-distance / scale)
 *
 * @param {number} distance - 유클리드 거리
 * @param {number} scale    - 감쇠 파라미터 (기본값 2.5)
 *                            값이 클수록 점수 차이가 완만해짐
 * @returns {number} 0 ~ 1 (1 = 완전 동일)
 */
export function distanceToScore(distance, scale = 5.0) {
  return Math.exp(-distance / scale);
}

/**
 * 쿼리 벡터와 가장 유사한 제스처 Top-K를 반환합니다.
 *
 * 알고리즘:
 *   1) 데이터베이스의 모든 벡터와 유클리드 거리 계산
 *   2) 거리 기반 점수로 변환
 *   3) 점수 내림차순 정렬 후 상위 K개 반환
 *
 * @param {number[]} queryVector - 현재 손 모양의 특징 벡터 (42차원)
 * @param {Array<{id, name, vector, ...}>} database - 제스처 데이터베이스
 * @param {number} topK - 반환할 최상위 결과 수 (기본: 3)
 * @returns {Array<{gesture, score, distance, cosineSim}>}
 */
export function findTopMatches(queryVector, database, topK = 3) {
  if (!queryVector || database.length === 0) return [];

  const results = database.map((gesture) => {
    const distance  = euclideanDistance(queryVector, gesture.vector);
    const score     = distanceToScore(distance);
    const cosineSim = cosineSimilarity(queryVector, gesture.vector);

    return { gesture, score, distance, cosineSim };
  });

  // 유사도 점수 내림차순 정렬
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, topK);
}
