/**
 * Gesture Database
 * ─────────────────────────────────────────────────────────────
 * 사전 정의된 손 제스처 데이터베이스.
 * 각 제스처는 미리 계산된 42차원 특징 벡터를 포함합니다.
 *
 * 벡터 좌표계:
 *   - 손목(landmark 0) 기준 원점
 *   - 스케일: 손목↔중지MCP 거리 = 1.0
 *   - Y축: 손가락 방향이 양수 (위가 +)
 *   - X축: 오른손 기준, 엄지 방향이 음수 (전면 카메라 미러링 없는 원시 좌표)
 */

// ────────────────────────────────────────────
// 기준 landmark 위치 (MCP 관절 - 제스처 무관하게 고정)
// ────────────────────────────────────────────
const B = {
  wrist:     [0,     0   ],
  thumbCMC:  [-0.32, 0.18],
  thumbMCP:  [-0.52, 0.34],
  indexMCP:  [-0.24, 1.00],
  middleMCP: [0,     1.00],  // ← 정규화 기준점
  ringMCP:   [0.24,  0.98],
  pinkyMCP:  [0.50,  0.85],
};

// ────────────────────────────────────────────
// 손가락 펼침(Extended) 위치
// ────────────────────────────────────────────
const E = {
  thumb:  { ip: [-0.68, 0.50], tip: [-0.82, 0.62] },
  index:  { pip: [-0.24, 1.52], dip: [-0.24, 1.78], tip: [-0.24, 2.02] },
  middle: { pip: [0,     1.52], dip: [0,     1.80], tip: [0,     2.05] },
  ring:   { pip: [0.24,  1.48], dip: [0.24,  1.72], tip: [0.24,  1.90] },
  pinky:  { pip: [0.50,  1.20], dip: [0.50,  1.40], tip: [0.50,  1.55] },
};

// ────────────────────────────────────────────
// 손가락 굽힘(Curled) 위치
// ────────────────────────────────────────────
const C = {
  thumb:  { ip: [-0.36, 0.30], tip: [-0.28, 0.24] },
  index:  { pip: [-0.06, 0.68], dip: [0.04,  0.45], tip: [0.08,  0.35] },
  middle: { pip: [0.02,  0.70], dip: [0.06,  0.48], tip: [0.08,  0.38] },
  ring:   { pip: [0.20,  0.68], dip: [0.22,  0.46], tip: [0.24,  0.36] },
  pinky:  { pip: [0.40,  0.62], dip: [0.42,  0.44], tip: [0.44,  0.36] },
};

/**
 * landmark 배열([[x,y], ...])을 42차원 flat array로 변환
 * @param {number[][]} lmArray - 21개의 [x, y] 쌍
 * @returns {number[]} 42차원 배열
 */
function flat(lmArray) {
  return lmArray.flat();
}

// ────────────────────────────────────────────
// 제스처 정의 (21개 landmark × [x,y] = 42차원)
// ────────────────────────────────────────────

