# Couple Habit Tracker 💜

Ứng dụng PWA theo dõi thói quen hằng ngày **cho hai người** (một cặp đôi). Mỗi người có checklist thói quen riêng; ai không hoàn thành checklist trong ngày sẽ bị **phạt tiền**. Dữ liệu được lưu trên **Google Sheets** để cả hai cùng đồng bộ.

Giao diện tiếng Việt, thiết kế mobile-first, cài được như app trên điện thoại.

## Tính năng

- **Hôm nay** — checklist thói quen của cả hai, tiến độ đôi, trạng thái đồng bộ realtime.
- **Lịch sử 7 ngày** — theo dõi mức hoàn thành từng ngày của mỗi người.
- **Thói quen** — thêm / đổi tên / sắp xếp / tắt thói quen của bạn.
- **Tiền phạt** — tự tính nợ (20.000đ mỗi ngày bỏ lỡ checklist) và ghi nhận khi đã đóng phạt.
- **PWA** — cài lên màn hình chính (Android/iOS), có service worker + manifest + icon.
- **Nhận diện thiết bị** — mỗi máy tự nhớ là "Người ấy" hay "Tôi" (lưu ở localStorage).

## Công nghệ

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack) + React 19 + TypeScript
- Google Sheets làm data layer (qua `googleapis` + service account)
- Vitest + Testing Library cho unit/component tests
- CSS thuần (design system tokens, dark mode, Google Sans Flex)

## Bắt đầu

```bash
npm install
cp .env.example .env.local   # rồi điền 3 biến bên dưới
npm run dev                  # http://localhost:3000
```

### Cấu hình Google Sheets

App cần một Google Sheet + một service account có quyền ghi. Xem cấu trúc tab đầy đủ trong [`docs/google-sheets-schema.md`](docs/google-sheets-schema.md).

1. Tạo project ở [Google Cloud Console](https://console.cloud.google.com), bật **Google Sheets API**.
2. Tạo **Service Account** → thêm **Key (JSON)** → tải file về.
3. Tạo một Google Sheet, rồi **Share** cho email service account (`...@....iam.gserviceaccount.com`) với quyền **Editor**.
4. Tạo 6 tab đúng tên và dòng tiêu đề: `people`, `habits`, `daily_entries`, `daily_closures`, `penalties`, `payments` (seed sẵn 2 dòng trong tab `people`).
5. Điền `.env.local`:

```env
GOOGLE_SHEETS_SPREADSHEET_ID=<ID trong URL của sheet>
GOOGLE_SERVICE_ACCOUNT_EMAIL=<client_email trong file JSON>
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Khi cấu hình đúng, pill góc trên phải màn hình "Hôm nay" sẽ hiển thị **"Đã đồng bộ"**. Nếu chưa cấu hình, app chạy với **dữ liệu demo** trong bộ nhớ và báo "Chưa đồng bộ".

> `.env.local` đã nằm trong `.gitignore` — credentials sẽ **không** bị commit lên git.

## Cài như app (PWA)

Cần phục vụ qua **HTTPS** (Chrome/Safari không cho cài qua `http://` trừ `localhost`). Cách nhanh nhất là deploy lên [Vercel](https://vercel.com) (tự có HTTPS), sau đó:

- **Android/Chrome**: menu → *Cài đặt ứng dụng*.
- **iOS/Safari**: Share → *Thêm vào Màn hình chính*.

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy dev server (Turbopack) |
| `npm run build` | Build production |
| `npm start` | Chạy bản production |
| `npm test` | Chạy toàn bộ test (Vitest) |
| `npm run test:watch` | Test ở chế độ watch |

## Cấu trúc thư mục

```
src/
├── app/            # Next.js App Router (layout, page, manifest, api, css)
├── components/     # BottomNav, IdentitySetup
├── screens/        # Today / History / Habits / Money
├── services/       # habitService (client → API)
├── server/         # sheetsRepository (server → Google Sheets)
├── lib/            # date, identity, habitLogic, demoData, googleSheetsClient
└── types/          # domain types
docs/               # schema Google Sheets, spec, plan
public/             # service worker, icon PWA
```

## Reset dữ liệu

- **Danh tính thiết bị** (Người ấy / Tôi): xoá key `couple-habit.identity` trong localStorage của trình duyệt.
- **Dữ liệu app**: xoá các dòng dữ liệu trong Google Sheet (giữ dòng tiêu đề + 2 dòng `people`).
