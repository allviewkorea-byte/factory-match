"""
공장매칭 매거진 자동 생성 스크립트 (SEO 키워드 최적화 버전 — 정보성 글 전용)
- Claude API로 본문 생성 (SEO 키워드 최적화 + 전문성 + 친근한 톤)
- Unsplash API로 사진 가져오기
- 정적 HTML 페이지 생성 → /magazine/posts/[slug]/index.html
- posts.json 자동 업데이트
- sitemap.xml 자동 업데이트 (lastmod + priority 포함)
- 글 타입: 가이드 / 비교 / 체크리스트 / 트렌드 / 케이스스터디 (추천 글 제외)

실행:
  cd C:\\Users\\micro\\factory-match
  git pull origin main
  py generate_magazine.py          # 초기 10개 일괄 생성
  py generate_magazine.py --daily  # 매일 3개 생성 (GitHub Actions)

필수 환경변수:
  ANTHROPIC_API_KEY = sk-ant-...
  UNSPLASH_ACCESS_KEY = (https://unsplash.com/developers 에서 발급)
"""

import os
import sys
import json
import re
import random
import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path

import requests
import anthropic

# === 설정 ===
SCRIPT_DIR = Path(__file__).parent
MAGAZINE_DIR = SCRIPT_DIR / "magazine"
POSTS_DIR = MAGAZINE_DIR / "posts"
DATA_FILE = MAGAZINE_DIR / "data" / "posts.json"
SITEMAP_FILE = SCRIPT_DIR / "sitemap.xml"

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
UNSPLASH_ACCESS_KEY = os.environ.get("UNSPLASH_ACCESS_KEY") or "Ez21T7kxW7Dqe5uS_dFfQ6rywt4lr5H6fwpYLgaefH0"
SUPABASE_URL = "https://yezxwlzyiqgewpkkyget.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"

# Claude 클라이언트
claude = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

# Supabase REST API 헤더
SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

# === 글 형식 정의 (정보성만) ===
POST_FORMATS = [
    {"type": "guide",     "count": 0,  "weight": 35},
    {"type": "compare",   "count": 0,  "weight": 25},
    {"type": "checklist", "count": 0,  "weight": 20},
    {"type": "trend",     "count": 0,  "weight": 12},
    {"type": "case",      "count": 0,  "weight": 8},
]

# 산업 카테고리 (KICOX 기반) — SEO 키워드 필드 추가
INDUSTRIES = [
    {
        "key": "cnc", "name": "CNC 가공",
        "kw_unsplash": "cnc machining factory", "color": "#1d4ed8",
        "seo_keywords": ["CNC 가공 업체", "CNC 밀링 선반", "정밀 가공 공장", "알루미늄 가공 업체"],
    },
    {
        "key": "injection", "name": "사출 성형",
        "kw_unsplash": "injection molding factory", "color": "#10b981",
        "seo_keywords": ["사출 성형 공장", "플라스틱 사출 업체", "사출 금형 제작", "소량 사출 생산"],
    },
    {
        "key": "press", "name": "프레스",
        "kw_unsplash": "metal press factory", "color": "#f59e0b",
        "seo_keywords": ["프레스 가공 업체", "금속 프레스 공장", "판금 프레스", "스탬핑 가공"],
    },
    {
        "key": "mold", "name": "금형 제작",
        "kw_unsplash": "mold manufacturing factory", "color": "#7c3aed",
        "seo_keywords": ["금형 제작 업체", "사출 금형 공장", "금형비 견적", "플라스틱 금형"],
    },
    {
        "key": "sewing", "name": "봉제 공장",
        "kw_unsplash": "garment sewing factory", "color": "#ec4899",
        "seo_keywords": ["봉제 공장 추천", "의류 위탁 생산", "소량 봉제 업체", "OEM 봉제"],
    },
    {
        "key": "coating", "name": "도장 / 표면처리",
        "kw_unsplash": "industrial coating factory", "color": "#06b6d4",
        "seo_keywords": ["분체 도장 업체", "액체 도장 공장", "표면 처리 견적", "아노다이징 업체"],
    },
    {
        "key": "casting", "name": "주조 공장",
        "kw_unsplash": "metal casting foundry", "color": "#dc2626",
        "seo_keywords": ["주조 공장 추천", "알루미늄 다이캐스팅", "주물 업체 견적", "압력 주조"],
    },
    {
        "key": "welding", "name": "용접 / 제관",
        "kw_unsplash": "welding factory", "color": "#0891b2",
        "seo_keywords": ["용접 공장 추천", "제관 업체 견적", "철구조물 용접", "TIG MIG 용접"],
    },
]

REGIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "경남", "경북", "충남", "충북", "전남", "전북", "강원"]

