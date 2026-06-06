# FEATURES.md

# Feature Specification

## Project
Smart Digital Store System is a responsive digital store for **one small shop**.

First demo: **skincare shop**.

Main parts:
- Customer website
- Admin dashboard
- Telegram automation
- AI Product Advisor

Build MVP first. Add advanced features later.

---

# 1. Feature Priority

## MVP
Build first:
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

## Version 2
Build after MVP:
- AI Product Advisor
- Telegram delivery update
- Daily Telegram report
- Low-stock alert
- Promotion management
- Customer order history
- Better analytics
- Simulated payment flow

## Premium
Build later:
- Real KHQR / Bakong / ABA verification
- PDF invoice
- Coupon system
- Loyalty points
- Barcode stock scanning
- Employee roles
- Advanced analytics
- AI analytics summary for owner

---

# 2. Customer Website

## Pages
Required pages:
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

## Home Page
Sections:
- Promotion Hero
- Best Sellers
- New Arrivals
- Shop by Skin Concern
- AI Product Advisor CTA
- Popular Brands
- Hot Sale
- Customer Reviews
- Contact Button

Hero example:
- Title: Glow Up Sale
- Subtitle: Find the best skincare product for your skin.
- Buttons: Shop Now, Find My Product, Ask AI Advisor

---

# 3. Product Catalog

## Product Grid
Responsive grid:
- Desktop: 3–4 columns
- Tablet: 2 columns
- Mobile: 1–2 columns

## Search
Search by:
- Product name
- Brand
- Category
- Skin concern
- Ingredient

## Filters
Filter by:
- Category
- Brand
- Skin type
- Skin concern
- Price range
- Stock status
- Promotion
- Best seller
- New arrival

## Sorting
Sort by:
- Newest
- Best seller
- Price low to high
- Price high to low
- Hot sale

---

# 4. Product Card

Each product card should show:
- Product image
- Product name
- Brand
- Price
- Skin concern
- Stock status
- Badge
- View Detail button
- Order button

Badges:
- Best Seller
- Hot Sale
- New Arrival
- Low Stock
- Recommended
- AI Pick

Example:
- Product: Anua Heartleaf Toner
- Brand: Anua
- Price: $18
- Best for: acne redness, sensitive skin
- Stock: Available
- Badge: Best Seller

---

# 5. Product Detail Page

Each product detail page should show:
- Product name
- Brand
- Price
- Product images
- Stock status
- Main benefit
- Best for skin type
- Best for skin concern
- How to use
- Key ingredients
- Description
- Related products
- AI explanation
- Order Now button

Related products should be based on:
- Same category
- Same skin concern
- Same brand
- Similar price

---

# 6. Find My Product

Find My Product is a simple quiz.

MVP can use rule-based matching. AI can be added later.

## Questions

Skin type:
- Oily
- Dry
- Sensitive
- Combination
- Normal
- Not sure

Skin concern:
- Acne
- Dark spots
- Redness
- Dull skin
- Large pores
- Dryness
- Oil control
- Sun protection

Budget:
- Under $10
- $10–$20
- $20–$50
- Above $50

Product needed:
- Cleanser
- Toner
- Serum
- Moisturizer
- Sunscreen
- Full routine
- Not sure

## Result
Show matching products with short reasons.

Example:
- Gentle Acne Cleanser — good for oily and acne-prone skin
- Calming Toner — helps redness
- Lightweight Moisturizer — suitable for oily skin

---

# 7. AI Product Advisor

AI Product Advisor is a later/premium feature.

AI should help with:
- Product recommendation
- Product comparison
- Skincare routine builder
- Budget recommendation
- Khmer and English support
- Product explanation

AI must:
- Recommend only products from the shop database
- Explain simply
- Mention stock if available
- Mention price if available
- Avoid medical claims
- Avoid recommending unavailable products

Safety rule:
AI gives skincare product suggestions only. It must not diagnose disease or give medical treatment. For serious irritation, allergy, infection, or painful skin condition, suggest consulting a dermatologist.

Example:
Customer: I have oily skin and acne. My budget is under $25.

AI should recommend suitable in-stock products from the database and explain why.

---

# 8. Order Form

## Fields
Order form needs:
- Customer name
- Phone number
- Telegram username or phone
- Product
- Quantity
- Delivery address
- Delivery option
- Note

## Delivery Options
- Pickup at shop
- Delivery in Phnom Penh
- Delivery to province

## Validation
Required:
- Customer name
- Phone number
- Product
- Quantity
- Delivery address if delivery is selected

Quantity must be at least 1.

## After Submit
After submit:
- Create Order ID
- Save order to database
- Redirect to payment or receipt page
- Send Telegram new order alert to owner

---

# 9. Payment Page

MVP uses simulated payment.

