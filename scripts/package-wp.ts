import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const WP_DIR = path.join(ROOT_DIR, 'wordpress');
const PLUGIN_DIR = path.join(WP_DIR, 'xiu-bread-coffee');
const PLUGIN_APP_DIR = path.join(PLUGIN_DIR, 'app');

const HTACCESS_CONTENT = `# Xíu Bread & Coffee — Apache / LiteSpeed Rules for WordPress Hosting
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType image/svg+xml "access plus 30 days"
  ExpiresByType text/css "access plus 30 days"
  ExpiresByType application/javascript "access plus 30 days"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/json
</IfModule>
`;

/**
 * Pure-Node ZIP archive builder (no external zip binary required).
 */
function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

interface ZipEntryInput {
  zipPath: string;
  data: Buffer;
}

function collectFiles(dir: string, prefix = ''): ZipEntryInput[] {
  const entries: ZipEntryInput[] = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, item.name);
    const rel = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.isDirectory()) {
      entries.push(...collectFiles(abs, rel));
    } else if (item.isFile()) {
      entries.push({ zipPath: rel.replace(/\\/g, '/'), data: fs.readFileSync(abs) });
    }
  }
  return entries;
}

function writeZipFile(entries: ZipEntryInput[], outPath: string): void {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.zipPath, 'utf8');
    const uncompressed = entry.data;
    const compressed = zlib.deflateRawSync(uncompressed);
    const crc = crc32(uncompressed);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8); // deflate
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(uncompressed.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuf, compressed);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(uncompressed.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, nameBuf);
    offset += localHeader.length + nameBuf.length + compressed.length;
  }

  const centralDir = Buffer.concat(centralParts);
  const endRecord = Buffer.alloc(22);
  endRecord.writeUInt32LE(0x06054b50, 0);
  endRecord.writeUInt16LE(0, 4);
  endRecord.writeUInt16LE(0, 6);
  endRecord.writeUInt16LE(entries.length, 8);
  endRecord.writeUInt16LE(entries.length, 10);
  endRecord.writeUInt32LE(centralDir.length, 12);
  endRecord.writeUInt32LE(offset, 16);
  endRecord.writeUInt16LE(0, 20);

  fs.writeFileSync(outPath, Buffer.concat([...localParts, centralDir, endRecord]));
}

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

if (!fs.existsSync(DIST_DIR)) {
  console.error('Missing dist/ directory. Run `npm run build` first.');
  process.exit(1);
}

// 1. Prune unused uploaded images from dist/assets/aistudio/ to keep WordPress ZIP lightweight
const distAistudioDir = path.join(DIST_DIR, 'assets', 'aistudio');
if (fs.existsSync(distAistudioDir)) {
  const used = findReferencedAistudioFiles(path.join(ROOT_DIR, 'src'));
  for (const file of fs.readdirSync(distAistudioDir)) {
    if (!used.has(file)) {
      fs.rmSync(path.join(distAistudioDir, file), { force: true });
    }
  }
}

// 2. Write Apache/LiteSpeed .htaccess into dist/ for standalone cPanel/WordPress hosting upload
fs.writeFileSync(path.join(DIST_DIR, '.htaccess'), HTACCESS_CONTENT, 'utf8');

// 3. Sync dist/ into wordpress/xiu-bread-coffee/app/ (excluding demo download hub files)
fs.rmSync(PLUGIN_APP_DIR, { recursive: true, force: true });
fs.cpSync(DIST_DIR, PLUGIN_APP_DIR, {
  recursive: true,
  force: true,
  filter: (src) => {
    const rel = path.relative(DIST_DIR, src).replace(/\\/g, '/');
    return (
      rel !== 'downloads' &&
      !rel.startsWith('downloads/') &&
      rel !== 'tai-demo.html' &&
      rel !== 'huong-dan-deploy.html'
    );
  },
});

// 4. Create WordPress Plugin ZIP (upload via WP Admin -> Plugins -> Add New -> Upload)
const pluginEntries = collectFiles(PLUGIN_DIR, 'xiu-bread-coffee');
const pluginZipPath = path.join(WP_DIR, 'xiu-bread-coffee-plugin.zip');
writeZipFile(pluginEntries, pluginZipPath);

// 5. Create Standalone Static Hosting ZIP (extract into public_html/ or subfolder on cPanel/LiteSpeed)
const staticEntries = collectFiles(DIST_DIR).filter(
  (entry) =>
    entry.zipPath !== 'tai-demo.html' &&
    entry.zipPath !== 'huong-dan-deploy.html' &&
    entry.zipPath !== 'downloads' &&
    !entry.zipPath.startsWith('downloads/')
);
const staticZipPath = path.join(WP_DIR, 'xiu-static-hosting.zip');
writeZipFile(staticEntries, staticZipPath);

// 6. Create Netlify Drag-and-Drop ZIP (drop directly onto https://app.netlify.com/drop)
const netlifyEntries: ZipEntryInput[] = [
  ...staticEntries.filter((entry) => entry.zipPath !== '.htaccess'),
  {
    zipPath: '_redirects',
    data: Buffer.from('/* /index.html 200\n', 'utf8'),
  },
];
const netlifyZipPath = path.join(WP_DIR, 'xiu-netlify-drop.zip');
writeZipFile(netlifyEntries, netlifyZipPath);

// 7. Create Clean GitHub Source-Code ZIP (ready to unzip & push to GitHub -> Vercel / Cloudflare / Netlify)
const githubEntries: ZipEntryInput[] = [];
const ROOT_SOURCE_FILES = [
  'index.html',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'vercel.json',
  'netlify.toml',
  '.gitignore',
  '.env.example',
  'README.md',
];

for (const filename of ROOT_SOURCE_FILES) {
  const abs = path.join(ROOT_DIR, filename);
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
    githubEntries.push({ zipPath: filename, data: fs.readFileSync(abs) });
  }
}

// Add src/ and scripts/
if (fs.existsSync(path.join(ROOT_DIR, 'src'))) {
  githubEntries.push(...collectFiles(path.join(ROOT_DIR, 'src'), 'src'));
}
if (fs.existsSync(path.join(ROOT_DIR, 'scripts'))) {
  githubEntries.push(...collectFiles(path.join(ROOT_DIR, 'scripts'), 'scripts'));
}

// Add public/ (excluding utility pages, downloads/, and unused/screenshot images)
const usedAistudioFiles = findReferencedAistudioFiles(path.join(ROOT_DIR, 'src'));
const publicDir = path.join(ROOT_DIR, 'public');
if (fs.existsSync(publicDir)) {
  for (const entry of collectFiles(publicDir, 'public')) {
    if (
      entry.zipPath === 'public/tai-demo.html' ||
      entry.zipPath === 'public/huong-dan-deploy.html' ||
      entry.zipPath.startsWith('public/downloads/')
    ) {
      continue;
    }
    if (entry.zipPath.startsWith('public/assets/aistudio/')) {
      const basename = path.basename(entry.zipPath);
      if (!usedAistudioFiles.has(basename)) {
        continue;
      }
    }
    githubEntries.push(entry);
  }
}

const githubZipPath = path.join(WP_DIR, 'xiu-github-source.zip');
writeZipFile(githubEntries, githubZipPath);

console.log(`WordPress Plugin ZIP ready: ${pluginZipPath}`);
console.log(`Static Hosting ZIP ready:   ${staticZipPath}`);
console.log(`Netlify Drop ZIP ready:     ${netlifyZipPath}`);
console.log(`GitHub Source ZIP ready:    ${githubZipPath} (${githubEntries.length} files)`);