# ─────────────────────────────────────────────
# SEO 키워드 풀 (검색량 높은 한국 제조업 longtail)
# ─────────────────────────────────────────────
SEO_KEYWORD_TOPICS = [
    # 발주 가이드 — 검색 의도: How
    {"type": "guide", "kw": "사출 성형 발주 방법",          "industry": "injection",
     "title": "사출 성형 발주 방법 완벽 가이드: 도면부터 납품까지",
     "meta_desc": "사출 성형 공장에 처음 발주하는 분을 위한 단계별 가이드. 도면 준비, 금형비, MOQ, 납기까지 핵심 정보를 정리했습니다.",
     "kw_unsplash": "injection molding factory"},
    {"type": "guide", "kw": "CNC 가공 견적 방법",           "industry": "cnc",
     "title": "CNC 가공 견적 받는 법: 단가 계산부터 업체 선정까지",
     "meta_desc": "CNC 가공 견적을 처음 받아보는 분을 위한 가이드. 단가 구성, 도면 제출 방법, 업체 비교 기준을 정리했습니다.",
     "kw_unsplash": "cnc machining factory"},
    {"type": "guide", "kw": "금형제작 비용 절감",           "industry": "mold",
     "title": "금형제작 비용 절감하는 5가지 실전 방법: 설계 단계부터 시작하라",
     "meta_desc": "금형제작 비용 절감을 위한 DFM 설계, 공용 금형 활용, 단계별 투자 전략 등 실전 팁을 정리했습니다.",
     "kw_unsplash": "mold manufacturing"},
    {"type": "guide", "kw": "의류제작 봉제 공장 발주",      "industry": "sewing",
     "title": "의류제작 봉제 공장 발주 가이드: MOQ·샘플·검품 핵심 체크포인트",
     "meta_desc": "의류제작 봉제 공장에 처음 발주하는 분을 위한 가이드. MOQ 협상, 샘플 제작, 검품 기준까지 실전 정보.",
     "kw_unsplash": "garment sewing factory"},
    {"type": "guide", "kw": "분체도장 업체 선정",           "industry": "coating",
     "title": "분체도장 업체 선정 가이드: 비용·품질·납기 체크리스트",
     "meta_desc": "분체도장 업체를 선정할 때 꼭 확인해야 할 비용 구조, 표면 처리 기준, 납기 협의 방법을 정리했습니다.",
     "kw_unsplash": "industrial coating"},
    {"type": "guide", "kw": "프레스 가공 발주",             "industry": "press",
     "title": "프레스 가공 발주 전 꼭 알아야 할 7가지",
     "meta_desc": "프레스 가공 발주 시 소재 선택, 공차 기준, 금형비 협의까지 7가지 핵심 사항을 정리했습니다.",
     "kw_unsplash": "metal press factory"},

    # 비교 분석 — 검색 의도: 비교/선택
    {"type": "compare", "kw": "OEM ODM 차이",
     "title": "OEM vs ODM 차이점 완벽 정리: 제조 위탁 방식 선택 가이드",
     "meta_desc": "OEM과 ODM의 차이점, 비용 구조, 납기, 지식재산권 이슈를 비교 분석합니다. 어떤 방식이 맞을지 결정하는 데 도움이 됩니다.",
     "kw_unsplash": "manufacturing production"},
    {"type": "compare", "kw": "시제품 제작 방법 비교",
     "title": "시제품 제작 방법 비교: 3D프린팅 vs CNC vs 사출 — 어떤 걸 골라야 할까",
     "meta_desc": "시제품 제작 방법별 비용·납기·정밀도를 비교합니다. 3D프린팅, CNC 가공, 소량 사출 중 어떤 방법이 적합한지 알아보세요.",
     "kw_unsplash": "prototype manufacturing"},
    {"type": "compare", "kw": "국내 vs 중국 공장 비교",
     "title": "국내 공장 vs 중국 공장: 비용·품질·납기·리스크 비교 분석",
     "meta_desc": "국내 제조 vs 중국 위탁 생산의 실제 비용 차이, 품질 관리, 납기 리스크를 비교합니다. 어떤 선택이 맞을지 판단 기준을 정리했습니다.",
     "kw_unsplash": "factory manufacturing comparison"},
    {"type": "compare", "kw": "분체도장 액체도장 차이",
     "title": "분체도장 vs 액체도장: 특성·비용·적용 사례 완벽 비교",
     "meta_desc": "분체도장과 액체도장의 내구성, 색상 구현력, 단가, 적합 소재를 비교합니다. 제품에 맞는 도장 방법 선택 가이드.",
     "kw_unsplash": "industrial coating spray"},
    {"type": "compare", "kw": "플라스틱사출 알루미늄 다이캐스팅 비교",
     "title": "플라스틱사출 vs 알루미늄 다이캐스팅: 소재 선택 완벽 비교 가이드",
     "meta_desc": "플라스틱사출 성형과 알루미늄 다이캐스팅의 강도·무게·단가·금형비를 비교합니다. 제품 소재 선택에 도움이 되는 가이드.",
     "kw_unsplash": "aluminum casting injection"},

    # 트렌드 — 검색 의도: 최신 정보
    {"type": "trend", "kw": "2026 제조업 트렌드",
     "title": "2026년 한국 제조업 트렌드 5가지: 스마트팩토리·친환경·리쇼어링",
     "meta_desc": "2026년 한국 제조업의 핵심 트렌드를 분석합니다. 스마트팩토리, 친환경 소재, 리쇼어링, AI 품질 검사 최신 현황.",
     "kw_unsplash": "smart factory automation"},
    {"type": "trend", "kw": "친환경 사출 소재",
     "title": "친환경 사출 소재 트렌드: PLA·바이오 ABS·재활용 플라스틱 현황",
     "meta_desc": "친환경 사출 성형 소재의 최신 트렌드를 정리합니다. PLA, 바이오 ABS, 재활용 플라스틱 각 소재의 특성과 적용 사례.",
     "kw_unsplash": "eco plastic injection molding"},
    {"type": "trend", "kw": "스마트팩토리 도입",
     "title": "스마트팩토리 도입 현황: 중소 제조업체가 알아야 할 핵심 정보",
     "meta_desc": "한국 중소 제조업의 스마트팩토리 도입 현황과 실제 사례. 정부 지원금, 도입 비용, 기대 효과를 정리했습니다.",
     "kw_unsplash": "smart factory robot"},

    # 체크리스트 — 검색 의도: 실수 방지
    {"type": "checklist", "kw": "공장 견적서 보는 법",
     "title": "공장 견적서 제대로 보는 법: 숨은 비용 찾는 5가지 체크포인트",
     "meta_desc": "공장 견적서에서 놓치기 쉬운 금형비, 포장비, 불량률 조항 등 숨은 비용을 찾는 방법을 정리했습니다.",
     "kw_unsplash": "business document factory"},
    {"type": "checklist", "kw": "스타트업 제조 발주 실수",
     "title": "스타트업이 제조 발주에서 자주 하는 실수 7가지 — 발주 전 꼭 읽어보세요",
     "meta_desc": "제조 경험이 없는 스타트업이 발주 과정에서 자주 저지르는 실수 7가지와 예방법을 정리했습니다.",
     "kw_unsplash": "startup manufacturing mistake"},
    {"type": "checklist", "kw": "발주서 작성 방법",
     "title": "발주서 작성 완벽 가이드: 공장 클레임 없이 진행하는 필수 항목",
     "meta_desc": "제조 발주서 작성 시 빠뜨리면 안 되는 항목들을 정리했습니다. 사양, 납기, 검품 기준, 클레임 조항까지.",
     "kw_unsplash": "factory order document"},
    {"type": "checklist", "kw": "공장 방문 체크리스트",
     "title": "공장 방문 전 준비해야 할 체크리스트: 발주 결정 전 확인 포인트",
     "meta_desc": "제조 공장 방문 시 놓치기 쉬운 설비 수준, 인증 현황, 생산 능력 확인 방법을 정리했습니다.",
     "kw_unsplash": "factory visit inspection"},

    # ── 미커버 고검색량 키워드 추가 ──────────────────────────────
    # 식품제조 (월 2,040) — 바이어 의도 명확
    {"type": "guide", "kw": "식품제조 업체 찾는 법",
     "title": "식품제조 업체 찾는 법: OEM·위탁 생산 의뢰 전 꼭 알아야 할 5가지",
     "meta_desc": "식품제조 업체에 OEM·위탁 생산을 의뢰할 때 꼭 확인해야 할 HACCP 인증, MOQ, 소분 포장, 유통기한 설정 방법을 정리했습니다.",
     "kw_unsplash": "food manufacturing factory"},

    {"type": "compare", "kw": "식품제조 OEM ODM 차이",
     "title": "식품제조 OEM vs ODM: 자체 레시피·위탁 생산 방식 완벽 비교",
     "meta_desc": "식품제조 OEM(주문자 생산)과 ODM(제조사 개발)의 차이, 비용 구조, 라벨링 권리를 비교합니다.",
     "kw_unsplash": "food production oem"},

    # 임가공 (월 1,440) — 바이어 의도 명확
    {"type": "guide", "kw": "임가공 업체 견적 받는 법",
     "title": "임가공 업체 견적 받는 법: 단가 구조와 발주 조건 완벽 가이드",
     "meta_desc": "임가공 업체에 견적을 요청할 때 꼭 확인해야 할 가공비 구조, MOQ, 재료 지급 방식, 납기 협의 방법을 정리했습니다.",
     "kw_unsplash": "contract manufacturing factory"},
    {"type": "checklist", "kw": "임가공 계약 체크리스트",
     "title": "임가공 계약 전 꼭 확인해야 할 체크리스트 7가지",
     "meta_desc": "임가공 계약 시 불량률 기준, 재료 손실률, 지식재산권 귀속, 하도급 금지 조항 등 핵심 항목을 정리했습니다.",
     "kw_unsplash": "manufacturing contract agreement"},

    # 굿즈소량제작 (월 530) — 스타트업·1인 브랜드 바이어
    {"type": "guide", "kw": "굿즈소량제작 업체 찾는 법",
     "title": "굿즈 소량 제작 업체 찾는 법: 최소 수량·비용·납기 완벽 가이드",
     "meta_desc": "굿즈 소량 제작 업체 선정 시 최소 발주 수량(MOQ), 인쇄 방식, 샘플 비용, 납기 기준을 정리했습니다. 스타트업·크리에이터 필독.",
     "kw_unsplash": "custom goods small batch production"},
    {"type": "compare", "kw": "굿즈소량제작 인쇄 방식 비교",
     "title": "굿즈 소량 제작 인쇄 방식 비교: 실크스크린·DTG·승화전사 어떤 걸 골라야 할까",
     "meta_desc": "굿즈 소량 제작 시 실크스크린, DTG 디지털 직접 인쇄, 승화전사 방식을 비용·최소수량·색상 구현력 기준으로 비교합니다.",
     "kw_unsplash": "custom printing goods merchandise"},

    # 금속가공 (월 430) — B2B 바이어 의도 명확
    {"type": "guide", "kw": "금속가공 업체 선정 방법",
     "title": "금속가공 업체 선정 방법: 공차·소재·단가 기준 완벽 가이드",
     "meta_desc": "금속가공 업체 선정 시 확인해야 할 가공 공차 기준, 소재별 가격 차이, 표면처리 옵션, 납기 협의 방법을 정리했습니다.",
     "kw_unsplash": "metal machining factory"},
    {"type": "checklist", "kw": "금속가공 발주 체크리스트",
     "title": "금속가공 발주 전 꼭 확인해야 할 체크리스트 6가지",
     "meta_desc": "금속가공 발주 시 도면 규격, 소재 지정, 공차 기준, 표면처리 요구사항, 샘플 검수 기준을 사전에 정리하는 방법.",
     "kw_unsplash": "metal parts manufacturing"},

    # ── 엑셀 연관키워드 분석 신규 발굴 ───────────────────────────
    # 한국봉제공장 (월 1,300) — 미커버
    {"type": "guide", "kw": "한국 봉제공장 찾는 법",
     "title": "한국 봉제공장 찾는 법: 국내 의류 위탁 생산 완벽 가이드",
     "meta_desc": "한국 봉제공장에 의류 위탁 생산을 의뢰할 때 꼭 확인해야 할 MOQ, 샘플비, 납기, 품질 기준을 정리했습니다.",
     "kw_unsplash": "korea garment sewing factory"},
    {"type": "compare", "kw": "한국봉제공장 vs 중국공장",
     "title": "한국 봉제공장 vs 중국 공장: 비용·품질·납기 비교 가이드",
     "meta_desc": "한국 봉제공장과 중국 의류 공장의 실제 단가 차이, 품질 수준, 납기, 샘플 커뮤니케이션을 비교합니다.",
     "kw_unsplash": "garment factory comparison"},

    # 레이저가공 (월 970) — 미커버
    {"type": "guide", "kw": "레이저가공 업체 선정 방법",
     "title": "레이저 가공 업체 선정 방법: 재질별 단가·공차·납기 가이드",
     "meta_desc": "레이저 가공 업체 선정 시 확인해야 할 소재별(SUS·알루미늄·아크릴) 단가 구조, 공차 기준, 납기 협의 방법을 정리했습니다.",
     "kw_unsplash": "laser cutting factory metal"},
    {"type": "checklist", "kw": "레이저가공 발주 체크리스트",
     "title": "레이저 가공 발주 전 꼭 챙겨야 할 체크리스트 5가지",
     "meta_desc": "레이저 가공 발주 시 도면 DXF 파일 준비, 소재 두께 지정, 후처리 요구사항, 수량별 단가 확인 방법을 정리했습니다.",
     "kw_unsplash": "laser cutting precision"},

    # 중국OEM (월 960) — 미커버 (기존엔 국내vs중국 비교만 있음)
    {"type": "guide", "kw": "중국 OEM 공장 찾는 법",
     "title": "중국 OEM 공장 찾는 법: 알리바바부터 직접 발굴까지 완벽 가이드",
     "meta_desc": "중국 OEM 공장을 찾는 방법, 샘플 주문 프로세스, 품질 검수, 결제 조건, 리스크 관리 방법을 정리했습니다.",
     "kw_unsplash": "china oem factory manufacturing"},
    {"type": "compare", "kw": "중국OEM vs 국내공장 실제 비용 비교",
     "title": "중국 OEM vs 국내 공장: 실제 비용·리스크·납기 완벽 비교",
     "meta_desc": "중국 OEM과 국내 공장의 실제 단가 차이, 물류비, 품질 불량률, 납기 리스크를 항목별로 비교합니다.",
     "kw_unsplash": "china korea manufacturing comparison"},

    # 화장품공장 (월 360) — 미커버, 고부가가치 바이어
    {"type": "guide", "kw": "화장품 공장 OEM 의뢰 방법",
     "title": "화장품 공장 OEM 의뢰 방법: 식약처 인증부터 소량 생산까지",
     "meta_desc": "화장품 공장에 OEM을 의뢰할 때 꼭 확인해야 할 식약처 등록, GMP 인증, 최소 수량, 성분 기준을 정리했습니다.",
     "kw_unsplash": "cosmetics manufacturing factory"},
    {"type": "checklist", "kw": "화장품 OEM 공장 선정 체크리스트",
     "title": "화장품 OEM 공장 선정 전 꼭 확인해야 할 체크리스트 7가지",
     "meta_desc": "화장품 OEM 공장 선정 시 식약처 등록 여부, GMP 인증, 성분 데이터베이스, 책임판매업 지원 여부 확인 방법.",
     "kw_unsplash": "cosmetics production quality"},

    # 사출성형 / 사출금형 longtail (월 380 / 690) — 사출 직접 타겟 강화
    {"type": "guide", "kw": "사출성형 공정 이해 가이드",
     "title": "사출성형 공정 완벽 이해: 수지 선택부터 금형 설계까지",
     "meta_desc": "사출성형 공정의 원리, 수지별 특성(PP·ABS·PC·나일론), 금형 설계 기준, 불량 유형과 원인을 정리했습니다.",
     "kw_unsplash": "injection molding process plastic"},
    {"type": "guide", "kw": "사출금형 제작 비용과 기간",
     "title": "사출금형 제작 비용과 기간: 견적 받기 전 꼭 알아야 할 것들",
     "meta_desc": "사출금형 제작 비용 구성, 캐비티 수에 따른 단가 차이, 스틸 종류(P20·H13·S136), 제작 기간 기준을 정리했습니다.",
     "kw_unsplash": "injection mold tooling steel"},

    # 식품제조 (월 2,040) — 바이어 의도 명확
    {"type": "guide", "kw": "식품제조 업체 찾는 법",
     "title": "식품제조 업체 찾는 법: OEM·위탁 생산 의뢰 전 꼭 알아야 할 5가지",
     "meta_desc": "식품제조 업체에 OEM·위탁 생산을 의뢰할 때 꼭 확인해야 할 HACCP 인증, MOQ, 소분 포장, 유통기한 설정 방법을 정리했습니다.",
     "kw_unsplash": "food manufacturing factory"},

    {"type": "compare", "kw": "식품제조 OEM ODM 차이",
     "title": "식품제조 OEM vs ODM: 자체 레시피·위탁 생산 방식 완벽 비교",
     "meta_desc": "식품제조 OEM(주문자 생산)과 ODM(제조사 개발)의 차이, 비용 구조, 라벨링 권리를 비교합니다.",
     "kw_unsplash": "food production oem"},

    # 임가공 (월 1,440) — 바이어 의도 명확
    {"type": "guide", "kw": "임가공 업체 견적 받는 법",
     "title": "임가공 업체 견적 받는 법: 단가 구조와 발주 조건 완벽 가이드",
     "meta_desc": "임가공 업체에 견적을 요청할 때 꼭 확인해야 할 가공비 구조, MOQ, 재료 지급 방식, 납기 협의 방법을 정리했습니다.",
     "kw_unsplash": "contract manufacturing factory"},
    {"type": "checklist", "kw": "임가공 계약 체크리스트",
     "title": "임가공 계약 전 꼭 확인해야 할 체크리스트 7가지",
     "meta_desc": "임가공 계약 시 불량률 기준, 재료 손실률, 지식재산권 귀속, 하도급 금지 조항 등 핵심 항목을 정리했습니다.",
     "kw_unsplash": "manufacturing contract agreement"},

    # 굿즈소량제작 (월 530) — 스타트업·1인 브랜드 바이어
    {"type": "guide", "kw": "굿즈소량제작 업체 찾는 법",
     "title": "굿즈 소량 제작 업체 찾는 법: 최소 수량·비용·납기 완벽 가이드",
     "meta_desc": "굿즈 소량 제작 업체 선정 시 최소 발주 수량(MOQ), 인쇄 방식, 샘플 비용, 납기 기준을 정리했습니다. 스타트업·크리에이터 필독.",
     "kw_unsplash": "custom goods small batch production"},
    {"type": "compare", "kw": "굿즈소량제작 인쇄 방식 비교",
     "title": "굿즈 소량 제작 인쇄 방식 비교: 실크스크린·DTG·승화전사 어떤 걸 골라야 할까",
     "meta_desc": "굿즈 소량 제작 시 실크스크린, DTG 디지털 직접 인쇄, 승화전사 방식을 비용·최소수량·색상 구현력 기준으로 비교합니다.",
     "kw_unsplash": "custom printing goods merchandise"},

    # 금속가공 (월 430) — B2B 바이어 의도 명확
    {"type": "guide", "kw": "금속가공 업체 선정 방법",
     "title": "금속가공 업체 선정 방법: 공차·소재·단가 기준 완벽 가이드",
     "meta_desc": "금속가공 업체 선정 시 확인해야 할 가공 공차 기준, 소재별 가격 차이, 표면처리 옵션, 납기 협의 방법을 정리했습니다.",
     "kw_unsplash": "metal machining factory"},
    {"type": "checklist", "kw": "금속가공 발주 체크리스트",
     "title": "금속가공 발주 전 꼭 확인해야 할 체크리스트 6가지",
     "meta_desc": "금속가공 발주 시 도면 규격, 소재 지정, 공차 기준, 표면처리 요구사항, 샘플 검수 기준을 사전에 정리하는 방법.",
     "kw_unsplash": "metal parts manufacturing"},

    # ── 케이스 스터디 ─────────────────────────────────────────
    {"type": "case", "kw": "스타트업 OEM 공장 찾기 사례",
     "title": "스타트업이 첫 OEM 공장 찾는 데 걸린 3개월: 실전 후기",
     "meta_desc": "아이디어만 있던 스타트업이 OEM 공장을 찾고 첫 양산까지 가는 과정을 담았습니다. 시행착오와 실전 노하우를 공유합니다.",
     "kw_unsplash": "startup manufacturing factory"},
    {"type": "case", "kw": "플라스틱 사출 금형비 절감 사례",
     "title": "금형비 40% 줄인 실전 사례: 설계 단계부터 바꾼 것들",
     "meta_desc": "플라스틱 사출 제품 개발 과정에서 DFM 설계 변경으로 금형비를 40% 절감한 실제 사례를 정리했습니다.",
     "kw_unsplash": "plastic injection mold design"},
    {"type": "case", "kw": "의류 ODM 소량 생산 성공 사례",
     "title": "100장 소량 생산으로 시작한 의류 브랜드: 봉제 공장 찾기부터 납품까지",
     "meta_desc": "의류 스타트업이 소량 봉제 공장을 찾고 첫 컬렉션을 출시하기까지의 과정을 단계별로 정리했습니다.",
     "kw_unsplash": "small batch garment production"},
    {"type": "case", "kw": "CNC 가공 협력사 변경 사례",
     "title": "CNC 협력사 바꾸고 납기 2주 단축한 실전 사례",
     "meta_desc": "납기 지연과 품질 문제로 CNC 가공 협력사를 교체한 실제 경험담. 업체 평가 기준과 전환 과정을 공유합니다.",
     "kw_unsplash": "cnc machining precision parts"},
    {"type": "case", "kw": "식품 OEM 공장 선정 사례",
     "title": "건강기능식품 OEM 공장 선정 과정: HACCP 검증부터 계약까지",
     "meta_desc": "건강기능식품 브랜드가 OEM 공장을 선정하면서 HACCP 인증 확인, 샘플 테스트, 계약 협상까지 거친 실제 과정을 정리했습니다.",
     "kw_unsplash": "health food supplement manufacturing"},
    {"type": "case", "kw": "굿즈 소량 제작 첫 발주 후기",
     "title": "굿즈 300개 첫 발주 후기: 업체 찾기부터 수령까지 겪은 일들",
     "meta_desc": "크리에이터가 굿즈를 처음 만들면서 겪은 업체 선정, 샘플 확인, 최소 수량 협상, 인쇄 품질 문제 해결 과정을 공유합니다.",
     "kw_unsplash": "custom merchandise small batch"},
    {"type": "case", "kw": "중국 OEM에서 국내 공장으로 전환 사례",
     "title": "중국 OEM 끊고 국내 공장으로 바꾼 이유: 비용·품질·납기 비교",
     "meta_desc": "3년간 중국 OEM을 사용하다 국내 공장으로 전환한 실제 사례. 단가 차이, 품질 변화, 납기 개선 효과를 수치로 공유합니다.",
     "kw_unsplash": "domestic manufacturing korea factory"},
    {"type": "case", "kw": "금속 부품 임가공 업체 발굴 사례",
     "title": "금속 부품 임가공 업체 3곳 바꿔본 후기: 선정 기준이 달라졌다",
     "meta_desc": "3개 임가공 업체를 순서대로 사용하면서 배운 것들. 견적서 읽는 법, 불량률 기준, 장기 거래 조건 협상 노하우를 정리했습니다.",
     "kw_unsplash": "metal parts subcontract manufacturing"},
    {"type": "case", "kw": "화장품 소량 OEM 시작 사례",
     "title": "화장품 브랜드 첫 소량 OEM: 식약처 등록부터 라벨 디자인까지",
     "meta_desc": "1인 화장품 브랜드가 소량 OEM 공장을 선정하고 식약처 등록, 용기 선택, 라벨 디자인까지 진행한 실제 과정을 담았습니다.",
     "kw_unsplash": "cosmetics small batch manufacturing"},
    {"type": "case", "kw": "프레스 금형 개발 비용 절감 사례",
     "title": "프레스 금형 개발비 30% 절감한 방법: 설계 변경과 공장 협상 후기",
     "meta_desc": "프레스 부품 금형 개발 과정에서 재료비 절감, 공정 단순화, 공장 장기 계약으로 비용을 30% 낮춘 실전 사례를 공유합니다.",
     "kw_unsplash": "metal press stamping factory"},
]

