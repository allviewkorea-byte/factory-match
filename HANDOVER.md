# 공장매칭 (FactoryMatch) 프로젝트 인수인계서
> 새 채팅에서 이 문서를 보여주면 바로 작업 시작 가능

---

## 🔑 핵심 정보

### 사이트
- **URL**: https://steady-mousse-5900f8.netlify.app
- **GitHub**: https://github.com/allviewkorea-byte/factory-match
- **GitHub 토큰**: ghp_****[GitHub Token - 별도 보관]

### 작업 방식
```
Claude 웹채팅이 직접 git push 가능
흐름: git clone → 코드 수정 → 빌드 → git push → Netlify 자동배포
remote URL: https://[토큰]@github.com/allviewkorea-byte/factory-match.git
```

---

## ⚠️ 코드 수정 시 반드시 지켜야 할 규칙

### 빌드 필수 (가장 중요!)
`pages.js`, `app.js`, `styles.css`, `data.js` 중 하나라도 수정하면
**반드시 빌드 후 min 파일도 함께 push해야 합니다.**

```bash
# 수정 후 반드시 실행
cd /home/claude/factory-match
node build.js

# 그 다음 push
git add pages.js pages.min.js app.js app.min.js styles.css styles.min.css data.js data.min.js
git commit -m "..."
git push
```

### 왜 필요한가?
- 현재 사이트는 Babel CDN 없이 **사전 컴파일된 .min.js 파일**을 사용
- `pages.js`만 수정하고 `pages.min.js`를 업데이트 안 하면 사이트에 반영 안 됨
- `pages.min.js`는 `node build.js`가 자동 생성함

### 빌드 원리
```
pages.js (JSX 포함) 
  → IIFE로 감싸기 (스코프 분리)
  → esbuild로 JSX 변환 + 압축
  → pages.min.js (브라우저에서 바로 실행 가능)
```

### IIFE가 필요한 이유
`pages.js`와 `app.js` 둘 다 `const { useState } = React` 선언.
Babel CDN은 각 파일을 독립 스코프로 실행했지만,
이제 같은 스코프에서 실행되므로 IIFE로 감싸서 충돌 방지.

---

## 🗝️ API 키 모음

| 서비스 | 키 |
|--------|-----|
| Anthropic | sk-ant-api03-****[Anthropic API Key - 별도 보관] |
| Supabase URL | https://yezxwlzyiqgewpkkyget.supabase.co |
| Supabase anon key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...****[Supabase anon key - 별도 보관] |
| 네이버 Client ID | tgqWP4gTAET4eh7pp1gh |
| 네이버 Client Secret | jBMiXrwRT9 |
| Google Maps | AIzaSyBA8NVjmUKCSbMtqbz0o6nuGECFmjbGGJY |
| Google Geocoding | AIzaSyC1WBx03zr2C0tDIdlsN8noB1Ue5dXpe1Y |
| KICOX+정부지원금 | 2ca93f3d623e0992d77686cd49e603aa5227eb3bd6ad66243300e10cc6b2b1b7 |
| DART | fc85d5b3e93600d415fa6e005057c5b609e874ca |

---

## 🗄️ DB 현황 (Supabase)

- **총 공장 수**: 217,054개
- **테이블**: factories
- **주요 컬럼**: id, name, city, region, website, email, phone, summary, industries, processes, ai_summary, completeness_score, bizrno, dart_revenue, dart_assets, lat, lng, hidden, dart_mismatch_name, dart_manual_match

### completeness_score 기준
| 항목 | 점수 |
|------|------|
| ai_summary | +40 |
| website | +20 |
| DART 재무 | +15 |
| phone | +10 |
| summary | +5 |
| 좌표(lat/lng) | +5 |
| image | +5 |

---

## 📁 프로젝트 구조

```
factory-match/
├── index.html          ← 메인 HTML (min 파일 로드)
├── pages.js            ← 전체 페이지 컴포넌트 (~10,000줄) ← 수정 대상
├── pages.min.js        ← 빌드 결과물 (자동생성, 직접 수정 금지)
├── app.js              ← 앱 라우팅 ← 수정 대상
├── app.min.js          ← 빌드 결과물 (자동생성, 직접 수정 금지)
├── styles.css          ← 전체 스타일 ← 수정 대상
├── styles.min.css      ← 빌드 결과물 (자동생성, 직접 수정 금지)
├── data.js             ← 정적 데이터
├── data.min.js         ← 빌드 결과물 (자동생성, 직접 수정 금지)
├── build.js            ← 빌드 스크립트 (esbuild)
├── netlify/functions/
│   ├── ai-consult.js   ← AI 상담 API
│   └── ai-match.js     ← AI 매칭 API
└── enrich_*.py         ← 데이터 수집 스크립트들
```

### 코드 수정 시 주의사항
- **원본 파일** (pages.js, app.js 등) 수정
- **node build.js** 실행해서 min 파일 재생성
- **둘 다 함께 push** (원본 + min 파일)
- `compiled/` 폴더는 사용 안 함

