# DATABASE.md

# Database Specification

## Project

Smart Digital Store System uses **Supabase PostgreSQL** as the main database.

The database should support:

- Products

- Categories

- Brands

- Customers

- Orders

- Order items

- Payments

- Deliveries

- Promotions

- Telegram logs

- AI conversations

- AI recommendations

Keep the database simple for MVP. Add advanced fields later only when needed.

---

# 1. Database Rules

Use clear table names.

Use lowercase table names with underscores.

Example:

```text

products

order_items

ai_conversations

telegram_logs

```

Use UUID for primary keys.

Use timestamps:

```text

created_at

updated_at

```

Do not expose private data to frontend without proper rules.

Use Row Level Security later when auth is ready.

---

# 2. Main Tables

Required tables:

```text

products

categories

brands

customers

orders

order_items

payments

deliveries

promotions

telegram_logs

ai_conversations

ai_recommendations

```

MVP tables:


```text

products

categories

brands

customers

orders

order_items

payments

deliveries

telegram_logs

```

Later tables:

```text

promotions

ai_conversations

ai_recommendations

```

---

# 3. products

Stores product information.

## Purpose

Used for product catalog, product detail page, admin product management, stock management, and AI recommendation.

## Fields

```text

id UUID PRIMARY KEY

name TEXT NOT NULL

brand_id UUID

category_id UUID

price NUMERIC NOT NULL

stock INTEGER NOT NULL DEFAULT 0

image_url TEXT

description TEXT

main_benefit TEXT

how_to_use TEXT

ingredients TEXT

skin_types TEXT[]

skin_concerns TEXT[]

ai_tags TEXT[]

is_best_seller BOOLEAN DEFAULT false

is_hot_sale BOOLEAN DEFAULT false

is_new_arrival BOOLEAN DEFAULT false

is_ai_recommendable BOOLEAN DEFAULT true

created_at TIMESTAMP DEFAULT now()

updated_at TIMESTAMP DEFAULT now()

```

## Notes

- `skin_types` can include oily, dry, sensitive, combination, normal.

- `skin_concerns` can include acne, dark spots, redness, dull skin, dryness, sun protection.

- `ai_tags` helps AI understand product usage.

- `is_ai_recommendable` controls whether AI can recommend this product.

---

# 4. categories

Stores product categories.

## Purpose

Used for filtering products and organizing catalog.

## Fields

```text

id UUID PRIMARY KEY

name TEXT NOT NULL

slug TEXT UNIQUE

description TEXT

created_at TIMESTAMP DEFAULT now()

updated_at TIMESTAMP DEFAULT now()

```

## Example Data

```text

Cleanser

Toner

Serum

Moisturizer

Sunscreen

Acne Treatment

Mask

Makeup

Skincare Set

```

---

# 5. brands

Stores product brands.

## Purpose

Used for product filtering and product detail.

## Fields

```text

id UUID PRIMARY KEY

name TEXT NOT NULL

slug TEXT UNIQUE

logo_url TEXT

description TEXT

created_at TIMESTAMP DEFAULT now()

updated_at TIMESTAMP DEFAULT now()

```

## Example Data

```text

Anua

COSRX

Beauty of Joseon

Skin1004

CeraVe

The Ordinary

Some By Mi

La Roche-Posay

```

---

# 6. customers

Stores customer information.

## Purpose

Used for orders, receipt, delivery tracking, and customer history.

Customer login is not required for MVP.

## Fields

```text

id UUID PRIMARY KEY

name TEXT NOT NULL

phone TEXT NOT NULL

telegram_username TEXT

telegram_chat_id TEXT

address TEXT

created_at TIMESTAMP DEFAULT now()

updated_at TIMESTAMP DEFAULT now()

```

## Notes

- Customer can track order using `order_id` and `phone`.

- `telegram_chat_id` is needed if sending Telegram message directly to customer.

---

# 7. orders

Stores order information.

## Purpose

Used for order management, receipt, payment, delivery, and analytics.

## Fields

