
# Fashion Store - E-commerce Student Project

A secure, responsive fashion e-commerce platform built with React, Tailwind CSS, and TypeScript. This project simulates a marketplace like Meesho, featuring user shopping, personalized filtering, and a secure admin dashboard.

## 🚀 Setup Instructions

1.  **Extract the project**: Ensure all files are in a single directory.
2.  **Dependencies**: The project uses CDNs for Tailwind and standard React libraries. To run locally, ensure you have Node.js installed.
3.  **Run with Vite/Create React App**:
    *   Initialize a new React project: `npm create vite@latest fashion-store -- --template react-ts`
    *   Replace the generated `src` files with the files provided in this code block.
    *   Install Router: `npm install react-router-dom`
    *   Start development server: `npm run dev`
4.  **Admin Access**:
    *   Navigate to the footer and click "Admin Portal" or go to `#/admin-login`.
    *   **Email**: `admin@fashionstore.com`
    *   **Password**: `adminpassword123`

## 🛠 Features Implemented

*   **Custom Authentication**: Context-based session management for Users and Admins.
*   **Protected Routes**: Prevents unauthorized access to shopping and admin pages.
*   **Persistent State**: Uses `localStorage` to keep products and orders even after refresh.
*   **Smart Sorting**: Prioritizes products based on User's Age and Gender selection.
*   **Mock Payment**: Simulates a secure checkout experience with form validation.
*   **Admin Dashboard**: Full CRUD-like interface for managing inventory and tracking sales.

## 🌟 Future Improvements (Student Tasks)

1.  **Backend Integration**: Replace `localStorage` with a real database like **Firebase** or **MongoDB** using an Express.js backend.
2.  **Image Uploads**: Implement a real image upload service using Cloudinary or Firebase Storage instead of placeholder URLs.
3.  **Search Bar**: Add a global search functionality in the Navbar to find products by name.
4.  **Product Reviews**: Allow users to leave ratings and text reviews for dresses.
5.  **Order Tracking**: Create a user profile page where customers can see their order history and current status.
6.  **Dark Mode**: Add a theme switcher using Tailwind's `dark:` utility classes.
7.  **Real Payment Gateway**: Integrate the Stripe or Razorpay SDK for actual payment processing.

---
*Created with ❤️ for web development students.*
