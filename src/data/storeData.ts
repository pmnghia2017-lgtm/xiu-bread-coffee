export type MenuCategory = 'all' | 'banh-mi' | 'ca-phe' | 'banh-ngot' | 'combo';

export interface ItemOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'all'>;
  categoryLabel: string;
  price: number;
  kcal: string;
  prepNote: string;
  description: string;
  featured?: boolean;
  artworkKey:
    | 'banh-mi-dac-biet'
    | 'banh-mi-thit-nuong'
    | 'banh-mi-ga-xe'
    | 'banh-mi-op-la'
    | 'ca-phe-sua-da'
    | 'ca-phe-den-da'
    | 'bac-xiu'
    | 'cold-brew-cam-sa'
    | 'croissant-bo-phap'
    | 'pain-au-chocolat'
    | 'banh-bong-lan-trung-muoi'
    | 'combo-sang-nang-luong';
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  imageTone?: 'warm' | 'rich' | 'neutral';
  options: ItemOption[];
}

export interface StoreBranch {
  id: string;
  name: string;
  district: string;
  ward: string;
  address: string;
  hours: string;
  bakingSchedule: string;
  phone: string;
  services: string[];
  isFlagship?: boolean;
  note: string;
}

export const MENU_CATEGORIES: { id: MenuCategory; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'banh-mi', label: 'Bánh mì tươi' },
  { id: 'ca-phe', label: 'Cà phê thật' },
  { id: 'banh-ngot', label: 'Bánh ngọt tươi mới' },
  { id: 'combo', label: 'Combo sáng' },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'bm-dac-biet',
    name: 'Bánh mì Đặc biệt Xíu',
    category: 'banh-mi',
    categoryLabel: 'Bánh mì tươi',
    price: 38000,
    kcal: '490 kcal',
    prepNote: 'Nướng nóng mỗi 2 giờ',
    description:
      'Ổ bánh vỏ giòn rụm nướng tại lò, nhân pate gan tươi nhà làm, chả lụa, thịt nguội, bơ trứng gà và đồ chua giòn.',
    featured: true,
    artworkKey: 'banh-mi-dac-biet',
    imageSrc: '/assets/aistudio/B_nh_m__th_t_n__ng_293bf6bb.png',
    imageAlt: 'Bánh mì Đặc biệt Xíu vỏ giòn rụm cắt đôi đầy ắp thịt nguội, pate và rau ngò tươi',
    imageClassName: 'object-[50%_52%]',
    imageTone: 'warm',
    options: [
      { id: 'extra-pate', label: 'Thêm pate gan tươi', priceDelta: 8000 },
      { id: 'extra-egg', label: 'Thêm trứng ốp la gà ta', priceDelta: 7000 },
      { id: 'no-chili', label: 'Không ớt · Ít đồ chua', priceDelta: 0 },
    ],
  },
  {
    id: 'bm-thit-nuong',
    name: 'Bánh mì Thịt nướng Sả ớt',
    category: 'banh-mi',
    categoryLabel: 'Bánh mì tươi',
    price: 36000,
    kcal: '460 kcal',
    prepNote: 'Thịt sạch truy xuất nguồn gốc',
    description:
      'Thịt nạc vai ướp sả mật ong nướng than thơm lừng, ăn kèm dưa leo, ngò rí và xốt tương đậu đặc chế.',
    artworkKey: 'banh-mi-thit-nuong',
    imageSrc: '/assets/aistudio/Banh_mi_sandwich_2aad7d36.jpg',
    imageAlt: 'Bánh mì Thịt nướng Sả ớt kẹp đồ chua cà rốt củ cải giòn và rau xanh tươi',
    imageClassName: 'object-[50%_54%]',
    imageTone: 'warm',
    options: [
      { id: 'extra-meat', label: 'Thêm phần thịt nướng', priceDelta: 12000 },
      { id: 'extra-pate', label: 'Thêm pate gan tươi', priceDelta: 8000 },
      { id: 'no-chili', label: 'Không ớt', priceDelta: 0 },
    ],
  },
  {
    id: 'bm-ga-xe',
    name: 'Bánh mì Gà xé Xốt bơ tỏi',
    category: 'banh-mi',
    categoryLabel: 'Bánh mì tươi',
    price: 34000,
    kcal: '410 kcal',
    prepNote: 'Thanh đạm · Giàu đạm',
    description:
      'Ức gà ta luộc xé sợi mềm ẩm, quyện xốt bơ tỏi nhẹ thanh, chà bông gà và rau thơm vườn sạch.',
    artworkKey: 'banh-mi-ga-xe',
    imageSrc: '/assets/aistudio/Vietnamese_B_nh_m___Banh_Mi__Sandwich_cd0a3fbe.jpg',
    imageAlt: 'Ổ bánh mì vàng giòn thơm nhân gà xé, rau ngò rí và đồ chua phục vụ trong giỏ mây',
    imageClassName: 'object-[22%_60%] origin-[22%_60%] scale-[1.34]',
    imageTone: 'warm',
    options: [
      { id: 'extra-chicken', label: 'Thêm gà xé & chà bông', priceDelta: 10000 },
      { id: 'extra-cheese', label: 'Thêm phô mai lát', priceDelta: 7000 },
    ],
  },
  {
    id: 'bm-op-la',
    name: 'Bánh mì Ốp la Hai trứng',
    category: 'banh-mi',
    categoryLabel: 'Bánh mì tươi',
    price: 29000,
    kcal: '380 kcal',
    prepNote: 'Phục vụ nóng tại quầy',
    description:
      'Hai trứng gà ta lòng đào chiên bơ lạt, rắc tiêu đen Phú Quốc, pate truyền thống và nước tương ớt tỏi.',
    artworkKey: 'banh-mi-op-la',
    options: [
      { id: 'extra-pate', label: 'Thêm pate gan tươi', priceDelta: 8000 },
      { id: 'extra-cha', label: 'Thêm 2 lát chả lụa', priceDelta: 8000 },
    ],
  },
  {
    id: 'cp-sua-da',
    name: 'Cà phê Sữa đá Phin',
    category: 'ca-phe',
    categoryLabel: 'Cà phê thật',
    price: 32000,
    kcal: '165 kcal',
    prepNote: 'Không hương liệu · Không độn bắp',
    description:
      '100% hạt Robusta Cầu Đất & Đắk Lắk rang mộc vừa độ, pha phin chậm rãi hòa cùng sữa đặc sánh mịn.',
    featured: true,
    artworkKey: 'ca-phe-sua-da',
    imageSrc: '/assets/aistudio/pexels-roman-odintsov-4869290_65927868.jpg',
    imageAlt: 'Ly Cà phê Sữa đá hòa quyện lớp sữa đặc béo ngậy và cà phê đậm đà trong ly thủy tinh',
    imageClassName: 'object-[64%_46%]',
    imageTone: 'warm',
    options: [
      { id: 'size-l', label: 'Cỡ lớn (L · +100ml)', priceDelta: 8000 },
      { id: 'less-milk', label: 'Ít sữa · Đậm vị cà phê', priceDelta: 0 },
      { id: 'extra-shot', label: 'Thêm 1 shot phin đậm', priceDelta: 10000 },
    ],
  },
  {
    id: 'cp-den-da',
    name: 'Cà phê Đen đá Nguyên chất',
    category: 'ca-phe',
    categoryLabel: 'Cà phê thật',
    price: 28000,
    kcal: '15 kcal',
    prepNote: 'Rang mộc 100%',
    description:
      'Vị đắng thanh, hậu ngọt sâu từ cà phê rang mộc nguyên hạt xay mới mỗi sáng trước giờ mở cửa.',
    artworkKey: 'ca-phe-den-da',
    imageSrc: '/assets/aistudio/pexels-mizunokozuki-13735958_967675d0.jpg',
    imageAlt: 'Rót cà phê đen rang mộc nguyên chất trực tiếp vào ly đá viên trong suốt',
    imageClassName: 'object-[50%_46%] origin-[50%_46%] scale-[1.06]',
    imageTone: 'warm',
    options: [
      { id: 'size-l', label: 'Cỡ lớn (L)', priceDelta: 8000 },
      { id: 'no-sugar', label: 'Không đường', priceDelta: 0 },
    ],
  },
  {
    id: 'cp-bac-xiu',
    name: 'Bạc xỉu Kem sữa tươi',
    category: 'ca-phe',
    categoryLabel: 'Cà phê thật',
    price: 36000,
    kcal: '210 kcal',
    prepNote: 'Sữa tươi thanh trùng mỗi ngày',
    description:
      'Sữa tươi thanh trùng ấm hòa quyện lớp sữa đặc và một shot phin đậm hương cacao, dịu nhẹ dễ uống.',
    artworkKey: 'bac-xiu',
    imageSrc: '/assets/aistudio/pexels-mackling-2161618291-38519299_14f0a473.jpg',
    imageAlt: 'Ly Bạc xỉu Kem sữa tươi hai tầng rõ rệt với nền sữa tươi trắng mịn và cà phê thơm dịu phía trên',
    imageClassName: 'object-[50%_56%]',
    imageTone: 'warm',
    options: [
      { id: 'size-l', label: 'Cỡ lớn (L)', priceDelta: 8000 },
      { id: 'oat-milk', label: 'Đổi sang sữa yến mạch', priceDelta: 10000 },
    ],
  },
  {
    id: 'cp-cold-brew',
    name: 'Cold Brew Cam vàng Sả tươi',
    category: 'ca-phe',
    categoryLabel: 'Cà phê thật',
    price: 42000,
    kcal: '70 kcal',
    prepNote: 'Ủ lạnh 18 giờ',
    description:
      'Arabica Cầu Đất ủ lạnh 18 giờ cho vị chua thanh trái cây, kết hợp lát cam vàng và sả đập dập giải nhiệt.',
    artworkKey: 'cold-brew-cam-sa',
    imageSrc: '/assets/aistudio/pexels-vitalyagorbachev-12540647_71277c29.jpg',
    imageAlt: 'Ly Cold Brew Cam vàng mát lạnh trang trí vỏ cam tươi hòa quyện hai tầng nâu cam rực rỡ',
    imageClassName: 'object-[50%_18%]',
    imageTone: 'neutral',
    options: [
      { id: 'size-l', label: 'Cỡ lớn (L)', priceDelta: 10000 },
      { id: 'less-sweet', label: 'Ít ngọt tự nhiên', priceDelta: 0 },
    ],
  },
  {
    id: 'bn-croissant',
    name: 'Croissant Bơ lạt Pháp',
    category: 'banh-ngot',
    categoryLabel: 'Bánh ngọt tươi mới',
    price: 35000,
    kcal: '310 kcal',
    prepNote: 'Ra lò lúc 06:30 & 14:00',
    description:
      '27 lớp bột ngàn lớp cán thủ công với bơ động vật nhập khẩu, vỏ vàng ươm giòn tan và ruột xốp tổ ong.',
    featured: true,
    artworkKey: 'croissant-bo-phap',
    imageSrc: '/assets/aistudio/pexels-marceloverfe-16026716_772cc085.jpg',
    imageAlt: 'Bánh Croissant bơ lạt Pháp nướng vàng ruộm ngàn lớp đặt trên thớt gỗ cùng giỏ bánh nóng',
    imageClassName: 'object-[50%_58%]',
    imageTone: 'warm',
    options: [
      { id: 'warm-up', label: 'Hâm giòn trước khi giao', priceDelta: 0 },
      { id: 'salted-egg-dip', label: 'Kèm xốt trứng muối nhà làm', priceDelta: 12000 },
    ],
  },
  {
    id: 'bn-pain-chocolat',
    name: 'Pain au Chocolat',
    category: 'banh-ngot',
    categoryLabel: 'Bánh ngọt tươi mới',
    price: 39000,
    kcal: '345 kcal',
    prepNote: 'Sô-cô-la đen 70%',
    description:
      'Bánh sừng bò nhân hai thanh sô-cô-la đen 70% cacao nguyên chất, cân bằng vị béo bơ và đắng nhẹ.',
    artworkKey: 'pain-au-chocolat',
    imageSrc: '/assets/aistudio/Pain_au_Chocolat_5bd2611f.jpg',
    imageAlt: 'Pain au Chocolat nướng vàng bóng với lớp vỏ ngàn lớp xếp ngay ngắn trên khay',
    imageClassName: 'object-[42%_68%] origin-[42%_68%] scale-[1.45]',
    imageTone: 'warm',
    options: [{ id: 'warm-up', label: 'Hâm ấm tan chảy nhân', priceDelta: 0 }],
  },
  {
    id: 'bn-bong-lan',
    name: 'Bông lan Trứng muối Chà bông',
    category: 'banh-ngot',
    categoryLabel: 'Bánh ngọt tươi mới',
    price: 45000,
    kcal: '420 kcal',
    prepNote: 'Không chất bảo quản',
    description:
      'Cốt bánh bông lan mềm mịn ít ngọt, phủ xốt dầu trứng phô mai béo mặn hài hòa, 4 trứng muối và chà bông.',
    artworkKey: 'banh-bong-lan-trung-muoi',
    imageSrc: '/assets/aistudio/B_nh_b_ng_lan_tr_ng_mu_i_t_i_nh__Mheo_ng_y_19_th_ng_01_n_m_2020__1__4e28ac68.jpg',
    imageAlt: 'Miếng bánh Bông lan Trứng muối phủ xốt dầu trứng óng ả, lòng đỏ trứng muối và chà bông sợi',
    imageClassName: 'object-[52%_36%]',
    imageTone: 'rich',
    options: [{ id: 'extra-sauce', label: 'Thêm hũ xốt dầu trứng riêng', priceDelta: 10000 }],
  },
  {
    id: 'cb-sang-xíu',
    name: 'Combo Sáng Xíu (Bánh mì + Cà phê)',
    category: 'combo',
    categoryLabel: 'Combo sáng',
    price: 62000,
    kcal: '655 kcal',
    prepNote: 'Tiết kiệm 8.000đ mỗi sáng',
    description:
      '1 Bánh mì Đặc biệt Xíu nóng giòn kết hợp 1 Cà phê Sữa đá Phin (hoặc Đen đá) cho bữa sáng trọn năng lượng.',
    featured: true,
    artworkKey: 'combo-sang-nang-luong',
    imageSrc: '/assets/aistudio/2023-12-10_Coffee_and_b_nh_m__in_Saigon_247c65b8.jpg',
    imageAlt: 'Combo sáng Sài Gòn gồm bánh mì đặc biệt cắt đôi đầy nhân và ly cà phê sữa đá',
    imageClassName: 'object-[48%_58%] origin-[48%_58%] scale-[1.22]',
    imageTone: 'warm',
    options: [
      { id: 'switch-black', label: 'Đổi sang Cà phê Đen đá', priceDelta: 0 },
      { id: 'size-l', label: 'Nâng cỡ ly Cà phê (L)', priceDelta: 8000 },
      { id: 'extra-pate', label: 'Thêm pate gan tươi', priceDelta: 8000 },
    ],
  },
];