```text

id UUID PRIMARY KEY

order_code TEXT UNIQUE NOT NULL

customer_id UUID

customer_name TEXT NOT NULL

customer_phone TEXT NOT NULL

customer_telegram TEXT

delivery_address TEXT

delivery_option TEXT

note TEXT

total_amount NUMERIC NOT NULL DEFAULT 0

order_status TEXT NOT NULL DEFAULT 'New Order'

payment_status TEXT NOT NULL DEFAULT 'Payment Pending'

delivery_status TEXT NOT NULL DEFAULT 'Order Created'

created_at TIMESTAMP DEFAULT now()

updated_at TIMESTAMP DEFAULT now()

```

## Order Status Values

```text

New Order

Waiting Payment

Paid

Preparing

Packing

Delivering

Completed

Cancelled

```

## Payment Status Values

```text

Payment Pending

Payment Submitted

Payment Successful

Payment Failed

Payment Expired

Refunded

```

## Delivery Status Values

```text

Order Created

Payment Successful

Preparing

Packing

Ready for Delivery

Delivering

Completed

Cancelled

```

---

# 8. order_items

Stores products inside each order.

## Purpose

One order can have one or many products.

## Fields

```text

id UUID PRIMARY KEY

order_id UUID NOT NULL

product_id UUID NOT NULL

product_name TEXT NOT NULL

quantity INTEGER NOT NULL DEFAULT 1

unit_price NUMERIC NOT NULL

total_price NUMERIC NOT NULL

created_at TIMESTAMP DEFAULT now()

```

## Notes

- Save `product_name` and `unit_price` at order time.

- This keeps receipt correct even if product price changes later.

---

# 9. payments

Stores payment information.

## Purpose

Used for payment status, receipt, and future KHQR verification.

## Fields

```text

id UUID PRIMARY KEY

order_id UUID NOT NULL

payment_method TEXT

amount NUMERIC NOT NULL

payment_status TEXT NOT NULL DEFAULT 'Payment Pending'

transaction_id TEXT

payment_reference TEXT

paid_at TIMESTAMP

created_at TIMESTAMP DEFAULT now()

updated_at TIMESTAMP DEFAULT now()

```

## Payment Methods

```text

Manual

KHQR

ABA

Bakong

Cash on Delivery

```

## MVP Payment Flow

For MVP, payment can be manual or simulated.

```text

Customer clicks “I have paid”

↓

payment_status = Payment Submitted

↓

Admin checks

↓

payment_status = Payment Successful

```

## Premium Payment Flow

Later, real KHQR / Bakong verification can update payment automatically.

---

# 10. deliveries

Stores delivery information.

## Purpose

Used for delivery tracking and Telegram delivery updates.

## Fields

```text

id UUID PRIMARY KEY

order_id UUID NOT NULL

delivery_company TEXT

tracking_code TEXT

rider_name TEXT

rider_phone TEXT

delivery_note TEXT

estimated_delivery_date DATE

delivery_status TEXT NOT NULL DEFAULT 'Order Created'

created_at TIMESTAMP DEFAULT now()

updated_at TIMESTAMP DEFAULT now()

```

## Delivery Status Values

```text

Order Created

Payment Successful

Preparing

Packing

Ready for Delivery

Delivering

Completed

Cancelled

```

---

# 11. promotions

Stores promotion campaigns.

## Purpose

Used for homepage hero, hot sale section, product badges, and AI priority.

This can be Version 2.

## Fields

```text

id UUID PRIMARY KEY

title TEXT NOT NULL

description TEXT

image_url TEXT

discount_type TEXT

discount_value NUMERIC

start_date DATE

end_date DATE

is_active BOOLEAN DEFAULT true

created_at TIMESTAMP DEFAULT now()

updated_at TIMESTAMP DEFAULT now()

```

## Discount Types

```text

Percentage

Fixed Amount

Bundle

Free Delivery

```

---

# 12. telegram_logs

Stores Telegram notification history.

## Purpose