# 추천 글 전용 SEO 타이틀 템플릿 (지역 × 산업 × 카운트)
def make_recommend_title(region, ind, count):
    """SEO 최적화된 추천 글 타이틀 생성"""
    variants = [
        f"{region} {ind['name']} 공장 추천 {count}선: 견적 바로 요청 가능한 업체",
        f"{region} {ind['name']} 업체 추천 {count}곳: 검증된 제조사 리스트",
        f"{region} {ind['name']} 발주 가이드 + 추천 업체 {count}선",
    ]
    return random.choice(variants)

def make_recommend_meta(region, ind, count):
    kw = random.choice(ind["seo_keywords"])
    return f"{region} 지역 {ind['name']} 공장 {count}곳을 소개합니다. {kw} 관련 발주 전 꼭 확인해야 할 정보와 함께 정리했습니다."

# ─────────────────────────────────────────────
# 유틸 함수
# ─────────────────────────────────────────────
def slugify(text):
    """한글 포함 텍스트를 URL-safe slug로 변환"""
    text = text.lower()
    text = re.sub(r'[\s/]+', '-', text)
    text = re.sub(r'[^\w가-힣\-]', '', text)
    return text[:80]

def weighted_choice(items, weight_key='weight'):
    total = sum(item[weight_key] for item in items)
    r = random.uniform(0, total)
    cumulative = 0
    for item in items:
        cumulative += item[weight_key]
        if r <= cumulative:
            return item
    return items[-1]

