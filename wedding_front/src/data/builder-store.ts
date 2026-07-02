export interface BuilderData {
  accent: string;
  fontMood: 'serif' | 'gothic';
  compact: boolean;
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
}

export const ACCENT_OPTIONS = [
  { key: 'sage', label: '세이지그린', hex: '#8E9775' },
  { key: 'rose', label: '더스티로즈', hex: '#C98A8A' },
  { key: 'gold', label: '샴페인골드', hex: '#B99A63' },
  { key: 'blue', label: '더스티블루', hex: '#7C93A0' },
];

const STORAGE_KEY = 'weddingBuilderData';

export const defaultBuilderData: BuilderData = {
  accent: '#8E9775',
  fontMood: 'serif',
  compact: true,
  groomName: '이준서',
  brideName: '박하은',
  date: '2026-10-24',
  time: '오후 1시 (13:00)',
  venueName: '더 그랜드 컨벤션',
  venueAddress: '서울특별시 강남구 테헤란로 123',
};

export function saveBuilderData(data: BuilderData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function loadBuilderData(): BuilderData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...defaultBuilderData, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

/** 저장된 accent/fontMood를 document 루트에 CSS 변수·클래스로 즉시 반영한다. */
export function applyBuilderTheme(data: BuilderData | null) {
  const root = document.documentElement;
  if (!data) return;
  root.style.setProperty('--wedding-primary', data.accent);
  root.classList.toggle('font-mood-gothic', data.fontMood === 'gothic');
}
