import { useEffect, useState } from 'react';
import { MENU_ITEMS, MenuCategory, MenuItem, STORE_BRANCHES, StoreBranch } from './data/storeData';
import { CartItem, buildCartKey } from './utils/storeLogic';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { PhilosophySection } from './components/PhilosophySection';
import { StoreLocatorSection } from './components/StoreLocatorSection';
import { FranchiseSection } from './components/FranchiseSection';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

const STORAGE_CART_KEY = 'xiu_cart_v1';
const STORAGE_BRANCH_KEY = 'xiu_branch_v1';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore malformed storage
    }
    return [];
  });

  const [activeBranchId, setActiveBranchId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BRANCH_KEY);
      if (saved && STORE_BRANCHES.some((b) => b.id === saved)) return saved;
    } catch {
      // Ignore
    }
    return STORE_BRANCHES[0].id;
  });

  const [selectedMenuCategory, setSelectedMenuCategory] = useState<MenuCategory>('all');
  const [inspectingItem, setInspectingItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota issues
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BRANCH_KEY, activeBranchId);
    } catch {
      // Ignore
    }
  }, [activeBranchId]);

  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = window.setTimeout(() => setFeedbackMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [feedbackMessage]);

  const activeBranch =
    STORE_BRANCHES.find((b) => b.id === activeBranchId) || STORE_BRANCHES[0];

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (
    item: MenuItem,
    selectedOptionIds: string[] = [],
    note = '',
    quantity = 1
  ) => {
    const cartKey = buildCartKey(item.id, selectedOptionIds, note);
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.cartKey === cartKey);
      if (existing) {
        return prev.map((entry) =>
          entry.cartKey === cartKey
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [...prev, { cartKey, item, selectedOptionIds, note, quantity }];
    });
    setFeedbackMessage(`Đã thêm ${quantity} × ${item.name} vào giỏ hàng`);
  };

  const handleUpdateQuantity = (cartKey: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((entry) =>
          entry.cartKey === cartKey
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleRemoveItem = (cartKey: string) => {
    setCartItems((prev) => prev.filter((entry) => entry.cartKey !== cartKey));
  };

  const handleQuickOrderCombo = () => {
    const combo = MENU_ITEMS.find((i) => i.id === 'cb-sang-xíu');
    if (combo) {
      addToCart(combo, [], '', 1);
      setCartOpen(true);
    }
  };

  const handleSelectBranch = (branch: StoreBranch) => {
    setActiveBranchId(branch.id);
    setFeedbackMessage(`Đã chọn chi nhánh ${branch.name}`);
  };

  const handleOrderFromBranch = (branch: StoreBranch) => {
    setActiveBranchId(branch.id);
    const menuEl = document.getElementById('thuc-don');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
    setFeedbackMessage(`Đang xem thực đơn phục vụ tại ${branch.name}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1C1613]">
      <Header cartCount={totalCount} onOpenCart={() => setCartOpen(true)} />

      <main className="flex-1">
        <HeroSection
          activeBranch={activeBranch}
          onQuickOrderCombo={handleQuickOrderCombo}
        />

        <MenuSection
          selectedCategory={selectedMenuCategory}
          onSelectCategory={setSelectedMenuCategory}
          onQuickAdd={(item) => addToCart(item, [], '', 1)}
          onInspectItem={(item) => setInspectingItem(item)}
        />

        <PhilosophySection />

        <StoreLocatorSection
          activeBranchId={activeBranchId}
          onSelectBranch={handleSelectBranch}
          onOrderFromBranch={handleOrderFromBranch}
        />

        <FranchiseSection />
      </main>

      <Footer onSelectMenuCategory={setSelectedMenuCategory} />

      <ProductModal
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        onAddToCart={addToCart}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        activeBranchId={activeBranchId}
        onChangeBranchId={setActiveBranchId}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onQuickAddItem={(item) => addToCart(item, [], '', 1)}
        onClearCart={() => setCartItems([])}
      />

      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-5 sm:right-5 z-40 sm:max-w-sm rounded-md bg-[#191411] text-[#F5EFE6] px-4 py-3 shadow-lg border border-[#332B26] flex items-center justify-between gap-4 text-sm"
        >
          <span>{feedbackMessage}</span>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="text-[#D8B88A] font-semibold hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Xem giỏ
          </button>
        </div>
      )}
    </div>
  );
}
