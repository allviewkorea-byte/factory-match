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
UNSPLASH_ACCESS_KEY = os.environ.get("UNSPLASH_ACCESS_KEY") or "Ez21T7kxW7Dqe5uS_dFfQ6rywt41r5H6fwpYLgaefH0"

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


def fetch_unsplash_photo(keyword):
    """Unsplash에서 사진 1장 가져오기"""
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
                # Download tracking (약관 6조)
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
    """개별 글 HTML 파일에 히어로 이미지 + attribution 삽입"""
    html_path = POSTS_DIR / post_slug / "index.html"
    if not html_path.exists():
        return False
    
    html = html_path.read_text(encoding='utf-8')
    
    # 1. 히어로 영역 background-image 적용
    # 기존 형태 1: 빈 배경 + linear-gradient
    pattern1 = r'<div class="mg-article-hero" style="background:linear-gradient\([^)]+\)"></div>'
    new_hero = f'<div class="mg-article-hero" style="background-image:url(\'{photo["url"]}\');background-size:cover;background-position:center"></div>'
    if re.search(pattern1, html):
        html = re.sub(pattern1, new_hero, html)
    else:
        # 기존 형태 2: background-image:url('')
        pattern2 = r'<div class="mg-article-hero" style="background-image:url\(\'[^\']*\'\)[^"]*"></div>'
        if re.search(pattern2, html):
            html = re.sub(pattern2, new_hero, html)
    
    # 2. OG image 메타태그 업데이트
    html = re.sub(
        r'<meta property="og:image" content="">',
        f'<meta property="og:image" content="{photo["url"]}">',
        html
    )
    
    # 3. JSON-LD의 image도 업데이트
    html = re.sub(
        r'"image": ""',
        f'"image": "{photo["url"]}"',
        html
    )
    
    # 4. 히어로 아래에 attribution 추가 (이미 있으면 안 함)
    if "Photo by" not in html:
        attribution = f'<div style="font-size:12px;color:#94a3b8;text-align:right;padding:10px 24px;background:#f8fafc;border-bottom:1px solid #e5e7eb">Photo by <a href="{photo["author_url"]}" target="_blank" rel="noopener" style="color:#1d4ed8;text-decoration:none">{photo["author_name"]}</a> on <a href="https://unsplash.com/?utm_source=factorymatch&utm_medium=referral" target="_blank" rel="noopener" style="color:#1d4ed8;text-decoration:none">Unsplash</a></div>'
        
        html = html.replace(
            new_hero,
            new_hero + '\n  ' + attribution
        )
    
    html_path.write_text(html, encoding='utf-8')
    return True


def main():
    print("=" * 60)
    print("📷 매거진 글에 Unsplash 사진 추가")
    print("=" * 60)
    
    if not UNSPLASH_ACCESS_KEY:
        print("❌ UNSPLASH_ACCESS_KEY가 설정되지 않았습니다.")
        sys.exit(1)
    
    data = json.loads(DATA_FILE.read_text(encoding='utf-8'))
    posts = data.get("posts", [])
    
    if not posts:
        print("⚠️ posts.json에 글이 없습니다.")
        return
    
    print(f"\n📋 총 {len(posts)}개 글 확인\n")
    
    updated = 0
    skipped = 0
    failed = 0
    
    for i, post in enumerate(posts, 1):
        # 이미 사진이 있으면 건너뜀
        if post.get("thumbnail_url"):
            print(f"[{i}/{len(posts)}] ⏩ 건너뜀 (이미 있음): {post['title'][:40]}")
            skipped += 1
            continue
        
        print(f"[{i}/{len(posts)}] 📝 {post['title']}")
        
        # 키워드 결정 (산업 우선, 없으면 카테고리)
        industry = post.get("industry_key")
        category = post.get("category")
        keyword = INDUSTRY_KEYWORDS.get(industry) or CATEGORY_KEYWORDS.get(category) or "manufacturing factory"
        print(f"  🔍 검색: {keyword}")
        
        # 사진 가져오기
        photo = fetch_unsplash_photo(keyword)
        if not photo:
            print(f"  ❌ 실패")
            failed += 1
            continue
        
        # posts.json 업데이트
        post["thumbnail_url"] = photo["thumb_url"]
        post["hero_image_url"] = photo["url"]
        
        # 개별 글 HTML 파일 업데이트
        if update_html_hero(post["slug"], photo):
            print(f"  ✅ 완료")
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
    print("=" * 60)


if __name__ == "__main__":
    main()
