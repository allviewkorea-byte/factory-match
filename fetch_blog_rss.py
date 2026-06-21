# -*- coding: utf-8 -*-
"""
네이버 블로그 RSS → 공장매칭 블로그 허브 생성기

목적: 네이버 블로그 글을 구글에 노출시키기 위한 백링크 허브.
  - RSS에서 '제목 + 개별 글 링크 + 날짜'만 추출 (본문은 의도적으로 버림 → 네이버 유사문서 위험 차단)
  - 개별 글 링크를 정적 <a> 태그로 HTML에 직접 박아 구글봇 크롤링을 유도
  - 네이버 글 URL은 모바일(m.blog.naver.com)로 변환 (구글 모바일 우선 색인에 유리)
  - sitemap.xml 에는 허브 페이지(/blog/)만 등록 (개별 네이버 URL은 우리 도메인이 아니므로 미등록)

생성/갱신 파일:
  - blog/index.html       (정적 허브 페이지)
  - blog/data/posts.json  (백업/참고용 데이터)
  - sitemap.xml           (/blog/ 항목 1줄 추가, 없을 때만)
"""

import os
import re
import json
import html
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

import requests

BLOG_ID = "dlwjdgh1889"
RSS_URL = f"https://rss.blog.naver.com/{BLOG_ID}.xml"
SITE = "https://factorymatch.co.kr"
HUB_PATH = "/blog/"

ROOT = os.path.dirname(os.path.abspath(__file__))
BLOG_DIR = os.path.join(ROOT, "blog")
DATA_DIR = os.path.join(BLOG_DIR, "data")
INDEX_HTML = os.path.join(BLOG_DIR, "index.html")
POSTS_JSON = os.path.join(DATA_DIR, "posts.json")
SITEMAP = os.path.join(ROOT, "sitemap.xml")


def fetch_rss():
    """RSS를 읽어 글 목록을 반환. 실패 시 빈 리스트."""
    headers = {"User-Agent": "Mozilla/5.0 (compatible; FactoryMatchBlogHub/1.0)"}
    res = requests.get(RSS_URL, headers=headers, timeout=20)
    res.raise_for_status()
    # 네이버 RSS는 보통 UTF-8
    res.encoding = res.apparent_encoding or "utf-8"
    root = ET.fromstring(res.text)

    posts = []
    for item in root.iter("item"):
        title_el = item.find("title")
        link_el = item.find("link")
        date_el = item.find("pubDate")
        if title_el is None or link_el is None:
            continue

        title = (title_el.text or "").strip()
        link = (link_el.text or "").strip()
        if not title or not link:
            continue

        # 추적 쿼리스트링 제거 (?fromRss=true&trackingCode=rss 등)
        link = link.split("?")[0]
        # PC URL → 모바일 URL (구글 모바일 우선 색인에 유리)
        mobile_link = link.replace("https://blog.naver.com/", "https://m.blog.naver.com/")
        mobile_link = mobile_link.replace("http://blog.naver.com/", "https://m.blog.naver.com/")

        # 날짜 파싱 (RFC822 → ISO)
        published_at = ""
        date_label = ""
        if date_el is not None and date_el.text:
            try:
                dt = parsedate_to_datetime(date_el.text.strip())
                published_at = dt.astimezone(timezone.utc).isoformat()
                date_label = f"{dt.year}.{dt.month:02d}.{dt.day:02d}"
            except Exception:
                pass

        posts.append({
            "title": title,
            "url": mobile_link,
            "published_at": published_at,
            "date_label": date_label,
        })

    # 최신순 정렬
    posts.sort(key=lambda p: p["published_at"], reverse=True)
    return posts


def render_html(posts):
    """정적 허브 페이지 HTML 생성. 네이버 글 링크가 <a>로 직접 박힘."""
    updated = datetime.now(timezone.utc).strftime("%Y.%m.%d")

    if posts:
        cards = "\n".join(
            f'''      <a href="{html.escape(p["url"])}" class="bh-card" rel="noopener" target="_blank">
        <span class="bh-card-date">{html.escape(p["date_label"] or "")}</span>
        <h3 class="bh-card-title">{html.escape(p["title"])}</h3>
        <span class="bh-card-more">네이버 블로그에서 보기 →</span>
      </a>'''
            for p in posts
        )
    else:
        cards = '      <div class="bh-empty">글을 불러오는 중입니다. 곧 업데이트됩니다.</div>'

    return f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>블로그 - 공장매칭</title>
