@echo off
chcp 65001 > nul
echo ==========================================
echo  공장매칭 일일 데이터 수집 시작
echo  %date% %time%
echo ==========================================

cd /d C:\Users\micro\factory-match

echo.
echo [1/7] Git 최신화...
git pull

echo.
echo [2/7] 주소 좌표 변환 (enrich_geocode)...
py enrich_geocode.py

echo.
echo [3/7] 공장 정보 보강 (enrich_factoryon)...
py enrich_factoryon.py

echo.
echo [4/7] 웹사이트 수집 (enrich_website_naver)...
py enrich_website_naver.py

echo.
echo [5/7] AI 요약 생성 (enrich_ai_summary)...
py enrich_ai_summary.py

echo.
echo [6/7] 이메일 수집 (enrich_email_only)...
py enrich_email_only.py

echo.
echo [7/7] KICOX 산업단지 수집 (collect_kicox_lndpcl)...
py collect_kicox_lndpcl.py

echo.
echo ==========================================
echo  완료! %date% %time%
echo ==========================================
pause