const VECTORS = {
  // 손바닥 펼치기: 5개 손가락 모두 펼침
  open_palm: flat([
    B.wrist, B.thumbCMC, B.thumbMCP, E.thumb.ip, E.thumb.tip,
    B.indexMCP,  E.index.pip,  E.index.dip,  E.index.tip,
    B.middleMCP, E.middle.pip, E.middle.dip, E.middle.tip,
    B.ringMCP,   E.ring.pip,   E.ring.dip,   E.ring.tip,
    B.pinkyMCP,  E.pinky.pip,  E.pinky.dip,  E.pinky.tip,
  ]),

  // 주먹: 모든 손가락 굽힘
  fist: flat([
    B.wrist, B.thumbCMC, B.thumbMCP, C.thumb.ip, C.thumb.tip,
    B.indexMCP,  C.index.pip,  C.index.dip,  C.index.tip,
    B.middleMCP, C.middle.pip, C.middle.dip, C.middle.tip,
    B.ringMCP,   C.ring.pip,   C.ring.dip,   C.ring.tip,
    B.pinkyMCP,  C.pinky.pip,  C.pinky.dip,  C.pinky.tip,
  ]),

  // 브이(피스): 검지 + 중지 펼침
  peace: flat([
    B.wrist, B.thumbCMC, B.thumbMCP, C.thumb.ip, C.thumb.tip,
    B.indexMCP,  E.index.pip,  E.index.dip,  E.index.tip,
    B.middleMCP, E.middle.pip, E.middle.dip, E.middle.tip,
    B.ringMCP,   C.ring.pip,   C.ring.dip,   C.ring.tip,
    B.pinkyMCP,  C.pinky.pip,  C.pinky.dip,  C.pinky.tip,
  ]),

  // 엄지 척: 엄지가 위로 향하고 나머지는 굽힘
  thumbs_up: flat([
    B.wrist, B.thumbCMC, B.thumbMCP,
    [-0.42, 0.72], [-0.38, 1.05],      // 엄지가 수직으로 올라감
    B.indexMCP,  C.index.pip,  C.index.dip,  C.index.tip,
    B.middleMCP, C.middle.pip, C.middle.dip, C.middle.tip,
    B.ringMCP,   C.ring.pip,   C.ring.dip,   C.ring.tip,
    B.pinkyMCP,  C.pinky.pip,  C.pinky.dip,  C.pinky.tip,
  ]),

  // 검지 가리키기: 검지만 펼침
  pointing: flat([
    B.wrist, B.thumbCMC, B.thumbMCP, C.thumb.ip, C.thumb.tip,
    B.indexMCP,  E.index.pip,  E.index.dip,  E.index.tip,
    B.middleMCP, C.middle.pip, C.middle.dip, C.middle.tip,
    B.ringMCP,   C.ring.pip,   C.ring.dip,   C.ring.tip,
    B.pinkyMCP,  C.pinky.pip,  C.pinky.dip,  C.pinky.tip,
  ]),

  // OK 사인: 엄지+검지가 원을 형성, 나머지 펼침
  ok: flat([
    B.wrist, B.thumbCMC, B.thumbMCP,
    [-0.60, 0.40], [-0.62, 0.32],      // 엄지가 검지 쪽으로 굽힘
    B.indexMCP,
    [-0.56, 0.72], [-0.64, 0.56], [-0.66, 0.44],  // 검지가 엄지 쪽으로 굽힘
    B.middleMCP, E.middle.pip, E.middle.dip, E.middle.tip,
    B.ringMCP,   E.ring.pip,   E.ring.dip,   E.ring.tip,
    B.pinkyMCP,  E.pinky.pip,  E.pinky.dip,  E.pinky.tip,
  ]),

  // 로큰롤: 검지 + 새끼 펼침 (뿔 모양)
  rock: flat([
    B.wrist, B.thumbCMC, B.thumbMCP, C.thumb.ip, C.thumb.tip,
    B.indexMCP,  E.index.pip,  E.index.dip,  E.index.tip,
    B.middleMCP, C.middle.pip, C.middle.dip, C.middle.tip,
    B.ringMCP,   C.ring.pip,   C.ring.dip,   C.ring.tip,
    B.pinkyMCP,  E.pinky.pip,  E.pinky.dip,  E.pinky.tip,
  ]),

  // 세 손가락: 검지 + 중지 + 약지
  three: flat([
    B.wrist, B.thumbCMC, B.thumbMCP, C.thumb.ip, C.thumb.tip,
    B.indexMCP,  E.index.pip,  E.index.dip,  E.index.tip,
    B.middleMCP, E.middle.pip, E.middle.dip, E.middle.tip,
    B.ringMCP,   E.ring.pip,   E.ring.dip,   E.ring.tip,
    B.pinkyMCP,  C.pinky.pip,  C.pinky.dip,  C.pinky.tip,
  ]),

  // 네 손가락: 엄지 제외 4개
  four: flat([
    B.wrist, B.thumbCMC, B.thumbMCP, C.thumb.ip, C.thumb.tip,
    B.indexMCP,  E.index.pip,  E.index.dip,  E.index.tip,
    B.middleMCP, E.middle.pip, E.middle.dip, E.middle.tip,
    B.ringMCP,   E.ring.pip,   E.ring.dip,   E.ring.tip,
    B.pinkyMCP,  E.pinky.pip,  E.pinky.dip,  E.pinky.tip,
  ]),

  // 핀치: 엄지+검지 끝이 맞닿고, 나머지 펼침
  pinch: flat([
    B.wrist, B.thumbCMC, B.thumbMCP,
    [-0.48, 0.46], [-0.40, 0.62],      // 엄지가 검지 방향으로
    B.indexMCP,
    [-0.32, 1.30], [-0.36, 1.05], [-0.40, 0.82],  // 검지가 엄지 방향으로
    B.middleMCP, E.middle.pip, E.middle.dip, E.middle.tip,
    B.ringMCP,   E.ring.pip,   E.ring.dip,   E.ring.tip,
    B.pinkyMCP,  E.pinky.pip,  E.pinky.dip,  E.pinky.tip,
  ]),
};

