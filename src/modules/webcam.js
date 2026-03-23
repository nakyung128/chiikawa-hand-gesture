/**
 * Webcam Module
 * ─────────────────────────────────────────────────────────────
 * 웹캠 스트림 초기화, 연결, 해제를 담당하는 모듈.
 * HTML5 MediaDevices API를 추상화하여 재사용 가능하게 구성.
 */

/**
 * 웹캠을 시작하고 video 엘리먼트에 스트림을 연결합니다.
 *
 * @param {HTMLVideoElement} videoElement - 스트림을 연결할 video 태그
 * @param {MediaStreamConstraints} constraints - 추가 constraints (optional)
 * @returns {Promise<MediaStream>} 활성화된 MediaStream 객체
 * @throws {Error} 카메라 권한 거부 또는 장치 없음 오류
 */
export async function startWebcam(videoElement, constraints = {}) {
  const defaultConstraints = {
    video: {
      width:  { ideal: 640 },
      height: { ideal: 480 },
      facingMode: 'user', // 전면 카메라 (셀피 모드)
    },
    audio: false,
  };

  const stream = await navigator.mediaDevices.getUserMedia({
    ...defaultConstraints,
    ...constraints,
  });

  videoElement.srcObject = stream;

  // 메타데이터 로드 완료 후 재생 시작
  await new Promise((resolve, reject) => {
    videoElement.onloadedmetadata = () => {
      videoElement.play().then(resolve).catch(reject);
    };
  });

  return stream;
}

/**
 * 웹캠 스트림을 중지하고 카메라 리소스를 해제합니다.
 *
 * @param {HTMLVideoElement} videoElement - 중지할 video 태그
 */
export function stopWebcam(videoElement) {
  if (videoElement && videoElement.srcObject) {
    const tracks = videoElement.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    videoElement.srcObject = null;
  }
}

/**
 * 현재 장치에서 카메라 사용 가능 여부를 확인합니다.
 *
 * @returns {Promise<boolean>}
 */
export async function isCameraAvailable() {
  if (!navigator.mediaDevices?.enumerateDevices) return false;
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.some((d) => d.kind === 'videoinput');
}
