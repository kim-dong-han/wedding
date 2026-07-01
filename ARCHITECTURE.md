# ARCHITECTURE

> Claude에게: 이 문서는 구조 파악용 최소 참조 자료. 코드 전체를 다시 읽지 말고
> 이 문서 + 관련 파일 1~2개만 열어서 작업할 것.

## 시스템 구조
- 프론트엔드(`C:\wedding`, 이 저장소)와 백엔드(`C:\wedding-backend`, 별도
  프로젝트/저장소)로 완전히 분리됨
- 하객용 청첩장 화면(`/`)은 React SPA. 백엔드 REST API(`http://localhost:8082/api/**`)를
  fetch로 호출해 데이터를 읽고 씀
- 관리자 화면(`/admin`)은 React가 아니라 **백엔드의 Thymeleaf 서버 렌더링 화면**.
  React 쪽에는 관리자 페이지가 존재하지 않음
- 데이터 영속성은 MariaDB(`wedding_db`) 하나로 통합 (localStorage 사용 안 함)

```
[하객 브라우저] --fetch(JSON)--> [Spring Boot :8082 /api/**] --JPA--> [MariaDB wedding_db]
[신랑/신부 브라우저] --폼 제출/세션--> [Spring Boot :8082 /admin/** (Thymeleaf)] --JPA--> [MariaDB]
```

## 프론트엔드 패키지 구조 (`C:\wedding`)
```
src/
├─ main.tsx              # 엔트리, 라우터 등록
├─ App.tsx                # '/' 라우트만 존재. 청첩장 전체 섹션
│   ├─ SectionNav, WeddingPage, Greeting, GallerySection
│   ├─ LocationSection, AccountSection, RsvpSection
│   └─ GuestbookSection, Footer
├─ components/
│   └─ MainCover.tsx      # 첫 화면 커버 (오프닝 애니메이션)
└─ data/
    └─ wedding-info.ts    # 타입 정의(SSOT) + 백엔드 fetch 함수 모음
                           # ★ API 스키마 변경 시 최우선 수정 대상
```
`AdminPage.tsx`는 관리자 기능이 백엔드로 이전되며 삭제됨.

## 데이터 흐름
1. `WeddingPage` 마운트 시 `useEffect`에서 `fetchWeddingInfo()`, `fetchGuestbook()` 호출
2. 로딩 전(`data === null`)에는 아무것도 렌더링하지 않음 (`if (!data) return null`)
3. RSVP 제출 → `submitRsvp()`로 `POST /api/rsvp` (응답을 화면에 유지할 필요 없어 상태 저장 안 함)
4. 방명록 작성 → `submitGuestbookEntry()`로 `POST /api/guestbook`, 응답을 로컬 목록에 append
5. 방명록 삭제 → 비밀번호 입력 → `deleteGuestbookEntry(id, password)`로
   `DELETE /api/guestbook/{id}` (비밀번호 검증은 서버의 BCrypt 해시 비교로만 수행,
   클라이언트는 평문 비밀번호를 절대 보관하지 않음)

## 백엔드 구조 (`C:\wedding-backend`, Spring Boot 3.5 / Gradle)
```
com.wedding.backend
├─ domain/       # WeddingInfo(싱글턴 id=1), Person/Location/... (@Embeddable),
│                 # RsvpEntry, GuestbookEntry (@Entity)
├─ repository/   # JpaRepository 3종
├─ service/      # WeddingInfoService, RsvpService, GuestbookService
├─ dto/          # WeddingInfoDto 등 — React WeddingInfo 인터페이스와 1:1 매칭되는 JSON 응답
├─ api/          # /api/** REST 컨트롤러 (공개, 인증 없음 — CORS로 프론트 오리진만 허용)
├─ admin/        # /admin/** Thymeleaf 컨트롤러 + 세션 인증 인터셉터
└─ config/       # CORS, 인터셉터 등록
```
- `application.yml`: `server.port=8082`, `spring.datasource.*`(MariaDB),
  `app.admin.password`(기본 `admin1234`, 환경변수 `ADMIN_PASSWORD`로 교체),
  `app.cors.allowed-origins`(기본 `http://localhost:5173`)
- DB 비밀번호는 `DB_PASSWORD` 환경변수로 주입 (코드/설정 파일에 평문 커밋 금지)

## 인증 방식
- 관리자: `POST /admin/login`에서 `app.admin.password`와 비교 → 세션(`HttpSession`)에
  플래그 저장 → `AdminAuthInterceptor`가 `/admin/**`(login/logout 제외) 접근 시 검사
- 방명록 삭제: 사용자가 입력한 비밀번호를 BCrypt로 해시해 DB에 저장, 삭제 시
  `BCryptPasswordEncoder.matches()`로 검증 (평문 비교 아님)
- 보안 등급: 여전히 소규모 개인 서비스 수준. 실제 운영 전환 시 관리자 비밀번호를
  반드시 교체하고 HTTPS 적용 필요

## DB 구조 (MariaDB `wedding_db`)
| 테이블 | 설명 |
|---|---|
| `wedding_info` | 싱글턴 행(id=1). 신랑/신부(`groom_*`/`bride_*` 접두 컬럼), 날짜/시간,
  장소, 인사말, 오프닝(`opening_*`), BGM(`bgm_*`) |
| `wedding_gallery` | 갤러리 이미지 URL 목록 (`@ElementCollection`, 순서 보존) |
| `wedding_interview` / `wedding_notice` / `wedding_transport` | 인터뷰/공지/교통안내 목록 |
| `rsvp_entry` | RSVP 응답 (id는 UUID 문자열) |
| `guestbook_entry` | 방명록 (`password_hash`만 저장, 평문 비밀번호 없음) |

`WeddingInfo` 관련 필드의 Single Source of Truth는 여전히
`src/data/wedding-info.ts`의 TS 인터페이스(React 쪽)이며, 백엔드
`WeddingInfoDto`는 이 인터페이스와 필드명이 1:1로 매칭되도록 유지해야 함.

## 로컬 실행 순서
1. MariaDB(Windows 서비스명 `MySQL`) 실행 확인: `Get-Service MySQL`
2. 백엔드: `cd C:\wedding-backend && ./gradlew.bat bootRun` (포트 8082)
3. 프론트엔드: `cd C:\wedding && npm run dev` (포트 5173)
4. 하객 화면: http://localhost:5173 , 관리자 화면: http://localhost:8082/admin