def fetch_unsplash_photo(keyword):
    """Unsplash에서 사진 1장 가져오기 + 다운로드 트래킹 (약관 6조 준수)"""
    if not UNSPLASH_ACCESS_KEY:
        return None
    try:
        res = requests.get(
            "https://api.unsplash.com/search/photos",
            params={"query": keyword, "per_page": 30, "orientation": "landscape"},
            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
            timeout=10
        )
        if res.status_code == 200:
            data = res.json()
            if data.get("results"):
                photo = random.choice(data["results"][:15])
                try:
                    download_url = photo.get("links", {}).get("download_location")
                    if download_url:
                        requests.get(
                            download_url,
                            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
                            timeout=5
                        )
                except Exception:
                    pass
                return {
                    "url": photo["urls"]["regular"],
                    "thumb_url": photo["urls"]["small"],
                    "author_name": photo["user"]["name"],
                    "author_url": photo["user"]["links"]["html"] + "?utm_source=factorymatch&utm_medium=referral",
                    "unsplash_url": "https://unsplash.com/?utm_source=factorymatch&utm_medium=referral",
                }
    except Exception as e:
        print(f"  ⚠️ Unsplash 조회 실패: {e}")
    return None

def fetch_factories(industry_key, region, count):
    """Supabase REST API로 산업×지역 공장 큐레이션"""
    try:
        search_kw = next((ind["name"] for ind in INDUSTRIES if ind["key"] == industry_key), industry_key)
        url = f"{SUPABASE_URL}/rest/v1/factories"

        # 1차: 지역 + 업종 필터
        params = {
            "select": "id,name,address,industries,factory_type",
            "limit": str(count * 5),
        }
        if region:
            params["address"] = f"ilike.*{region}*"
        params["industries"] = f"ilike.*{search_kw}*"

        res = requests.get(url, params=params, headers=SUPABASE_HEADERS, timeout=15)
        rows = []
        if res.status_code == 200:
            rows = res.json() or []

        # 2차: 결과 없으면 factory_type으로 fallback
        if not rows:
            params2 = {
                "select": "id,name,address,industries,factory_type",
                "limit": str(count * 5),
                "factory_type": f"ilike.*{search_kw}*",
            }
            if region:
                params2["address"] = f"ilike.*{region}*"
            res2 = requests.get(url, params=params2, headers=SUPABASE_HEADERS, timeout=15)
            if res2.status_code == 200:
                rows = res2.json() or []

        # 3차: 지역 없이 업종만
        if not rows and region:
            params3 = {
                "select": "id,name,address,industries,factory_type",
                "limit": str(count * 5),
                "industries": f"ilike.*{search_kw}*",
            }
            res3 = requests.get(url, params=params3, headers=SUPABASE_HEADERS, timeout=15)
            if res3.status_code == 200:
                rows = res3.json() or []

        if rows:
            random.shuffle(rows)
            return rows[:count]
        print(f"  ⚠️ 공장 조회 결과 없음: {industry_key} / {region}")
    except Exception as e:
        print(f"  ⚠️ 공장 조회 실패: {e}")
    return []

