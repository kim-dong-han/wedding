export interface WeddingInfo {
  groom: {
    name: string;
    parentRelation: string; // 장남, 차남 등
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
    parentRelation: string; // 장녀, 차녀 등
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
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: {
    name: string;
    hall: string;
    address: string;
    lat: number;
    lng: number;
    phone: string;
  };
  message: string;
}

export const weddingData: WeddingInfo = {
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
};
