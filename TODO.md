# TODO

> 세션 시작 시 Claude가 git log를 다시 뒤지지 않도록, 여기 상태를 최신으로 유지한다.
> 작업 완료 즉시 "진행 중" → "완료"로 이동. 오래된 항목은 삭제(보관 금지, git 이력으로 충분).

## 완료
- [x] Vite + React + TS + Tailwind 기본 템플릿 구축
- [x] Cloudflare Pages 배포 파이프라인 (base path, redirects 이슈 해결)
- [x] 관리자 페이지(`/admin`) 추가 — 기본정보/계좌/갤러리/인터뷰/공지/교통/오프닝/BGM/RSVP/방명록 편집
- [x] 모바일 청첩장 UI 간소화 및 폰트 크기 조정

## 진행 중
- [ ] (여기에 현재 작업 중인 항목을 적을 것. 예: "AccountSection 계좌 복사 UX 개선")

## 예정
- [ ] 신규 고객사 온보딩 체크리스트 문서화 (README 워크플로우 보완)
- [ ] Admin 비밀번호를 환경변수/빌드 타임 설정으로 분리 (현재 하드코딩, ARCHITECTURE.md 참고)
- [ ] `App.tsx`/`AdminPage.tsx` 분리 여부 검토 (900줄대, 필요 시에만 분리)

## 다음 세션 시작 시 Claude에게
- 위 "진행 중" 항목만 먼저 확인하고 시작. PROJECT.md/ARCHITECTURE.md는
  구조가 바뀌었을 때만 참조 (매번 재확인 불필요)
