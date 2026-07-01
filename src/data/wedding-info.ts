const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

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

export interface RsvpCreateInput {
  name: string;
  side: 'groom' | 'bride';
  guests: number;
  attending: boolean;
  message: string;
  phone: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface GuestbookCreateInput {
  name: string;
  message: string;
  password: string;
}

export async function fetchWeddingInfo(): Promise<WeddingInfo> {
  const res = await fetch(`${API_BASE}/api/wedding-info`);
  if (!res.ok) throw new Error('청첩장 정보를 불러오지 못했습니다.');
  return res.json();
}

export async function fetchGuestbook(): Promise<GuestbookEntry[]> {
  const res = await fetch(`${API_BASE}/api/guestbook`);
  if (!res.ok) throw new Error('방명록을 불러오지 못했습니다.');
  return res.json();
}

export async function submitRsvp(input: RsvpCreateInput): Promise<RsvpEntry> {
  const res = await fetch(`${API_BASE}/api/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('참석 여부 전송에 실패했습니다.');
  return res.json();
}

export async function submitGuestbookEntry(input: GuestbookCreateInput): Promise<GuestbookEntry> {
  const res = await fetch(`${API_BASE}/api/guestbook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('방명록 등록에 실패했습니다.');
  return res.json();
}

/** 비밀번호가 일치하면 true, 틀리면 false를 반환한다. */
export async function deleteGuestbookEntry(id: string, password: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/guestbook/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (res.status === 204) return true;
  if (res.status === 403) return false;
  throw new Error('방명록 삭제에 실패했습니다.');
}
