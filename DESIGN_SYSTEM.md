# DESIGN_SYSTEM.md

# Design System

## Goal

The design must feel:

- Apple-like
- Clean
- Modern
- Soft
- Premium
- Mobile-first
- Easy to use
- Trustworthy

First demo: skincare shop.

The UI should look like a premium skincare store, not a messy product list.

---

## Visual Style

Use a soft skincare style.

Recommended colors:

```text
Background: #FFFFFF
Off White: #FAFAF7
Soft Cream: #F7EFE5
Soft Pink: #F8DDEB
Soft Green: #DDEFE3
Text Dark: #1F2937
Text Gray: #6B7280
Border Gray: #E5E7EB
Success: #16A34A
Warning: #F59E0B
Error: #DC2626
```

Design feeling:

```text
White space
Soft cards
Rounded corners
Light borders
Soft shadows
Clean typography
Simple icons
Smooth small animations
```

---

## Typography

Use a clean font.

Recommended:

```text
Inter
SF Pro style
System font
```

Suggested sizes:

```text
Hero title: 36–56px
Section title: 24–32px
Card title: 16–20px
Body text: 14–16px
Small text: 12–14px
Button text: 14–16px
```

Text must be readable on mobile.

---

## Spacing

Use generous spacing.

Suggested spacing:

```text
Mobile page padding: 16px
Tablet page padding: 24px
Desktop page padding: 64–96px
Card padding: 16–24px
Section spacing: 56–96px
Button padding: 12px 18px
```

Keep layout breathable and not crowded.

---

## Radius and Shadows

Use rounded corners:

```text
Buttons / inputs: 12px
Product cards: 20px
Hero cards: 28px
Dashboard cards: 20px
Modals: 24px
```

Use soft shadows only.

Cards can use:

```text
Light border + soft shadow
```

---

## Buttons

Primary buttons are for main actions:

```text
Shop Now
Order Now
Submit Order
Ask AI Advisor
Save Product
Update Order
```

Secondary buttons are for supporting actions:

```text
View Detail
Track Order
Contact Shop
Cancel
```

Button rules:

```text
Minimum height: 44px
Clear label
Rounded corners
Soft hover effect
Loading state when submitting
Disabled state when invalid
```

---

## Product Card

Product card must show:

```text
Product image
Badge
Product name
Brand
Price
Skin concern
Stock status
View Detail button
Order button
```

Style:

```text
White card
Rounded corners
Soft border
Soft shadow
Large image
Clear price
Good spacing
```

Badges:

```text
Best Seller
Hot Sale
New Arrival
Low Stock
AI Pick
Recommended
```

---

## Product Detail Page

Product detail must show:

```text
Product images
Product name
Brand
Price
Stock status
Main benefit
Best for skin type
Best for skin concern
How to use
Key ingredients
Related products
Order Now button
```

Desktop layout:

```text
Left: product images
Right: product information
Below: details and related products
```

Mobile layout:

```text
Product image first
Product info below
Order button easy to tap
```

---

## Home Page

Home page sections:

```text
Promotion Hero
Best Sellers
New Arrivals
Shop by Skin Concern
AI Product Advisor CTA
Popular Brands
Hot Sale
Customer Reviews
Contact CTA
```

Hero should include:

```text
Short headline
Short subtitle
Product/skincare visual
Primary CTA
Secondary CTA
```

Example:

```text
Glow Up Sale
Find the best skincare product for your skin.
Shop by concern or ask our AI Product Advisor.
```

---

## Find My Product Page

Design as a simple step-by-step quiz.

Must include:

```text
Progress indicator
Large answer cards
Clear next button
Result page with recommended products
```

Quiz topics:

```text
Skin type
Skin concern
Budget
Product needed
```

Result card should show:

```text
Recommended product
Short reason
View Detail button
Order button
```

---

## AI Product Advisor

AI page should feel like a helpful shopping assistant.

Layout:

```text
Chat interface
Suggested question chips
AI answer area
Product recommendation cards
Safety note
```

Suggested question chips:

```text
I have acne
I have oily skin
I need sunscreen
Build routine under $30
Compare these products
```

AI answer should be short and easy to read.

---

## Order Form

Order form fields:

```text
Name
Phone
Telegram username or phone
Product
Quantity
Address
Delivery option
Note
```

Rules:

```text
Use clear labels
One column on mobile
Show required fields
Show friendly validation
Use loading state on submit
```

---

## Receipt Page

Receipt should feel trustworthy.

Receipt card shows:

```text
Receipt ID
Order ID
Customer name
Product list
Total price
Payment status
Order status
Date
Shop contact
```

Actions:

```text
Copy Order ID
Track Order
Contact Shop
```

Use clear status badges.

---

## Track Order Page

Customer enters:

```text
Order ID
Phone number
```

Result shows:

```text
Order status
Payment status
Delivery status
Tracking code
Delivery note
Estimated delivery date
```

Use delivery timeline:

```text
Order Created
Payment Successful
Preparing
Delivering
Completed
```

---

## Admin Dashboard

Admin dashboard should be clean and practical.

Sections:

```text
Overview
Products
Orders
Stock
Promotions
Delivery
Customers
AI Product Data
Analytics
Settings
```

Dashboard cards:

```text
Today Orders
Today Revenue
Paid Orders
Low Stock
Best Seller
```

Admin UI rules:

```text
Simple sidebar
Clear top bar
Readable tables
Status badges
Easy forms
Search and filters
```

---

## Status Badges

Use text + color.

Order statuses:

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

Payment statuses:

```text
Payment Pending
Payment Submitted
Payment Successful
Payment Failed
Payment Expired
Refunded
```

Delivery statuses:

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

## Empty and Error States

Use friendly messages.

Examples:

```text
No products yet. Add your first product to start your store.
No orders yet. New customer orders will appear here.
No matching products found. Try another keyword or filter.
We could not find your order. Please check your Order ID and phone number.
Something went wrong. Please try again.
```

Do not show technical errors to customers.

---

## Animation

Use subtle animation only:

```text
Card hover lift
Button press effect
Page fade in
AI message fade in
Receipt success checkmark
Delivery timeline transition
```

Keep motion smooth and not distracting.

---

## Icons

Use:

```text
Lucide React
SF Symbols reference
```

Useful icons:

```text
ShoppingBag
Search
Sparkles
Bot
Receipt
Truck
CreditCard
Package
ChartBar
Bell
User
ShieldCheck
Settings
```

Icons support text. Do not use icon-only buttons unless very clear.

---

## Responsive Rules

Customer website must work well on:

```text
Phone
Tablet
Laptop
Desktop
```

Rules:

```text
No horizontal overflow
Cards resize properly
Images stay responsive
Buttons easy to tap
Text readable
Filters work on mobile
Order form works on mobile
Receipt is easy to read
```

Admin dashboard is mainly tablet/desktop, but should not break on mobile.

---

## Final Rule

Make every screen:

```text
Clean
Soft
Apple-like
Mobile-first
Easy to understand
Not crowded
```