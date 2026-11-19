import React, { useEffect, useState } from 'react';
import { Menu, Phone, ShoppingBag, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_LINKS = [
  { id: 'thuc-don', href: '#thuc-don', label: 'Thực đơn' },
  { id: 'triet-ly', href: '#triet-ly', label: 'Triết lý sạch' },
  { id: 'cua-hang', href: '#cua-hang', label: 'Cửa hàng' },
  { id: 'nhuong-quyen', href: '#nhuong-quyen', label: 'Nhượng quyền' },
];

/** Bespoke minimalist bakery & coffee crest for Xíu Bread & Coffee */
const BrandCrest: React.FC = () => (
  <span
    aria-hidden="true"
    className="relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1C1613] text-[#E6C79C] ring-1 ring-[#9A4D10]/40 ring-offset-2 ring-offset-[#FCFBF8] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] shrink-0"
  >
    <svg
      viewBox="0 0 36 36"
      fill="none"
      className="w-6 h-6 sm:w-7 sm:h-7"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="18"
        cy="18"
        r="16"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="0.9"
      />
      {/* Stylized golden wheat stalk (left) */}
      <path
        d="M11.6 26.5C11.6 20.6 13 14.8 17.4 9.6"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <path
        d="M12.2 22C9.5 21 8.4 18.8 9.4 16.7C11.3 17.2 12.6 19.2 12.2 22Z"
        fill="currentColor"
      />
      <path
        d="M13.8 16.3C11.7 15.1 11 13.1 12.2 11.4C14 12.1 14.6 14 13.8 16.3Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      {/* Roasted coffee bean (right) */}
      <path
        d="M21 14.2C24.2 14.2 26.6 16.7 26.6 20C26.6 23.3 24.1 25.8 21 25.8C17.9 25.8 15.8 23.5 15.8 20.2C15.8 16.9 17.9 14.2 21 14.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M21.9 14.8C20.3 17.4 22.2 20.6 20.3 25.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Delicate rising aroma curl */}
      <path
        d="M22.2 8.4C23.2 9.5 23.2 10.9 22.2 12"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />
    </svg>
  </span>
);

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      const y = window.scrollY;
      setIsScrolled(y > 12);

      const offset = y + 160;
      let current = '';
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= offset) {
          current = link.id;
        }
      }
      setActiveSection(current);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-t-[2px] border-t-[#9A4D10] bg-[#FCFBF8]/95 backdrop-blur-md border-b transition-all duration-200 ${
        isScrolled
          ? 'border-b-[#DFD7CA] shadow-[0_8px_28px_-18px_rgba(28,22,19,0.28)]'
          : 'border-b-[#EAE3D8]'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 h-[68px] sm:h-[74px] flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        {/* Zone 1: Artistic heritage brand seal + refined two-tier wordmark */}
        <a
          href="#top"
          className="group inline-flex items-center gap-2.5 sm:gap-3 min-w-0 shrink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A4D10]"
        >
          <BrandCrest />
          <span className="flex flex-col leading-none min-w-0">
            <span className="flex items-baseline gap-1 sm:gap-1.5 whitespace-nowrap">
              <span className="font-display text-[1.25rem] sm:text-[1.45rem] font-semibold tracking-[-0.02em] text-[#1C1613] group-hover:text-[#9A4D10] transition-colors">
                Xíu
              </span>
              <span className="font-display italic text-[0.82rem] sm:text-[0.95rem] font-medium text-[#7A5536]">
                Bread &amp; Coffee
              </span>
            </span>
            <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8C7A68] mt-1 whitespace-nowrap">
              Lò bánh tươi · Sài Gòn
            </span>
          </span>
        </a>

        {/* Zone 2: Clear, sculpted editorial navigation with delicate architectural rhythm */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden md:flex items-center h-full gap-1 lg:gap-2"
        >
          {NAV_LINKS.map((link, idx) => {
            const isActive = activeSection === link.id;
            return (
              <React.Fragment key={link.href}>
                {idx > 0 && (
                  <span
                    aria-hidden="true"
                    className="hidden lg:inline-block w-1 h-1 rounded-full bg-[#D5C9B8] mx-1.5 shrink-0"
                  />
                )}
                <a
                  href={link.href}
                  onClick={() => setActiveSection(link.id)}
                  className={`group relative h-full inline-flex items-center px-3.5 lg:px-4 text-[15px] tracking-[-0.005em] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#9A4D10] ${
                    isActive
                      ? 'font-semibold text-[#9A4D10]'
                      : 'font-semibold text-[#2B231E] hover:text-[#9A4D10]'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* Subtle sculpted bronze bottom bar anchored flush to header edge */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-3.5 bottom-0 h-[2.5px] rounded-t-full bg-[#9A4D10] origin-center transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-75 group-hover:opacity-65'
                    }`}
                  />
                </a>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Zone 3: Flagship hotline whisper (wide screens) + signature order button */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          <a
            href="tel:02838321790"
            className="hidden xl:inline-flex items-center gap-2 text-xs font-medium text-[#57504A] hover:text-[#9A4D10] transition-colors whitespace-nowrap"
            aria-label="Gọi hotline cửa hàng trung tâm 028 3832 1790"
          >
            <Phone className="w-3.5 h-3.5 text-[#9A4D10] shrink-0" aria-hidden="true" />
            <span className="tabular-nums font-semibold text-[#1C1613]">028 3832 1790</span>
          </a>

          <span
            aria-hidden="true"
            className="hidden xl:inline-block h-5 w-px bg-[#E3DCD1]"
          />

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={cartCount > 0 ? `Mở giỏ hàng (${cartCount} món)` : 'Đặt món ngay'}
            className="group inline-flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[42px] rounded-md bg-[#1C1613] text-[#FCFBF8] text-xs sm:text-sm font-semibold tracking-[-0.005em] ring-1 ring-inset ring-white/10 shadow-[0_6px_16px_-10px_rgba(28,22,19,0.55)] hover:bg-[#9A4D10] hover:shadow-[0_8px_18px_-10px_rgba(154,77,16,0.55)] transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A4D10]"
          >
            <ShoppingBag
              className="w-4 h-4 text-[#E6C79C] group-hover:text-white transition-colors shrink-0"
              aria-hidden="true"
            />
            <span>{cartCount > 0 ? 'Giỏ hàng' : 'Đặt món'}</span>
            {cartCount > 0 && (
              <span className="tabular-nums inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded bg-[#9A4D10] group-hover:bg-[#1C1613] text-white text-xs font-bold transition-colors">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-[#DFD7CA] bg-white text-[#1C1613] hover:bg-[#F8F6F2] transition-colors shrink-0 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Điều hướng di động"
          className="md:hidden border-t border-[#EAE3D8] bg-[#FCFBF8] px-5 py-3 flex flex-col divide-y divide-[#EFE9DF]"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  setActiveSection(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`py-3.5 px-1 min-h-[48px] flex items-center justify-between text-[15px] transition-colors ${
                  isActive
                    ? 'text-[#9A4D10] font-semibold'
                    : 'text-[#1C1613] font-semibold hover:text-[#9A4D10]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#9A4D10]"
                  />
                )}
              </a>
            );
          })}
          <div className="pt-3.5 pb-1.5 px-1 flex items-center justify-between text-xs text-[#766E67]">
            <span>Hotline Flagship · 06:00 – 21:30</span>
            <a
              href="tel:02838321790"
              className="tabular-nums font-semibold text-[#1C1613] hover:text-[#9A4D10]"
            >
              028 3832 1790
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
