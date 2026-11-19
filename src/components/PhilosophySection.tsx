import React, { useState } from 'react';
import { ArtisanImage } from './ArtisanImage';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Nướng mới mỗi 2 giờ tại quầy',
    body: 'Bột mì ủ lạnh qua đêm, nướng đối lưu ở 215°C theo 4 khung giờ trong ngày để ổ bánh luôn giòn vỏ, mềm ruột và không bán qua ngày.',
    metric: '1.800+ ổ/ngày',
  },
  {
    number: '02',
    title: 'Cà phê rang mộc nguyên hạt',
    body: 'Robusta Đắk Lắk và Arabica Cầu Đất rang vừa độ, không hương liệu hay độn bắp; xay mới và chiết xuất chuẩn định lượng từng ly.',
    metric: 'Ủ lạnh 18 giờ',
  },
  {
    number: '03',
    title: 'Nguyên liệu sạch truy xuất rõ',
    body: 'Pate gan tươi chế biến mỗi sáng tại bếp trung tâm đạt chuẩn VSATTP, thịt và rau củ từ nông trại VietGAP, không chất bảo quản.',
    metric: '100% VietGAP',
  },
];

const BAKING_BATCHES = [
  {
    time: '05:30',
    label: 'Mẻ sáng sớm',
    items: 'Bánh mì vỏ giòn truyền thống · Pate gan tươi · Phin cà phê đầu ngày',
    note: 'Sẵn sàng cho giờ đi làm và học sinh từ 06:00',
  },
  {
    time: '08:30',
    label: 'Mẻ giữa buổi',
    items: 'Croissant bơ lạt Pháp · Pain au Chocolat · Thịt nướng sả ớt',
    note: 'Bổ sung bánh ngọt nóng cho khung giờ văn phòng',
  },
  {
    time: '11:30',
    label: 'Mẻ trưa',
    items: 'Bánh mì Đặc biệt · Gà xé bơ tỏi · Cold Brew cam vàng sả tươi',
    note: 'Phục vụ bữa trưa nhanh gọn & đơn giao nhóm',
  },
  {
    time: '15:30',
    label: 'Mẻ xế chiều',
    items: 'Bánh mì giòn mới · Bông lan trứng muối · Bánh ngọt ăn xế',
    note: 'Đáp ứng giờ tan tầm và đơn tiệc Teabreak chiều',
  },
];

export const PhilosophySection: React.FC = () => {
  const [activeBatchIdx, setActiveBatchIdx] = useState(0);
  const currentBatch = BAKING_BATCHES[activeBatchIdx];

  return (
    <section
      id="triet-ly"
      className="scroll-mt-[76px] py-14 lg:py-20 bg-[#191411] text-[#F5EFE6] border-y border-[#2E2621]"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 space-y-11">
        {/* Band 1: Balanced editorial intro + 3-frame culinary photography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <p className="text-[13px] font-medium text-[#D8B88A] mb-2">
              Triết lý vận hành
            </p>
            <h2 className="font-display text-3xl sm:text-[2.1rem] font-semibold leading-[1.2] tracking-[-0.015em] text-white mb-4">
              Làm mới mỗi ngày, minh bạch từng nguyên liệu
            </h2>
            <p className="text-[15px] text-[#C8BFB5] leading-[1.7]">
              Từ cửa hàng đầu tiên tại 179A Cách Mạng Tháng 8, Xíu đặt chất lượng nguyên liệu
              lên trước tốc độ mở rộng. Mọi chi nhánh đều vận hành chung một quy trình kiểm định
              bếp lúc 04:30 và nướng nóng trực tiếp tại quầy.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="group aspect-[4/3] sm:aspect-[4/3.6] rounded-lg overflow-hidden border border-[#332B26]">
                <ArtisanImage
                  src="/assets/aistudio/pexels-sevgi-2147957701-30510114_2d105ead.jpg"
                  alt="Tủ bánh mì vàng giòn mới ra lò xếp ngay ngắn dưới ánh đèn ấm tại quầy Xíu"
                  imgClassName="object-[64%_78%] origin-[64%_78%] scale-[1.34]"
                  tone="warm"
                  caption="Lò nướng trực tiếp tại quầy"
                />
              </div>
              <div className="group aspect-[4/3] sm:aspect-[4/3.6] rounded-lg overflow-hidden border border-[#332B26]">
                <ArtisanImage
                  src="/assets/aistudio/Vietnamese_iced_coffee_-_Jan_31__2018_6e1fe1d1.jpg"
                  alt="Phin nhôm truyền thống đang nhỏ từng giọt cà phê nguyên chất trên mặt bàn gỗ"
                  imgClassName="object-[50%_46%]"
                  tone="warm"
                  caption="Chiết xuất phin chậm rãi"
                />
              </div>
              <div className="group aspect-[4/3] sm:aspect-[4/3.6] rounded-lg overflow-hidden border border-[#332B26]">
                <ArtisanImage
                  src="/assets/aistudio/pexels-felipe-vieira-651921657-20066398_bd232780.jpg"
                  alt="Tách cà phê rang mộc lớp crema dày đặt giữa hạt cà phê nguyên chất trên nền gỗ"
                  imgClassName="object-[50%_50%]"
                  tone="warm"
                  caption="Hạt rang mộc Cầu Đất"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Band 2: Equal-height 3-column horizontal pillars — zero uneven overhang */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#302823]">
          {PRINCIPLES.map((item) => (
            <div key={item.number} className="flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-baseline justify-between gap-3 mb-2.5">
                  <span className="tabular-nums text-xs font-semibold text-[#D8B88A]">
                    {item.number}
                  </span>
                  <span className="tabular-nums text-xs font-medium text-[#A89E94]">
                    {item.metric}
                  </span>
                </div>
                <h3 className="text-[17px] font-semibold text-white leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#C8BFB5] leading-[1.65]">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Band 3: Full-width compact Baking Schedule bar — clean horizontal balance */}
        <div className="rounded-lg border border-[#302823] bg-[#221C18] px-5 py-5 sm:px-6 sm:py-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="shrink-0">
              <p className="text-xs font-medium text-[#D8B88A] mb-2.5">
                Lịch ra lò bánh nóng hằng ngày
              </p>
              <div
                role="tablist"
                aria-label="Chọn khung giờ ra lò"
                className="inline-flex items-center gap-1.5"
              >
                {BAKING_BATCHES.map((batch, idx) => {
                  const selected = idx === activeBatchIdx;
                  return (
                    <button
                      key={batch.time}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveBatchIdx(idx)}
                      className={`py-2 px-3.5 rounded-md tabular-nums text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8B88A] ${
                        selected
                          ? 'bg-[#9A4D10] text-white'
                          : 'bg-[#191411] text-[#C8BFB5] hover:bg-[#2E2621] hover:text-white'
                      }`}
                    >
                      {batch.time}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:border-l lg:border-[#332B26] lg:pl-7 flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <p className="text-[15px] font-semibold text-white">
                  {currentBatch.label}{' '}
                  <span className="tabular-nums font-normal text-[#D8B88A]">
                    ({currentBatch.time})
                  </span>
                </p>
                <p className="text-xs text-[#A89E94]">{currentBatch.note}</p>
              </div>
              <p className="text-sm text-[#D4CCC2] leading-relaxed">{currentBatch.items}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
