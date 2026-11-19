# Xíu Bread & Coffee

Website cửa hàng **Xíu Bread & Coffee** — Bánh mì tươi · Cà phê thật · Thực phẩm sạch (Flagship 179A Cách Mạng Tháng 8, Phường Bàn Cờ, Quận 3, TP.HCM & hệ thống 5 chi nhánh).

## Công nghệ sử dụng
- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4**
- Cấu hình sẵn cho **Vercel** (`vercel.json`) và **Netlify / Cloudflare Pages** (`netlify.toml`)

## Chạy trên máy tính (Local)
```bash
npm install
npm run dev
```
Mở trình duyệt tại `http://localhost:3000`.

## Build sản phẩm
```bash
npm run build
```
Thư mục xuất bản: `dist/`

## Đưa lên Vercel từ GitHub (Miễn phí, không gắn logo)
1. Đẩy toàn bộ thư mục mã nguồn này lên một kho **GitHub** (nhánh `main`).
2. Vào [vercel.com](https://vercel.com) → **Add New → Project** → chọn kho GitHub vừa tạo.
3. Giữ nguyên cấu hình mặc định (Vercel tự nhận `Vite`, `npm run build`, thư mục `dist`) và bấm **Deploy**.
4. Mỗi lần cập nhật mới chỉ cần `git push` lên nhánh `main`, Vercel sẽ tự động build và xuất bản bản mới trong ~30 giây.
