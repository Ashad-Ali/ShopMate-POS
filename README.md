# 🛒 ShopMate-POS (Full-Stack Enterprise Solution)

ShopMate-POS is a robust, full-stack Point of Sale system designed for seamless retail operations. It features a secure admin dashboard, real-time inventory tracking, and an intelligent billing system with built-in stock validation.

---

## 🚀 Live Demo
**Access the Application:** https://shop-mate-pos-frontend.vercel.app/

*(Note: Admin-only access. Sign-up is disabled for security.)*

---

## ✨ Key Modules & Features

### 🏢 1. Admin Dashboard & Analytics
- **Total Revenue Tracking:** Automatically calculates and displays **Today's Sales** summary.
- **Secure Access:** Only pre-registered admins can log in (JWT Protected).

### 📦 2. Advanced Inventory Management (CRUD)
- **Full Control:** Add, view, edit, and delete products effortlessly.
- **Search Functionality:** Quickly find any product using the built-in **Search Bar**.
- **Real-time Stock Status:** Monitor current stock levels for every item in the list.

### 💳 3. Intelligent POS (Billing) System
- **Smart Search:** Find products in the billing tab instantly to speed up the checkout process.
- **Stock Validation (Crucial):**
  - **Over-selection Protection:** Users cannot select more items than what is available in stock.
  - **Zero Stock Alert:** If a product is out of stock (0 quantity), it is automatically disabled and cannot be added to the cart.
- **Dynamic Billing:** Real-time calculation of subtotals and grand totals as you adjust the cart.

### 📑 4. Structured Navigation
- **Inventory Tab:** Dedicated space for stock management and data entry.
- **Billing Tab:** Focused environment for processing customer orders and payments.

---

## 🛠 Tech Stack
- **Frontend:** React.js (Context API for state management)
- **Backend:** Node.js & Express (Serverless Architecture)
- **Database:** MongoDB Atlas (Mongoose)
- **Deployment:** Vercel

---

## 📂 Project Structure
```text
ShopMate-POS/
├── frontend/      # React Client (Inventory & Billing Modules)
├── backend/       # Node.js API (Sales & Product Logic)
└── README.md      # Documentation
```

---

## ⚙️ How to Setup and Use this Repo

Follow these steps to get the project running on your local machine:

---

## 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/Ashad-Ali/ShopMate-POS.git
cd ShopMate-POS
```

---

## 2. Setup the Backend

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```
### Environment Variables

Create a `.env` file in the backend folder and add your credentials:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
Run the backend:

```bash
npm run dev
# or
npm start
```

---

## 3. Setup the Frontend

Open a new terminal, navigate to the frontend folder, and install dependencies:

```bash
cd frontend
npm install
```
Run the frontend:

```bash
npm run dev
# or
npm start
```

---

## 4. Database Setup

> **Note:**  
> Since signup is disabled for security reasons, you must manually add an **admin user** to your MongoDB `users` collection to log in for the first time and also replace this url "https://shopmate-pos.vercel.app/..." with the local "http://localhost:5000/... to run it on your local machine".


