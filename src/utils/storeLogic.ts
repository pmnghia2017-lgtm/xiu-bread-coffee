import { MenuCategory, MenuItem, StoreBranch } from '../data/storeData';

export interface CartItem {
  cartKey: string;
  item: MenuItem;
  selectedOptionIds: string[];
  note: string;
  quantity: number;
}

export type FulfillmentMode = 'pickup' | 'delivery';

export interface OrderSummary {
  subtotal: number;
  comboDiscount: number;
  discountReason: string | null;
  deliveryFee: number;
  freeDeliveryRemaining: number;
  total: number;
  totalItems: number;
}

export interface CheckoutInput {
  customerName: string;
  phone: string;
  address: string;
  fulfillment: FulfillmentMode;
  branchId: string;
}

export interface FranchiseInput {
  fullName: string;
  phone: string;
  area: string;
  inquiryType: 'nhuong-quyen' | 'teabreak' | 'cung-cap-si';
  notes: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const FREE_DELIVERY_THRESHOLD = 150000;
export const STANDARD_DELIVERY_FEE = 15000;

export function formatVND(amount: number): string {
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString('vi-VN')}đ`;
}

export function normalizeVietnamese(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export type MenuSortMode = 'default' | 'featured' | 'price-asc' | 'price-desc';

export function filterMenuItems(
  items: MenuItem[],
  category: MenuCategory,
  query: string
): MenuItem[] {
  const q = normalizeVietnamese(query);
  return items.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    const haystack = normalizeVietnamese(
      `${item.name} ${item.description} ${item.categoryLabel} ${item.prepNote}`
    );
    return haystack.includes(q);
  });
}

export function sortMenuItems(
  items: MenuItem[],
  sortMode: MenuSortMode
): MenuItem[] {
  const copy = [...items];
  if (sortMode === 'featured') {
    return copy.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }
  if (sortMode === 'price-asc') {
    return copy.sort((a, b) => a.price - b.price);
  }
  if (sortMode === 'price-desc') {
    return copy.sort((a, b) => b.price - a.price);
  }
  return copy;
}

export function filterStores(
  stores: StoreBranch[],
  district: string,
  query: string
): StoreBranch[] {
  const q = normalizeVietnamese(query);
  return stores.filter((branch) => {
    const matchesDistrict = district === 'Tất cả' || branch.district === district;
    if (!matchesDistrict) return false;
    if (!q) return true;
    const haystack = normalizeVietnamese(
      `${branch.name} ${branch.address} ${branch.district} ${branch.ward}`
    );
    return haystack.includes(q);
  });
}

export function computeCartItemUnitPrice(
  item: MenuItem,
  selectedOptionIds: string[]
): number {
  const delta = item.options
    .filter((opt) => selectedOptionIds.includes(opt.id))
    .reduce((sum, opt) => sum + opt.priceDelta, 0);
  return item.price + delta;
}

export function buildCartKey(
  itemId: string,
  selectedOptionIds: string[],
  note: string
): string {
  const sortedOpts = [...selectedOptionIds].sort().join(',');
  return `${itemId}::${sortedOpts}::${note.trim().toLowerCase()}`;
}

export function calculateOrderSummary(
  cartItems: CartItem[],
  fulfillment: FulfillmentMode,
  promoCode: string
): OrderSummary {
  const subtotal = cartItems.reduce(
    (sum, entry) =>
      sum + computeCartItemUnitPrice(entry.item, entry.selectedOptionIds) * entry.quantity,
    0
  );
  const totalItems = cartItems.reduce((sum, entry) => sum + entry.quantity, 0);

  const hasBread = cartItems.some((c) => c.item.category === 'banh-mi');
  const hasCoffee = cartItems.some((c) => c.item.category === 'ca-phe');
  const normalizedCode = promoCode.trim().toUpperCase();

  let comboDiscount = 0;
  let discountReason: string | null = null;

  if (normalizedCode === 'XIU10' && subtotal > 0) {
    comboDiscount = Math.round(subtotal * 0.1);
    discountReason = 'Mã ưu đãi XIU10 (Giảm 10%)';
  } else if (hasBread && hasCoffee && subtotal > 0) {
    comboDiscount = Math.round(subtotal * 0.08);
    discountReason = 'Ưu đãi ghép cặp Bánh mì & Cà phê (-8%)';
  }

  const afterDiscount = Math.max(0, subtotal - comboDiscount);
  const needsDeliveryFee =
    fulfillment === 'delivery' && afterDiscount > 0 && afterDiscount < FREE_DELIVERY_THRESHOLD;
  const deliveryFee = needsDeliveryFee ? STANDARD_DELIVERY_FEE : 0;
  const freeDeliveryRemaining =
    fulfillment === 'delivery' && afterDiscount < FREE_DELIVERY_THRESHOLD
      ? Math.max(0, FREE_DELIVERY_THRESHOLD - afterDiscount)
      : 0;

  return {
    subtotal,
    comboDiscount,
    discountReason,
    deliveryFee,
    freeDeliveryRemaining,
    total: afterDiscount + deliveryFee,
    totalItems,
  };
}

export function isValidVietnamesePhone(phone: string): boolean {
  const digits = phone.replace(/[\s.-]/g, '');
  return /^0\d{9,10}$/.test(digits);
}

export function validateCheckoutForm(input: CheckoutInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.customerName.trim() || input.customerName.trim().length < 2) {
    errors.customerName = 'Vui lòng nhập họ tên người nhận (tối thiểu 2 ký tự).';
  }

  if (!isValidVietnamesePhone(input.phone)) {
    errors.phone = 'Số điện thoại chưa đúng định dạng (gồm 10–11 chữ số, bắt đầu bằng 0).';
  }

  if (!input.branchId.trim()) {
    errors.branchId = 'Vui lòng chọn chi nhánh Xíu phục vụ đơn hàng.';
  }

  if (input.fulfillment === 'delivery' && input.address.trim().length < 8) {
    errors.address = 'Vui lòng nhập địa chỉ giao hàng chi tiết (số nhà, tên đường, phường).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateFranchiseForm(input: FranchiseInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.fullName.trim() || input.fullName.trim().length < 2) {
    errors.fullName = 'Vui lòng nhập họ tên hoặc tên doanh nghiệp.';
  }

  if (!isValidVietnamesePhone(input.phone)) {
    errors.phone = 'Số điện thoại liên hệ chưa hợp lệ (ví dụ: 0901234567).';
  }

  if (!input.area.trim() || input.area.trim().length < 2) {
    errors.area = 'Vui lòng nhập quận/khu vực dự kiến.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateOrderCode(prefix = 'XIU'): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}
