# PROJECT.md

# Smart Digital Store System

## 1. Project Summary

This project is called **Smart Digital Store System**.

It is a responsive digital store and order management system for **one small shop**. The project is not a big marketplace like Shopee, and it is not a complex POS system for many branches. It is designed for one shop that wants to sell products online in a more organized, professional, and modern way.

The first demo business will be a **skincare shop**, because skincare shops usually have many products, many brands, many skin concerns, and many customer questions. However, the system should be flexible enough to reuse later for other shop types such as phone shops, fashion shops, beauty shops, accessory shops, food shops, or supplement shops.

The system combines:

- customer website
- product catalog
- product detail pages
- AI product advisor
- Find My Product recommendation quiz
- online order form
- payment status flow
- receipt system
- delivery tracking
- admin dashboard
- stock management
- Telegram notification
- basic analytics and reports

The goal is to help a shop owner manage the store more easily and help customers browse, choose, order, receive receipts, and track delivery without messy chat communication.

---

## 2. Project Vision

The vision of this project is to help small shops become more digital and professional without needing a very expensive system.

Many small businesses already sell through Facebook, Telegram, Messenger, or Instagram, but the selling process is often messy. Customers ask for product details through chat, sellers reply manually, orders are written manually, payment proof is checked manually, and delivery updates are sent manually.

This project solves that by giving the shop a simple but powerful digital store system.

The system should feel:

- clean
- modern
- trustworthy
- premium
- easy to use
- mobile-first
- Apple-like
- simple for non-technical shop owners

The project should not feel like a cheap product list. It should feel like a real business tool that helps the shop sell and manage better.

---

## 3. Project Positioning

This project should not be described as only a website.

A normal website only shows information.

This project is more than that. It is a **digital store system** for one shop.

Use this positioning sentence:

> I build a smart digital store for one shop. Customers can browse products, get AI product recommendations, order online, receive receipts, and track delivery. The shop owner can manage products, stock, orders, delivery, and receive Telegram reports automatically.

Another version:

> I do not only build a website. I build a simple digital store system that helps your shop sell products, recommend the right products, manage orders, update stock, send receipts, and notify customers through Telegram.

This positioning is important because it helps the project look more valuable and allows higher pricing for clients.

---

## 4. Main Problem

Many small shops in Cambodia still manage products, orders, payments, receipts, and delivery updates manually through chat apps.

Common platforms they use:

- Facebook Page
- Messenger
- Telegram
- Instagram
- phone call
- Google Sheets
- handwritten notes

This creates many problems.

Customers often need to ask:

- How much is this product?
- Is it still in stock?
- Is this product good for acne?
- Is this product good for oily skin?
- How do I use this product?
- What product should I buy for my skin?
- Can I order now?
- Did you receive my payment?
- Do I have a receipt?
- Where is my delivery?
- What is my tracking code?

The shop owner or employee must answer the same questions many times every day.

This wastes time, creates mistakes, and makes the business look less professional.

For skincare shops, the problem is even stronger because customers often do not know what product fits their skin. They need help choosing based on:

- skin type
- skin concern
- product category
- budget
- brand
- product benefit
- ingredient
- routine step

If the shop only posts product photos on social media, the customer still has to ask many questions before buying.

---

## 5. Customer Problems

Customers face many problems when buying from small shops through chat.

### 5.1 Product Browsing Problem

Customers cannot easily see all products in one organized place.

Products may be posted across many Facebook posts or Telegram messages. The customer needs to scroll a lot and may miss important products.

A customer may not know:

- what products are available
- what products are new
- what products are on promotion
- what products are best sellers
- what products are in stock
- what products match their needs

The solution is to create a clean product catalog that is easy to browse.

---

### 5.2 Product Information Problem

Customers often cannot see full product details.

They may only see:

- product image
- product name
- price

But for skincare, customers need more details:

- brand
- category
- skin type
- skin concern
- benefit
- how to use
- ingredients
- stock status
- related products
- safety note
- routine step

Without clear information, customers may feel unsure and need to message the seller.

The solution is to create a product detail page that explains the product clearly.

---

### 5.3 Product Choice Problem

Customers may not know which product is right for them.

Example customer questions:

- I have acne. What should I use?
- I have oily skin. Which sunscreen is good?
- I have dry skin. What moisturizer should I buy?
- My skin is sensitive. Which product is safe?
- I have dark spots. Which serum should I use?
- I am a beginner. What skincare routine should I start with?
- My budget is $20. What can I buy?

