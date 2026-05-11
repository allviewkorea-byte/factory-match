# 공장매칭 (FactoryMatch) 인수인계서
> 새 채팅에서 이 문서를 보여주면 바로 작업 시작 가능
> 마지막 업데이트: 2026-05-11

---

## 🔑 핵심 정보

| 항목 | 내용 |
|------|------|
| 사이트 URL | https://steady-mousse-5900f8.netlify.app |
| GitHub | https://github.com/allviewkorea-byte/factory-match |
| GitHub 토큰 | Claude 메모리에 저장됨 |
| 로컬 경로 | C:\Users\micro\factory-match (Windows, `py` 명령) |

### 작업 흐름
```
Claude 웹채팅 → git clone → 코드 수정 → node build.js → git push → Netlify 자동배포
```

---

## ⚠️ 빌드 규칙 (가장 중요!)

pages.js, app.js, styles.css, data.js 수정 시 반드시 빌드 후 함께 push

```bash
cd /home/claude/factory-match
node build.js

git add pages.js pages.min.js app.js app.min.js styles.css styles.min.css data.js data.min.js
git commit -m "..."
git push
```

왜? 사이트는 Babel CDN 없이 esbuild 사전컴파일된 .min.js를 로드함.
원본만 push하면 사이트에 반영 안 됨.

IIFE 래핑: pages.js/app.js 둘 다 const {useState}=React 선언 → 스코프 충돌 방지.
build.js가 자동 처리하므로 신경 쓸 필요 없음.

---

## 🗝️ API 키 (Claude 메모리에 저장됨)

| 서비스 | 용도 |
|--------|------|
| Supabase URL | https://yezxwlzyiqgewpkkyget.supabase.co |
| Supabase anon key | 메모리 참조 |
| Anthropic | AI 요약 enrich_ai_summary.py |
| 네이버 ID/Secret | 웹사이트 수집 enrich_website_naver.py |
| Google Maps | 지도/좌표 |
| Google Geocoding | 주소→좌표 변환 |
| KICOX+정부지원금 | 공장 데이터 + 지원사업 API |
| DART | 재무정보 opendart.fss.or.kr |

---

## 🗄️ DB 현황 (Supabase)

- 총 공장: 217,054개 (factories 테이블)
- bizrno: 컬럼은 있으나 실제 값 없음 → collect_kicox_lndpcl.py 재실행 필요
- 웹사이트 수집: 34,655개
- ai_summary: 일부 수집됨

주요 컬럼:
id, name, city, region, website, email, phone, summary, industries, processes,
ai_summary, completeness_score, bizrno, dart_revenue, dart_assets,
lat, lng, hidden, dart_mismatch_name, dart_manual_match

completeness_score: ai_summary(+40), website(+20), DART재무(+15), phone(+10), summary(+5), 좌표(+5), image(+5)

중요 SQL 함수:
SELECT * FROM get_region_counts();  -- 지역별 공장 수 (한글→영문 코드 변환)

---

## 📁 프로젝트 구조

```
factory-match/
├── index.html            ← 메인 HTML
├── pages.js              ← 전체 페이지 컴포넌트 (~11,000줄) ★ 주요 수정 대상
├── pages.min.js          ← 빌드 결과물 (직접 수정 금지)
├── app.js                ← 앱 라우팅/인증
├── app.min.js            ← 빌드 결과물 (직접 수정 금지)
├── styles.css            ← 전체 스타일
├── styles.min.css        ← 빌드 결과물 (직접 수정 금지)
├── data.js               ← 정적 데이터 (공정/업종/지역 매핑)
├── data.min.js           ← 빌드 결과물 (직접 수정 금지)
├── build.js              ← esbuild 빌드 스크립트
├── netlify/functions/
│   ├── ai-consult.js     ← AI 상담 Netlify Function
│   └── ai-match.js       ← AI 매칭 Netlify Function
└── enrich_*.py           ← 데이터 수집 스크립트 (PC에서 실행)
```

