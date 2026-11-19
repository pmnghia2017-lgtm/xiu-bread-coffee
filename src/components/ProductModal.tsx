import React, { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { MenuItem } from '../data/storeData';
import { computeCartItemUnitPrice, formatVND } from '../utils/storeLogic';
import { ArtisanImage } from './ArtisanImage';
import { ProductArtwork } from './ProductArtwork';

interface ProductModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    selectedOptionIds: string[],
    note: string,
    quantity: number
  ) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    setSelectedOptions([]);
    setQuantity(1);
    setNote('');
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [item, onClose]);

  if (!item) return null;

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const unitPrice = computeCartItemUnitPrice(item, selectedOptions);
  const totalPrice = unitPrice * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#191411]/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white border border-[#E6E1D9] shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="group relative h-60 sm:h-64 border-b border-[#EFECE6] shrink-0">
          {item.imageSrc ? (
            <ArtisanImage
              src={item.imageSrc}
              alt={item.imageAlt || item.name}
              imgClassName={item.imageClassName}
              tone={item.imageTone}
              fallbackArtworkKey={item.artworkKey}
            />
          ) : (
            <ProductArtwork artworkKey={item.artworkKey} />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết món"
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-md bg-white/95 border border-[#E6E1D9] flex items-center justify-center text-[#1C1613] hover:bg-white cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <p className="text-xs text-[#766E67] mb-1">
              {item.categoryLabel} · {item.kcal} · {item.prepNote}
            </p>
            <h3
              id="product-modal-title"
              className="font-display text-2xl font-semibold text-[#1C1613]"
            >
              {item.name}
            </h3>
            <p className="text-sm text-[#57504A] mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {item.options.length > 0 && (
            <div className="pt-4 border-t border-[#EFECE6]">
              <p className="text-sm font-semibold text-[#1C1613] mb-3">
                Tùy chỉnh khẩu vị &amp; món thêm
              </p>
              <div className="space-y-2">
                {item.options.map((opt) => {
                  const checked = selectedOptions.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-md border text-sm cursor-pointer transition-colors ${
                        checked
                          ? 'border-[#9A4D10] bg-[#FAF6F1] text-[#1C1613]'
                          : 'border-[#E6E1D9] bg-white text-[#57504A] hover:border-[#CFC8BC]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOption(opt.id)}
                          className="w-4 h-4 accent-[#9A4D10]"
                        />
                        <span>{opt.label}</span>
                      </span>
                      <span className="tabular-nums text-xs font-medium text-[#1C1613]">
                        {opt.priceDelta > 0 ? `+${formatVND(opt.priceDelta)}` : 'Miễn phí'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="item-note-input"
              className="block text-sm font-semibold text-[#1C1613] mb-2"
            >
              Ghi chú cho quầy bếp
            </label>
            <input
              id="item-note-input"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Ít hành ngò, cắt đôi ổ bánh..."
              className="w-full px-3.5 py-2.5 rounded-md border border-[#DCD6CC] bg-white text-sm text-[#1C1613] placeholder:text-[#9A9189] focus:outline-none focus:border-[#9A4D10]"
            />
          </div>
        </div>

        <div className="p-5 border-t border-[#EFECE6] bg-[#F8F6F2] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-1 border border-[#DCD6CC] bg-white rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Giảm số lượng"
              className="w-9 h-9 rounded flex items-center justify-center text-[#1C1613] hover:bg-[#F3EFE8] cursor-pointer"
            >
              <Minus className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="w-8 text-center tabular-nums text-sm font-semibold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Tăng số lượng"
              className="w-9 h-9 rounded flex items-center justify-center text-[#1C1613] hover:bg-[#F3EFE8] cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onAddToCart(item, selectedOptions, note, quantity);
              onClose();
            }}
            className="flex-1 py-2.5 px-5 min-h-[42px] rounded-md bg-[#9A4D10] text-white text-sm font-semibold hover:bg-[#7E3E0B] transition-colors tabular-nums cursor-pointer"
          >
            Thêm vào giỏ · {formatVND(totalPrice)}
          </button>
        </div>
      </div>
    </div>
  );
};