The solution is to add:

- Find My Product quiz
- AI Product Advisor

These features help customers choose products faster.

---

### 5.4 Order Problem

Many orders through chat are messy.

Customers may forget to send:

- name
- phone number
- address
- quantity
- product name
- delivery option
- note

Employees may also make mistakes when copying order information manually.

The solution is to create an order form that collects all required information clearly.

---

### 5.5 Payment Problem

Payment confirmation may be unclear.

The customer may pay by ABA, KHQR, or Bakong, then send a screenshot to the seller. The seller needs to check manually.

This can create problems:

- payment screenshot lost in chat
- seller forgets to confirm
- customer waits too long
- wrong amount
- no clear payment status

For MVP, payment can be simulated or manually confirmed.

Later, real KHQR / Bakong payment verification can be added as a premium feature.

---

### 5.6 Receipt Problem

Many small shops do not send a clear receipt.

Customers may only have chat messages as proof.

This can make customers feel less confident, especially when buying expensive products.

The solution is to create a receipt system.

The receipt should include:

- receipt ID
- order ID
- customer name
- product list
- quantity
- total price
- payment status
- order status
- date
- shop contact

The customer should be able to see receipt on the website and receive it through Telegram.

---

### 5.7 Delivery Tracking Problem

Customers often need to ask the seller about delivery status.

Common questions:

- Is my order packed?
- Is my order delivering?
- What is the tracking code?
- When will it arrive?
- Who is the rider?
- Can I get delivery contact?

The solution is to add delivery tracking.

Customer can enter:

- order ID
- phone number

Then the system shows:

- order status
- payment status
- delivery status
- tracking code
- delivery note
- estimated delivery date

---

## 6. Shop Owner Problems

Shop owners also face many problems.

### 6.1 Product Management Problem

Product information may be stored in many places:

- Facebook posts
- Telegram albums
- phone gallery
- Google Sheets
- notes app
- handwritten notebook

This makes it hard to update:

- price
- stock
- promotion
- product details
- product image
- category
- brand

The solution is an admin dashboard where the owner can add, edit, and manage products.

---

### 6.2 Order Management Problem

Orders can come from many channels.

Examples:

- Facebook inbox
- Telegram chat
- phone call
- walk-in customer
- Instagram message

This makes it easy to lose orders or forget order status.

The solution is order management in one dashboard.

Admin can:

- view new orders
- search orders
- filter by status
- update order status
- update payment status
- update delivery status
- cancel order
- mark order completed

---

### 6.3 Stock Management Problem

Shop owners may forget to update stock.

This can cause:

- selling products that are out of stock
- not knowing which product is low stock
- missing chance to restock best-selling products
- customer disappointment

The solution is stock management.

Admin can:

- update stock
- see low-stock products
- receive low-stock alert
- auto-decrease stock after paid order

---

### 6.4 Payment Checking Problem

Manual payment checking takes time.

The owner or employee may need to check many screenshots.

This is slow and can cause mistakes.

For MVP, the admin can manually mark payment as successful.

Later, premium version can include KHQR / Bakong payment verification.

---

### 6.5 Delivery Management Problem

Delivery details can be messy.

The owner may need to manually send:

- rider phone
- tracking code
- delivery company
- delivery note
- delivery document

The solution is delivery management inside the dashboard.

Admin can update delivery information, and customer can track it.

Later, Telegram can send delivery updates automatically.

---

### 6.6 Business Analysis Problem

Shop owners may not know useful business information.

They may not know:

- today revenue
- today orders
- best-selling product
- low-stock products
- popular skin concern
- most asked AI question
- most recommended product
- best promotion
- most ordered category

The solution is analytics dashboard and Telegram daily report.

---

## 7. Employee Problems

If the shop has employees, they may face daily workflow problems.

Employees may need to:

- answer repeated product questions
- check product stock manually
- write customer order manually
- confirm payment manually
- update delivery manually
- switch between chat, product list, payment app, and delivery information
- report sales to the owner manually

This system helps employees by giving them one dashboard to manage:

- products
- orders
- stock
- delivery
- customer information

Employee should not see sensitive revenue or manager-level reports unless allowed.

---

## 8. Target Users

### 8.1 Customer

The customer uses the website to:

- browse products
- search products
- filter products
- view product details
- ask AI for product advice
- use Find My Product quiz
- place an order
- view payment status
- view receipt
- track delivery
- receive Telegram updates

The customer does not need to log in for MVP.

Customer can track order using:

