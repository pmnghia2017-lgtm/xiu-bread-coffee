import test from 'node:test';
import assert from 'node:assert/strict';
import { MENU_ITEMS, STORE_BRANCHES } from '../data/storeData';
import {
  buildCartKey,
  calculateOrderSummary,
  computeCartItemUnitPrice,
  filterMenuItems,
  filterStores,
  formatVND,
  isValidVietnamesePhone,
  normalizeVietnamese,
  sortMenuItems,
  validateCheckoutForm,
  validateFranchiseForm,
} from './storeLogic';
import { assetUrl } from './assetUrl';

test('formatVND formats Vietnamese currency cleanly', () => {
  assert.equal(formatVND(38000), '38.000đ');
  assert.equal(formatVND(150000), '150.000đ');
});

test('normalizeVietnamese strips diacritics accurately', () => {
  assert.equal(normalizeVietnamese('Bánh mì Đặc biệt Xíu'), 'banh mi dac biet xiu');
  assert.equal(normalizeVietnamese('179A Cách Mạng Tháng 8, P. Bàn Cờ'), '179a cach mang thang 8, p. ban co');
});

test('filterMenuItems filters by category and Vietnamese query', () => {
  const coffeeItems = filterMenuItems(MENU_ITEMS, 'ca-phe', '');
  assert.equal(coffeeItems.length, 4);
  assert.ok(coffeeItems.every((i) => i.category === 'ca-phe'));

  const searchResult = filterMenuItems(MENU_ITEMS, 'all', 'pate');
  assert.ok(searchResult.some((i) => i.id === 'bm-dac-biet'));
});

test('sortMenuItems reorders items by featured, ascending price, descending price, and default', () => {
  const featuredFirst = sortMenuItems(MENU_ITEMS, 'featured');
  assert.equal(featuredFirst[0].featured, true);
  assert.equal(featuredFirst.slice(0, 3).every((i) => i.featured), true);

  const asc = sortMenuItems(MENU_ITEMS, 'price-asc');
  for (let i = 1; i < asc.length; i++) {
    assert.ok(asc[i].price >= asc[i - 1].price);
  }

  const desc = sortMenuItems(MENU_ITEMS, 'price-desc');
  for (let i = 1; i < desc.length; i++) {
    assert.ok(desc[i].price <= desc[i - 1].price);
  }

  const def = sortMenuItems(MENU_ITEMS, 'default');
  assert.deepEqual(
    def.map((i) => i.id),
    MENU_ITEMS.map((i) => i.id)
  );
});

test('filterStores finds flagship 179A CMT8 P. Bàn Cờ by district and diacritic-free query', () => {
  const q3Stores = filterStores(STORE_BRANCHES, 'Quận 3', '');
  assert.equal(q3Stores.length, 2);
  assert.equal(q3Stores[0].id, 'cmt8-banco');

  const queryMatch = filterStores(STORE_BRANCHES, 'Tất cả', 'ban co');
  assert.equal(queryMatch.length, 1);
  assert.equal(queryMatch[0].id, 'cmt8-banco');
});

test('computeCartItemUnitPrice adds selected option deltas', () => {
  const banhMi = MENU_ITEMS.find((i) => i.id === 'bm-dac-biet')!;
  assert.equal(computeCartItemUnitPrice(banhMi, []), 38000);
  assert.equal(computeCartItemUnitPrice(banhMi, ['extra-pate', 'extra-egg']), 53000);
});

test('buildCartKey produces identical keys regardless of option order', () => {
  const k1 = buildCartKey('bm-dac-biet', ['extra-egg', 'extra-pate'], 'Ít hành');
  const k2 = buildCartKey('bm-dac-biet', ['extra-pate', 'extra-egg'], ' ít hành ');
  assert.equal(k1, k2);
});