# ─────────────────────────────────────────────
# Claude API — SEO 최적화 본문 생성
# ─────────────────────────────────────────────
def generate_post_content(post_meta):
    """Claude API로 글 본문 생성 — SEO 키워드 최적화 + 검증된 톤"""
    if not claude:
        raise RuntimeError("ANTHROPIC_API_KEY 환경변수 필요")

    post_type = post_meta["type"]
    title     = post_meta["title"]
    target_kw = post_meta.get("kw", title)          # 타겟 SEO 키워드

    # 추천 글 공장 정보
    factories_info = ""
    if post_type == "recommend" and post_meta.get("factories"):
        factories_info = "\n\n[참고: 추천 업체 정보]\n"
        for i, f in enumerate(post_meta["factories"], 1):
            factories_info += f"{i}. {f.get('name','')} - {f.get('address','')} - {f.get('factory_type','')}\n"

    system_prompt = f"""당신은 공장매칭 매거진 편집팀입니다. 한국 제조업 B2B 바이어를 대상으로 글을 씁니다.

**SEO 키워드 배치 규칙 (필수, 순서대로 지켜주세요):**

타겟 키워드: "{target_kw}"

1. 제목(H1) — 타겟 키워드를 제목 앞부분에 1회 포함 (이미 제공된 제목 사용)
2. 첫 문단(100자 이내) — 타겟 키워드를 자연스럽게 2~3회 등장시키세요
   예) "사출 성형 발주를 처음 준비하신다면, 사출 성형 공장 선정 전에 이 글을 꼭 읽어보세요. 사출 성형 견적부터 납기까지..."
3. 소제목(H2/H3) — 타겟 키워드 또는 변형어(유의어, 연관어)를 각 H2에 포함
   나쁜 예) ## 1. 도면 준비: 2D와 3D 어디까지 필요한가
   좋은 예) ## CNC 가공 견적 전 도면 준비 방법: 2D vs 3D
4. 본문 — 1,000~1,500자당 키워드 2~3회 자연스럽게 배치 (단순 반복 금지)
5. 마지막 문단 — 타겟 키워드 1회 + "공장매칭에서 [키워드] 공장을 바로 검색해보세요" 형태 CTA
6. 분량 — 2,000자 이상 (HTML 변환 전 마크다운 기준)

**톤 가이드라인 (필수 준수):**
- 인사말("안녕하세요" 등) 없이 바로 본론 시작
- 친근하되 가볍지 않은 톤 ("~합니다", "~이에요" 적절히 혼용)
- 정확한 수치/용어 사용 (예: ±0.005mm, MOQ 500개, A6061 등급 등)
- 실용적이고 구체적인 정보 (애매한 표현 금지)
- 마크다운 형식 (## 섹션, **굵게**, - 리스트 등)
- 광고성 문구 금지, 정보성 가치 중심
- "공장매칭" 언급은 마지막 CTA 포함 최대 2회
"""

    if post_type == "recommend":
        ind_obj = next((i for i in INDUSTRIES if i["key"] == post_meta.get("industry")), {})
        seo_kws = ", ".join(ind_obj.get("seo_keywords", [])[:3])
        user_prompt = f"""다음 제목으로 글을 작성해주세요: "{title}"

이 글은 {post_meta.get('count', 3)}개 업체를 추천하는 글입니다.
연관 SEO 키워드(자연스럽게 녹여주세요): {seo_kws}

**구조:**
1. 인트로 (3-4문장, 타겟 키워드 포함, 누구를 위한 글인지 명확히)
2. ## {post_meta.get('region','')} {ind_obj.get('name','')} 시장 현황 — 클러스터 특징, 강점, 수치 (키워드 포함 H2)
3. ## {ind_obj.get('name','')} 업체 선정 시 핵심 체크포인트 5가지 (각 80-150자, 구체적)
4. ## 추천 업체 {post_meta.get('count', 3)}선 — 아래 "[FACTORIES_PLACEHOLDER]" 표시만 두세요 (실제 카드는 시스템이 자동 삽입)
5. ## 자주 묻는 질문 (FAQ) — Q/A 형식 4-5개 (검색 쿼리 형태의 Q 작성)
6. ## 정리 — 핵심 5가지 요약 (타겟 키워드 1회 포함)

{factories_info}
"""
    elif post_type == "guide":
        user_prompt = f"""다음 제목으로 정보성 가이드 글을 작성해주세요: "{title}"

**구조:**
1. 인트로 (3-4문장, 타겟 키워드 포함, 누구를 위한 글인지)
2. ## [핵심 정보 1] — 250-400자, 구체적 수치 포함 (연관 키워드 H2에 포함)
3. ## [핵심 정보 2] — 250-400자
4. ## [핵심 정보 3] — 250-400자
5. ## [핵심 정보 4] — 250-400자
6. ## [핵심 정보 5] — 250-400자
7. ## 자주 묻는 질문 (FAQ) — Q/A 형식 4개 (실제 검색 쿼리 스타일로 Q 작성)
8. ## 정리 — 핵심 5가지 요약

업체 추천은 포함하지 마세요. 순수 정보성 가이드입니다.
"""
    elif post_type == "compare":
        user_prompt = f"""다음 제목으로 비교 분석 글을 작성해주세요: "{title}"

**구조:**
1. 인트로 (왜 이 비교가 중요한지, 타겟 키워드 포함)
2. ## [옵션 A] 소개 — 특징, 장점, 단가 (키워드 H2)
3. ## [옵션 B] 소개 — 특징, 장점, 단가
4. ## 항목별 비교 — 비용, 품질, 납기, 적합 상황 (표 또는 리스트)
5. ## 어떤 상황에 어떤 선택이 맞을까 — 시나리오 3-5개
6. ## 자주 묻는 질문 (FAQ) — Q/A 형식 4개 (실제 검색 쿼리 스타일)
7. ## 정리 + 결론

객관적이고 균형 잡힌 시각으로 작성하세요.
"""
    elif post_type == "trend":
        user_prompt = f"""다음 제목으로 트렌드 분석 글을 작성해주세요: "{title}"

**구조:**
1. 인트로 (왜 지금 이 트렌드인지, 타겟 키워드 포함)
2. ## 트렌드 1: [제목] — 배경, 영향, 사례 (키워드 H2)
3. ## 트렌드 2: [제목]
4. ## 트렌드 3: [제목]
5. ## 트렌드 4: [제목]
6. ## 트렌드 5: [제목] (선택)
7. ## 한국 제조사가 준비해야 할 것 — 실용 조언
8. ## 자주 묻는 질문 (FAQ) — Q/A 4개
9. ## 정리

전문가의 인사이트 톤으로 작성하세요.
"""
    elif post_type == "checklist":
        user_prompt = f"""다음 제목으로 체크리스트 형 글을 작성해주세요: "{title}"

**구조:**
1. 인트로 (왜 이 체크리스트가 필요한지, 타겟 키워드 포함)
2. ## ✅ 체크포인트 1: [제목] — 200-300자, 왜 중요한지 + 어떻게 체크하는지 (키워드 포함 H2)
... (5-7개 체크 항목 — 각 ## ✅ 로 시작)
3. ## 자주 묻는 질문 (FAQ) — Q/A 4개 (실제 검색 쿼리 스타일)
4. ## 정리 — 핵심 5가지 요약

실용성에 초점. 각 체크포인트는 구체적인 수치나 기준 포함.
"""
    elif post_type == "case":
        user_prompt = f"""다음 제목으로 케이스 스터디 글을 작성해주세요: "{title}"

**구조:**
1. 인트로 — 주인공(스타트업/브랜드/제조사)과 상황 소개, 타겟 키워드 포함 (100자 이내)
2. ## 배경: 어떤 문제가 있었나 — 구체적인 상황 묘사, 수치 포함
3. ## 해결 과정 ① — 첫 번째 시도, 결과 (키워드 변형어 포함 H2)
4. ## 해결 과정 ② — 두 번째 접근, 전환점
5. ## 핵심 결과 — 수치로 표현 (비용 절감 %, 납기 단축 일수 등)
6. ## 이 경험에서 배운 것 — 독자가 바로 적용할 수 있는 인사이트 3-5가지
7. ## 자주 묻는 질문 (FAQ) — Q/A 형식 4개 (실제 검색 쿼리 스타일)
8. ## 정리

스토리텔링 형식으로 생생하게 작성. 구체적인 수치와 에피소드 포함. 
가상의 사례지만 실제처럼 느껴지도록 디테일하게 작성하세요.
"""
    else:
        user_prompt = f"""다음 제목으로 글을 작성해주세요: "{title}"

전문성 있고 SEO 친화적인 구조로 작성. 타겟 키워드 "{target_kw}" 자연스럽게 포함. 2000-2500자."""

    response = claude.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=4000,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}]
    )
    return response.content[0].text