- order ID
- phone number

---

### 8.2 Employee

The employee uses the admin dashboard to:

- add products
- edit products
- update stock
- check new orders
- update order status
- update delivery information
- help customers faster

The employee should have limited permission.

---

### 8.3 Shop Owner / Manager

The shop owner or manager uses the dashboard to:

- view revenue
- view today orders
- check paid orders
- check low stock
- view best-selling products
- view customer demand
- receive Telegram reports

The manager may not always use a computer, so Telegram reports are important.

---

## 9. Main Solution Structure

The system has four main parts:

1. Customer Website
2. Admin Dashboard
3. Telegram Automation
4. AI Product Recommendation

---

## 10. Customer Website

The customer website is the online storefront.

It should be:

- responsive
- mobile-first
- clean
- fast
- easy to use
- Apple-like
- visually premium
- simple for customers

Main pages:

- Home
- Products
- Product Detail
- AI Product Advisor
- Find My Product
- Order Form
- Payment Page
- Receipt Page
- Track Order
- Contact

---

### 10.1 Home Page

Home page sections:

- Promotion Hero
- Best Sellers
- New Arrivals
- Shop by Skin Concern
- AI Product Advisor CTA
- Popular Brands
- Hot Sale
- Customer Reviews
- Contact / Order CTA

Example hero content:

> Glow Up Sale  
> Find the best skincare product for your skin.  
> Shop by concern or ask our AI Product Advisor.

Hero buttons:

- Shop Now
- Find My Product
- Ask AI Advisor

---

### 10.2 Products Page

The products page shows all products.

It should include:

- search bar
- product grid
- category filter
- brand filter
- skin type filter
- skin concern filter
- price filter
- stock filter
- promotion filter
- sorting

Product categories for skincare:

- Cleanser
- Toner
- Serum
- Moisturizer
- Sunscreen
- Acne Treatment
- Mask
- Makeup
- Skincare Set

Skin concerns:

- Acne
- Oily Skin
- Dry Skin
- Sensitive Skin
- Dark Spots
- Brightening
- Hydration
- Redness
- Sun Protection

---

### 10.3 Product Detail Page

The product detail page should include:

- product name
- brand
- price
- product image gallery
- stock status
- main benefit
- best for skin type
- best for skin concern
- how to use
- key ingredients
- product description
- related products
- AI explanation
- Order Now button

Example:

> Product: Anua Heartleaf 77% Soothing Toner  
> Brand: Anua  
> Price: $18  
> Best for: sensitive skin, acne redness, oily skin  
> Benefit: calming, hydration, redness care  
> How to use: Apply after cleansing using cotton pad or hand.  
> Stock: Available

---

### 10.4 AI Product Advisor Page

The AI Product Advisor helps customers choose the right product.

Customers can ask:

- I have oily skin and acne. What should I use?
- Which product is good for dark spots?
- What routine should I use for dry skin?
- Which sunscreen is good under $20?
- Which one is better: Anua Toner or COSRX Toner?

AI must answer based on the shop product database.

AI should not recommend products outside the shop.

AI should not give medical diagnosis.

AI should support Khmer and English.

---

### 10.5 Find My Product Page

This is a guided quiz.

Questions:

What is your skin type?

- Oily
- Dry
- Sensitive
- Combination
- Normal
- Not sure

What is your main concern?

- Acne
- Dark spots
- Redness
- Dull skin
- Large pores
- Dryness
- Oil control
- Sun protection

What is your budget?

- Under $10
- $10–$20
- $20–$50
- Above $50

What product do you need?

- Cleanser
- Toner
- Serum
- Moisturizer
- Sunscreen
- Full routine
- Not sure

The system then recommends matching products.

In MVP, this can be rule-based.

Later, it can be connected to AI.

---

### 10.6 Order Form

Order form fields:

- customer name
- phone number
- Telegram username or phone
- product name
- quantity
- delivery address
- delivery option
- note

Delivery options:

- pickup at shop
- delivery in Phnom Penh
- delivery to province

After submit:

1. system creates order ID
2. order is saved to database
3. customer goes to payment or receipt page
4. Telegram sends new order alert to owner

---

### 10.7 Payment Page

For MVP, payment can be simulated.

MVP payment flow:

1. customer confirms order
2. website shows payment QR placeholder
3. customer clicks "I have paid"
4. system marks payment as Payment Submitted
5. admin can mark Payment Successful

Payment statuses:

- Payment Pending
- Payment Submitted
- Payment Successful
- Payment Failed
- Payment Expired
- Refunded