test('calculateOrderSummary applies Bread+Coffee pairing discount, promo code, and delivery threshold', () => {
  const banhMi = MENU_ITEMS.find((i) => i.id === 'bm-dac-biet')!;
  const coffee = MENU_ITEMS.find((i) => i.id === 'cp-sua-da')!;

  const summary = calculateOrderSummary(
    [
      { cartKey: '1', item: banhMi, selectedOptionIds: [], note: '', quantity: 1 },
      { cartKey: '2', item: coffee, selectedOptionIds: [], note: '', quantity: 1 },
    ],
    'delivery',
    ''
  );

  // 38.000 + 32.000 = 70.000, 8% pairing discount = 5.600 -> 64.400 + 15.000 delivery = 79.400
  assert.equal(summary.subtotal, 70000);
  assert.equal(summary.comboDiscount, 5600);
  assert.equal(summary.deliveryFee, 15000);
  assert.equal(summary.total, 79400);
  assert.equal(summary.totalItems, 2);

  // With promo XIU10 and >= 150k free delivery
  const largeOrder = calculateOrderSummary(
    [{ cartKey: '1', item: banhMi, selectedOptionIds: [], note: '', quantity: 5 }],
    'delivery',
    'xiu10'
  );
  // 190.000 - 19.000 = 171.000 >= 150.000 -> free delivery
  assert.equal(largeOrder.subtotal, 190000);
  assert.equal(largeOrder.comboDiscount, 19000);
  assert.equal(largeOrder.deliveryFee, 0);
  assert.equal(largeOrder.total, 171000);
});

test('phone and form validations catch invalid inputs and accept valid Vietnamese inputs', () => {
  assert.equal(isValidVietnamesePhone('0909 123 456'), true);
  assert.equal(isValidVietnamesePhone('02838321790'), true);
  assert.equal(isValidVietnamesePhone('12345'), false);

  const badCheckout = validateCheckoutForm({
    customerName: 'A',
    phone: '012',
    address: '',
    fulfillment: 'delivery',
    branchId: 'cmt8-banco',
  });
  assert.equal(badCheckout.valid, false);
  assert.ok(badCheckout.errors.customerName);
  assert.ok(badCheckout.errors.phone);
  assert.ok(badCheckout.errors.address);

  const goodPickup = validateCheckoutForm({
    customerName: 'Nguyễn Minh Tuấn',
    phone: '0908123456',
    address: '',
    fulfillment: 'pickup',
    branchId: 'cmt8-banco',
  });
  assert.equal(goodPickup.valid, true);

  const badFranchise = validateFranchiseForm({
    fullName: '',
    phone: 'abc',
    area: '',
    inquiryType: 'nhuong-quyen',
    notes: '',
  });
  assert.equal(badFranchise.valid, false);
  assert.ok(badFranchise.errors.fullName);
  assert.ok(badFranchise.errors.phone);
  assert.ok(badFranchise.errors.area);
});

test('MENU_ITEMS catalog has valid prices, unique IDs, and local asset paths', () => {
  const ids = new Set<string>();
  for (const item of MENU_ITEMS) {
    assert.ok(!ids.has(item.id), `Duplicate menu ID: ${item.id}`);
    ids.add(item.id);
    assert.ok(item.price > 0);
    if (item.imageSrc) {
      assert.ok(item.imageSrc.startsWith('/assets/aistudio/'));
      assert.ok(item.imageAlt && item.imageAlt.length > 10);
    }
  }
});

test('assetUrl resolves paths cleanly across inline demo, WordPress plugin, relative build, and root dev', () => {
  assert.equal(
    assetUrl('/assets/aistudio/banh.jpg', {
      inlineAssets: { '/assets/aistudio/banh.jpg': 'data:image/jpeg;base64,ABC' },
    }),
    'data:image/jpeg;base64,ABC'
  );
  assert.equal(
    assetUrl('/assets/aistudio/banh.jpg', {
      assetBase: 'https://xiubread.vn/wp-content/plugins/xiu-bread-coffee/app/',
    }),
    'https://xiubread.vn/wp-content/plugins/xiu-bread-coffee/app/assets/aistudio/banh.jpg'
  );
  assert.equal(
    assetUrl('/assets/aistudio/banh.jpg', undefined, './'),
    './assets/aistudio/banh.jpg'
  );
  assert.equal(
    assetUrl('/assets/aistudio/banh.jpg', undefined, '/'),
    '/assets/aistudio/banh.jpg'
  );
  assert.equal(
    assetUrl('https://cdn.example.com/photo.jpg', {
      assetBase: 'https://xiubread.vn/wp-content/plugins/xiu/',
    }),
    'https://cdn.example.com/photo.jpg'
  );
});
