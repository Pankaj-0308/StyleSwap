
# SwapStyle – Community Clothing Exchange

SwapStyle is a web-based community clothing exchange platform that allows users to swap unused clothing through a point-based redemption system. The application encourages sustainable fashion, helps reduce textile waste, and promotes reusable garments instead of discarding them.

## 🚀 Hosted Application
**Live Link:** [https://styleswap-l60t.onrender.com]

---

## ✨ Features

- **User Authentication:** 
  - Register & sign in securely (using passwords hashed via `bcryptjs`).
  - Session security handled with JSON Web Tokens (JWT) stored in `HttpOnly` cookies.
- **Point-Based System:**
  - New registered accounts start with **100 points**.
  - Users spend points to buy items and earn points by listing and selling items.
- **Item Listings:**
  - Users can list clothes with key details: category, subcategory, size, condition, brand, color, custom points value, description, and images.
  - Delete or modify listings easily.
- **Request Transactions:**
  - Send purchase requests to sellers.
  - Sellers can approve (deducts points from buyer, awards them to seller, marks item as sold) or reject requests.
- **Interactive Dashboards:**
  - **User Dashboard:** Track points, view and manage listed items, and monitor requests.
  - **Admin Panel:** Administrative controls to monitor users, view platform statistics, and remove accounts if necessary.
- **Feedback Form:** Community members can share ratings and feedback.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript, [EJS (Embedded JavaScript Templates)](https://ejs.co/)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (using [Mongoose ODM](https://mongoosejs.com/))
- **Authentication:** `jsonwebtoken` & `bcryptjs`

---

## 📂 Project Structure

```text
SwapStyle/
├── Controller/          # Route controller logic (hostcontroller, usercontroller)
├── Models/              # Mongoose database models (Account, Addclothes, Feedback, PurchaseRequest)
├── Routes/              # Express routers (userrouter, hostrouter)
├── middleware/          # Authentication & Authorization middlewares
├── utils/               # Database connection and path helpers
├── views/               # EJS template views & partials (navbar, footer, head)
├── Public/              # Static assets (stylesheets, client JavaScript, images)
├── app.js               # Main Express application entry point
├── package.json         # Project metadata and dependencies
└── README.md            # Project documentation


