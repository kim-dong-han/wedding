# 영구 소장형 모바일 청첩장 서비스 (Master Template)

이 프로젝트는 Vite + React + TypeScript + Tailwind CSS를 기반으로 한 모바일 청첩장 마스터 템플릿입니다. Cloudflare Pages를 통해 무료로 평생 호스팅이 가능하도록 설계되었습니다.

## 🚀 서비스 운영 가이드 (Business Workflow)

1. **의뢰 접수:** 예비 부부로부터 웨딩 정보(이름, 날짜, 장소, 계좌번호 등)와 사진을 전달받습니다.
2. **계정 준비:** 고객에게 GitHub 계정 생성을 요청하고, 본인을 Collaborator로 초대하게 합니다.
3. **커스텀 작업:**
   - `src/data/wedding-info.ts` 파일의 데이터를 의뢰 내용으로 수정합니다.
   - `public/` 폴더의 이미지를 고객의 웨딩 사진으로 교체합니다.
4. **배포:** 
   - 고객의 GitHub 레포지토리에 코드를 푸시합니다.
   - Cloudflare Pages에서 해당 레포지토리를 연결하여 배포합니다. (Build Command: `npm run build`, Build Output: `dist`)
5. **완료:** 생성된 Cloudflare URL을 고객에게 전달합니다.

## 🛠 기술 스택
- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Deployment:** Cloudflare Pages

## 📂 주요 폴더 구조
- `src/data/`: 모든 웨딩 정보가 집중된 데이터 파일 (`wedding-info.ts`)
- `src/components/`: 메인 커버, 갤러리, 지도 등 각 섹션별 컴포넌트
- `public/`: 웨딩 사진 및 정적 자산

---
*본 템플릿은 데이터와 로직이 분리되어 있어, 데이터 파일 수정만으로 빠르게 새로운 청첩장 제작이 가능합니다.*
