// Netlify 빌드: 환경변수 → env-config.js + esbuild로 JSX 컴파일 + 압축
const fs   = require('fs');
const path = require('path');
const { buildSync } = require('esbuild');

// ── 1. env-config.js 생성 ──────────────────────────────────
const required = ['GOOGLE_MAPS_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missing  = required.filter(k => !process.env[k]);
if (missing.length) console.warn('[build] 경고: 환경변수 누락 →', missing.join(', '));

const env = {
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
  SUPABASE_URL:        process.env.SUPABASE_URL        || '',
  SUPABASE_ANON_KEY:   process.env.SUPABASE_ANON_KEY   || '',
};
fs.writeFileSync('env-config.js', `window._env = ${JSON.stringify(env, null, 2)};\n`);
console.log('[build] env-config.js 생성 완료');

// ── 2. JS 파일들을 esbuild로 JSX 컴파일 + 압축 ──────────────
const jsFiles = ['data.js', 'visitor_log.js', 'pages.js', 'app.js'];

for (const file of jsFiles) {
  const src = path.join(__dirname, file);
  if (!fs.existsSync(src)) { console.warn(`[build] 없음: ${file}`); continue; }

  const outFile = file.replace('.js', '.min.js');
  try {
    buildSync({
      entryPoints: [src],
      outfile: path.join(__dirname, outFile),
      bundle: false,
      minify: true,
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      loader: { '.js': 'jsx' },
      target: ['es2018'],
      logLevel: 'warning',
    });
    const orig = fs.statSync(src).size;
    const mini = fs.statSync(path.join(__dirname, outFile)).size;
    console.log(`[build] ${file} → ${outFile} (${(orig/1024).toFixed(0)}KB → ${(mini/1024).toFixed(0)}KB, -${Math.round((1-mini/orig)*100)}%)`);
  } catch(e) {
    console.error(`[build] ${file} 빌드 실패:`, e.message);
    fs.copyFileSync(src, path.join(__dirname, outFile));
    console.warn(`[build] ${file} 원본으로 대체`);
  }
}

// ── 3. CSS 압축 ───────────────────────────────────────────
try {
  buildSync({
    entryPoints: [path.join(__dirname, 'styles.css')],
    outfile: path.join(__dirname, 'styles.min.css'),
    bundle: false,
    minify: true,
    logLevel: 'warning',
  });
  const orig = fs.statSync('styles.css').size;
  const mini = fs.statSync('styles.min.css').size;
  console.log(`[build] styles.css → styles.min.css (${(orig/1024).toFixed(0)}KB → ${(mini/1024).toFixed(0)}KB, -${Math.round((1-mini/orig)*100)}%)`);
} catch(e) {
  console.error('[build] styles.css 압축 실패:', e.message);
  fs.copyFileSync('styles.css', 'styles.min.css');
}

console.log('[build] 완료!');
