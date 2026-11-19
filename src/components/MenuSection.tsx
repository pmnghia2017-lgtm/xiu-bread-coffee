import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Check, Plus, Search } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS, MenuCategory, MenuItem } from '../data/storeData';
import {
  MenuSortMode,
  filterMenuItems,
  formatVND,
  sortMenuItems,
} from '../utils/storeLogic';
import { ArtisanImage } from './ArtisanImage';
import { ProductArtwork } from './ProductArtwork';

interface MenuSectionProps {
  selectedCategory?: MenuCategory;
  onSelectCategory?: (category: MenuCategory) => void;
  onQuickAdd: (item: MenuItem) => void;
  onInspectItem: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  selectedCategory: controlledCategory,
  onSelectCategory,
  onQuickAdd,
  onInspectItem,
}) => {
  const [internalCategory, setInternalCategory] = useState<MenuCategory>('all');
  const [sortMode, setSortMode] = useState<MenuSortMode>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const selectedCategory = controlledCategory ?? internalCategory;
  const setSelectedCategory = (cat: MenuCategory) => {
    setInternalCategory(cat);
    onSelectCategory?.(cat);
  };

  useEffect(() => {
    if (!justAddedId) return;
    const t = window.setTimeout(() => setJustAddedId(null), 1100);
    return () => window.clearTimeout(t);
  }, [justAddedId]);

  const categoryCounts = useMemo(() => {
    const counts: Record<MenuCategory, number> = {
      all: MENU_ITEMS.length,
      'banh-mi': 0,
      'ca-phe': 0,
      'banh-ngot': 0,
      combo: 0,
    };
    for (const item of MENU_ITEMS) {
      counts[item.category] += 1;
    }
    return counts;
  }, []);

  const visibleItems = useMemo(() => {
    const filtered = filterMenuItems(MENU_ITEMS, selectedCategory, searchQuery);
    return sortMenuItems(filtered, sortMode);
  }, [selectedCategory, searchQuery, sortMode]);

  const handleCardQuickAdd = (item: MenuItem) => {
    onQuickAdd(item);
    setJustAddedId(item.id);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSortMode('default');
    setSelectedCategory('all');
  };

  return (
    <section id="thuc-don" className="scroll-mt-[76px] py-14 lg:py-20 bg-white">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Section header + understated editorial pairing notice */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7">
          <div>
            <p className="text-[13px] font-medium text-[#9A4D10] mb-1.5">
              Thực đơn mỗi ngày
            </p>
            <h2 className="font-display text-3xl sm:text-[2.1rem] font-semibold tracking-[-0.015em] text-[#1C1613]">
              Món ngon nướng nóng &amp; pha phin tại quầy
            </h2>
          </div>

          <div className="lg:text-right text-sm text-[#57504A] shrink-0">
            <p className="font-medium text-[#1C1613]">
              Ghép 1 Bánh mì + 1 Cà phê tự động giảm 8%
            </p>
            <p className="text-xs text-[#766E67] mt-0.5">
              Hoặc nhập mã <span className="font-semibold text-[#9A4D10]">XIU10</span> giảm 10% đơn từ 100.000đ
            </p>
          </div>
        </div>

        {/* Clean architectural underline category bar + utility controls on balanced rows */}
        <div className="border-b border-[#E6E1D9] flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 lg:pb-0">
          <div
            role="tablist"
            aria-label="Danh mục thực đơn"
            className="flex items-center gap-6 sm:gap-8 overflow-x-auto"
          >
            {MENU_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative py-3.5 text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A4D10] ${
                    active
                      ? 'font-semibold text-[#1C1613]'
                      : 'font-medium text-[#766E67] hover:text-[#1C1613]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`tabular-nums text-xs ml-1.5 ${
                      active ? 'text-[#9A4D10]' : 'text-[#9A9189]'
                    }`}
                  >
                    {categoryCounts[cat.id]}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 -bottom-[1px] h-[2px] bg-[#9A4D10] transition-opacity duration-150 ${
                      active ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 lg:pb-2 shrink-0">
            <div className="relative">
              <label htmlFor="menu-sort" className="sr-only">
                Sắp xếp thực đơn
              </label>
              <ArrowUpDown
                className="w-4 h-4 text-[#766E67] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="menu-sort"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as MenuSortMode)}
                aria-label="Sắp xếp thực đơn"
                className="w-full sm:w-48 pl-9 pr-7 py-2 min-h-[38px] rounded-md border border-[#E2DDD4] bg-white text-sm text-[#1C1613] focus:outline-none focus:border-[#9A4D10] cursor-pointer"
              >
                <option value="default">Thứ tự mặc định</option>
                <option value="featured">Món bán chạy</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
              </select>
            </div>

            <div className="relative w-full sm:w-56">
              <label htmlFor="menu-search" className="sr-only">
                Tìm món trong thực đơn
              </label>
              <Search
                className="w-4 h-4 text-[#766E67] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="menu-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bánh mì, cà phê..."
                className="w-full pl-9 pr-3 py-2 min-h-[38px] rounded-md border border-[#E2DDD4] bg-white text-sm text-[#1C1613] placeholder:text-[#9A9189] focus:outline-none focus:border-[#9A4D10]"
              />
            </div>
          </div>
        </div>

        {(searchQuery || selectedCategory !== 'all' || sortMode !== 'default') && (
          <div className="pt-3 flex items-center gap-3 text-xs text-[#766E67]">
            <span className="tabular-nums">Đang hiển thị {visibleItems.length} món</span>
            <button
              type="button"
              onClick={resetFilters}
              className="font-medium text-[#9A4D10] hover:underline cursor-pointer"
            >
              Xem toàn bộ thực đơn
            </button>
          </div>
        )}

        {/* Product Grid */}
        {visibleItems.length === 0 ? (
          <div className="mt-7 py-14 text-center rounded-lg border border-[#EAE5DD] bg-[#F8F6F2]">
            <p className="font-display text-xl font-semibold text-[#1C1613] mb-2">
              Không tìm thấy món phù hợp
            </p>
            <p className="text-sm text-[#57504A] mb-5">
              Thử từ khóa khác như “pate”, “sữa đá” hoặc “croissant”.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 min-h-[42px] rounded-md bg-[#1C1613] text-white text-sm font-medium hover:bg-[#9A4D10] transition-colors cursor-pointer"
            >
              Xem toàn bộ thực đơn
            </button>
          </div>
        ) : (
          <div
            className={`mt-7 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7 ${
              visibleItems.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
            }`}
          >
            {visibleItems.map((item) => {
              const wasJustAdded = justAddedId === item.id;
              return (
                <article
                  key={item.id}
                  className="group flex flex-col rounded-lg border border-[#EAE5DD] bg-white overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-16px_rgba(28,22,19,0.22)] hover:border-[#D6CEC2]"
                >
                  {/* Clean culinary photography */}
                  <button
                    type="button"
                    onClick={() => onInspectItem(item)}
                    aria-label={`Xem chi tiết ${item.name}`}
                    className="relative aspect-[4/3] w-full overflow-hidden border-b border-[#EFECE6] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#9A4D10]"
                  >
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
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pt-8 pb-2.5 bg-gradient-to-t from-[#191411]/80 via-[#191411]/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between text-xs font-medium text-white"
                    >
                      <span>Xem chi tiết &amp; tùy chọn</span>
                      {item.options.length > 0 && (
                        <span className="tabular-nums text-[#E8D0AC]">
                          {item.options.length} lựa chọn
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Card content */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#766E67] mb-1.5">
                        <span>{item.categoryLabel}</span>
                        {item.featured && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-[#9A4D10]">Bán chạy</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-[17px] font-semibold text-[#1C1613] leading-snug mb-1.5 tracking-[-0.01em]">
                        <button
                          type="button"
                          onClick={() => onInspectItem(item)}
                          className="text-left group-hover:text-[#9A4D10] transition-colors cursor-pointer"
                        >
                          {item.name}
                        </button>
                      </h3>

                      <p className="text-sm text-[#57504A] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-[#F0ECE5] flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="tabular-nums text-base font-bold text-[#1C1613]">
                          {formatVND(item.price)}
                        </p>
                        <p className="text-xs text-[#766E67] truncate mt-0.5">
                          {item.prepNote}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCardQuickAdd(item)}
                        aria-label={`Thêm ${item.name} vào giỏ`}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          wasJustAdded
                            ? 'bg-[#275D3B] text-white'
                            : 'bg-[#1C1613] text-white hover:bg-[#9A4D10]'
                        }`}
                      >
                        {wasJustAdded ? (
                          <>
                            <Check className="w-4 h-4" aria-hidden="true" />
                            <span>Đã thêm</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" aria-hidden="true" />
                            <span>Thêm</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