// ────────────────────────────────────────────
// 제스처 데이터베이스 export
// ────────────────────────────────────────────
export const gestureDatabase = [
  {
    id: 'open_palm',
    name: '손바닥 펼치기',
    emoji: '🖐️',
    description: '손 흔들며 인사하는 우사기',
    imagePath: '/images/usagi_wave.jpg',
    fallbackPath: '/images/open_palm.svg',
    vector: VECTORS.open_palm,
  },
  {
    id: 'fist',
    name: '주먹',
    emoji: '✊',
    description: '모든 손가락을 안으로 구부린 클로즈드 피스트',
    imagePath: '/images/fist.svg',
    vector: VECTORS.fist,
  },
  {
    id: 'peace',
    name: '브이 (피스)',
    emoji: '✌️',
    description: '브이 포즈를 하고 있는 치이카와',
    imagePath: '/images/chiikawa_peace.jpg',
    fallbackPath: '/images/peace.svg',
    vector: VECTORS.peace,
  },
  {
    id: 'thumbs_up',
    name: '엄지 척',
    emoji: '👍',
    description: '딸기 모자 치이카와의 엄지 척',
    imagePath: '/images/ichigo_thumbsup.jpg',
    fallbackPath: '/images/thumbs_up.svg',
    vector: VECTORS.thumbs_up,
  },
  {
    id: 'pointing',
    name: '검지 가리키기',
    emoji: '☝️',
    description: '눈을 가리키며 메롱하는 우사기',
    imagePath: '/images/usagi_meron.jpg',
    fallbackPath: '/images/pointing.svg',
    vector: VECTORS.pointing,
  },
  {
    id: 'ok',
    name: 'OK 사인',
    emoji: '👌',
    description: '양손으로 브이를 만든 하치와레',
    imagePath: '/images/hachiware_peace.jpg',
    fallbackPath: '/images/ok.svg',
    vector: VECTORS.ok,
  },
  {
    id: 'rock',
    name: '로큰롤',
    emoji: '🤘',
    description: '반짝반짝 엄지척을 하는 하치와레',
    imagePath: '/images/hachiware_thumbsup.jpg',
    fallbackPath: '/images/rock.svg',
    vector: VECTORS.rock,
  },
  {
    id: 'three',
    name: '세 손가락',
    emoji: '🤟',
    description: '검지·중지·약지 세 손가락을 펼친 숫자 3',
    imagePath: '/images/three.svg',
    vector: VECTORS.three,
  },
  {
    id: 'four',
    name: '네 손가락',
    emoji: '🖖',
    description: '엄지 제외 네 손가락을 펼친 숫자 4',
    imagePath: '/images/four.svg',
    vector: VECTORS.four,
  },
  {
    id: 'pinch',
    name: '손가락 하트',
    emoji: '🤌',
    description: '볼에 양손 검지를 콕! 치이카와',
    imagePath: '/images/chiikawa_cheek.jpg',
    fallbackPath: '/images/pinch.svg',
    vector: VECTORS.pinch,
  },
];
