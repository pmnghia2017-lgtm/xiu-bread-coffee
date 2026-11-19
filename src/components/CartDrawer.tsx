import React, { useEffect, useState } from 'react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import { MENU_ITEMS, MenuItem, STORE_BRANCHES } from '../data/storeData';
import {
  CartItem,
  FREE_DELIVERY_THRESHOLD,
  FulfillmentMode,
  calculateOrderSummary,
  computeCartItemUnitPrice,
  formatVND,
  validateCheckoutForm,
} from '../utils/storeLogic';
import { submitOrder } from '../utils/apiClient';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  activeBranchId: string;
  onChangeBranchId: (id: string) => void;
  onUpdateQuantity: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onQuickAddItem: (item: MenuItem) => void;
  onClearCart: () => void;
}

interface ConfirmedReceipt {
  orderCode: string;
  customerName: string;
  phone: string;
  branchName: string;
  fulfillment: FulfillmentMode;
  address: string;
  total: number;
  itemCount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  cartItems,
  activeBranchId,
  onChangeBranchId,
  onUpdateQuantity,
  onRemoveItem,
  onQuickAddItem,
  onClearCart,
}) => {
  const [fulfillment, setFulfillment] = useState<FulfillmentMode>('pickup');
  const [promoCode, setPromoCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ConfirmedReceipt | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const summary = calculateOrderSummary(cartItems, fulfillment, promoCode);
  const selectedBranch =
    STORE_BRANCHES.find((b) => b.id === activeBranchId) || STORE_BRANCHES[0];

  const hasBread = cartItems.some((c) => c.item.category === 'banh-mi');
  const hasCoffee = cartItems.some((c) => c.item.category === 'ca-phe');
  const suggestedCoffee = MENU_ITEMS.find((i) => i.id === 'cp-sua-da');
  const suggestedBread = MENU_ITEMS.find((i) => i.id === 'bm-dac-biet');
  const pairingSuggestion =
    hasBread && !hasCoffee
      ? suggestedCoffee
      : hasCoffee && !hasBread
        ? suggestedBread
        : undefined;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutForm({
      customerName,
      phone,
      address,
      fulfillment,
      branchId: activeBranchId,
    });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    const itemsPayload = cartItems.map((entry) => ({
      itemId: entry.item.id,
      name: entry.item.name,
      quantity: entry.quantity,
      unitPrice: computeCartItemUnitPrice(entry.item, entry.selectedOptionIds),
      options: entry.item.options
        .filter((o) => entry.selectedOptionIds.includes(o.id))
        .map((o) => o.label),
      note: entry.note,
    }));

    const result = await submitOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      fulfillment,
      branchId: activeBranchId,
      branchName: selectedBranch.name,
      promoCode: promoCode.trim().toUpperCase(),
      subtotal: summary.subtotal,
      discount: summary.comboDiscount,
      deliveryFee: summary.deliveryFee,
      total: summary.total,
      totalItems: summary.totalItems,
      items: itemsPayload,
    });

    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(
        result.errorMessage || 'Không thể gửi đơn hàng. Vui lòng thử lại.'
      );
      return;
    }

    setReceipt({
      orderCode: result.code,
      customerName: customerName.trim(),
      phone: phone.trim(),
      branchName: selectedBranch.name,
      fulfillment,
      address: address.trim(),
      total: summary.total,
      itemCount: summary.totalItems,
    });
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#191411]/55"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#F8F6F2] h-full shadow-2xl border-l border-[#E6E1D9] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E1D9] bg-white flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 id="cart-drawer-title" className="font-display text-xl font-semibold text-[#1C1613]">
              Giỏ hàng của bạn
            </h2>
            <p className="text-xs text-[#766E67] tabular-nums">
              {summary.totalItems > 0
                ? `${summary.totalItems} món · ${selectedBranch.name}`
                : selectedBranch.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng giỏ hàng"
            className="w-9 h-9 rounded-md border border-[#E6E1D9] flex items-center justify-center text-[#1C1613] hover:bg-[#F8F6F2] cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {receipt ? (
            <div className="rounded-lg border border-[#275D3B]/30 bg-white p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-[#275D3B]">
                <CheckCircle2 className="w-6 h-6 shrink-0" aria-hidden="true" />
                <h3 className="font-display text-2xl font-semibold text-[#1C1613]">
                  Đặt hàng thành công
                </h3>
              </div>
              <p className="text-sm text-[#57504A] leading-relaxed">
                Quầy bếp tại <span className="font-semibold text-[#1C1613]">{receipt.branchName}</span>{' '}
                đang chuẩn bị <span className="tabular-nums font-medium">{receipt.itemCount}</span> món tươi nóng cho{' '}
                <span className="font-semibold text-[#1C1613]">{receipt.customerName}</span>.
              </p>

              <dl className="py-4 border-y border-[#EFECE6] space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#766E67]">Mã đơn hàng</dt>
                  <dd className="tabular-nums font-semibold text-[#1C1613]">#{receipt.orderCode}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#766E67]">Hình thức</dt>
                  <dd className="font-medium text-[#1C1613]">
                    {receipt.fulfillment === 'pickup' ? 'Nhận tại quầy (15 phút)' : 'Giao tận nơi'}
                  </dd>
                </div>
                {receipt.fulfillment === 'delivery' && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#766E67] shrink-0">Địa chỉ</dt>
                    <dd className="font-medium text-[#1C1613] text-right">{receipt.address}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[#766E67]">Tổng thanh toán (COD/Tiền mặt)</dt>
                  <dd className="tabular-nums font-bold text-[#9A4D10]">
                    {formatVND(receipt.total)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-md bg-[#1C1613] text-white text-sm font-semibold hover:bg-[#9A4D10] transition-colors cursor-pointer"
              >
                Tiếp tục khám phá thực đơn
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-xl font-semibold text-[#1C1613] mb-2">
                Giỏ hàng đang trống
              </p>
              <p className="text-sm text-[#57504A] mb-6">
                Hãy chọn ổ bánh mì nóng giòn hoặc ly cà phê phin đậm vị từ thực đơn.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-md bg-[#9A4D10] text-white text-sm font-semibold hover:bg-[#7E3E0B] cursor-pointer"
              >
                Xem thực đơn ngay
              </button>
            </div>
          ) : (
            <>
              {/* Item list */}
              <ul className="divide-y divide-[#E6E1D9] border-b border-[#E6E1D9]">
                {cartItems.map((entry) => {
                  const unitPrice = computeCartItemUnitPrice(
                    entry.item,
                    entry.selectedOptionIds
                  );
                  const optionLabels = entry.item.options
                    .filter((o) => entry.selectedOptionIds.includes(o.id))
                    .map((o) => o.label);

                  return (
                    <li key={entry.cartKey} className="py-4 first:pt-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#1C1613]">
                            {entry.item.name}
                          </p>
                          {optionLabels.length > 0 && (
                            <p className="text-xs text-[#766E67] mt-0.5">
                              {optionLabels.join(' · ')}
                            </p>
                          )}
                          {entry.note && (
                            <p className="text-xs text-[#766E67] italic mt-0.5">
                              Ghi chú: {entry.note}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(entry.cartKey)}
                          aria-label={`Xóa ${entry.item.name}`}
                          className="p-1.5 text-[#766E67] hover:text-[#B42318] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#DCD6CC] rounded-md bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(entry.cartKey, -1)}
                            aria-label={`Giảm số lượng ${entry.item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-[#1C1613] hover:bg-[#F8F6F2] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-8 text-center tabular-nums text-xs font-semibold">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(entry.cartKey, 1)}
                            aria-label={`Tăng số lượng ${entry.item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-[#1C1613] hover:bg-[#F8F6F2] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <p className="tabular-nums text-sm font-semibold text-[#1C1613]">
                          {formatVND(unitPrice * entry.quantity)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Smart pairing suggestion to unlock -8% */}
              {pairingSuggestion && (
                <div className="rounded-md border border-[#E6E1D9] bg-white p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#275D3B]">
                      Ghép cặp Bánh mì &amp; Cà phê để giảm 8%
                    </p>
                    <p className="text-xs text-[#57504A] truncate mt-0.5">
                      Thêm {pairingSuggestion.name} ({formatVND(pairingSuggestion.price)})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onQuickAddItem(pairingSuggestion)}
                    className="px-3 py-1.5 rounded-md bg-[#1C1613] text-white text-xs font-medium hover:bg-[#9A4D10] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    + Thêm
                  </button>
                </div>
              )}

              {/* Promo Code */}
              <div>
                <label
                  htmlFor="promo-code-input"
                  className="block text-xs font-medium text-[#57504A] mb-1.5"
                >
                  Mã ưu đãi (nhập <span className="font-semibold text-[#9A4D10]">XIU10</span> giảm 10%)
                </label>
                <input
                  id="promo-code-input"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Nhập mã ưu đãi nếu có..."
                  className="w-full px-3.5 py-2 rounded-md border border-[#DCD6CC] bg-white text-sm uppercase text-[#1C1613] placeholder:normal-case focus:outline-none focus:border-[#9A4D10]"
                />
              </div>

              {/* Order calculation breakdown */}
              <div className="rounded-lg border border-[#E6E1D9] bg-white p-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#57504A]">
                  <span>Tạm tính</span>
                  <span className="tabular-nums">{formatVND(summary.subtotal)}</span>
                </div>

                {summary.comboDiscount > 0 && (
                  <div className="flex justify-between text-[#275D3B]">
                    <span>{summary.discountReason}</span>
                    <span className="tabular-nums">
                      -{formatVND(summary.comboDiscount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[#57504A]">
                  <span>Phí giao hàng</span>
                  <span className="tabular-nums">
                    {summary.deliveryFee === 0 ? 'Miễn phí' : formatVND(summary.deliveryFee)}
                  </span>
                </div>

                {fulfillment === 'delivery' && summary.freeDeliveryRemaining > 0 && (
                  <p className="text-xs text-[#766E67]">
                    Mua thêm {formatVND(summary.freeDeliveryRemaining)} để được miễn phí giao hàng (đơn từ {formatVND(FREE_DELIVERY_THRESHOLD)}).
                  </p>
                )}

                <div className="pt-2 border-t border-[#EFECE6] flex justify-between font-semibold text-base text-[#1C1613]">
                  <span>Tổng thanh toán</span>
                  <span className="tabular-nums text-[#9A4D10]">
                    {formatVND(summary.total)}
                  </span>
                </div>
              </div>

              {/* Checkout form */}
              <form id="checkout-form" onSubmit={handleCheckout} noValidate className="space-y-4">
                <div>
                  <span className="block text-xs font-medium text-[#57504A] mb-1.5">
                    Hình thức nhận món
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EAE5DD] rounded-md">
                    <button
                      type="button"
                      onClick={() => setFulfillment('pickup')}
                      className={`py-2 px-3 rounded text-xs font-medium cursor-pointer transition-colors ${
                        fulfillment === 'pickup'
                          ? 'bg-white text-[#1C1613] shadow-xs'
                          : 'text-[#57504A]'
                      }`}
                    >
                      Nhận tại quầy
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillment('delivery')}
                      className={`py-2 px-3 rounded text-xs font-medium cursor-pointer transition-colors ${
                        fulfillment === 'delivery'
                          ? 'bg-white text-[#1C1613] shadow-xs'
                          : 'text-[#57504A]'
                      }`}
                    >
                      Giao tận nơi
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="checkout-branch"
                    className="block text-xs font-medium text-[#57504A] mb-1.5"
                  >
                    Chi nhánh phục vụ
                  </label>
                  <select
                    id="checkout-branch"
                    value={activeBranchId}
                    onChange={(e) => onChangeBranchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#DCD6CC] bg-white text-sm text-[#1C1613] focus:outline-none focus:border-[#9A4D10]"
                  >
                    {STORE_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} — {b.ward}, {b.district}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-medium text-[#57504A] mb-1.5"
                  >
                    Tên người nhận <span className="text-[#B42318]">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Trần Thị Minh Thư"
                    aria-invalid={Boolean(errors.customerName)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#DCD6CC] bg-white text-sm text-[#1C1613] focus:outline-none focus:border-[#9A4D10]"
                  />
                  {errors.customerName && (
                    <p className="text-xs text-[#B42318] mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-medium text-[#57504A] mb-1.5"
                  >
                    Số điện thoại <span className="text-[#B42318]">*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0908123456"
                    aria-invalid={Boolean(errors.phone)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#DCD6CC] bg-white text-sm tabular-nums text-[#1C1613] focus:outline-none focus:border-[#9A4D10]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-[#B42318] mt-1">{errors.phone}</p>
                  )}
                </div>

                {fulfillment === 'delivery' && (
                  <div>
                    <label
                      htmlFor="checkout-address"
                      className="block text-xs font-medium text-[#57504A] mb-1.5"
                    >
                      Địa chỉ giao hàng <span className="text-[#B42318]">*</span>
                    </label>
                    <input
                      id="checkout-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số nhà, tên đường, phường, quận..."
                      aria-invalid={Boolean(errors.address)}
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#DCD6CC] bg-white text-sm text-[#1C1613] focus:outline-none focus:border-[#9A4D10]"
                    />
                    {errors.address && (
                      <p className="text-xs text-[#B42318] mt-1">{errors.address}</p>
                    )}
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {/* Footer CTA */}
        {!receipt && cartItems.length > 0 && (
          <div className="p-5 border-t border-[#E6E1D9] bg-white shrink-0 space-y-2.5">
            {submitError && (
              <p role="alert" className="text-xs text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-md px-3 py-2">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="w-full py-3 px-5 min-h-[44px] rounded-md bg-[#9A4D10] text-white text-sm font-semibold hover:bg-[#7E3E0B] disabled:opacity-65 disabled:cursor-wait transition-colors tabular-nums cursor-pointer"
            >
              {submitting
                ? 'Đang gửi đơn hàng...'
                : `Xác nhận đặt món · ${formatVND(summary.total)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