export const CHAIN_DISTRICTS = ['Tất cả', 'Quận 3', 'Quận 1', 'Phú Nhuận', 'Bình Thạnh'];

export const STORE_BRANCHES: StoreBranch[] = [
  {
    id: 'cmt8-banco',
    name: 'Xíu Flagship · 179A CMT8',
    district: 'Quận 3',
    ward: 'Phường Bàn Cờ',
    address: '179A Cách Mạng Tháng 8, Phường Bàn Cờ, Quận 3, TP.HCM',
    hours: '06:00 – 21:30',
    bakingSchedule: '05:30 · 08:30 · 11:30 · 15:30',
    phone: '028 3832 1790',
    services: ['Ngồi tại quán (28 chỗ)', 'Mang đi nhanh', 'Giao tận nơi'],
    isFlagship: true,
    note: 'Cửa hàng trung tâm theo nhận diện mẫu với lò nướng bánh tại chỗ và quầy pha phin thủ công.',
  },
  {
    id: 'nguyen-dinh-chieu',
    name: 'Xíu · Nguyễn Đình Chiểu',
    district: 'Quận 3',
    ward: 'Phường 4',
    address: '312 Nguyễn Đình Chiểu, Phường 4, Quận 3, TP.HCM',
    hours: '06:00 – 21:00',
    bakingSchedule: '05:45 · 09:00 · 12:00 · 16:00',
    phone: '028 3832 4512',
    services: ['Mang đi nhanh', 'Ngồi tại quán (14 chỗ)', 'Giao tận nơi'],
    note: 'Phục vụ nhanh cho khu vực văn phòng & trường học trung tâm Quận 3.',
  },
  {
    id: 'hai-ba-trung',
    name: 'Xíu · Hai Bà Trưng',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    address: '94 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM',
    hours: '06:30 – 22:00',
    bakingSchedule: '06:00 · 09:30 · 13:30 · 16:30',
    phone: '028 3824 9104',
    services: ['Ngồi tại quán (36 chỗ)', 'Mang đi nhanh', 'Giao tận nơi'],
    note: 'Không gian 2 tầng dành cho gặp gỡ đối tác, làm việc và thưởng thức bánh ngọt chiều.',
  },
  {
    id: 'phan-xich-long',
    name: 'Xíu · Phan Xích Long',
    district: 'Phú Nhuận',
    ward: 'Phường 7',
    address: '158 Phan Xích Long, Phường 7, Quận Phú Nhuận, TP.HCM',
    hours: '06:00 – 21:30',
    bakingSchedule: '05:30 · 08:30 · 11:30 · 15:30',
    phone: '028 3517 8820',
    services: ['Mang đi nhanh', 'Ngồi tại quán (20 chỗ)', 'Giao tận nơi'],
    note: 'Tủ bánh nóng liên tục cả ngày, thuận tiện dừng xe ghé mua buổi sáng.',
  },
  {
    id: 'd2-binh-thanh',
    name: 'Xíu · Nguyễn Gia Trí',
    district: 'Bình Thạnh',
    ward: 'Phường 25',
    address: '62 Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, TP.HCM',
    hours: '06:00 – 22:00',
    bakingSchedule: '05:45 · 09:00 · 12:30 · 16:00',
    phone: '028 3512 6640',
    services: ['Ngồi tại quán (32 chỗ)', 'Mang đi nhanh', 'Giao tận nơi'],
    note: 'Điểm hẹn quen thuộc khu vực sinh viên và cư dân Bình Thạnh với bàn dài có ổ cắm.',
  },
];
