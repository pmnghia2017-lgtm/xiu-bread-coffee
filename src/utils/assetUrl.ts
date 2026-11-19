export interface XiuRuntimeConfig {
  assetBase?: string;
  apiBase?: string;
  nonce?: string;
  inlineAssets?: Record<string, string>;
}

declare global {
  interface Window {
    __XIU_WP_CONFIG__?: XiuRuntimeConfig;
  }
}

export function getRuntimeConfig(): XiuRuntimeConfig | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.__XIU_WP_CONFIG__;
}

/**
 * Resolves static asset paths cleanly across:
 * 1) Standalone single-file HTML demo (via window.__XIU_WP_CONFIG__.inlineAssets)
 * 2) WordPress plugin/theme hosting (via window.__XIU_WP_CONFIG__.assetBase)
 * 3) Subfolder / cPanel static hosting (Vite base: './')
 * 4) Local Vite dev server (BASE_URL === '/')
 */
export function assetUrl(
  path: string,
  runtimeConfig: XiuRuntimeConfig | undefined = getRuntimeConfig(),
  viteBase?: string
): string {
  if (!path) return path;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  const clean = path.replace(/^\/+/, '');
  const inlined =
    runtimeConfig?.inlineAssets?.[path] ?? runtimeConfig?.inlineAssets?.[clean];
  if (inlined) {
    return inlined;
  }

  const wpBase = runtimeConfig?.assetBase?.trim();
  if (wpBase) {
    return `${wpBase.replace(/\/+$/, '')}/${clean}`;
  }

  const envBase =
    viteBase ??
    (typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env.BASE_URL as string | undefined)
      : undefined) ??
    '/';

  if (envBase === './' || envBase === '.') {
    return `./${clean}`;
  }

  const normalized = envBase.replace(/\/+$/, '');
  return normalized ? `${normalized}/${clean}` : `/${clean}`;
}
