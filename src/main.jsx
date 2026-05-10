import React from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// 환경변수 설정
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// 전역 변수 설정 (기존 코드 호환)
window._sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window._env = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  GOOGLE_MAPS_API_KEY,
};

// Google Maps 동적 로드
const loadGoogleMaps = () => {
  return new Promise((resolve) => {
    if (window.google) { resolve(); return; }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&language=ko&region=KR`;
    script.async = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
};
window._loadGoogleMaps = loadGoogleMaps;

// App 로드
import('./App.jsx').then(({ default: App }) => {
  ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
