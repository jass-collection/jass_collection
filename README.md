# Jass Collection - Designer Suits E-commerce

A modern e-commerce platform for designer suits built with Next.js, featuring authentication, geolocation-based pricing, and admin management.

## Features

- **Modern Next.js App Router** - Latest Next.js conventions with app router
- **Authentication System** - Local email/password auth + social login (Google, Facebook)
- **Geolocation & Internationalization** - Auto-detect location for currency and shipping
- **Admin Dashboard** - Product management with image/video uploads
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Role-based Access** - Customer and admin roles with protected routes
- **Shopping Cart** - Local storage cart with state management

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Authentication**: NextAuth.js, JWT tokens, bcryptjs
- **Data Storage**: JSON files (ready for Firebase migration)
- **File Uploads**: Formidable, local file storage
- **Geolocation**: Browser API + IP geolocation fallback

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd jass_collection
npm install
```

### 2. Environment Setup

```bash
cp env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Required: Generate a random 32+ character string
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters

# Required for social login
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Optional: For Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: For Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Credentials

**Admin Account:**
- Email: `admin@jasscollection.test`
- Password: `password`

**Customer Account:**
- Email: `customer@test.com`
- Password: `password`

## API Endpoints

### Public Routes
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Single product details
- `GET /api/countries` - Countries and states data
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Admin Routes (Authentication Required)
- `GET /api/admin/products` - Admin product list
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/upload` - Upload images/videos

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart page
│   ├── login/             # Login page
│   ├── products/          # Product pages
│   └── register/          # Registration page
├── components/            # Reusable components
├── lib/                   # Utilities
│   ├── auth.js           # JWT & password utilities
│   └── data.js           # JSON data operations
├── middleware.js         # Route protection
└── pages/api/auth/       # NextAuth configuration
data/                     # JSON data files
├── products.json         # Product catalog
├── users.json           # User accounts
└── countries_states.json # Geography data
```

## Key Features Guide

### Geolocation & Currency

The app automatically detects user location and displays:
- **India**: Prices in ₹ (INR), Indian states for delivery
- **UK**: Prices in £ (GBP), UK regions for delivery  
- **Canada**: Prices in C$ (CAD), Canadian provinces for delivery
- **US**: Prices in $ (USD), US states for delivery

### Admin Features

Access admin dashboard at `/admin/dashboard` (admin login required):
- View site statistics
- Add/edit/delete products
- Upload product images and videos
- Manage inventory and pricing

### Authentication Flow

1. **Local Auth**: Email/password with bcrypt hashing
2. **Social Auth**: Google and Facebook OAuth via NextAuth.js
3. **JWT Tokens**: Secure API access with HTTP-only cookies
4. **Role Protection**: Middleware protects admin routes

## Configuration Required

### 1. OAuth Setup (Optional)

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect: `http://localhost:3000/api/auth/callback/google`

**Facebook OAuth:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create app → Add Facebook Login
3. Add redirect URI: `http://localhost:3000/api/auth/callback/facebook`

### 2. File Uploads

Create uploads directory:
```bash
mkdir -p public/uploads
```

Ensure write permissions for the uploads folder.

## Migration to Firebase

The app is structured for easy Firebase migration:

1. **Replace `lib/data.js`** - Swap JSON operations with Firestore calls
2. **Update file uploads** - Change from local storage to Firebase Storage
3. **Environment variables** - Add Firebase config to `.env.local`

All data operations are abstracted in `lib/data.js` with TODO comments marking Firebase replacement points.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Configure proper OAuth redirect URLs for your domain
3. Set secure JWT secrets
4. Enable HTTPS for secure cookies

## License

This project is created for educational purposes. Customize as needed for your business requirements.
