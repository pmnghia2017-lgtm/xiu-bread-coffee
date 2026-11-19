import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import esbuild from 'esbuild';

const ROOT_DIR = process.cwd();
const DIST_ASSETS_DIR = path.join(ROOT_DIR, 'dist', 'assets');
const PUBLIC_ASSETS_DIR = path.join(ROOT_DIR, 'public', 'assets', 'aistudio');
const DEMO_DIR = path.join(ROOT_DIR, 'demo');
const OUT_FILE = path.join(DEMO_DIR, 'xiu-bread-coffee-demo.html');
const PUBLIC_DOWNLOADS_DIR = path.join(ROOT_DIR, 'public', 'downloads');
const PUBLIC_OUT_FILE = path.join(PUBLIC_DOWNLOADS_DIR, 'xiu-bread-coffee-demo.html');

function findReferencedAistudioFiles(dir: string): Set<string> {
  const referenced = new Set<string>();
  const pattern = /\/assets\/aistudio\/([^"'\s)]+)/g;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, item.name);
    if (item.isDirectory()) {
      for (const f of findReferencedAistudioFiles(abs)) referenced.add(f);
    } else if (
      item.isFile() &&
      /\.(ts|tsx|js|jsx|css|html)$/.test(item.name) &&
      !item.name.endsWith('.test.ts')
    ) {
      const content = fs.readFileSync(abs, 'utf8');
      for (const match of content.matchAll(pattern)) {
        if (match[1]) referenced.add(match[1]);
      }
    }
  }
  return referenced;
}

async function main() {
  if (!fs.existsSync(DIST_ASSETS_DIR)) {
    console.error('Missing dist/assets/. Run `vite build` first.');
    process.exit(1);
  }

  const cssFile = fs.readdirSync(DIST_ASSETS_DIR).find((f) => f.endsWith('.css'));
  if (!cssFile) {
    console.error('Could not find compiled CSS in dist/assets/.');
    process.exit(1);
  }
  const compiledCss = fs.readFileSync(path.join(DIST_ASSETS_DIR, cssFile), 'utf8');

  // Bundle React app as a classic IIFE so double-clicking file:// works offline in every browser
  const result = await esbuild.build({
    entryPoints: [path.join(ROOT_DIR, 'src', 'main.tsx')],
    bundle: true,
    minify: true,
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    write: false,
    define: {
      'process.env.NODE_ENV': '"production"',
      'import.meta.env.BASE_URL': '"./"',
      'import.meta.env.VITE_API_BASE': '""',
    },
    plugins: [
      {
        name: 'ignore-css-imports',
        setup(build) {
          build.onLoad({ filter: /\.css$/ }, () => ({ contents: '', loader: 'js' }));
        },
      },
    ],
  });

  const compiledJs = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

  // Compress all referenced photos via ImageMagick and embed as base64 data URIs
  const referenced = Array.from(findReferencedAistudioFiles(path.join(ROOT_DIR, 'src'))).sort();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'xiu-demo-'));
  const inlineAssets: Record<string, string> = {};

  try {
    for (const filename of referenced) {
      const srcPath = path.join(PUBLIC_ASSETS_DIR, filename);
      if (!fs.existsSync(srcPath)) continue;

      const outJpg = path.join(tmpDir, `${path.parse(filename).name}.jpg`);
      execFileSync('convert', [
        srcPath,
        '-auto-orient',
        '-background',
        '#24140D',
        '-alpha',
        'remove',
        '-alpha',
        'off',
        '-resize',
        '960x960>',
        '-strip',
        '-interlace',
        'Plane',
        '-quality',
        '82',
        outJpg,
      ]);

      const b64 = fs.readFileSync(outJpg).toString('base64');
      inlineAssets[`/assets/aistudio/${filename}`] = `data:image/jpeg;base64,${b64}`;
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  const faviconSvgPath = path.join(ROOT_DIR, 'public', 'favicon.svg');
  const faviconDataUri = fs.existsSync(faviconSvgPath)
    ? `data:image/svg+xml;base64,${fs.readFileSync(faviconSvgPath).toString('base64')}`
    : '';

  const inlineConfigJson = JSON.stringify({ inlineAssets }).replace(/<\/script/gi, '<\\/script');

  const html = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Xíu Bread &amp; Coffee — Bánh mì tươi · Cà phê thật · Thực phẩm sạch (Bản Demo)</title>
    <meta
      name="description"
      content="Bản giới thiệu tương tác website Xíu Bread &amp; Coffee — Chuỗi bánh mì tươi nướng mỗi ngày &amp; cà phê rang mộc nguyên chất tại TP.HCM."
    />
    ${faviconDataUri ? `<link rel="icon" type="image/svg+xml" href="${faviconDataUri}" />` : ''}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <style>${compiledCss}</style>
  </head>
  <body class="bg-[#FCFAF7] text-[#24140D] antialiased selection:bg-[#C67211]/20 selection:text-[#24140D]">
    <div id="root"></div>
    <script>window.__XIU_WP_CONFIG__=${inlineConfigJson};</script>
    <script>${compiledJs}</script>
  </body>
</html>
`;

  fs.mkdirSync(DEMO_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, html, 'utf8');

  fs.mkdirSync(PUBLIC_DOWNLOADS_DIR, { recursive: true });
  fs.writeFileSync(PUBLIC_OUT_FILE, html, 'utf8');

  const stats = fs.statSync(OUT_FILE);
  const mb = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(
    `Single-file HTML demo created: ${OUT_FILE} and ${PUBLIC_OUT_FILE} (${mb} MB, ${Object.keys(inlineAssets).length} embedded images)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
