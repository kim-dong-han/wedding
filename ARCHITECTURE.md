# ARCHITECTURE

> Claude에게: 이 문서는 구조 파악용 최소 참조 자료. 코드 전체를 다시 읽지 말고
> 이 문서 + 관련 파일 1~2개만 열어서 작업할 것.

## 시스템 구조
- 순수 클라이언트 SPA (백엔드 서버 없음, API 없음)
- 빌드 결과물(`dist/`)을 Cloudflare Pages가 정적 서빙
- 데이터 영속성은 브라우저 `localStorage`뿐 (기기/브라우저 종속, 서버 동기화 없음)

```
[사용자 브라우저]
   ├─ / (WeddingPage)  → localStorage 읽기 → 청첩장 렌더링
   └─ /admin (AdminPage) → 비밀번호 확인 → localStorage 읽기/쓰기 → 즉시 반영
```

## 패키지 구조
```
src/
├─ main.tsx              # 엔트리, 라우터 등록
├─ App.tsx                # '/' 라우트. 청첩장 전체 섹션 (824줄, 단일 파일)
│   ├─ SectionNav, WeddingPage, Greeting, GallerySection
│   ├─ LocationSection, AccountSection, RsvpSection
│   └─ GuestbookSection, Footer
├─ pages/
│   └─ AdminPage.tsx      # '/admin' 라우트. CMS (932줄, 단일 파일)
│       ├─ AdminPage(로그인) → AdminDashboard
│       └─ 탭별 Editor 컴포넌트 11개 (BasicInfoEditor, GalleryEditor 등)
├─ components/
│   └─ MainCover.tsx      # 첫 화면 커버 (오프닝 애니메이션)
└─ data/
    └─ wedding-info.ts    # 타입 정의 + 기본값 + localStorage read/write 함수
                           # ★ 신규 고객 커스텀 작업 시 최우선 수정 대상
```

**주의**: `App.tsx`, `AdminPage.tsx`는 800~900줄대 단일 파일. 특정 섹션만 고칠 때는
Grep으로 해당 컴포넌트(`const XxxSection = ...`) 위치만 찾아 그 블록만 Read할 것
(파일 전체를 컨텍스트에 올리지 말 것).

## 데이터 흐름
1. `defaultWeddingData` (data/wedding-info.ts) — 최초 기본값
2. `loadWeddingData()` — localStorage(`STORAGE_KEYS.weddingData`)에서 읽기, 없으면 기본값
3. React state (App.tsx / AdminPage.tsx 내부) — 렌더링에 사용
4. `saveWeddingData(data)` — Admin에서 저장 시 localStorage에 즉시 write
5. RSVP(`rsvps`), 방명록(`guestbook`)도 동일 패턴 (`loadRsvps/saveRsvps`, `loadGuestbook/saveGuestbook`)

서버 API, 데이터베이스, 외부 fetch 없음 — 전부 클라이언트 로컬 상태.

## 인증 방식
- `AdminPage.tsx`의 `handleLogin()`에서 **하드코딩된 비밀번호 문자열**을 비교하는 방식
- 세션/토큰/서버 검증 없음, `authenticated` 로컬 state로만 화면 전환
- 보안 등급: 데모/개인용 수준. 실서비스 민감정보 보호용으로 취급하지 말 것
- 고객사 인계 시 비밀번호 변경 필수 (코드 내 리터럴 직접 수정)

## DB 구조 (= localStorage 스키마)
DB 없음. `localStorage` 키 3개, `STORAGE_KEYS` (data/wedding-info.ts)로 정의:

| key | 타입 | 설명 |
|---|---|---|
| `weddingData` | `WeddingInfo` (JSON) | 신랑/신부 정보, 계좌, 날짜, 장소, 갤러리, 인터뷰 등 |
| `rsvps` | `RsvpEntry[]` (JSON) | 참석 여부 응답 |
| `guestbook` | `GuestbookEntry[]` (JSON) | 방명록 |

`WeddingInfo` 필드 구조는 `src/data/wedding-info.ts`의 `interface WeddingInfo` 원본이
Single Source of Truth이므로 여기 중복 기술하지 않음 — 필요 시 해당 파일만 Read.