<meta name="description" content="공장매칭이 전하는 제조·발주 인사이트와 현장 이야기. 네이버 블로그 글 모음.">
<meta property="og:title" content="공장매칭 블로그">
<meta property="og:description" content="제조·발주 인사이트와 현장 이야기">
<meta property="og:type" content="website">
<meta property="og:url" content="{SITE}{HUB_PATH}">
<link rel="canonical" href="{SITE}{HUB_PATH}">
<link rel="stylesheet" href="/magazine/assets/magazine.css">
<style>
  .bh-wrap {{ max-width: 920px; margin: 0 auto; padding: 0 20px 80px; }}
  .bh-list {{ display: flex; flex-direction: column; gap: 14px; margin-top: 8px; }}
  .bh-card {{
    display: block; padding: 20px 22px; border: 1px solid #e7e9ee; border-radius: 14px;
    text-decoration: none; color: inherit; background: #fff; transition: all .15s ease;
  }}
  .bh-card:hover {{ border-color: #c7ccd6; box-shadow: 0 4px 18px rgba(20,28,46,.06); transform: translateY(-1px); }}
  .bh-card-date {{ display: block; font-size: 13px; color: #8a90a0; margin-bottom: 6px; }}
  .bh-card-title {{ font-size: 18px; font-weight: 700; line-height: 1.45; margin: 0 0 10px; color: #1a1f2e; }}
  .bh-card-more {{ font-size: 13px; color: #3b6fd4; font-weight: 600; }}
  .bh-empty {{ padding: 60px 0; text-align: center; color: #8a90a0; }}
  .bh-note {{ margin-top: 26px; font-size: 13px; color: #9aa0ad; text-align: center; }}
</style>
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
      <a href="/magazine/">매거진</a>
      <a href="/blog/" class="active">블로그</a>
    </nav>
    <a href="/" class="mg-cta">로그인 및 가입하기</a>
  </div>
</header>

<section class="mg-title-section">
  <h1 class="mg-title">공장매칭 블로그</h1>
  <p class="mg-subtitle">제조·발주 현장의 인사이트와 이야기</p>
</section>

<div class="bh-wrap">
  <div class="bh-list" id="blogList">
{cards}
  </div>
  <p class="bh-note">최신 글 자동 업데이트 · {updated} 기준</p>
</div>

<footer class="mg-footer">
  <div>
    <a href="/">홈</a>
    <a href="/#list">제조사 탐색</a>
    <a href="/magazine/">매거진</a>
    <a href="/blog/">블로그</a>
  </div>
  <div class="mg-credit">© 2026 공장매칭 (FactoryMatch) · 국내 217,054개 제조사 데이터 기반</div>
</footer>

</body>
</html>
'''


def update_sitemap():
    """sitemap.xml 에 /blog/ 항목이 없으면 추가."""
    if not os.path.exists(SITEMAP):
        return
    with open(SITEMAP, "r", encoding="utf-8") as f:
        content = f.read()

    if f"{SITE}{HUB_PATH}" in content:
        return  # 이미 있음

    entry = f'''  <url>
    <loc>{SITE}{HUB_PATH}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
'''
    # </urlset> 직전에 삽입
    content = content.replace("</urlset>", entry + "</urlset>")
    with open(SITEMAP, "w", encoding="utf-8") as f:
        f.write(content)


def main():
    os.makedirs(DATA_DIR, exist_ok=True)

    try:
        posts = fetch_rss()
        print(f"✅ RSS 수집: {len(posts)}개 글")
    except Exception as e:
        print(f"⚠️ RSS 수집 실패: {e}")
        # 실패 시 기존 데이터 유지 (덮어쓰지 않음)
        if os.path.exists(POSTS_JSON):
            print("   기존 데이터를 유지합니다.")
            return
        posts = []

    # 데이터 저장
    with open(POSTS_JSON, "w", encoding="utf-8") as f:
        json.dump({
            "blog_id": BLOG_ID,
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "count": len(posts),
            "posts": posts,
        }, f, ensure_ascii=False, indent=2)

    # HTML 생성
    with open(INDEX_HTML, "w", encoding="utf-8") as f:
        f.write(render_html(posts))

    # sitemap 갱신
    update_sitemap()

    print(f"✅ 허브 생성 완료: {INDEX_HTML}")


if __name__ == "__main__":
    main()