pages.js 주요 컴포넌트:
Header, GateModal, LandingPage, AuthFormPage, ForgotPasswordPage,
SignupPage, VerifyPage, OnboardingPage, WelcomePage,
HomePage, ListPage, DetailPage, RfqPage, AiConsultPage,
GrantsPage, MyPage, AdminPage

---

## 🔐 인증/가입 흐름

로그인: 이메일+비밀번호 → Supabase 인증 → 바로 홈 (verify 없음)
이메일 가입: SignupPage 4단계 → status=active 즉시 활성화
소셜 로그인: 카카오/네이버 UI만 있음(미연동), 구글 Supabase 연동됨

게이트 모달 조건:
- 공장 상세: 비로그인 2회 허용 → 3번째 게이트
- 정부지원금 게시물: 클릭 즉시 게이트
- AI 상담 / 견적 요청: 클릭 즉시 게이트

---

## 🏗️ 주요 기능 현황

제조사 탐색 (ListPage):
- 지역/업종/공정 필터 (서버사이드), completeness_score 정렬
- 지도 연동, 인증/리드타임 필터 숨김 (데이터 없음)

공장 상세 (DetailPage):
- 관심 제조사 (localStorage, 빨간 하트 토글)
- 정보 오류 문의 버튼 (노란 배경)

정부지원금 (GrantsPage):
- 기업마당 API, 진행중/마감임박/마감/전체 필터
- 공고문 다운로드(초록), 온라인 신청, 스크랩(제목+ID 저장)
- 뒤로/앞으로가기 히스토리 지원

마이페이지 (MyPage):
- 탭: 개요/견적요청내역/최근조회/관심제조사/지원사업스크랩/계정정보
- 관심 제조사: Supabase DB 직접 조회
- 지원사업 스크랩: 제목 표시, 클릭 시 grants 탭 이동

관리자 콘솔 (AdminPage):
- DART 불일치 탭, 방문자 통계, 제조사 편집

---

## 🐍 데이터 수집 스크립트

매일 실행 (C:\Users\micro\factory-match에서):
```powershell
py enrich_geocode.py        # 주소→좌표
py enrich_factoryon.py      # 공장온 정보
py enrich_website_naver.py  # 웹사이트 수집
py enrich_ai_summary.py     # AI 요약
py enrich_email_only.py     # 이메일 수집
```

1회성:
```powershell
del lndpcl_progress.json && py collect_kicox_lndpcl.py  # bizrno 수집 (일 1,000건)
py enrich_dart.py                                         # DART 재무 (일 10,000건, IP승인 후)
```

---

## ⏳ PENDING 작업

즉시 (데이터):
- DART IP 승인 확인 후 enrich_dart.py 실행
- lndpcl_progress.json 삭제 후 collect_kicox_lndpcl.py 재실행
- DART 수집 후 completeness_score SQL 재계산

기능 개발:
- 카카오/네이버 소셜 로그인 연동 (각 개발자센터 앱 등록 필요)
- 제조사 소유권 인증 (사업자등록증 업로드 → 관리자 승인 → 편집 권한)
- 공장 사진 업로드 (여러 장)
- SMS 알림 실제 연동 (Twilio 등 필요)
- website 검증 스크립트 (verify_website.py)
- 홈 AI 미리보기 섹션 (비로그인)

오픈 전:
- 모바일 UI/UX 검토
- 법무사 미팅 (이용약관/개인정보처리방침)

---

## 💡 알아두면 좋은 것들

- Supabase 이메일 한도: 시간당 3~4회 (rate limit 에러 시 1시간 대기)
- KICOX API 일 한도: 1,000건 (증량 신청 중)
- DART/정부지원금 API 한도: 10,000건/일
- 전화번호 SMS 인증: UI만 있고 실제 발송 미연동
- 브랜딩 후보: 세모아 (세상의 모든 공장)
- 경쟁사: 캐파(capa.ai) 2,200개 / 샤플(make.shapl.com)