---

## 🐍 매일 실행할 스크립트 (PowerShell)

### 위치: C:\Users\micro\factory-match

```powershell
# 1. git pull 후 파일 복사
cd C:\Users\micro\factory-match
git pull origin main
copy enrich_website_naver.py C:\Users\micro\Downloads\enrich_website_naver.py
copy enrich_factoryon.py C:\Users\micro\Downloads\enrich_factoryon.py
copy enrich_ai_summary.py C:\Users\micro\Downloads\enrich_ai_summary.py

# 2. API 키 설정 후 4개 동시 실행
$env:ANTHROPIC_API_KEY="sk-ant-api03-****[별도 보관]"
Start-Process powershell -ArgumentList "-NoExit -Command `$env:ANTHROPIC_API_KEY='$env:ANTHROPIC_API_KEY'; py C:\Users\micro\Downloads\enrich_geocode.py"
Start-Process powershell -ArgumentList "-NoExit -Command `$env:ANTHROPIC_API_KEY='$env:ANTHROPIC_API_KEY'; py C:\Users\micro\Downloads\enrich_factoryon.py"
Start-Process powershell -ArgumentList "-NoExit -Command `$env:ANTHROPIC_API_KEY='$env:ANTHROPIC_API_KEY'; py C:\Users\micro\Downloads\enrich_website_naver.py"
Start-Process powershell -ArgumentList "-NoExit -Command `$env:ANTHROPIC_API_KEY='$env:ANTHROPIC_API_KEY'; py C:\Users\micro\Downloads\enrich_ai_summary.py"
```

### 이메일 수집 (별도 실행)
```powershell
copy enrich_email_only.py C:\Users\micro\Downloads\enrich_email_only.py
py C:\Users\micro\Downloads\enrich_email_only.py
```

### KICOX + DART (bizrno 수집 후 실행)
```powershell
copy collect_kicox_lndpcl.py C:\Users\micro\Downloads\collect_kicox_lndpcl.py
py C:\Users\micro\Downloads\collect_kicox_lndpcl.py
# 완료 후
copy enrich_dart.py C:\Users\micro\Downloads\enrich_dart.py
py C:\Users\micro\Downloads\enrich_dart.py
# ※ DART API IP 등록 필요: opendart.fss.or.kr → 마이페이지 → IP변경신청
```

---

## ⏳ PENDING 작업 목록

### 즉시 필요
- [ ] DART IP 승인 후 enrich_dart.py 실행 (1~2영업일 대기중)
- [ ] completeness_score 재계산 SQL (DART 후)
- [ ] 잘못된 ai_summary 초기화 (회사명 불일치)

### 기능 개발
- [ ] 바이어 가입 프로필 페이지
- [ ] 홈 AI 미리보기 섹션 (비로그인)
- [ ] 디자인 최종 검토 (PC → 모바일)
- [ ] 법무사 미팅 (오픈 전)

### 장기
- [ ] Google Places API로 공장 사진 수집
- [ ] 모바일 UI/UX 작업
- [ ] 파트너 공장 유료 회원제 설계
- [ ] 거래 수수료 시스템

---

## 🏗️ 주요 기능 현황

### 제조사 탐색 (ListPage)
- 217,053개 공장 카드 표시
- completeness_score 기준 정렬
- 지역/업종/공정 필터
- 지도 연동 (현재 페이지 공장만 핀 표시)
- 뒤로가기 시 페이지 번호 복원

### 상세 페이지 (DetailPage)
- ai_summary 태그 표시
- DART 재무정보 섹션
- AI 상담 버튼 → AI 탭으로 이동 + 제조사 컨텍스트 전달

### AI 상담 (AiConsultPage)
- web_search 도구 탑재
- 제조업 전문 컨설턴트 페르소나
- 상세페이지에서 진입 시 해당 제조사 컨텍스트 자동 설정

### 정부지원금 (GrantsPage)
- 기업마당 Open API 연동
- 진행중/마감임박 상단 고정
- 지역/분야 필터, 검색창
- 공고문 다운로드, 온라인신청 바로가기

### 관리자 콘솔 (AdminPage)
- DART 불일치 관리 탭 (상호명 불일치 수동 매칭)
- 제조사 편집, 방문자 통계

### AI 매칭
- ai_summary + completeness_score 반영
- 키워드 기반 공장 검색

---

## 💡 브랜딩 메모
- 현재 이름 "공장매칭" → 브랜딩 아이덴티티 부족으로 변경 검토 중
- 후보: **세모아** (세상의 모든 공장) - 배민처럼 한글 브랜드로 검토 중
- 경쟁사: 캐파(capa.ai) 2,200개 공장 / 샤플(make.shapl.com)

## 💰 수익 모델 (계획)
1. 3~6개월 무료 운영 후 유료 전환
2. 유료 회원제 (공장 월 구독)
3. 노출 광고 (상단 배치)
4. 거래 수수료 (플랫폼 내 결제 시스템 구축 후)
5. 데이터 판매 / 금융 연계 (장기)