# ─────────────────────────────────────────────
# HTML 렌더링
# ─────────────────────────────────────────────
def render_factories_html(factories):
    """추천 업체 카드 HTML 생성"""
    if not factories:
        return '<div class="mg-rec-section"><p style="color:#9ca3af;font-size:13px;padding:16px 0">현재 공장매칭에서 관련 제조사를 검색해보세요.</p></div>'
    html = '<div class="mg-rec-section">'
    for i, f in enumerate(factories, 1):
        name = f.get("name", "회사명")
        initial = name[0] if name else "공"
        address_short = " ".join((f.get("address", "") or "").split()[0:2])
        factory_type = f.get("factory_type", "")
        tags = [t.strip() for t in re.split(r'[,/、·]', factory_type) if t.strip()][:3]
        tags_html = "".join([f'<span class="mg-rec-tag">{t}</span>' for t in tags])

        h = int(hashlib.md5(name.encode()).hexdigest()[:6], 16)
        hue = h % 360
        bg = f"hsl({hue}, 60%, 85%)"

        html += f'''
        <a href="/?factory={f.get("id","")}" class="mg-rec-card">
          <div class="mg-rec-num">{i}</div>
          <div class="mg-rec-photo" style="background:{bg};display:flex;align-items:center;justify-content:center;color:hsl({hue},60%,35%);font-weight:700;font-size:24px">{initial}</div>
          <div class="mg-rec-info">
            <div class="mg-rec-name">{name}</div>
            <div class="mg-rec-meta">{address_short}</div>
            <div class="mg-rec-tags">{tags_html}</div>
          </div>
        </a>
        '''
    html += '</div>'
    return html

def markdown_to_html(md, factories_html=""):
    """마크다운 → HTML 변환"""
    html = md

    html = re.sub(r'\[FACTORIES_PLACEHOLDER\]', factories_html, html)

    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)

    lines = html.split('\n')
    out = []
    in_ul = False
    for line in lines:
        if re.match(r'^- (.+)', line):
            if not in_ul:
                out.append('<ul>')
                in_ul = True
            out.append(f'<li>{re.sub(r"^- ", "", line)}</li>')
        else:
            if in_ul:
                out.append('</ul>')
                in_ul = False
            out.append(line)
    if in_ul:
        out.append('</ul>')
    html = '\n'.join(out)

    # FAQ 박스
    html = re.sub(
        r'\*\*Q\. (.+?)\*\*\n(.+?)(?=\n\n|\n\*\*Q\.|\Z)',
        r'<div class="mg-faq-item"><div class="mg-faq-q">Q. \1</div><div class="mg-faq-a">\2</div></div>',
        html, flags=re.DOTALL
    )

    paragraphs = re.split(r'\n\n+', html)
    out = []
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
        if p.startswith('<') and not p.startswith('<strong>'):
            out.append(p)
        else:
            out.append(f'<p>{p}</p>')
    return '\n'.join(out)

def build_faq_schema(body_md):
    """FAQ Schema.org 구조화 데이터 생성 (Q. 패턴 추출)"""
    faqs = re.findall(r'\*\*Q\. (.+?)\*\*\n(.+?)(?=\n\n|\n\*\*Q\.|\Z)', body_md, re.DOTALL)
    if not faqs:
        return ""
    items = []
    for q, a in faqs[:5]:
        a_clean = re.sub(r'\*\*|\*', '', a.strip())[:300]
        items.append(f'''    {{
      "@type": "Question",
      "name": "{q.strip()}",
      "acceptedAnswer": {{"@type": "Answer", "text": "{a_clean}"}}
    }}''')
    schema = f'''<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
{",\n".join(items)}
  ]
}}
</script>'''
    return schema

