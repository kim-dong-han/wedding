# TODO

> 세션 시작 시 Claude가 git log를 다시 뒤지지 않도록, 여기 상태를 최신으로 유지한다.
> 작업 완료 즉시 "진행 중" → "완료"로 이동. 오래된 항목은 삭제(보관 금지, git 이력으로 충분).

## 완료
- [x] Vite + React + TS + Tailwind 기본 템플릿 구축
- [x] Cloudflare Pages 배포 파이프라인 (base path, redirects 이슈 해결)
- [x] 모바일 청첩장 UI 간소화 및 폰트 크기 조정
- [x] MariaDB 로컬 설치 및 `wedding_db` 생성
- [x] `C:\wedding-backend` Spring Boot(Lombok/Web/JPA/Thymeleaf/MariaDB) 프로젝트 생성
- [x] WeddingInfo/RsvpEntry/GuestbookEntry JPA 엔티티 + Repository + REST API(`/api/**`)
- [x] 관리자 페이지를 React(`AdminPage.tsx`, 삭제됨)에서 백엔드 Thymeleaf(`/admin/**`,
      세션 인증)로 완전 이전 — 기본정보/계좌/갤러리/인터뷰/공지/교통/오프닝/BGM/RSVP/방명록
- [x] React의 localStorage 읽기/쓰기를 전부 `fetch` 기반 API 호출로 교체
- [x] 방명록 삭제 비밀번호를 BCrypt 해시로 저장/검증하도록 변경 (평문 저장 제거)
- [x] Playwright E2E로 청첩장 렌더링/RSVP 제출/방명록 작성·삭제(오답/정답) 검증 완료

## 진행 중
- [ ] (여기에 현재 작업 중인 항목을 적을 것)

## 예정
- [ ] 신규 고객사 온보딩 체크리스트 문서화 (README 워크플로우 보완, 백엔드 배포 방법 포함)
- [ ] 백엔드 프로덕션 배포 방식 결정 (서버 호스팅, MariaDB 운영 환경, HTTPS)
- [ ] `C:\wedding-backend`를 별도 git 저장소로 초기화할지 결정

## 다음 세션 시작 시 Claude에게
- 위 "진행 중" 항목만 먼저 확인하고 시작. PROJECT.md/ARCHITECTURE.md는
  구조가 바뀌었을 때만 참조 (매번 재확인 불필요)
