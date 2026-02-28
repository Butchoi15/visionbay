# VisionBay 🔐

A modern e-commerce platform for security cameras, NVRs, and surveillance accessories, built with React, TypeScript, and Firebase.

## ✨ Features

- **Product Catalog** — Browse IP cameras, NVR/DVR recorders, accessories, and more
- **Smart Search** — Full-text search across product names, descriptions, and categories
- **Inquiry System** — "Ask for Availability" flow linked to Admin fulfilment workflow
- **Checkout Flow** — Shipping details form with mandatory email and real-time order tracking
- **User Dashboard** — View orders, edit pending shipping details, track notifications
- **Admin Dashboard** — Manage orders, update tracking numbers, add/edit products
- **Multi-Image Gallery** — Products support multiple images with a clickable gallery viewer
- **Firebase Backend** — Authentication, Firestore database, and Storage for image uploads
- **Admin Notifications** — Admins are notified instantly when a new inquiry or order arrives

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Storage | Firebase Storage |
| Icons | Lucide React |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Firebase](https://console.firebase.google.com) project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/visionbay.git
   cd visionbay
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then open `.env.local` and fill in your Firebase project credentials.

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔑 Environment Variables

Create a `.env.local` file in the root directory. See `.env.example` for the full template.

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

## 📦 Build

```bash
npm run build
```

The output will be in the `dist/` folder.

## 🔒 Firebase Security

Make sure to configure **Firestore Security Rules** and **Storage Security Rules** in your Firebase console to protect your data in production.
