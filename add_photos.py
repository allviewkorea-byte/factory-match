"""
매거진 글에 Unsplash 사진을 추가하는 스크립트 (글은 그대로 유지, 사진만 추가)
- posts.json의 thumbnail_url + hero_image_url 채움
- 각 글의 index.html에 히어로 이미지 + 작가 attribution 삽입

실행:
  cd C:\\Users\\micro\\factory-match
  git pull origin main
  py add_photos.py
"""

import os
import sys
import json
import re
import random
import time
from pathlib import Path

import requests

# === 설정 ===
SCRIPT_DIR = Path(__file__).parent
MAGAZINE_DIR = SCRIPT_DIR / "magazine"
POSTS_DIR = MAGAZINE_DIR / "posts"
DATA_FILE = MAGAZINE_DIR / "data" / "posts.json"

# Unsplash 키 (환경변수 또는 fallback)
UNSPLASH_ACCESS_KEY = os.environ.get("UNSPLASH_ACCESS_KEY") or "Ez21T7kxW7Dqe5uS_dFfQ6rywt4lr5H6fwpYLgaefH0"

# 산업별 키워드 매핑
INDUSTRY_KEYWORDS = {
    "cnc":       "cnc machining factory",
    "injection": "injection molding factory",
    "press":     "metal press factory",
    "mold":      "mold manufacturing factory",
    "sewing":    "garment sewing factory",
    "coating":   "industrial coating factory",
    "casting":   "metal casting foundry",
    "welding":   "welding factory",
}

# 카테고리별 fallback 키워드
CATEGORY_KEYWORDS = {
    "guide":     "manufacturing factory production",
    "compare":   "industrial manufacturing comparison",
    "trend":     "smart factory automation",
    "checklist": "factory quality inspection",
    "case":      "manufacturing case study",
}


def fetch_unsplash_photo(keyword, used_urls=None, page=1):
    """Unsplash에서 사진 1장 가져오기 (중복 회피 + 페이지 무작위)"""
    if not UNSPLASH_ACCESS_KEY:
        return None
    used_urls = used_urls or set()
    try:
        res = requests.get(
            "https://api.unsplash.com/search/photos",
            params={"query": keyword, "per_page": 30, "page": page, "orientation": "landscape"},
            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
            timeout=10
        )
        if res.status_code == 200:
            data = res.json()
            results = data.get("results", [])
            if results:
                available = [p for p in results if p["urls"]["regular"] not in used_urls]
                pool = available if available else results
                photo = random.choice(pool[:15])
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
                }
        else:
            print(f"  ⚠️ HTTP {res.status_code}: {res.text[:100]}")
    except Exception as e:
        print(f"  ⚠️ Unsplash 실패: {e}")
    return None


def update_html_hero(post_slug, photo):
    """개별 글 HTML 파일에 히어로 이미지 + attribution 삽입/교체 (로컬 저장)"""
    html_path = POSTS_DIR / post_slug / "index.html"
    if not html_path.exists():
        return False

    # 이미지 로컬 저장 (hotlink 방지)
    local_url = photo["url"]
    try:
        img_res = requests.get(photo["url"], timeout=15)
        if img_res.status_code == 200:
            hero_path = POSTS_DIR / post_slug / "hero.jpg"
            hero_path.write_bytes(img_res.content)
            local_url = f"/magazine/posts/{post_slug}/hero.jpg"
    except Exception as e:
        print(f"  ⚠️ 이미지 저장 실패: {e}")

    html = html_path.read_text(encoding='utf-8')

    new_hero = f'<div class="mg-article-hero" style="background-image:url(\'{local_url}\');background-size:cover;background-position:center"></div>'

    pattern = r'<div class="mg-article-hero"[^>]*></div>'
    if re.search(pattern, html):
        html = re.sub(pattern, new_hero, html, count=1)

    html = re.sub(
        r'<meta property="og:image" content="[^"]*">',
        f'<meta property="og:image" content="{photo["url"]}">',
        html
    )
    html = re.sub(
        r'"image": "[^"]*"',
        f'"image": "{photo["url"]}"',
        html
    )
    html = re.sub(
        r'<div style="[^"]*">Photo by <a [^>]*>[^<]*</a> on <a [^>]*>Unsplash</a></div>\s*',
        '',
        html
    )

    attribution = f'<div style="font-size:12px;color:#94a3b8;text-align:right;padding:10px 24px;background:#f8fafc;border-bottom:1px solid #e5e7eb">Photo by <a href="{photo["author_url"]}" target="_blank" rel="noopener" style="color:#1d4ed8;text-decoration:none">{photo["author_name"]}</a> on <a href="https://unsplash.com/?utm_source=factorymatch&utm_medium=referral" target="_blank" rel="noopener" style="color:#1d4ed8;text-decoration:none">Unsplash</a></div>'
    html = html.replace(new_hero, new_hero + '\n  ' + attribution)

    # posts.json thumbnail도 로컬 경로로 업데이트
    photo["local_url"] = local_url

    html_path.write_text(html, encoding='utf-8')
    return True