Used to track whether Telegram messages were sent successfully.

## Fields

```text

id UUID PRIMARY KEY

order_id UUID

recipient_type TEXT NOT NULL

chat_id TEXT

message_type TEXT NOT NULL

message_text TEXT

send_status TEXT NOT NULL DEFAULT 'Pending'

error_message TEXT

sent_at TIMESTAMP

created_at TIMESTAMP DEFAULT now()

```

## Recipient Types

```text

Customer

Owner

Manager

Employee

```

## Message Types

```text

New Order

Payment Successful

Receipt

Delivery Update

Low Stock Alert

Daily Report

AI Question Summary

```

## Send Status

```text

Pending

Sent

Failed

```

---

# 13. ai_conversations

Stores AI customer questions.

## Purpose

Used for AI Product Advisor and analytics.

This can be Version 2 or Premium.

## Fields

```text

id UUID PRIMARY KEY

customer_id UUID

order_id UUID

question TEXT NOT NULL

language TEXT

skin_type TEXT

skin_concern TEXT

budget TEXT

created_at TIMESTAMP DEFAULT now()

```

## Notes

- Store customer question for analytics.

- Do not store sensitive personal health data unnecessarily.

- AI should not diagnose medical conditions.

---

# 14. ai_recommendations

Stores AI recommendation results.

## Purpose

Used to track what AI recommended and analyze conversion.

This can be Version 2 or Premium.

## Fields

```text

id UUID PRIMARY KEY

conversation_id UUID

recommended_product_ids UUID[]

reason TEXT

converted_to_order BOOLEAN DEFAULT false

created_at TIMESTAMP DEFAULT now()

```

## Notes

- `recommended_product_ids` stores product IDs recommended by AI.

- `converted_to_order` can show whether customer ordered after AI recommendation.

---

# 15. Suggested Relationships

```text

categories 1 → many products

brands 1 → many products

customers 1 → many orders

orders 1 → many order_items

products 1 → many order_items

orders 1 → 1 payment

orders 1 → 1 delivery

orders 1 → many telegram_logs

customers 1 → many ai_conversations

ai_conversations 1 → many ai_recommendations

```

---

# 16. MVP Database Build Order

Create tables in this order:

```text

1. categories

2. brands

3. products

4. customers

5. orders

6. order_items

7. payments

8. deliveries

9. telegram_logs

```

Later:

```text

10. promotions

11. ai_conversations

12. ai_recommendations

```

---

# 17. Example Product Data

```text

Product: Anua Heartleaf Toner

Brand: Anua

Category: Toner

Price: 18

Stock: 10

Skin Types: sensitive, oily, combination

Skin Concerns: acne, redness, hydration

Main Benefit: calming and hydration

AI Tags: calming, sensitive skin, acne redness

```

```text

Product: COSRX Low pH Cleanser

Brand: COSRX

Category: Cleanser

Price: 12

Stock: 8

Skin Types: oily, combination, acne-prone

Skin Concerns: acne, oil control

Main Benefit: gentle daily cleanser

AI Tags: acne, cleanser, oil control

```

---

# 18. Example Order Data

```text

Order Code: ORD-1001

Customer: Sreyka

Phone: 012345678

Product: Anua Heartleaf Toner

Quantity: 2

Total: 36

Order Status: New Order

Payment Status: Payment Pending

Delivery Status: Order Created

```

---

# 19. Security Notes

Never expose these in frontend:

```text

SUPABASE_SERVICE_ROLE_KEY

OPENROUTER_API_KEY

TELEGRAM_BOT_TOKEN

PAYMENT_SECRET_KEY

```

Use environment variables.

Do not commit `.env.local`.

Add to `.gitignore`:

```text

.env

.env.local

.env.production

node_modules

.next

```

---

# 20. Important Reminder

Keep database simple first.

Do not add complex accounting, multi-branch, or marketplace tables in MVP.

Focus on:

```text

Products

Orders

Payments

Receipts

Delivery

Telegram

Basic AI logs later

```