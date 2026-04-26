declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (settings: KakaoShareSettings) => void;
      };
    };
  }
}

interface KakaoShareSettings {
  objectType: 'feed' | 'text' | 'list' | 'location' | 'commerce';
  content?: {
    title: string;
    description?: string;
    imageUrl?: string;
    link: { webUrl: string; mobileWebUrl: string };
  };
  buttons?: Array<{
    title: string;
    link: { webUrl: string; mobileWebUrl: string };
  }>;
}

const KAKAO_SDK_VERSION = '2.8.1';
const KAKAO_SDK_URL = `https://t1.kakaocdn.net/kakao_js_sdk/${KAKAO_SDK_VERSION}/kakao.min.js`;

function loadKakaoSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우: SDK 객체 존재 여부로 확인
    if (typeof window.Kakao !== 'undefined') {
      resolve();
      return;
    }
    // 스크립트 태그가 삽입됐지만 아직 로드 중인 경우
    if (document.getElementById('kakao-sdk')) {
      const existing = document.getElementById(
        'kakao-sdk',
      ) as HTMLScriptElement;
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Kakao SDK 로드 실패')),
      );
      return;
    }
    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = KAKAO_SDK_URL;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Kakao SDK 로드 실패'));
    document.head.appendChild(script);
  });
}

function initKakao() {
  const jsKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  if (!jsKey)
    throw new Error(
      'NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY가 설정되지 않았습니다.',
    );
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(jsKey);
  }
}

export async function shareViaKakao(
  settings: KakaoShareSettings,
): Promise<void> {
  await loadKakaoSdk();
  initKakao();
  window.Kakao.Share.sendDefault(settings);
}