def main():
    print("=" * 60)
    print("📷 매거진 글에 Unsplash 사진 추가 (중복 회피)")
    print("=" * 60)
    
    if not UNSPLASH_ACCESS_KEY:
        print("❌ UNSPLASH_ACCESS_KEY가 설정되지 않았습니다.")
        sys.exit(1)
    
    # --force / -f 옵션: 이미 사진 있는 글도 새 사진으로 교체
    force_mode = "--force" in sys.argv or "-f" in sys.argv
    if force_mode:
        print("🔄 강제 모드: 모든 글의 사진을 새로 가져옵니다 (중복 회피)")
    
    data = json.loads(DATA_FILE.read_text(encoding='utf-8'))
    posts = data.get("posts", [])
    
    if not posts:
        print("⚠️ posts.json에 글이 없습니다.")
        return
    
    print(f"\n📋 총 {len(posts)}개 글\n")
    
    # 이미 사용된 사진 URL 추적 (중복 회피)
    used_urls = set()
    # 같은 키워드 사용 횟수 추적 (페이지 인덱싱)
    keyword_count = {}
    
    if not force_mode:
        for p in posts:
            if p.get("hero_image_url"):
                used_urls.add(p["hero_image_url"])
    
    updated = 0
    skipped = 0
    failed = 0
    
    for i, post in enumerate(posts, 1):
        if not force_mode and post.get("thumbnail_url"):
            print(f"[{i}/{len(posts)}] ⏩ 건너뜀 (이미 있음): {post['title'][:40]}")
            skipped += 1
            continue
        
        print(f"[{i}/{len(posts)}] 📝 {post['title']}")
        
        industry = post.get("industry_key")
        category = post.get("category")
        keyword = INDUSTRY_KEYWORDS.get(industry) or CATEGORY_KEYWORDS.get(category) or "manufacturing factory"
        
        # 같은 키워드 N번째 글이면 N번째 페이지에서 검색 (다른 사진 풀 보장)
        keyword_count[keyword] = keyword_count.get(keyword, 0) + 1
        page = keyword_count[keyword]
        
        print(f"  🔍 검색: {keyword} (페이지 {page})")
        
        photo = fetch_unsplash_photo(keyword, used_urls=used_urls, page=page)
        if not photo:
            print(f"  ❌ 실패")
            failed += 1
            continue
        
        used_urls.add(photo["url"])

        # posts.json 업데이트
        post["thumbnail_url"] = photo["thumb_url"]
        post["hero_image_url"] = photo["url"]

        # 개별 글 HTML 파일 업데이트 (hero.jpg 로컬 저장 포함)
        if update_html_hero(post["slug"], photo):
            # 로컬 저장 성공 시 thumbnail도 로컬 경로로 업데이트
            if photo.get("local_url"):
                post["thumbnail"] = photo["local_url"]
                post["thumbnail_url"] = photo["local_url"]
            print(f"  ✅ 완료 ({photo['author_name']})")
            updated += 1
        else:
            print(f"  ⚠️ HTML 파일 없음 (posts.json만 업데이트)")
            updated += 1
        
        time.sleep(1)  # API rate limit (50 호출/시간, 안전 마진)
    
    # posts.json 저장
    DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    
    print("\n" + "=" * 60)
    print(f"✅ 완료!")
    print(f"   - 업데이트: {updated}개")
    print(f"   - 건너뜀: {skipped}개")
    print(f"   - 실패: {failed}개")
    print(f"   - 사용한 고유 사진: {len(used_urls)}개")
    print("=" * 60)


if __name__ == "__main__":
    main()