## Payment Page Shows
- Order ID
- Total amount
- Payment instruction
- QR placeholder
- Payment status
- Button: I have paid
- Button: Contact shop

## Payment Statuses
- Payment Pending
- Payment Submitted
- Payment Successful
- Payment Failed
- Payment Expired
- Refunded

Real KHQR / Bakong / ABA verification is premium later.

---

# 10. Receipt Page

Receipt should show:
- Receipt ID
- Order ID
- Customer name
- Phone number
- Product list
- Quantity
- Total price
- Payment status
- Order status
- Date
- Shop name
- Shop contact

Receipt actions:
- Copy Order ID
- Track order
- Contact shop

Receipt should also be sent through Telegram.

---

# 11. Track Order Page

Customer inputs:
- Order ID
- Phone number

System shows:
- Order status
- Payment status
- Delivery status
- Tracking code
- Delivery note
- Estimated delivery date

If not found:
“We could not find your order. Please check your Order ID and phone number.”

---

# 12. Admin Dashboard

## Sections
Admin dashboard includes:
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

## Overview Cards
Show:
- Today orders
- Today revenue
- Paid orders
- Pending orders
- Cancelled orders
- Low-stock products
- Best-selling product
- Most asked AI topic

MVP can show only available data.

---

# 13. Product Management

Admin can:
- Add product
- Edit product
- Delete product
- Upload product image
- Update price
- Update stock
- Update category
- Update brand
- Update skin type
- Update skin concern
- Mark best seller
- Mark hot sale
- Mark new arrival
- Control AI recommendation visibility

Product form fields:
- Product name
- Brand
- Category
- Price
- Stock
- Skin type
- Skin concern
- Main benefit
- How to use
- Ingredients
- Description
- Image
- Best seller status
- Hot sale status
- New arrival status
- AI recommendation tags

---

# 14. Order Management

Admin can:
- View new orders
- Search orders
- Filter orders by status
- View customer info
- View order items
- Update payment status
- Update order status
- Update delivery status
- Cancel order
- Mark order completed

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

# 15. Stock Management

Admin can:
- See current stock
- Update stock
- See low-stock products
- Receive low-stock alert
- Track stock after paid order

Low stock rule:
- Low stock when stock is less than or equal to 3

When order is marked paid:
- Product stock should decrease automatically

---

# 16. Promotion Management

Promotion can be Version 2.

Admin can create:
- Promotion title
- Promotion image
- Discount amount
- Start date
- End date
- Products included
- Promotion status

Promotions can appear in:
- Home hero
- Hot sale section
- Product card badge
- Product detail page
- AI recommendation priority

---

# 17. Delivery Management

Admin can update:
- Delivery company
- Tracking code
- Rider name
- Rider phone
- Delivery note
- Estimated delivery date
- Delivery status

Delivery statuses:
- Order Created
- Payment Successful
- Preparing
- Packing
- Ready for Delivery
- Delivering
- Completed
- Cancelled

Customer should see delivery updates on Track Order page.

Telegram delivery update is Version 2.

---

# 18. Customer Management

Admin can see:
- Customer name
- Phone number
- Telegram contact
- Order history
- Total orders
- Last order date
- Skin concern interest

Customer data can be created automatically from orders.

Customer login is not required in MVP.

---

# 19. AI Product Data Control

This is for later.

Admin can control:
- Recommended skin type
- Recommended skin concern
- Not recommended skin type
- Product priority
- Routine step
- Budget level
- Safety notes

Example:
Product: Anua Heartleaf Toner  
Recommended for: sensitive skin, acne redness  
Routine step: toner  
Safety note: patch test first if skin is very sensitive

---

# 20. Analytics

## MVP Analytics
- Today orders
- Paid orders
- Pending orders
- Total products
- Low-stock products

## Version 2 Analytics
- Today revenue
- Best-selling product
- Popular category
- Top skin concern
- Most searched concern

## Premium Analytics
- Most asked AI question
- Most recommended product by AI
- AI recommendation conversion
- Best promotion
- Customer repeat rate

Do not overbuild analytics first.

---

# 21. Telegram Automation

Telegram is notification only.

Customer messages:
- Order confirmed
- Payment successful
- Receipt
- Delivery update
- Order completed

Owner messages:
- New order
- Payment successful
- Low stock
- Daily summary
- Delivery completed
- AI question summary

Telegram token must stay backend-only.

---

# 22. Feature Build Order

Build in this order:
1. Home page
2. Product catalog
3. Product detail page
4. Order form
5. Receipt page
6. Track order page
7. Admin layout
8. Product management
9. Order management
10. Stock update
11. Telegram new order notification
12. Telegram receipt
13. Find My Product
14. AI Product Advisor
15. Payment verification later