Premium payment flow later:

1. customer confirms order
2. system generates KHQR
3. customer scans with ABA / Bakong
4. backend verifies transaction
5. order becomes Payment Successful
6. receipt is generated
7. Telegram sends confirmation

---

### 10.8 Receipt Page

Receipt should include:

- receipt ID
- order ID
- customer name
- phone number
- product list
- quantity
- total price
- payment status
- order status
- date
- shop name
- shop contact

Customer can:

- view receipt
- copy order ID
- track order
- contact shop
- receive receipt in Telegram

---

### 10.9 Track Order Page

Customer enters:

- order ID
- phone number

System shows:

- order status
- payment status
- delivery status
- tracking code
- delivery note
- estimated delivery date

If no order is found, show a friendly message:

> We could not find your order. Please check your Order ID and phone number.

---

## 11. Admin Dashboard

The admin dashboard is for shop owner, manager, or employee.

Main admin sections:

- Overview
- Product Management
- Order Management
- Stock Management
- Promotion Management
- Delivery Management
- Customer Management
- AI Product Data Control
- Analytics
- Settings

---

### 11.1 Overview

Overview should show:

- today orders
- today revenue
- paid orders
- pending orders
- cancelled orders
- low-stock products
- best-selling product
- most asked AI topic

The dashboard should be clean and easy to scan.

---

### 11.2 Product Management

Admin can:

- add product
- edit product
- delete product
- upload product image
- update price
- update stock
- add product description
- add skin concern
- add skin type
- add category
- add brand
- mark product as best seller
- mark product as hot sale
- mark product as new arrival
- control whether product appears in AI recommendation

Product form fields:

- product name
- brand
- category
- price
- stock
- skin type
- skin concern
- main benefit
- how to use
- ingredients
- description
- image
- best seller status
- hot sale status
- new arrival status
- AI recommendation tags

---

### 11.3 Order Management

Admin can:

- view new orders
- search orders
- filter orders by status
- view customer info
- view order items
- update payment status
- update order status
- update delivery status
- cancel order
- mark order completed

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

### 11.4 Stock Management

Admin can:

- see current stock
- update stock
- see low-stock products
- receive low-stock alert
- track stock after order

Low stock rule:

If stock is less than or equal to 3, show low stock warning.

Example:

> Low Stock Alert  
> Anua Toner: 2 left  
> COSRX Cleanser: 1 left

When an order is paid successfully, stock should decrease automatically.

---

### 11.5 Promotion Management

Admin can create promotions.

Promotion fields:

- promotion title
- promotion image
- discount amount
- start date
- end date
- products included
- promotion status

Promotion can appear in:

- home hero
- hot sale section
- product card badge
- product detail page
- AI recommendation priority

---

### 11.6 Delivery Management

Admin can update delivery information.

Delivery fields:

- delivery company
- tracking code
- rider name
- rider phone
- delivery note
- delivery document/photo
- estimated delivery date
- delivery status

Delivery statuses:

- Order Created
- Payment Successful
- Preparing
- Packing
- Ready for Delivery
- Delivering
- Completed
- Cancelled

---

### 11.7 Customer Management

Admin can see:

- customer name
- phone number
- Telegram contact
- order history
- total orders
- last order date
- skin concern interest

Customer data can be created automatically when customer places order.

---

### 11.8 AI Product Data Control

Admin can manage what AI uses.

Admin can set:

- recommended skin type
- recommended skin concern
- not recommended skin type
- product priority
- routine step
- budget level
- safety notes

Example:

> Product: Anua Heartleaf Toner  
> Recommended for: sensitive skin, acne redness  
> Routine step: toner  
> Safety note: patch test first if skin is very sensitive

This helps the AI recommendation become safer and more accurate.

---

### 11.9 Analytics

Analytics should show:

- today orders
- today revenue
- total products
- paid orders
- cancelled orders
- best-selling product
- low-stock products
- most viewed product
- top skin concern
- most searched concern
- most ordered category
- popular brand
- best promotion
- most asked AI question
- most recommended product by AI
- AI recommendation conversion

For MVP, start with simple analytics only.

---

## 12. Telegram Automation

Telegram is used for fast notification and communication.

Website is the main system.

Telegram is the notification channel.

Telegram should send messages for:

Customer:

- order confirmed
- payment successful
- receipt
- delivery update
- order completed

Shop owner:

- new order
- payment successful
- low-stock alert
- daily sales summary
- delivery completed
- AI question summary

