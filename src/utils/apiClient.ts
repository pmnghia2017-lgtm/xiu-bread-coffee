import { getRuntimeConfig } from './assetUrl';
import {
  CheckoutInput,
  FranchiseInput,
  FulfillmentMode,
  generateOrderCode,
} from './storeLogic';

export interface OrderItemPayload {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  options: string[];
  note: string;
}

export interface OrderSubmissionPayload extends CheckoutInput {
  branchName: string;
  promoCode: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  totalItems: number;
  items: OrderItemPayload[];
}

export interface SubmissionResult {
  ok: boolean;
  code: string;
  persisted: boolean;
  errorMessage?: string;
}

function resolveApiBase(): string | null {
  const wpApiBase = getRuntimeConfig()?.apiBase?.trim();
  if (wpApiBase) {
    return wpApiBase.replace(/\/+$/, '');
  }

  const viteApiBase =
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env.VITE_API_BASE as string | undefined)?.trim()
      : undefined;

  if (viteApiBase) {
    return viteApiBase.replace(/\/+$/, '');
  }

  return null;
}

async function postToEndpoint(
  endpointPath: string,
  body: unknown,
  fallbackPrefix: string
): Promise<SubmissionResult> {
  const apiBase = resolveApiBase();
  if (!apiBase) {
    return {
      ok: true,
      code: generateOrderCode(fallbackPrefix),
      persisted: false,
    };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const nonce = getRuntimeConfig()?.nonce;
  if (nonce) {
    headers['X-WP-Nonce'] = nonce;
  }

  try {
    const response = await fetch(`${apiBase}${endpointPath}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      code?: string;
      message?: string;
    };

    if (!response.ok || data.success === false) {
      return {
        ok: false,
        code: '',
        persisted: false,
        errorMessage:
          data.message ||
          'Không thể kết nối máy chủ tiếp nhận lúc này. Vui lòng thử lại hoặc gọi hotline chi nhánh.',
      };
    }

    return {
      ok: true,
      code: data.code || generateOrderCode(fallbackPrefix),
      persisted: true,
    };
  } catch {
    return {
      ok: false,
      code: '',
      persisted: false,
      errorMessage:
        'Kết nối mạng bị gián đoạn khi gửi thông tin. Vui lòng kiểm tra lại mạng và thử gửi lại.',
    };
  }
}

export function submitOrder(payload: OrderSubmissionPayload): Promise<SubmissionResult> {
  return postToEndpoint('/orders', payload, 'XIU');
}

export function submitInquiry(payload: FranchiseInput): Promise<SubmissionResult> {
  return postToEndpoint('/inquiries', payload, 'HT');
}

export function formatFulfillmentLabel(mode: FulfillmentMode): string {
  return mode === 'pickup' ? 'Nhận tại quầy (15 phút)' : 'Giao tận nơi';
}
