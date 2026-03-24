# 🐹🐱🐰 치이카와 손 제스처 매처

> 웹캠으로 손 모양을 보여주면, 가장 닮은 치이카와 캐릭터가 나타나요! ✨

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Tasks--Vision-FF6F00?style=flat-square)

---

## 🌟 프로젝트 소개

웹캠으로 실시간 손 제스처를 인식하고, 미리 정의된 치이카와 캐릭터 이미지와 매칭해주는 웹 앱이에요!

손을 카메라에 보여주면 **치이카와 🐹 · 우사기 🐰 · 하치와레 🐱** 캐릭터들이 가장 비슷한 손 모양으로 반응해줄 거예요 🥹

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🖐️ **실시간 손 감지** | MediaPipe Hands로 프레임마다 21개 랜드마크 추출 |
| 📐 **특징 벡터 추출** | 손목 기준 정규화된 42차원 특징 벡터로 변환 |
| 🔍 **유사도 검색** | 유클리드 거리 기반으로 가장 닮은 제스처 Top 3 탐색 |
| 🏆 **캐릭터 매칭** | 1~3위 결과를 귀여운 치이카와 캐릭터 카드로 표시 |
| 🪞 **셀피 거울 모드** | 카메라 화면이 좌우 반전되어 자연스럽게 보여요 |

---

## 🤟 인식 가능한 제스처 (5가지 · 10개 캐릭터 카드)

| 제스처 | 이모지 | 캐릭터 카드 |
|--------|--------|-------------|
| 손바닥 펼치기 | 🖐️ | 손 흔들며 인사하는 우사기 · 한 손 들고 인사하는 하치와레 |
| 브이 (피스) | ✌️ | 브이 포즈의 치이카와 · 양손 브이의 하치와레 · 양손 브이의 우사기 |
| 엄지 척 | 👍 | 딸기 모자 치이카와의 엄지 척 · 엄지척하는 하치와레 |
| 검지 가리키기 | ☝️ | 눈을 가리키며 메롱하는 우사기 |
| 손가락 하트 | 🤌 | 볼에 손가락 콕! 치이카와 · 볼에 손가락 콕! 하치와레 |

---

## 🗂️ 프로젝트 구조

```
chiikawa-hand-gesture/
├── public/
│   └── images/                  # 치이카와 캐릭터 이미지
├── src/
│   ├── modules/
│   │   ├── webcam.js            # 웹캠 스트림 제어
│   │   ├── handTracking.js      # MediaPipe 초기화 & 손 감지
│   │   ├── featureExtraction.js # 42차원 특징 벡터 추출
│   │   └── similarity.js        # 유사도 계산 & Top-K 탐색
│   ├── hooks/
│   │   └── useHandTracking.js   # 웹캠 + 손 추적 커스텀 훅
│   ├── components/
│   │   ├── WebcamView.jsx        # 웹캠 화면 + 스켈레톤 오버레이
│   │   ├── ResultPanel.jsx       # 매칭 결과 패널
│   │   └── ImageCard.jsx         # 캐릭터 카드 (순위 · 유사도 바)
│   ├── data/
│   │   └── gestureDatabase.js   # 제스처 DB (42차원 벡터 + 이미지 경로)
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## 🛠️ 기술 스택

- **React 18** — UI 컴포넌트 & 상태 관리
- **Vite 5** — 빠른 개발 서버 & 번들링
- **MediaPipe Tasks-Vision** — 브라우저에서 실시간 손 랜드마크 추출
- **Vanilla CSS** — 다크 테마 커스텀 스타일링 (CSS 변수 활용)

---

## 🚀 실행 방법

### 사전 요구사항

- **Node.js** 18 이상 ([nodejs.org](https://nodejs.org) 에서 다운로드)
- **웹캠**이 연결된 환경 (내장 카메라도 OK!)
- **Chrome / Edge** 브라우저 권장 (Firefox도 동작하지만 성능 차이 있을 수 있어요)

### 1️⃣ 저장소 클론

```bash
git clone https://github.com/<your-username>/chiikawa-hand-gesture.git
cd chiikawa-hand-gesture
```

### 2️⃣ 의존성 설치

```bash
npm install
```

> 📦 `@mediapipe/tasks-vision` 패키지가 포함되어 있어 설치 시간이 조금 걸릴 수 있어요!

### 3️⃣ 개발 서버 실행

```bash
npm run dev
```

터미널에 아래와 같이 표시되면 성공!

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4️⃣ 브라우저에서 열기

`http://localhost:5173` 으로 접속 후, **카메라 권한 허용** 버튼을 눌러주세요 📷

> ⚠️ 카메라 권한을 거부하면 앱이 동작하지 않아요. 브라우저 주소창 왼쪽의 🔒 아이콘을 클릭해서 권한을 다시 허용할 수 있어요.

### 5️⃣ 손 제스처 해보기

1. 웹캠 앞에 손을 올려주세요 🖐️
2. 초록색 **"손 감지됨"** 뱃지가 나타나면 인식 시작!
3. 오른쪽 패널에서 가장 닮은 치이카와 캐릭터 Top 3를 확인하세요 🏆

---

### 🏗️ 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성돼요. 로컬에서 확인하려면:

```bash
npm run preview
```

---

## 🔧 기술적 동작 원리

```
웹캠 프레임
    ↓
MediaPipe HandLandmarker
    ↓ 21개 랜드마크 [x, y] 추출
특징 벡터 추출 (42차원)
  · 손목(landmark 0) 기준 원점 이동
  · 손목↔중지MCP 거리로 스케일 정규화
  · Y축 반전 (위 = 양수)
    ↓
유클리드 거리 계산 → score = exp(-distance / 2.5)
    ↓
Top-3 매칭 결과 표시 🎉
```

---

## 💡 사용 팁

- 🌟 손을 **카메라 중앙**에, 밝은 조명 아래에 놓으면 인식률이 올라가요
- ✋ 손바닥이 카메라를 **정면으로 향하도록** 해주세요
- 🐢 처음 로딩 시 MediaPipe 모델을 다운로드하느라 5~10초 정도 걸릴 수 있어요

---

## 📄 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.
치이카와 캐릭터의 저작권은 **나가노(ナガノ)** 작가님께 있습니다 🐹💕
