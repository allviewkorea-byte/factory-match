// Netlify 빌드 시 환경변수 → env-config.js 생성
const fs = require('fs');

const required = ['GOOGLE_MAPS_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.warn('[build] 경고: 환경변수 누락 →', missing.join(', '));
}

const env = {
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
  SUPABASE_URL:        process.env.SUPABASE_URL        || '',
  SUPABASE_ANON_KEY:   process.env.SUPABASE_ANON_KEY   || '',
};

fs.writeFileSync('env-config.js', `window._env = ${JSON.stringify(env, null, 2)};\n`);
console.log('[build] env-config.js 생성 완료');
