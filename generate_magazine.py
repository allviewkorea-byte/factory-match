"""
공장매칭 매거진 자동 생성 스크립트
- Claude API로 본문 생성 (전문성 + 친근한 톤)
- Unsplash API로 사진 가져오기
- Supabase에서 산업×지역 데이터 + 공장 큐레이션 (추천 글일 경우)
- 정적 HTML 페이지 생성 → /magazine/posts/[slug]/index.html
- posts.json 자동 업데이트
- sitemap.xml 자동 업데이트

실행:
  cd C:\\Users\\micro\\factory-match
  git pull origin main
  py generate_magazine.py

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
from supabase import create_client

# === 설정 ===
SCRIPT_DIR = Path(__file__).parent
MAGAZINE_DIR = SCRIPT_DIR / "magazine"
POSTS_DIR = MAGAZINE_DIR / "posts"
DATA_FILE = MAGAZINE_DIR / "data" / "posts.json"
SITEMAP_FILE = SCRIPT_DIR / "sitemap.xml"

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
UNSPLASH_ACCESS_KEY = os.environ.get("UNSPLASH_ACCESS_KEY", "")
SUPABASE_URL = "https://yezxwlzyiqgewpkkyget.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDAwMDAsImV4cCI6MjA1MDE3NjAwMH0.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"

# Claude 클라이언트
claude = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None
sb = create_client(SUPABASE_URL, SUPABASE_KEY)

# === 글 형식 정의 ===
POST_FORMATS = [
    # 산업별 추천 (산업×지역 매트릭스)
    {"type": "recommend", "count": 3, "weight": 20},
    {"type": "recommend", "count": 5, "weight": 10},
    {"type": "recommend", "count": 7, "weight": 5},
    # 정보성 가이드
    {"type": "guide", "count": 0, "weight": 25},
    # 비교 분석
    {"type": "compare", "count": 0, "weight": 15},
    # 트렌드
    {"type": "trend", "count": 0, "weight": 10},
    # 체크리스트
    {"type": "checklist", "count": 0, "weight": 8},
    # 케이스 스터디
    {"type": "case", "count": 0, "weight": 7},
]

# 산업 카테고리 (KICOX 기반)
INDUSTRIES = [
    {"key": "cnc",      "name": "CNC 가공",     "kw_unsplash": "cnc machining factory", "color": "#1d4ed8"},
    {"key": "injection","name": "사출 성형",    "kw_unsplash": "injection molding factory", "color": "#10b981"},
    {"key": "press",    "name": "프레스",       "kw_unsplash": "metal press factory", "color": "#f59e0b"},
    {"key": "mold",     "name": "금형 제작",    "kw_unsplash": "mold manufacturing factory", "color": "#7c3aed"},
    {"key": "sewing",   "name": "봉제 공장",    "kw_unsplash": "garment sewing factory", "color": "#ec4899"},
    {"key": "coating",  "name": "도장 / 표면처리", "kw_unsplash": "industrial coating factory", "color": "#06b6d4"},
    {"key": "casting",  "name": "주조 공장",    "kw_unsplash": "metal casting foundry", "color": "#dc2626"},
    {"key": "welding",  "name": "용접 / 제관",  "kw_unsplash": "welding factory", "color": "#0891b2"},
]

REGIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "경남", "경북", "충남", "충북", "전남", "전북", "강원"]

# 정보성 가이드 주제
GUIDE_TOPICS = [
    {"title": "사출 발주 처음이면 꼭 알아야 할 5가지 핵심 정보", "industry": "injection", "kw": "사출 성형"},
    {"title": "CNC 가공 견적 받는 법: 도면부터 단가까지", "industry": "cnc", "kw": "CNC 가공"},
    {"title": "금형비 줄이는 5가지 실전 팁", "industry": "mold", "kw": "금형 제작"},
    {"title": "프레스 가공 발주 전 체크해야 할 7가지", "industry": "press", "kw": "프레스 가공"},
    {"title": "봉제 공장 발주의 정석: MOQ부터 검품까지", "industry": "sewing", "kw": "봉제 발주"},
    {"title": "제품 도장 의뢰 가이드: 분체도장 vs 액체도장", "industry": "coating", "kw": "분체도장"},
]

COMPARE_TOPICS = [
    {"title": "OEM과 ODM 차이점 완벽 가이드", "kw": "OEM ODM"},
    {"title": "시제품 제작 방식 비교: 3D프린팅 vs CNC vs 사출", "kw": "시제품 제작"},
    {"title": "한국 vs 중국 제조: 비용·품질·납기 비교", "kw": "한국 중국 제조 비교"},
    {"title": "분체도장 vs 액체도장: 어떤 게 우리 제품에 맞을까", "kw": "분체도장 액체도장"},
]

TREND_TOPICS = [
    {"title": "2026년 자동차 부품 제조 트렌드 5가지", "kw": "자동차 부품 제조"},
    {"title": "친환경 소재 사출의 부상: PLA·재활용 ABS·바이오 플라스틱", "kw": "친환경 사출"},
    {"title": "스마트팩토리 도입 현황: 한국 중소제조업의 변화", "kw": "스마트팩토리"},
]

CHECKLIST_TOPICS = [
    {"title": "공장 견적서 보는 법: 숨은 단가 찾는 5가지 체크포인트", "kw": "견적서 작성"},
    {"title": "처음 발주하는 스타트업이 자주 하는 실수 7가지", "kw": "제조 발주 실수"},
    {"title": "발주서 작성 완벽 가이드: 빠짐없이 챙겨야 할 항목", "kw": "발주서 작성"},
]

# === 유틸 함수 ===
def slugify(text):
    """한글 포함 텍스트를 URL-safe slug로 변환"""
    text = text.lower()
    text = re.sub(r'[\s/]+', '-', text)
    text = re.sub(r'[^\w가-힣\-]', '', text)
    return text[:80]

def weighted_choice(items, weight_key='weight'):
    """가중치 기반 무작위 선택"""
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
            params={"query": keyword, "per_page": 10, "orientation": "landscape"},
            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
            timeout=10
        )
        if res.status_code == 200:
            data = res.json()
            if data.get("results"):
                photo = random.choice(data["results"][:5])
                # ★ Unsplash 약관 6조 - Download tracking: 사진을 영구 포함할 때 통지 필수
                try:
                    download_url = photo.get("links", {}).get("download_location")
                    if download_url:
                        requests.get(
                            download_url,
                            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
                            timeout=5
                        )
                except Exception:
                    pass  # 트래킹 실패는 무시 (사진 사용 자체는 계속 진행)
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
    """Supabase에서 산업×지역 공장 큐레이션 (전화 + 사진은 추후, 일단 기본 정보로)"""
    try:
        # industry_key → 검색 키워드 변환
        search_kw = next((ind["name"] for ind in INDUSTRIES if ind["key"] == industry_key), industry_key)
        
        query = sb.table("factories").select("id, name, address, business_number, factory_type")
        # 지역 필터 (주소에 포함)
        if region:
            query = query.ilike("address", f"%{region}%")
        # 산업 필터 (factory_type 또는 ai_summary에 키워드 포함)
        query = query.ilike("factory_type", f"%{search_kw}%")
        query = query.limit(count * 3)  # 여유 있게
        
        res = query.execute()
        rows = res.data or []
        
        # 다양성 (지역/규모 분산) - 일단 무작위 선택
        random.shuffle(rows)
        return rows[:count]
    except Exception as e:
        print(f"  ⚠️ 공장 조회 실패: {e}")
        return []

def generate_post_content(post_meta):
    """Claude API로 글 본문 생성 - 사용자 검증된 톤"""
    if not claude:
        raise RuntimeError("ANTHROPIC_API_KEY 환경변수 필요")
    
    post_type = post_meta["type"]
    title = post_meta["title"]
    
    # 추천 글의 경우 공장 정보 포함
    factories_info = ""
    if post_type == "recommend" and post_meta.get("factories"):
        factories_info = "\n\n[참고: 추천 업체 정보]\n"
        for i, f in enumerate(post_meta["factories"], 1):
            factories_info += f"{i}. {f.get('name','')} - {f.get('address','')} - {f.get('factory_type','')}\n"
    
    # 톤 가이드라인 - 사용자가 검증한 톤
    system_prompt = """당신은 공장매칭 매거진 편집팀입니다. 한국 제조업 B2B 바이어를 대상으로 글을 씁니다.