Example customer receipt:

> Receipt #1024  
> Product: Anua Toner  
> Quantity: 2  
> Total: $36  
> Payment: Successful  
> Status: Preparing  
> Thank you for your order.

Example owner report:

> Today Store Report  
> Orders: 12  
> Revenue: $246  
> Best Seller: Sunscreen SPF50  
> Low Stock: Acne Serum  
> Top Concern: Oily Skin  
> Most Asked AI Topic: Acne

Telegram bot token must never be exposed in frontend.

Telegram messages must be sent from backend only.

---

## 13. AI Product Advisor

AI Product Advisor is a premium and special feature.

It helps customers choose products faster.

AI can help with:

- product recommendation
- product comparison
- skincare routine builder
- budget recommendation
- Khmer and English support
- product explanation

AI must use the shop product database.

AI must not recommend random outside products.

AI must not act like a doctor.

Safety rule:

> AI should recommend skincare products based on customer needs, but it should not diagnose disease or give medical treatment. If the customer has serious irritation, allergy, infection, or painful skin condition, AI should suggest consulting a dermatologist.

Example:

Customer:

> I have oily skin and acne. My budget is under $25.

AI:

> Based on your skin concern, I recommend:
> 1. COSRX Low pH Cleanser — good for acne-prone skin
> 2. Anua Heartleaf Toner — helps calm redness
> 3. Lightweight gel moisturizer — good for oily skin
>
> You should avoid heavy cream products because they may feel too oily.

---

## 14. MVP Scope

The MVP should include:

- responsive customer website
- home page
- product catalog
- product detail page
- simple search and filter
- Find My Product recommendation
- order form
- receipt page
- track order page
- admin product management
- admin order management
- admin stock update
- Telegram new order notification
- Telegram customer receipt

The MVP should be simple but polished.

Do not overbuild.

---

## 15. Version 2 Scope

After MVP works, add:

- AI Product Advisor
- Telegram delivery update
- daily Telegram report
- low-stock alert
- promotion management
- customer order history
- better analytics
- simulated payment flow

---

## 16. Premium Scope

Later, add:

- real KHQR / Bakong payment verification
- AI Product Advisor with Khmer and English support
- PDF invoice
- coupon system
- loyalty points
- barcode stock scanning
- employee permission roles
- advanced sales analytics
- AI analytics summary for manager

---

## 17. What Not To Build First

Do not build these in MVP:

- Shopee-like marketplace
- multi-vendor system
- multi-branch system
- complex accounting
- complex POS system
- real payment API before order flow works
- mobile app before website is complete
- loyalty points before order system works
- barcode scanning before stock system works

Focus on one shop first.

---

## 18. Recommended Tech Stack

Use this stack:

- Design: Figma
- Design Guide: Apple Human Interface Guidelines
- Icons: SF Symbols + Lucide Icons
- Frontend: Next.js + React + TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Animation: Motion / Framer Motion
- Backend: Supabase
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
- Storage: Supabase Storage
- AI: OpenRouter or OpenAI API through backend only
- Telegram: Telegram Bot API + Telegraf.js
- Deployment: GitHub + Vercel
- Testing: Postman + Chrome DevTools

---

## 19. Build Order

Build in this order:

1. Figma design
2. database design
3. customer homepage
4. product catalog
5. product detail page
6. order form
7. receipt page
8. track order page
9. admin dashboard layout
10. product management
11. order management
12. stock management
13. Telegram notification
14. Find My Product
15. AI Product Advisor
16. payment verification later

---

## 20. Final Portfolio Description

Smart Digital Store System is a responsive one-shop digital store built for small businesses such as skincare shops. It allows customers to browse products, filter by skin concern, get AI product recommendations, order online, receive receipts, and track delivery.

The admin dashboard helps the shop owner manage products, stock, orders, promotions, delivery, and AI product data. Telegram automation sends order alerts, receipts, delivery updates, low-stock alerts, AI question summaries, and daily reports.

This project helps small shops look more professional, save time, reduce mistakes, improve customer trust, and manage their business more easily.

---

## 21. Final Instruction for AI Coding Assistant

When working on this project:

- Read this file before coding.
- Keep the project focused on one shop.
- Do not build unnecessary marketplace features.
- Build MVP first.
- Use clean, simple, maintainable code.
- Keep the UI clean, Apple-like, modern, and mobile-first.
- Do not expose API keys in frontend.
- Do not change unrelated files.
- Explain what files were changed after each task.