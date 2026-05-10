// Netlify 빌드 시 환경변수 → env-config.js 생성 + Babel 사전 컴파일
const fs = require('fs');
const babel = require('@babel/core');

// 1. 환경변수 → env-config.js
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

// 2. Babel 사전 컴파일 (브라우저에서 실시간 변환 제거)
const babelOpts = {
  presets: [
    ['@babel/preset-react', { runtime: 'classic' }],
    ['@babel/preset-env', { targets: { browsers: 'last 2 years' }, modules: false }]
  ]
};

const filesToCompile = [
  { src: 'data.js',        dist: 'compiled/data.js' },
  { src: 'pages.js',       dist: 'compiled/pages.js' },
  { src: 'app.js',         dist: 'compiled/app.js' },
  { src: 'visitor_log.js', dist: 'compiled/visitor_log.js' },
];

if (!fs.existsSync('compiled')) fs.mkdirSync('compiled');

filesToCompile.forEach(({ src, dist }) => {
  const code = fs.readFileSync(src, 'utf-8');
  const result = babel.transformSync(code, { ...babelOpts, filename: src });
  fs.writeFileSync(dist, result.code);
  const kb = Math.round(result.code.length / 1024);
  console.log(`[build] 컴파일 완료: ${src} → ${dist} (${kb}KB)`);
});

console.log('[build] 모든 파일 컴파일 완료');

