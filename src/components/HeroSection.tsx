import React, { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { StoreBranch } from '../data/storeData';
import { assetUrl } from '../utils/assetUrl';

interface HeroSectionProps {
  activeBranch: StoreBranch;
  onQuickOrderCombo: () => void;
}

const HERO_HIGHLIGHTS = [
  { metric: '05:30', label: 'Mẻ bánh đầu ra lò mỗi sáng' },
  { metric: 'Cầu Đất', label: 'Hạt rang mộc, pha phin trực tiếp' },
  { metric: 'VietGAP', label: 'Pate tươi & rau sạch kiểm định hằng ngày' },
  { metric: '5 chi nhánh', label: 'Quận 1, Quận 3, Phú Nhuận & Bình Thạnh' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeBranch,
  onQuickOrderCombo,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="border-b border-[#EAE5DD] bg-[#F8F6F2]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-8 pb-9 lg:pt-10 lg:pb-11">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left column: Focal editorial headline & primary CTA */}
          <div className="lg:col-span-7 flex flex-col justify-between py-1">
            <div>
              <p className="text-[13px] font-medium text-[#766E67] mb-3">
                Bánh mì tươi · Cà phê thật · Thực phẩm sạch
              </p>

              <h1 className="font-display text-[clamp(2.1rem,3.5vw,3.15rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-[#1C1613] max-w-xl mb-4">
                Ổ bánh giòn rụm mỗi sáng, ly cà phê rang mộc trọn vị.
              </h1>

              <p className="text-[15px] sm:text-base text-[#57504A] leading-[1.7] max-w-[34rem] mb-7">
                Bánh được ủ bột qua đêm và nướng trực tiếp tại quầy từ 5 giờ 30 sáng,
                dùng kèm cà phê pha phin nguyên chất và pate gan tươi chế biến mỗi ngày.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <a
                  href="#thuc-don"
                  className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-md bg-[#9A4D10] text-white text-sm font-semibold hover:bg-[#7E3E0B] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1613]"
                >
                  <span>Khám phá thực đơn</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={onQuickOrderCombo}
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-md border border-[#D8D0C4] bg-white text-[#1C1613] text-sm font-medium hover:border-[#1C1613] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A4D10]"
                >
                  Đặt nhanh Combo sáng
                </button>
              </div>
            </div>

            {/* Active branch bar — clean single-line without ellipsis truncation */}
            <div className="pt-4 border-t border-[#E6E1D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <MapPin className="w-4 h-4 text-[#9A4D10] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-xs text-[#766E67]">
                    Đang đặt tại ·{' '}
                    <span className="tabular-nums text-[#57504A]">{activeBranch.hours}</span>
                  </p>
                  <p className="text-sm font-medium text-[#1C1613] mt-0.5">
                    {activeBranch.name} · {activeBranch.ward}, {activeBranch.district}
                  </p>
                </div>
              </div>
              <a
                href="#cua-hang"
                className="text-sm font-medium text-[#9A4D10] hover:text-[#7E3E0B] underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                Đổi chi nhánh
              </a>
            </div>
          </div>

          {/* Right column: Clean framed storefront photograph */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <figure className="w-full max-w-[420px] lg:max-w-none flex flex-col">
              <div className="relative h-[360px] sm:h-[400px] lg:h-[420px] rounded-lg overflow-hidden border border-[#E6E1D9] bg-[#191411]">
                {!imgError ? (
                  <img
                    src={assetUrl('/assets/aistudio/image_bedee89f.png')}
                    alt="Mặt tiền cửa hàng Xíu Bread & Coffee tại 179A Cách Mạng Tháng 8, Phường Bàn Cờ với tủ bánh mì tươi và quầy pha chế"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-[50%_28%]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#191411] text-[#F8F6F2]">
                    <p className="font-display text-2xl font-semibold mb-2">Xíu Bread &amp; Coffee</p>
                    <p className="text-sm text-[#D6CEC3]">179A CMT8, P. Bàn Cờ, Quận 3</p>
                  </div>
                )}
              </div>
              <figcaption className="pt-2.5 text-xs text-[#766E67] flex items-center justify-between gap-3">
                <span>Không gian lò nướng &amp; quầy pha chế cửa hàng trung tâm</span>
                <span className="font-medium text-[#57504A] shrink-0">Quận 3</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Full-width 4-column craft standards strip */}
        <div className="mt-8 pt-6 border-t border-[#E6E1D9] grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
          {HERO_HIGHLIGHTS.map((item) => (
            <div key={item.metric}>
              <p className="font-display tabular-nums text-[1.35rem] font-semibold text-[#1C1613] tracking-[-0.01em]">
                {item.metric}
              </p>
              <p className="text-[13px] text-[#57504A] mt-1 leading-snug">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
