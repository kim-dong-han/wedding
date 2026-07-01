# PROJECT

## 소개
영구 소장형 모바일 청첩장 마스터 템플릿. 신규 고객마다 이 템플릿을 포크하여
`src/data/wedding-info.ts` 타입 구조에 맞춰 백엔드 시드 데이터를 교체하고
배포하는 1인 운영 SaaS형 서비스.

## 기술 스택
| 영역 | 선택 | 비고 |
|---|---|---|
| Frontend | React 18 + Vite 5 + TypeScript 5 | 하객용 청첩장 화면(`/`)만 담당, SPA |
| Styling | Tailwind CSS 3 + Framer Motion 11 | |
| Backend | Spring Boot 3.5 (`C:\wedding-backend`) | REST API + 관리자 서버 렌더링, 별도 프로젝트/저장소 |
| Backend 세부 | Lombok, Spring Web, Spring Data JPA, Thymeleaf | Gradle(Groovy) 빌드 |
| DB | MariaDB (`wedding_db`) | 로컬 설치, JDBC `mariadb-java-client` |
| 관리자 화면 | Thymeleaf 서버 렌더링 (`/admin`, 세션 인증) | React에는 관리자 페이지 없음 |
| 배포 | (프론트) Cloudflare Pages 정적 호스팅 / (백엔드) 별도 서버 필요 | 기존 "서버 비용 0원" 전제는 백엔드 도입으로 깨짐 |

## 목표
- 고객사 1건당 커스터마이징 작업 시간 최소화 (데이터/로직 분리 유지)
- Claude Code 사용 시 토큰 소모 최소화 (→ RULES.md, ARCHITECTURE.md 참조)

## 진행 현황
상세 내역은 [TODO.md](./TODO.md) 참조. 이 섹션은 한 줄 요약만 유지.
- 현재 단계: Spring Boot(JPA/MariaDB/Thymeleaf) 백엔드 도입 완료, React는 REST API
  fetch 기반으로 전환, 관리자 페이지는 Thymeleaf로 이전 완료
