export interface WeddingInfo {
  groom: {
    name: string;
    parentRelation: string;
    parents: {
      father: string;
      mother: string;
    };
    account: {
      bank: string;
      number: string;
      owner: string;
    };
  };
  bride: {
    name: string;
    parentRelation: string;
    parents: {
      father: string;
      mother: string;
    };
    account: {
      bank: string;
      number: string;
      owner: string;
    };
  };
  date: string;
  time: string;
  location: {
    name: string;
    hall: string;
    address: string;
    lat: number;
    lng: number;
    phone: string;
  };
  message: string;
  gallery: string[];
  interview: { question: string; answer: string }[];
  notices: { title: string; content: string }[];
  transportation: { method: string; description: string }[];
  openingAnimation: {
    enabled: boolean;
    text: string;
    subtext: string;
  };
  bgm: {
    enabled: boolean;
    url: string;
    title: string;
  };
}

export interface RsvpEntry {
  id: string;
  name: string;
  side: 'groom' | 'bride';
  guests: number;
  attending: boolean;
  message: string;
  phone: string;
  createdAt: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  password: string;
  createdAt: string;
}

export const defaultWeddingData: WeddingInfo = {
  groom: {
    name: "김철수",
    parentRelation: "장남",
    parents: {
      father: "김영호",
      mother: "박순자",
    },
    account: {
      bank: "신한은행",
      number: "110-xxx-xxxxxx",
      owner: "김철수",
    },
  },
  bride: {
    name: "이영희",
    parentRelation: "장녀",
    parents: {
      father: "이정식",
      mother: "최미경",
    },
    account: {
      bank: "국민은행",
      number: "00000-xx-xxxxxx",
      owner: "이영희",
    },
  },
  date: "2024-10-26",
  time: "13:00",
  location: {
    name: "더 리버사이드 호텔",
    hall: "7층 콘서트홀",
    address: "서울특별시 서초구 강남대로107길 6",
    lat: 37.5165,
    lng: 127.0195,
    phone: "02-6710-1100",
  },
  message: "저희 두 사람이 사랑으로 만나 진실한 가정을 이루고자 합니다.\n귀한 걸음 하시어 저희의 시작을 축복해 주시면 큰 기쁨이겠습니다.",
  gallery: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
  ],
  interview: [
    { question: "첫 만남은 어떻게 되셨나요?", answer: "지인의 소개로 만나게 되었습니다." },
    { question: "프로포즈는 어떻게 하셨나요?", answer: "조용한 레스토랑에서 준비했습니다." },
  ],
  notices: [
    { title: "주차 안내", content: "예식장 내 주차장이 협소하오니 대중교통 이용 부탁드립니다." },
  ],
  transportation: [
    { method: "지하철", description: "2호선 강남역 3번 출구에서 도보 5분" },
    { method: "버스", description: "간선 140, 142번 강남역 하차" },
  ],
  openingAnimation: {
    enabled: true,
    text: "저희 두 사람, 결혼합니다",
    subtext: "W E   G E T   M A R R I E D",
  },
  bgm: {
    enabled: false,
    url: "",
    title: "",
  },
};

export const STORAGE_KEYS = {
  weddingData: 'wedding-data',
  rsvps: 'wedding-rsvps',
  guestbook: 'wedding-guestbook',
} as const;

export function loadWeddingData(): WeddingInfo {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.weddingData);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultWeddingData, ...parsed };
    }
  } catch {}
  return defaultWeddingData;
}

export function saveWeddingData(data: WeddingInfo): void {
  localStorage.setItem(STORAGE_KEYS.weddingData, JSON.stringify(data));
}

export function loadRsvps(): RsvpEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.rsvps);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveRsvps(entries: RsvpEntry[]): void {
  localStorage.setItem(STORAGE_KEYS.rsvps, JSON.stringify(entries));
}

export function loadGuestbook(): GuestbookEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.guestbook);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveGuestbook(entries: GuestbookEntry[]): void {
  localStorage.setItem(STORAGE_KEYS.guestbook, JSON.stringify(entries));
}
