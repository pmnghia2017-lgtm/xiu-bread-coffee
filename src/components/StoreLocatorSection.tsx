import React, { useMemo, useState } from 'react';
import { Check, ChevronRight, Clock, Phone, Search } from 'lucide-react';
import { CHAIN_DISTRICTS, STORE_BRANCHES, StoreBranch } from '../data/storeData';
import { filterStores } from '../utils/storeLogic';

interface StoreLocatorSectionProps {
  activeBranchId: string;
  onSelectBranch: (branch: StoreBranch) => void;
  onOrderFromBranch: (branch: StoreBranch) => void;
}

const BRANCH_COORDS: Record<string, { x: number; y: number; shortLabel: string }> = {
  'phan-xich-long': { x: 158, y: 48, shortLabel: 'Phan Xích Long' },
  'd2-binh-thanh': { x: 324, y: 56, shortLabel: 'Nguyễn Gia Trí' },
  'cmt8-banco': { x: 108, y: 118, shortLabel: '179A CMT8' },
  'nguyen-dinh-chieu': { x: 192, y: 132, shortLabel: 'N. Đình Chiểu' },
  'hai-ba-trung': { x: 286, y: 134, shortLabel: 'Hai Bà Trưng' },
};

export const StoreLocatorSection: React.FC<StoreLocatorSectionProps> = ({
  activeBranchId,
  onSelectBranch,
  onOrderFromBranch,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBranches = useMemo(
    () => filterStores(STORE_BRANCHES, selectedDistrict, searchQuery),
    [selectedDistrict, searchQuery]
  );

  const selectedBranch =
    STORE_BRANCHES.find((b) => b.id === activeBranchId) || STORE_BRANCHES[0];

  return (
    <section
      id="cua-hang"
      className="scroll-mt-[76px] py-14 lg:py-20 bg-[#F8F6F2] border-b border-[#EAE5DD]"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Section heading + filter bar cleanly paired */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7">
          <div>
            <p className="text-[13px] font-medium text-[#9A4D10] mb-1.5">
              Hệ thống cửa hàng
            </p>
            <h2 className="font-display text-3xl sm:text-[2.1rem] font-semibold tracking-[-0.015em] text-[#1C1613]">
              Tìm quầy Xíu gần bạn nhất
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div
              role="tablist"
              aria-label="Lọc cửa hàng theo quận"
              className="flex flex-wrap items-center gap-1.5"
            >
              {CHAIN_DISTRICTS.map((district) => {
                const active = selectedDistrict === district;
                return (
                  <button
                    key={district}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedDistrict(district)}
                    className={`px-3 py-1.5 min-h-[38px] rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                      active
                        ? 'bg-[#1C1613] text-white border-[#1C1613]'
                        : 'bg-white text-[#57504A] border-[#E2DDD4] hover:border-[#1C1613] hover:text-[#1C1613]'
                    }`}
                  >
                    {district}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-56">
              <label htmlFor="store-search" className="sr-only">
                Tìm cửa hàng theo tên đường hoặc phường
              </label>
              <Search
                className="w-4 h-4 text-[#766E67] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="store-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên đường, phường..."
                className="w-full pl-9 pr-3 py-1.5 min-h-[38px] rounded-md border border-[#E2DDD4] bg-white text-sm text-[#1C1613] placeholder:text-[#9A9189] focus:outline-none focus:border-[#9A4D10]"
              />
            </div>
          </div>
        </div>

        {/* Symmetrical 6/6 equal-height split — zero dead space & zero duplicate copy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Clean unified interactive directory list (no repeated buttons or repeated phone/hours) */}
          <div className="lg:col-span-6 flex flex-col">
            {filteredBranches.length === 0 ? (
              <div className="flex-1 p-8 rounded-lg border border-[#E6E1D9] bg-white flex flex-col items-center justify-center text-center">
                <p className="text-base font-semibold text-[#1C1613] mb-1">
                  Chưa có cửa hàng tại khu vực vừa tìm
                </p>
                <p className="text-sm text-[#57504A] mb-4">
                  Hiện hệ thống phục vụ tại Quận 1, Quận 3, Phú Nhuận và Bình Thạnh.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDistrict('Tất cả');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-md bg-[#1C1613] text-white text-sm font-medium cursor-pointer"
                >
                  Hiện tất cả 5 chi nhánh
                </button>
              </div>
            ) : (
              <div className="flex-1 rounded-lg border border-[#E6E1D9] bg-white divide-y divide-[#EFECE6] overflow-hidden flex flex-col">
                {filteredBranches.map((branch) => {
                  const isSelected = branch.id === selectedBranch.id;
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => onSelectBranch(branch)}
                      aria-pressed={isSelected}
                      className={`group w-full flex-1 text-left px-5 py-4 transition-colors flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#9A4D10] ${
                        isSelected
                          ? 'bg-[#FBF8F3] border-l-[3px] border-l-[#9A4D10]'
                          : 'bg-white hover:bg-[#FAF8F5] border-l-[3px] border-l-transparent'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[#766E67] mb-0.5">
                          <span>{branch.district}</span>
                          {branch.isFlagship && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-medium text-[#275D3B]">
                                Cửa hàng trung tâm
                              </span>
                            </>
                          )}
                        </div>
                        <p
                          className={`text-[15px] font-semibold truncate transition-colors ${
                            isSelected
                              ? 'text-[#9A4D10]'
                              : 'text-[#1C1613] group-hover:text-[#9A4D10]'
                          }`}
                        >
                          {branch.name}
                        </p>
                        <p className="text-sm text-[#57504A] truncate mt-0.5">
                          {branch.address}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 text-xs font-medium">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#275D3B]/10 text-[#275D3B]">
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Đang chọn</span>
                          </span>
                        ) : (
                          <ChevronRight
                            className="w-4 h-4 text-[#A89E94] group-hover:text-[#1C1613] group-hover:translate-x-0.5 transition-all"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Interactive Schematic Map + Active Branch Operational Details */}
          <aside className="lg:col-span-6 rounded-lg border border-[#E6E1D9] bg-white p-5 sm:p-6 flex flex-col justify-between gap-5">
            {/* Clean district map */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#766E67] mb-2">
                <span className="font-medium text-[#1C1613]">Sơ đồ 5 chi nhánh TP.HCM</span>
                <span>Nhấp điểm để đổi quầy</span>
              </div>
              <svg
                viewBox="0 0 420 180"
                className="w-full h-auto rounded-md bg-[#F4F1EC] border border-[#EAE5DD]"
                role="img"
                aria-label="Sơ đồ 5 chi nhánh Xíu tại TP.HCM"
              >
                <path
                  d="M0 84 Q140 70 260 88 T420 76"
                  stroke="#DCE5E2"
                  strokeWidth="8"
                  fill="none"
                />
                <path
                  d="M352 0 Q370 92 336 180"
                  stroke="#DCE5E2"
                  strokeWidth="13"
                  fill="none"
                />

                <line x1="75" y1="20" x2="148" y2="168" stroke="#E4DFD6" strokeWidth="2" />
                <line x1="60" y1="138" x2="345" y2="124" stroke="#E4DFD6" strokeWidth="2" />
                <line x1="226" y1="24" x2="320" y2="164" stroke="#E4DFD6" strokeWidth="1.5" />

                <text x="18" y="34" fill="#8C847C" fontSize="10" fontFamily="Be Vietnam Pro, sans-serif">
                  Phú Nhuận
                </text>
                <text x="292" y="24" fill="#8C847C" fontSize="10" fontFamily="Be Vietnam Pro, sans-serif">
                  Bình Thạnh
                </text>
                <text x="22" y="162" fill="#8C847C" fontSize="10" fontFamily="Be Vietnam Pro, sans-serif">
                  Quận 3
                </text>
                <text x="292" y="166" fill="#8C847C" fontSize="10" fontFamily="Be Vietnam Pro, sans-serif">
                  Quận 1
                </text>

                {STORE_BRANCHES.map((branch) => {
                  const pt = BRANCH_COORDS[branch.id];
                  if (!pt) return null;
                  const active = branch.id === selectedBranch.id;
                  return (
                    <g
                      key={branch.id}
                      onClick={() => onSelectBranch(branch)}
                      className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-[#9A4D10]"
                      role="button"
                      tabIndex={0}
                      aria-label={`Chọn ${branch.name}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectBranch(branch);
                        }
                      }}
                    >
                      {active && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="13"
                          fill="#9A4D10"
                          fillOpacity="0.16"
                        />
                      )}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={active ? 7 : 5.5}
                        fill={active ? '#9A4D10' : branch.isFlagship ? '#275D3B' : '#1C1613'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 11}
                        textAnchor="middle"
                        fill={active ? '#9A4D10' : '#1C1613'}
                        fontSize={active ? '10.5' : '9.5'}
                        fontWeight={active ? '600' : '500'}
                        fontFamily="Be Vietnam Pro, sans-serif"
                      >
                        {pt.shortLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected branch unique operational info (not repeated in left rows) */}
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1C1613]">
                  {selectedBranch.name}
                </h3>
                <p className="text-sm text-[#57504A] mt-1 leading-relaxed">
                  {selectedBranch.note}
                </p>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-[#EFECE6] text-sm">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#9A4D10] mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-[#766E67]">Giờ mở cửa &amp; Ra lò</dt>
                    <dd className="font-medium text-[#1C1613] tabular-nums mt-0.5">
                      {selectedBranch.hours}
                    </dd>
                    <dd className="text-xs text-[#275D3B] mt-0.5 tabular-nums">
                      {selectedBranch.bakingSchedule}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#9A4D10] mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-[#766E67]">Hotline &amp; Dịch vụ</dt>
                    <dd className="font-medium text-[#1C1613] tabular-nums mt-0.5">
                      {selectedBranch.phone}
                    </dd>
                    <dd className="text-xs text-[#57504A] mt-0.5">
                      {selectedBranch.services.join(' · ')}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-[#766E67]">
                  Hỗ trợ đặt trước nhận tại quầy &amp; giao nóng trong 30 phút
                </p>

                <button
                  type="button"
                  onClick={() => onOrderFromBranch(selectedBranch)}
                  className="px-5 py-2.5 min-h-[42px] rounded-md bg-[#1C1613] text-white text-sm font-semibold hover:bg-[#9A4D10] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Đặt món tại quầy này
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