def render_article_html(post, body_html, body_md, hero_photo):
    """개별 글 HTML 페이지 생성 — SEO 메타태그 강화"""
    cat_label = {
        "recommend": "산업별 추천",
        "guide":     "발주 가이드",
        "trend":     "트렌드",
        "compare":   "비교·선택",
        "case":      "케이스 스터디",
        "checklist": "체크리스트",
    }.get(post["category"], "매거진")

    hero_bg = f"background-image:url('{hero_photo['url']}')" if hero_photo else "background:linear-gradient(135deg,#1d4ed8,#3b82f6)"

    attribution = ""
    if hero_photo and hero_photo.get("author_name"):
        attribution = f'''<div style="font-size:12px;color:#94a3b8;text-align:right;padding:10px 24px;background:#f8fafc;border-bottom:1px solid #e5e7eb">
  Photo by <a href="{hero_photo["author_url"]}" target="_blank" rel="noopener" style="color:#1d4ed8;text-decoration:none">{hero_photo["author_name"]}</a> on <a href="{hero_photo["unsplash_url"]}" target="_blank" rel="noopener" style="color:#1d4ed8;text-decoration:none">Unsplash</a>
</div>'''

    # 해시태그
    hashtags = ["공장매칭", "제조업", "B2B", "공장찾기"]
    if post.get("industry_name"):
        hashtags.append(post["industry_name"].replace(" ", ""))
    if post.get("region"):
        hashtags.append(post["region"] + "공장")
    if post.get("kw"):
        kw_tag = re.sub(r'\s+', '', post["kw"])
        if kw_tag not in hashtags:
            hashtags.append(kw_tag)
    hashtags_html = "".join([f'<span class="mg-tag">#{t}</span>' for t in hashtags])

    # FAQ 구조화 데이터
    faq_schema = build_faq_schema(body_md)

    # 메타 description (SEO 키워드 포함)
    meta_desc = post.get("meta_desc") or post.get("subtitle") or post["title"]

    # 캐노니컬 URL
    canonical = f"https://factorymatch.co.kr/magazine/posts/{post['slug']}/"

    return f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{post["title"]} - 공장매칭 매거진</title>
<meta name="description" content="{meta_desc}">
<meta name="keywords" content="{post.get('kw','')}, 공장매칭, 제조업 B2B, 공장 추천, 제조사 찾기">
<meta name="robots" content="index, follow">
<meta property="og:title" content="{post["title"]}">
<meta property="og:description" content="{meta_desc}">
<meta property="og:type" content="article">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{hero_photo['url'] if hero_photo else ''}">
<meta property="og:site_name" content="공장매칭 매거진">
<meta property="article:published_time" content="{post["published_at"]}">
<meta property="article:section" content="{cat_label}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{post["title"]}">
<meta name="twitter:description" content="{meta_desc}">
<meta name="twitter:image" content="{hero_photo['url'] if hero_photo else ''}">
<link rel="canonical" href="{canonical}">
<link rel="stylesheet" href="/magazine/assets/magazine.css">
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{post['title']}",
  "description": "{meta_desc}",
  "image": "{hero_photo['url'] if hero_photo else ''}",
  "datePublished": "{post['published_at']}",
  "dateModified": "{post['published_at']}",
  "author": {{"@type": "Organization", "name": "공장매칭"}},
  "publisher": {{"@type": "Organization", "name": "공장매칭", "url": "https://factorymatch.co.kr"}},
  "mainEntityOfPage": {{"@type": "WebPage", "@id": "{canonical}"}}
}}
</script>
{faq_schema}
</head>
<body>

<header class="mg-header">
  <div class="mg-header-inner">
    <a href="/" class="mg-logo">
      <img src="/logo.svg" alt="공장매칭" class="mg-logo-img" onerror="this.style.display='none'">
      <img src="/logo-text.png" alt="공장매칭 FactoryMatch" class="mg-logo-text" onerror="this.style.display='none'">
    </a>
    <nav class="mg-nav">
      <a href="/">홈</a>
      <a href="/#ai">AI 상담</a>
      <a href="/#list">제조사 탐색</a>
      <a href="/">견적 요청</a>
      <a href="/#grants">정부지원금</a>
      <a href="/magazine/" class="active">매거진</a>
      <a href="/#community">게시판</a>
    </nav>
    <a href="/" class="mg-cta" id="mg-header-cta">로그인 및 가입하기</a>
  </div>
</header>
<script>
(function() {{
  const SUPA_URL = 'https://yezxwlzyiqgewpkkyget.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs';
  fetch(SUPA_URL + '/auth/v1/user', {{
    headers: {{ 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + (
      (() => {{ try {{
        const k = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
        if (!k) return '';
        const d = JSON.parse(localStorage.getItem(k));
        return d?.access_token || '';
      }} catch(e) {{ return ''; }} }})()
    )}}
  }}).then(r => r.ok ? r.json() : null).then(user => {{
    const cta = document.getElementById('mg-header-cta');
    if (!cta) return;
    if (user && user.id) {{
      cta.textContent = '견적 요청';
      cta.href = '/?utm_source=magazine&utm_medium=header_cta#rfq';
    }}
  }}).catch(() => {{}});
}})();
</script>

<div class="mg-breadcrumb mg-container">
  <a href="/magazine/">매거진</a> › <a href="/magazine/?cat={post['category']}">{cat_label}</a> › {post['title']}
</div>

<article class="mg-article" itemscope itemtype="https://schema.org/Article">
  <div class="mg-article-hero" style="{hero_bg}"></div>
  {attribution}
  <div class="mg-article-header">
    <span class="mg-article-cat">{cat_label}</span>
    <h1 class="mg-article-title" itemprop="headline">{post["title"]}</h1>
    <p class="mg-article-subtitle" itemprop="description">{meta_desc}</p>
    <div class="mg-article-meta">
      <span>📅 {post["published_at"][:10]}</span>
      <span>⏱ 5분 읽기</span>
    </div>
  </div>

  <div class="mg-article-body" itemprop="articleBody">
    {body_html}
  </div>

  <div class="mg-tags">
    {hashtags_html}
  </div>

  <div class="mg-cta-box" style="margin:2rem 0;padding:2rem;background:#eff6ff;border-radius:12px;text-align:center;border:1px solid #bfdbfe">
    <p style="font-size:16px;font-weight:700;color:#1e40af;margin:0 0 8px">{post.get("industry_name") or "제조"} 공장, 지금 바로 견적 요청해보세요</p>
    <p style="font-size:13px;color:#3b82f6;margin:0 0 16px">공장매칭에 등록된 217,054개 제조사 중 딱 맞는 곳을 찾아드립니다</p>
    <a href="/?utm_source=magazine&utm_medium=cta&utm_campaign={post['slug']}" style="display:inline-block;background:#1d4ed8;color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none">무료 견적 요청하기 →</a>
  </div>
</article>

<footer class="mg-footer">
  <div>
    <a href="/">홈</a>
    <a href="/#list">제조사 탐색</a>
    <a href="/magazine/">매거진</a>
    <a href="/privacy/">개인정보처리방침</a>
    <a href="/terms/">이용약관</a>
  </div>
  <div class="mg-credit">© 2026 올뷰코리아 (ALL VIEW KOREA) · 대표 이정호 · admin@factorymatch.co.kr</div>
  <div class="mg-credit" style="margin-top:4px">공장매칭(FactoryMatch) · 국내 217,054개 제조사 데이터 기반 · https://factorymatch.co.kr</div>
</footer>

