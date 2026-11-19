import React from 'react';
import { MENU_CATEGORIES, MenuCategory } from '../data/storeData';

interface FooterProps {
  onSelectMenuCategory?: (category: MenuCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectMenuCategory }) => {
  const handleJumpCategory = (category: MenuCategory) => {
    onSelectMenuCategory?.(category);
  };

  return (
    <footer className="bg-[#191411] text-[#D4CCC2] border-t border-[#2E2621]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-9 border-b border-[#2E2621]">
          <div className="md:col-span-4">
            <p className="font-display text-xl font-semibold text-white mb-2.5">
              Xíu Bread &amp; Coffee
            </p>
            <p className="text-sm text-[#A89E94] leading-relaxed max-w-sm">
              Chuỗi cửa hàng bánh mì nóng giòn nướng tại lò mỗi ngày và cà phê rang xay
              nguyên chất phục vụ tại TP. Hồ Chí Minh.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2 text-sm">
            <p className="font-semibold text-white mb-2.5">Cửa hàng trung tâm</p>
            <p className="text-[#C8BFB5]">179A Cách Mạng Tháng 8, P. Bàn Cờ, Quận 3, TP.HCM</p>
            <p className="tabular-nums text-[#D8B88A]">
              Giờ mở cửa: 06:00 – 21:30 hằng ngày
            </p>
            <p className="tabular-nums text-[#C8BFB5]">Hotline: 028 3832 1790</p>
          </div>

          <div className="md:col-span-3 space-y-2 text-sm">
            <p className="font-semibold text-white mb-2.5">Danh mục thực đơn</p>
            <ul className="space-y-2">
              {MENU_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <li key={cat.id}>
                  <a
                    href="#thuc-don"
                    onClick={() => handleJumpCategory(cat.id)}
                    className="text-[#C8BFB5] hover:text-white transition-colors"
                  >
                    {cat.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2 text-sm">
            <p className="font-semibold text-white mb-2.5">Khám phá</p>
            <ul className="space-y-2">
              <li>
                <a href="#triet-ly" className="text-[#C8BFB5] hover:text-white transition-colors">
                  Triết lý thực phẩm sạch
                </a>
              </li>
              <li>
                <a href="#cua-hang" className="text-[#C8BFB5] hover:text-white transition-colors">
                  Hệ thống 5 chi nhánh
                </a>
              </li>
              <li>
                <a href="#nhuong-quyen" className="text-[#C8BFB5] hover:text-white transition-colors">
                  Hợp tác nhượng quyền
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#8E847A]">
          <p>© 2026 Xíu Bread &amp; Coffee. Bảo lưu mọi quyền.</p>
          <p>Tiêu chuẩn an toàn vệ sinh thực phẩm · TP. Hồ Chí Minh</p>
        </div>
      </div>
    </footer>
  );
};
