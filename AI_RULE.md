# AI_RULES.md

# AI Coding Rules

## Project
This project is **Smart Digital Store System**: a responsive digital store for **one small shop**.  
First demo: **skincare shop**.

It is NOT:
- Marketplace
- Shopee clone
- Multi-vendor system
- Multi-branch POS
- Accounting system

Main goal: build a clean, Apple-like, mobile-first store where customers can browse products, get recommendations, order, receive receipt, track delivery, and shop owner can manage products, orders, stock, Telegram notifications, and reports.

---

## Tech Stack
Use this stack unless user says otherwise:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Motion / Framer Motion
- Supabase
- Supabase Auth
- Supabase Storage
- OpenRouter or OpenAI API through backend only
- Telegram Bot API / Telegraf.js
- Vercel
- GitHub

Do not change stack without asking.

---

## Core Rules
Always:
- Build MVP first.
- Keep code clean and simple.
- Use TypeScript properly.
- Make UI mobile-first.
- Follow Apple-like clean design.
- Change only files needed for the task.
- Explain changed files after coding.
- Ask before deleting or restructuring files.
- Keep secrets in environment variables.

Never:
- Build marketplace features.
- Add multi-vendor logic.
- Add complex POS/accounting.
- Expose API keys in frontend.
- Commit `.env.local`.
- Rewrite unrelated files.
- Install packages without reason.
- Delete files without permission.

---

## MVP Features
Build these first:

- Home page
- Product catalog
- Product detail page
- Find My Product quiz
- Order form
- Receipt page
- Track order page
- Admin product management
- Admin order management
- Stock update
- Telegram new order notification
- Telegram customer receipt

Do not build premium features before MVP works.

---

## Later Features
Add later:

- AI Product Advisor
- Telegram delivery update
- Daily Telegram report
- Low-stock alert
- Promotion management
- Customer order history
- Better analytics
- Real KHQR / Bakong / ABA verification
- PDF invoice
- Coupons
- Loyalty points
- Barcode scanning
- Employee roles

---

## Folder Structure
Use this structure:

```text
app/
  page.tsx
  products/
  ai-advisor/
  find-my-product/
  order/
  payment/
  receipt/
  track-order/
  admin/

components/
  ui/
  product/
  admin/
  ai/
  order/
  layout/

lib/
  supabase.ts
  ai.ts
  telegram.ts
  orders.ts
  products.ts
  utils.ts

types/
  product.ts
  order.ts
  customer.ts
  ai.ts
  database.ts
```

---

## UI Rules
Design style:

- Apple-like
- Clean
- Soft
- Modern
- Premium
- Mobile-first
- Easy to use

Use:
- White background
- Soft beige/pink/green accents
- Rounded cards
- Soft shadows
- Clear buttons
- Good spacing
- Large product images
- Simple typography

Avoid:
- Crowded layout
- Too many colors
- Harsh shadows
- Random gradients
- Tiny text
- Broken mobile layout

---

## Customer Website
Pages:

- Home
- Products
- Product Detail
- Find My Product
- AI Product Advisor
- Order
- Payment
- Receipt
- Track Order
- Contact

Product filters:
- Category
- Brand
- Skin type
- Skin concern
- Price
- Stock
- Promotion
- Best seller
- New arrival

---

## Admin Dashboard
Sections:

- Overview
- Products
- Orders
- Stock
- Promotions
- Delivery
- Customers
- AI Product Data
- Analytics
- Settings

Admin can:
- Add/edit/delete products
- Upload product image
- Update price
- Update stock
- Manage orders
- Update payment status
- Update delivery status
- View simple analytics

---

## Order Rules
Order flow:

```text
Customer selects product
Customer fills order form
System creates Order ID
Order saved to database
Customer sees payment / receipt
Admin sees order
Telegram sends alert
```

Order statuses:

- New Order
- Waiting Payment
- Paid
- Preparing
- Packing
- Delivering
- Completed
- Cancelled

---

## Payment Rules
MVP uses simulated payment.

Payment statuses:

- Payment Pending
- Payment Submitted
- Payment Successful
- Payment Failed
- Payment Expired
- Refunded

Real KHQR / Bakong / ABA verification is later premium feature.

---

## AI Rules
AI Product Advisor must:
- Recommend only products from shop database.
- Explain recommendations simply.
- Support Khmer and English.
- Help with product comparison, routine, and budget.
- Not act like a doctor.
- Not promise medical results.
- Not recommend unavailable products.

Safety line:
AI gives skincare product suggestions only. For serious irritation, allergy, infection, or painful skin condition, suggest consulting a dermatologist.

AI API key must stay backend-only.

---

## Telegram Rules
Telegram is notification only. Database is the source of truth.

Send to customer:
- Order confirmed
- Payment successful
- Receipt
- Delivery update
- Order completed

Send to owner:
- New order
- Payment successful
- Low stock
- Daily summary
- Delivery completed
- AI question summary

Telegram token must stay backend-only.

---

## Supabase Rules
Use Supabase for:
- Products
- Orders
- Customers
- Payments
- Deliveries
- Promotions
- AI logs
- Telegram logs
- Auth
- Storage

Never expose:
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENROUTER_API_KEY`
- `TELEGRAM_BOT_TOKEN`

Use `.env.local`.

---

## After Coding Response
After every coding task, respond with:

```text
Changed files:
- ...

What changed:
- ...

How to test:
- ...

Notes:
- ...
```

Keep explanation short.