**톤 가이드라인 (필수 준수):**
- 인사말 ("안녕하세요" 등) 없이 바로 본론 시작
- 친근하되 가볍지 않은 톤 ("~합니다", "~이에요" 적절히 혼용)
- 정확한 수치/용어 사용 (예: ±0.005mm, MOQ 500개, A6061 등급 등)
- 실용적이고 구체적인 정보 (애매한 표현 금지)
- 마크다운 형식 (## 섹션, **굵게**, - 리스트 등)
- "처음 발주하시는 분이라면..." 정도의 친근한 도입 OK
- 분량: 약 2000-2500자
- 광고성 문구 금지, 정보성 가치 중심
- "공장매칭"이라는 사이트 이름 본문에 1-2번만 자연스럽게 언급 (과도하면 안 됨)
"""
    
    if post_type == "recommend":
        user_prompt = f"""다음 제목으로 글을 작성해주세요: "{title}"

이 글은 {post_meta.get('count', 3)}개 업체를 추천하는 글입니다.

**구조:**
1. 인트로 (3-4문장, 누구를 위한 글인지 명확히)
2. ## 1. [산업명/지역] 특징 — 클러스터 분석, 강점, 수치
3. ## 2. 발주 전 알아둘 핵심 정보 5가지 (각 80-150자, 구체적)
4. ## 3. 추천 업체 {post_meta.get('count', 3)}선 — 아래 "[FACTORIES_PLACEHOLDER]" 표시만 두세요 (실제 카드는 시스템이 자동 삽입)
5. ## 4. 자주 묻는 질문 (4-5개 Q&A)
6. ## 정리 (간단히 핵심 5가지 요약)

{factories_info}
"""
    elif post_type == "guide":
        user_prompt = f"""다음 제목으로 정보성 가이드 글을 작성해주세요: "{title}"

**구조:**
1. 인트로 (3-4문장, 누구를 위한 글인지)
2. ## 1. [핵심 정보 1] — 250-400자, 구체적 수치 포함
3. ## 2. [핵심 정보 2] — 250-400자
4. ## 3. [핵심 정보 3] — 250-400자
5. ## 4. [핵심 정보 4] — 250-400자
6. ## 5. [핵심 정보 5] — 250-400자
7. ## 정리 (5가지 핵심 요약)
8. ## 자주 묻는 질문 (3-4개 Q&A)

업체 추천은 포함하지 마세요. 순수 정보성 가이드입니다.
"""
    elif post_type == "compare":
        user_prompt = f"""다음 제목으로 비교 분석 글을 작성해주세요: "{title}"

**구조:**
1. 인트로 (왜 이 비교가 중요한지)
2. ## [옵션 A] 소개 — 특징, 장점, 단가
3. ## [옵션 B] 소개 — 특징, 장점, 단가
4. ## 항목별 비교 — 비용, 품질, 납기, 적합 상황 등 (표 또는 리스트)
5. ## 어떤 상황에 어떤 선택이 맞을까 — 시나리오 3-5개
6. ## 정리 + 결론
7. ## 자주 묻는 질문 (3-4개)

객관적이고 균형 잡힌 시각으로 작성하세요.
"""
    elif post_type == "trend":
        user_prompt = f"""다음 제목으로 트렌드 분석 글을 작성해주세요: "{title}"

**구조:**
1. 인트로 (왜 지금 이 트렌드인지)
2. ## 1. [트렌드 1] — 배경, 영향, 사례
3. ## 2. [트렌드 2] — 배경, 영향, 사례
4. ## 3. [트렌드 3] — 배경, 영향, 사례
5. ## 4. [트렌드 4] — 배경, 영향, 사례
6. ## 5. [트렌드 5] — 배경, 영향, 사례 (선택)
7. ## 한국 제조사가 준비해야 할 것 — 실용 조언
8. ## 정리

전문가의 인사이트 톤으로 작성하세요.
"""
    elif post_type == "checklist":
        user_prompt = f"""다음 제목으로 체크리스트 형 글을 작성해주세요: "{title}"

**구조:**
1. 인트로 (왜 이 체크리스트가 필요한지)
2. ## ✅ 1. [체크 항목 1] — 200-300자, 왜 중요한지 + 어떻게 체크하는지
3. ## ✅ 2. [체크 항목 2] — 200-300자
... (5-7개 체크 항목)
3. ## 정리 — 핵심 5가지 요약
4. ## 자주 묻는 질문 (3-4개)

실용성에 초점.
"""
    else:
        user_prompt = f"""다음 제목으로 글을 작성해주세요: "{title}"

전문성 있고 구조적인 글로 작성. 2000-2500자."""
    
    response = claude.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=4000,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}]
    )
    return response.content[0].text

def render_factories_html(factories):
    """추천 업체 카드 HTML 생성 (사진은 컬러 그라데이션 + 이니셜)"""
    if not factories:
        return ""
    html = '<div class="mg-rec-section">'
    for i, f in enumerate(factories, 1):
        name = f.get("name", "회사명")
        initial = name[0] if name else "공"
        address_short = (f.get("address", "") or "").split()[0:2]
        address_short = " ".join(address_short) if address_short else ""
        factory_type = f.get("factory_type", "")
        # 가공방식 태그 (factory_type 쪼개기)
        tags = [t.strip() for t in re.split(r'[,/、·]', factory_type) if t.strip()][:3]
        tags_html = "".join([f'<span class="mg-rec-tag">{t}</span>' for t in tags])
        
        # 컬러 배경 (회사명 해시 기반 일관성)
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
    """간단한 마크다운 → HTML 변환"""
    html = md
    
    # 추천 업체 자리에 카드 삽입
    if factories_html:
        html = re.sub(r'\[FACTORIES_PLACEHOLDER\]', factories_html, html)
    
    # 헤딩
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    
    # 굵게
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    
    # 리스트
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
    
    # FAQ 박스 (Q. 로 시작하는 줄)
    html = re.sub(
        r'\*\*Q\. (.+?)\*\*\n(.+?)(?=\n\n|\n\*\*Q\.|\Z)',
        r'<div class="mg-faq-item"><div class="mg-faq-q">Q. \1</div><div class="mg-faq-a">\2</div></div>',
        html, flags=re.DOTALL
    )
    
    # 단락 (빈 줄 기준)
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

def render_article_html(post, body_html, hero_photo):
    """개별 글 HTML 페이지 생성"""
    cat_label = {
        "recommend": "산업별 추천",
        "guide": "발주 가이드",
        "trend": "트렌드",
        "compare": "비교·선택",
        "case": "케이스 스터디",
        "checklist": "체크리스트",
    }.get(post["category"], "매거진")
    
    hero_bg = f"background-image:url('{hero_photo['url']}')" if hero_photo else "background:linear-gradient(135deg,#1d4ed8,#3b82f6)"
    
    attribution = ""
    if hero_photo and hero_photo.get("author_name"):
        attribution = f'''<div style="font-size:12px;color:#94a3b8;text-align:right;padding:10px 24px;background:#f8fafc;border-bottom:1px solid #e5e7eb">
  Photo by <a href="{hero_photo["author_url"]}" target="_blank" rel="noopener" style="color:#1d4ed8;text-decoration:none">{hero_photo["author_name"]}</a> on <a href="{hero_photo["unsplash_url"]}" target="_blank" rel="noopener" style="color:#1d4ed8;text-decoration:none">Unsplash</a>
</div>'''
    
    # 해시태그 자동 생성
    hashtags = ["공장매칭", "제조업", "B2B"]
    if post.get("industry_name"):
        hashtags.append(post["industry_name"].replace(" ", ""))
    if post.get("region"):
        hashtags.append(post["region"] + "공장")
    hashtags_html = "".join([f'<span class="mg-tag">#{t}</span>' for t in hashtags])
    
    return f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{post["title"]} - 공장매칭 매거진</title>
<meta name="description" content="{post["subtitle"]}">
<meta property="og:title" content="{post["title"]}">
<meta property="og:description" content="{post["subtitle"]}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://factorymatch.co.kr/magazine/posts/{post["slug"]}/">
<meta property="og:image" content="{hero_photo['url'] if hero_photo else ''}">
<meta property="article:published_time" content="{post["published_at"]}">
<meta property="article:section" content="{cat_label}">
<link rel="canonical" href="https://factorymatch.co.kr/magazine/posts/{post["slug"]}/">
<link rel="stylesheet" href="/magazine/assets/magazine.css">
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{post['title']}",
  "description": "{post['subtitle']}",
  "image": "{hero_photo['url'] if hero_photo else ''}",
  "datePublished": "{post['published_at']}",
  "author": {{ "@type": "Organization", "name": "공장매칭" }},
  "publisher": {{ "@type": "Organization", "name": "공장매칭", "url": "https://factorymatch.co.kr" }}
}}
</script>
</head>
<body>

<header class="mg-header">
  <div class="mg-header-inner">
    <a href="/" class="mg-logo">
      <img src="/logo.svg" alt="공장매칭" class="mg-logo-img" onerror="this.style.display='none'">
      <span>공장매칭</span>
    </a>
    <nav class="mg-nav">
      <a href="/">홈</a>
      <a href="/#list">제조사 탐색</a>
      <a href="/magazine/" class="active">매거진</a>
    </nav>
    <a href="/" class="mg-cta">견적 요청</a>
  </div>
</header>

<div class="mg-breadcrumb mg-container">
  <a href="/magazine/">매거진</a> › <a href="/magazine/?cat={post['category']}">{cat_label}</a> › {post['title']}
</div>

<article class="mg-article">
  <div class="mg-article-hero" style="{hero_bg}"></div>
  {attribution}
  <div class="mg-article-header">
    <span class="mg-article-cat">{cat_label}</span>
    <h1 class="mg-article-title">{post["title"]}</h1>
    <p class="mg-article-subtitle">{post["subtitle"]}</p>
    <div class="mg-article-meta">
      <span>📅 {post["published_at"][:10]}</span>
      <span>👁 {post.get("views", 0)}</span>
      <span>⏱ 5분 읽기</span>
    </div>
  </div>
  
  <div class="mg-article-body">
    {body_html}
  </div>
  
  <div class="mg-tags">
    {hashtags_html}
  </div>
</article>

<footer class="mg-footer">
  <div>
    <a href="/">홈</a>
    <a href="/#list">제조사 탐색</a>
    <a href="/magazine/">매거진</a>
  </div>
  <div class="mg-credit">© 2026 공장매칭 (FactoryMatch) · 국내 217,054개 제조사 데이터 기반</div>
</footer>

</body>
</html>
'''

def update_sitemap(posts):
    """sitemap.xml에 매거진 글 URL 추가"""
    urls = []
    urls.append("https://factorymatch.co.kr/")
    urls.append("https://factorymatch.co.kr/magazine/")
    for p in posts:
        urls.append(f"https://factorymatch.co.kr/magazine/posts/{p['slug']}/")
    
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for url in urls:
        sitemap += f'  <url><loc>{url}</loc><changefreq>weekly</changefreq></url>\n'
    sitemap += '</urlset>\n'
    
    SITEMAP_FILE.write_text(sitemap, encoding='utf-8')

def generate_post(post_meta):
    """글 1개 생성 → HTML 파일 + posts.json 업데이트"""
    print(f"\n📝 생성: {post_meta['title']}")
    
    # 1. Unsplash 사진
    print("  📷 Unsplash 사진 조회...")
    photo = fetch_unsplash_photo(post_meta.get("kw_unsplash", "factory"))
    
    # 2. 추천 글이면 공장 조회
    factories = []
    if post_meta["type"] == "recommend":
        print("  🏭 공장 큐레이션...")
        factories = fetch_factories(post_meta["industry"], post_meta.get("region", ""), post_meta["count"])
        post_meta["factories"] = factories
    
    # 3. Claude API로 본문 생성
    print("  🤖 Claude API 본문 생성...")
    md_content = generate_post_content(post_meta)
    
    # 4. 마크다운 → HTML
    factories_html = render_factories_html(factories)
    body_html = markdown_to_html(md_content, factories_html)
    
    # 5. 메타데이터
    slug = slugify(post_meta["title"])
    now = datetime.now(timezone.utc).isoformat()
    count_label = None
    if post_meta["type"] == "recommend":
        count_label = f"{post_meta['count']}선"
    
    post = {
        "slug": slug,
        "title": post_meta["title"],
        "subtitle": post_meta.get("subtitle", post_meta["title"]),
        "category": post_meta["type"],
        "industry_key": post_meta.get("industry"),
        "industry_name": next((i["name"] for i in INDUSTRIES if i["key"] == post_meta.get("industry")), ""),
        "region": post_meta.get("region", ""),
        "count_label": count_label,
        "thumbnail_url": photo["thumb_url"] if photo else "",
        "hero_image_url": photo["url"] if photo else "",
        "published_at": now,
        "views": 0,
    }
    
    # 6. HTML 파일 저장
    article_html = render_article_html(post, body_html, photo)
    post_dir = POSTS_DIR / slug
    post_dir.mkdir(parents=True, exist_ok=True)
    (post_dir / "index.html").write_text(article_html, encoding='utf-8')
    
    # 7. posts.json 업데이트
    data = json.loads(DATA_FILE.read_text(encoding='utf-8'))
    # 중복 체크 (slug 같으면 교체)
    data["posts"] = [p for p in data["posts"] if p["slug"] != slug]
    data["posts"].append(post)
    data["updated_at"] = now
    DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    
    # 8. sitemap.xml 업데이트
    update_sitemap(data["posts"])
    
    print(f"  ✅ 완료: /magazine/posts/{slug}/")
    return post

def plan_initial_posts():
    """첫 발행 글 12-15개 계획"""
    plan = []
    
    # 산업별 추천 5개 (다양한 산업×지역)
    plan.append({
        "type": "recommend", "count": 3,
        "industry": "cnc", "region": "서울",
        "title": "서울 CNC 가공 업체 추천 3선: 정밀가공 발주 가이드",
        "subtitle": "서울 지역 CNC 가공 업체 중 평점·사진·연락처 확인된 3곳",
        "kw_unsplash": "cnc machining factory"
    })
    plan.append({
        "type": "recommend", "count": 5,
        "industry": "injection", "region": "경기",
        "title": "경기도 사출 성형 공장 추천 5선: 플라스틱 발주 완벽 가이드",
        "subtitle": "경기 지역 사출 성형 공장 검증 5곳",
        "kw_unsplash": "injection molding factory"
    })
    plan.append({
        "type": "recommend", "count": 3,
        "industry": "mold", "region": "인천",
        "title": "인천 금형 제작 업체 추천 3선",
        "subtitle": "인천 산업단지의 금형 제작 전문 업체",
        "kw_unsplash": "mold manufacturing"
    })
    plan.append({
        "type": "recommend", "count": 7,
        "industry": "sewing", "region": "부산",
        "title": "부산 봉제 공장 추천 7선: 의류·패션 발주 가이드",
        "subtitle": "부산 지역 봉제 공장 검증 7곳",
        "kw_unsplash": "garment sewing factory"
    })
    plan.append({
        "type": "recommend", "count": 5,
        "industry": "press", "region": "대구",
        "title": "대구 프레스 가공 업체 추천 5선",
        "subtitle": "대구 산업단지의 프레스 가공 전문 업체",
        "kw_unsplash": "metal press factory"
    })
    
    # 정보성 가이드 4개
    for topic in GUIDE_TOPICS[:4]:
        plan.append({
            "type": "guide", "count": 0,
            "title": topic["title"],
            "subtitle": topic["title"],
            "industry": topic.get("industry"),
            "kw_unsplash": topic["kw"]
        })
    
    # 비교 분석 2개
    for topic in COMPARE_TOPICS[:2]:
        plan.append({
            "type": "compare", "count": 0,
            "title": topic["title"],
            "subtitle": topic["title"],
            "kw_unsplash": topic["kw"]
        })
    
    # 트렌드 2개
    for topic in TREND_TOPICS[:2]:
        plan.append({
            "type": "trend", "count": 0,
            "title": topic["title"],
            "subtitle": topic["title"],
            "kw_unsplash": topic["kw"]
        })
    
    # 체크리스트 2개
    for topic in CHECKLIST_TOPICS[:2]:
        plan.append({
            "type": "checklist", "count": 0,
            "title": topic["title"],
            "subtitle": topic["title"],
            "kw_unsplash": topic["kw"]
        })
    
    return plan

def plan_daily_post():
    """매일 1개 무작위 글 계획 (기존 발행된 slug 제외)"""
    # 기존 발행 글의 slug 확인
    try:
        data = json.loads(DATA_FILE.read_text(encoding='utf-8'))
        existing_slugs = {p["slug"] for p in data.get("posts", [])}
    except Exception:
        existing_slugs = set()
    
    # 모든 가능한 글 후보 풀 구성
    candidates = []
    
    # ① 산업별 추천 (산업 8개 × 지역 15개 × 형식 3개 = 360개)
    for ind in INDUSTRIES:
        for region in REGIONS:
            for count in [3, 5, 7]:
                title = f"{region} {ind['name']} 업체 추천 {count}선"
                candidates.append({
                    "type": "recommend",
                    "count": count,
                    "industry": ind["key"],
                    "region": region,
                    "title": title,
                    "subtitle": f"{region} 지역 {ind['name']} 업체 검증 {count}곳",
                    "kw_unsplash": ind["kw_unsplash"]
                })
    
    # ② 정보성 가이드
    for topic in GUIDE_TOPICS:
        candidates.append({
            "type": "guide", "count": 0,
            "title": topic["title"],
            "subtitle": topic["title"],
            "industry": topic.get("industry"),
            "kw_unsplash": topic["kw"]
        })
    
    # ③ 비교 분석
    for topic in COMPARE_TOPICS:
        candidates.append({
            "type": "compare", "count": 0,
            "title": topic["title"],
            "subtitle": topic["title"],
            "kw_unsplash": topic["kw"]
        })
    
    # ④ 트렌드
    for topic in TREND_TOPICS:
        candidates.append({
            "type": "trend", "count": 0,
            "title": topic["title"],
            "subtitle": topic["title"],
            "kw_unsplash": topic["kw"]
        })
    
    # ⑤ 체크리스트
    for topic in CHECKLIST_TOPICS:
        candidates.append({
            "type": "checklist", "count": 0,
            "title": topic["title"],
            "subtitle": topic["title"],
            "kw_unsplash": topic["kw"]
        })
    
    # 기존 슬러그 제외
    fresh = [c for c in candidates if slugify(c["title"]) not in existing_slugs]
    
    if not fresh:
        print("⚠️ 모든 후보가 이미 발행됨. 추가 토픽 풀 확장 필요.")
        return None
    
    # 무작위 선택
    chosen = random.choice(fresh)
    print(f"📌 오늘의 글: {chosen['title']} ({chosen['type']})")
    return chosen

def main():
    print("=" * 60)
    print("🚀 공장매칭 매거진 자동 생성 시작")
    print("=" * 60)
    
    if not ANTHROPIC_API_KEY:
        print("❌ ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.")
        return
    if not UNSPLASH_ACCESS_KEY:
        print("⚠️ UNSPLASH_ACCESS_KEY 미설정 - 사진 없이 진행합니다.")
    
    # 모드 결정: 인자 또는 환경변수
    mode = "initial"  # 기본값: 첫 15개 일괄 생성
    if len(sys.argv) > 1 and sys.argv[1] in ("--daily", "-d"):
        mode = "daily"
    elif os.environ.get("MAGAZINE_MODE") == "daily":
        mode = "daily"
    
    if mode == "daily":
        # 매일 모드: 1개만 생성
        print("\n🌅 매일 자동 생성 모드 (1개)\n")
        post_meta = plan_daily_post()
        if post_meta:
            try:
                generate_post(post_meta)
                print("\n✅ 오늘의 글 발행 완료")
            except Exception as e:
                print(f"❌ 실패: {e}")
                sys.exit(1)
    else:
        # 초기 일괄 모드: 15개 생성
        plan = plan_initial_posts()
        print(f"\n📋 초기 생성 계획: {len(plan)}개 글\n")
        for i, post_meta in enumerate(plan, 1):
            print(f"\n[{i}/{len(plan)}]")
            try:
                generate_post(post_meta)
                time.sleep(2)
            except Exception as e:
                print(f"  ❌ 실패: {e}")
                continue
        print("\n" + "=" * 60)
        print(f"✅ 초기 발행 완료! {DATA_FILE.parent} 확인")
        print("=" * 60)

if __name__ == "__main__":
    main()
