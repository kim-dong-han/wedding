# PROJECT

## 소개
영구 소장형 모바일 청첩장 마스터 템플릿. 신규 고객마다 이 템플릿을 포크하여
`src/data/wedding-info.ts`와 `public/` 이미지만 교체 후 Cloudflare Pages에 배포하는
1인 운영 SaaS형 서비스.

## 기술 스택
| 영역 | 선택 | 비고 |
|---|---|---|
| Framework | React 18 + Vite 5 | SPA, SSR 없음 |
| Language | TypeScript 5 | strict 모드 |
| Styling | Tailwind CSS 3 | 커스텀 CSS 최소화 |
| Animation | Framer Motion 11 | |
| Routing | react-router-dom 7 | `/`, `/admin` 2개 라우트 |
| 배포 | Cloudflare Pages | 정적 호스팅, 서버리스 |
| 데이터 저장 | 브라우저 localStorage | 백엔드/DB 없음 |

## 목표
- 고객사 1건당 커스터마이징 작업 시간 최소화 (데이터/로직 분리 유지)
- 무료 티어로 평생 호스팅 가능한 구조 유지 (서버 비용 0원)
- Claude Code 사용 시 토큰 소모 최소화 (→ RULES.md, ARCHITECTURE.md 참조)

## 진행 현황
상세 내역은 [TODO.md](./TODO.md) 참조. 이 섹션은 한 줄 요약만 유지.
- 현재 단계: 관리자 페이지(CMS) 기반 v1 완료, 모바일 UI 간소화 완료
