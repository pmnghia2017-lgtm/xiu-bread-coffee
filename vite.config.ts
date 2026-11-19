import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

function createDownloadMiddleware() {
  return (
    req: { url?: string },
    res: {
      statusCode: number;
      setHeader: (k: string, v: string) => void;
      end: (body: Buffer) => void;
    },
    next: () => void
  ) => {
    const rawUrl = req.url || '';
    const pathname = rawUrl.split('?')[0];
    const downloadMap: Record<
      string,
      { file: string; filename: string; contentType: string }
    > = {
      '/download-demo': {
        file: path.resolve(__dirname, 'demo/xiu-bread-coffee-demo.html'),
        filename: 'xiu-bread-coffee-demo.html',
        contentType: 'text/html; charset=utf-8',
      },
      '/download-wp-plugin': {
        file: path.resolve(__dirname, 'wordpress/xiu-bread-coffee-plugin.zip'),
        filename: 'xiu-bread-coffee-plugin.zip',
        contentType: 'application/zip',
      },
      '/download-wp-static': {
        file: path.resolve(__dirname, 'wordpress/xiu-static-hosting.zip'),
        filename: 'xiu-static-hosting.zip',
        contentType: 'application/zip',
      },
      '/download-netlify': {
        file: path.resolve(__dirname, 'wordpress/xiu-netlify-drop.zip'),
        filename: 'xiu-netlify-drop.zip',
        contentType: 'application/zip',
      },
      '/download-github': {
        file: path.resolve(__dirname, 'wordpress/xiu-github-source.zip'),
        filename: 'xiu-github-source.zip',
        contentType: 'application/zip',
      },
    };

    const match = downloadMap[pathname];
    if (match && fs.existsSync(match.file)) {
      res.statusCode = 200;
      res.setHeader('Content-Type', match.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${match.filename}"`);
      res.setHeader('Cache-Control', 'no-store');
      res.end(fs.readFileSync(match.file));
      return;
    }
    next();
  };
}

export default defineConfig(({command}) => {
  return {
    base: command === 'build' ? './' : '/',
    plugins: [
      react(),
      tailwindcss(),
      // Serves direct attachment downloads in dev and preview modes (/download-demo, /download-wp-plugin, /download-wp-static)
      {
        name: 'demo-download-middleware',
        configureServer(server) {
          server.middlewares.use(createDownloadMiddleware());
        },
        configurePreviewServer(server) {
          server.middlewares.use(createDownloadMiddleware());
        },
      },
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
    },
  };
});
