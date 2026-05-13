@echo off
cd /d C:\Users\micro\factory-match
git pull origin main

set ANTHROPIC_API_KEY=여기에_API_키_입력

echo [1/7] 좌표 변환 시작...
py enrich_geocode.py
echo [2/7] 공장ON 수집 시작...
py enrich_factoryon.py
echo [3/7] 네이버 website 수집 시작...
py enrich_website_naver.py
echo [4/7] 구글 Places 수집 시작...
py enrich_google_places.py
echo [5/7] 크로스체크 시작...
py enrich_crosscheck.py
echo [6/7] AI 요약 시작...
py enrich_ai_summary.py
echo [7/7] 이메일 수집 시작...
py enrich_email_only.py

echo.
echo ✅ 모든 수집 완료!
pause