</body>
</html>
'''

def update_sitemap(posts):
    """sitemap.xml 업데이트 — lastmod + priority 포함"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    entries = [
        {"url": "https://factorymatch.co.kr/",           "priority": "1.0", "changefreq": "daily"},
        {"url": "https://factorymatch.co.kr/magazine/",  "priority": "0.9", "changefreq": "daily"},
    ]
    for p in posts:
        entries.append({
            "url":        f"https://factorymatch.co.kr/magazine/posts/{p['slug']}/",
            "priority":   "0.7",
            "changefreq": "weekly",
            "lastmod":    p.get("published_at", today)[:10],
        })

    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for e in entries:
        sitemap += f'  <url>\n'
        sitemap += f'    <loc>{e["url"]}</loc>\n'
        if "lastmod" in e:
            sitemap += f'    <lastmod>{e["lastmod"]}</lastmod>\n'
        sitemap += f'    <changefreq>{e["changefreq"]}</changefreq>\n'
        sitemap += f'    <priority>{e["priority"]}</priority>\n'
        sitemap += f'  </url>\n'
    sitemap += '</urlset>\n'

    SITEMAP_FILE.write_text(sitemap, encoding='utf-8')

# ─────────────────────────────────────────────
# 글 생성 메인 함수
# ─────────────────────────────────────────────
def generate_post(post_meta):
    """글 1개 생성 → HTML 파일 + posts.json 업데이트"""
    print(f"\n📝 생성: {post_meta['title']}")

    print("  📷 Unsplash 사진 조회...")
    photo = fetch_unsplash_photo(post_meta.get("kw_unsplash", "factory"))

    factories = []
    if post_meta["type"] == "recommend":
        print("  🏭 공장 큐레이션...")
        factories = fetch_factories(post_meta["industry"], post_meta.get("region", ""), post_meta["count"])
        post_meta["factories"] = factories

    print("  🤖 Claude API 본문 생성 (SEO 최적화)...")
    md_content = generate_post_content(post_meta)

    factories_html = render_factories_html(factories)
    body_html = markdown_to_html(md_content, factories_html)

    slug     = slugify(post_meta["title"])
    now      = datetime.now(timezone.utc).isoformat()
    count_label = f"{post_meta['count']}선" if post_meta["type"] == "recommend" else None

    post = {
        "slug":          slug,
        "title":         post_meta["title"],
        "subtitle":      post_meta.get("meta_desc") or post_meta.get("subtitle") or post_meta["title"],
        "meta_desc":     post_meta.get("meta_desc") or post_meta.get("subtitle") or post_meta["title"],
        "kw":            post_meta.get("kw", ""),
        "category":      post_meta["type"],
        "industry_key":  post_meta.get("industry"),
        "industry_name": next((i["name"] for i in INDUSTRIES if i["key"] == post_meta.get("industry")), ""),
        "region":        post_meta.get("region", ""),
        "count_label":   count_label,
        "thumbnail_url": photo["thumb_url"] if photo else "",
        "thumbnail":     photo["thumb_url"] if photo else "",
        "hero_image_url":photo["url"] if photo else "",
        "published_at":  now,
        "views":         0,
    }

    article_html = render_article_html(post, body_html, md_content, photo)
    post_dir = POSTS_DIR / slug
    post_dir.mkdir(parents=True, exist_ok=True)
    (post_dir / "index.html").write_text(article_html, encoding='utf-8')

    data = json.loads(DATA_FILE.read_text(encoding='utf-8'))
    data["posts"] = [p for p in data["posts"] if p["slug"] != slug]
    data["posts"].append(post)
    data["updated_at"] = now
    DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

    update_sitemap(data["posts"])

    print(f"  ✅ 완료: /magazine/posts/{slug}/")
    return post

# ─────────────────────────────────────────────
# 글 계획 함수
# ─────────────────────────────────────────────
def plan_initial_posts():
    """첫 발행 글 10개 계획 (정보성 글만: 가이드·비교·트렌드·체크리스트)"""
    plan = []
    by_type = {}
    for t in SEO_KEYWORD_TOPICS:
        if t["type"] != "recommend":
            by_type.setdefault(t["type"], []).append(t)

    for tp, n in [("guide", 4), ("compare", 3), ("checklist", 2), ("trend", 2)]:
        for topic in by_type.get(tp, [])[:n]:
            plan.append({
                "type":        tp,
                "count":       0,
                "title":       topic["title"],
                "meta_desc":   topic.get("meta_desc", topic["title"]),
                "kw":          topic["kw"],
                "industry":    topic.get("industry"),
                "kw_unsplash": topic.get("kw_unsplash", "factory manufacturing"),
            })
    return plan

def plan_daily_posts(n=3):
    """매일 n개 글 계획 — 정보성 SEO 토픽만 (가이드·비교·트렌드·체크리스트·케이스)"""
    try:
        data = json.loads(DATA_FILE.read_text(encoding='utf-8'))
        existing_slugs = {p["slug"] for p in data.get("posts", [])}
    except Exception:
        existing_slugs = set()

    candidates = []

    # SEO 키워드 토픽 — recommend 제외
    for topic in SEO_KEYWORD_TOPICS:
        if topic["type"] == "recommend":
            continue
        candidates.append({
            "type":        topic["type"],
            "count":       0,
            "title":       topic["title"],
            "meta_desc":   topic.get("meta_desc", topic["title"]),
            "kw":          topic["kw"],
            "industry":    topic.get("industry"),
            "kw_unsplash": topic.get("kw_unsplash", "factory manufacturing"),
        })

    # 발행된 slug 제외
    fresh = [c for c in candidates if slugify(c["title"]) not in existing_slugs]

    if not fresh:
        print("⚠️ 모든 후보가 이미 발행됨. 토픽 풀 확장 필요.")
        return []

    chosen = random.sample(fresh, min(n, len(fresh)))
    for c in chosen:
        print(f"📌 오늘의 글: {c['title']} [{c['type']}] | 키워드: {c.get('kw','')}")
    return chosen

# ─────────────────────────────────────────────
# 메인
# ─────────────────────────────────────────────
def main():
    print("=" * 60)
    print("🚀 공장매칭 매거진 자동 생성 시작 (SEO 키워드 최적화 버전)")
    print("=" * 60)

    if not ANTHROPIC_API_KEY:
        print("❌ ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.")
        return
    if not UNSPLASH_ACCESS_KEY:
        print("⚠️ UNSPLASH_ACCESS_KEY 미설정 - 사진 없이 진행합니다.")

    mode = "initial"
    if len(sys.argv) > 1 and sys.argv[1] in ("--daily", "-d"):
        mode = "daily"
    elif os.environ.get("MAGAZINE_MODE") == "daily":
        mode = "daily"

    if mode == "daily":
        print("\n🌅 매일 자동 생성 모드 (3편/일)\n")
        posts_meta = plan_daily_posts(n=3)
        success = 0
        for pm in posts_meta:
            try:
                generate_post(pm)
                success += 1
                time.sleep(3)
            except Exception as e:
                print(f"  ❌ 실패: {e}")
        print(f"\n✅ 오늘 발행 완료: {success}/{len(posts_meta)}편")
        if success == 0:
            sys.exit(1)
    else:
        plan = plan_initial_posts()
        print(f"\n📋 초기 생성 계획: {len(plan)}개 글\n")
        for i, pm in enumerate(plan, 1):
            print(f"\n[{i}/{len(plan)}]")
            try:
                generate_post(pm)
                time.sleep(2)
            except Exception as e:
                print(f"  ❌ 실패: {e}")
                continue
        print("\n" + "=" * 60)
        print(f"✅ 초기 발행 완료! {DATA_FILE.parent} 확인")
        print("=" * 60)

if __name__ == "__main__":
    main()
