---
title: "ZiuuGas"
summary: "A comprehensive cross-platform mobile marketplace application for gas delivery and automotive accessories, featuring multi-role support (customers, delivery partners, promoters) with real-time order tracking, advanced payment integration, and serverless backend infrastructure"
tech: ["React Native", "TypeScript", "Kotlin", "Swift", "Firebase", "Firestore", "FCM", "Vercel", "Google Ads", "ImageKit", "React Navigation", "Zustand"]
github: "https://github.com/FahadIqball/ZiuuGas"
role: "Full Stack Mobile Developer & Product Architect"
period: "2025-Present"
layout: "split"
images:
  - "/images/projects/ziuugas/hero.png"
  - "/images/projects/ziuugas/features.png"
---

## Overview

**ZiuuGas** is a sophisticated cross-platform mobile marketplace application built with React Native that enables customers to order gas cylinders and automotive accessories with real-time delivery tracking. The platform supports multiple user roles (customers, delivery partners, promoters) and features advanced e-commerce capabilities, Firebase-powered authentication, real-time database synchronization, and a serverless Vercel backend for notifications and media management.

## The Challenge

Building a scalable multi-platform marketplace required solving several complex architectural problems:

- **Multi-role Authorization**: Different user types (customer, seller, delivery partner, promoter) with distinct screens and capabilities
- **Real-time Synchronization**: Instant order status updates, notifications, and inventory changes across distributed users
- **Payment Integration**: Secure transaction handling with multiple payment providers
- **Performance Optimization**: Managing hundreds of products and concurrent users without degradation
- **Media Management**: Efficient image handling and optimization for various device sizes
- **Scalability**: Building infrastructure to handle growth without backend bottlenecks
- **Cross-platform Consistency**: Unified experience across Android and iOS with native performance

## My Role & Contributions

### 🏗️ Architecture & Infrastructure Design
- Designed comprehensive mobile application architecture following MVVM and feature-based folder structure
- Established Firebase ecosystem integration (Authentication, Firestore, Cloud Messaging, Storage)
- Built serverless Vercel backend for FCM push notifications and ImageKit authentication
- Implemented context-based state management using React Context API and Zustand
- Designed role-based navigation system supporting customer, seller, delivery partner, and promoter flows
- Created reusable component library with unified design system

### 🎯 Core Features Implementation

**Multi-Role Navigation System**:
- **RootNavigator**: Authentication stack logic with Firebase Auth integration
- **MainStack**: Feature screens for orders, products, profile, wallet, tracking
- **MainTabs**: Bottom tab navigation with role-aware screen rendering
  - Customer View: Home, Orders, Offers, Profile
  - Seller View: Inventory management, notifications, earnings
  - Delivery Partner: Active deliveries, earnings, delivery confirmation
  - Promoter: Referral tracking, payout management

**Customer Features**:
- **HomeScreen**: Product catalog with category filtering, search functionality, and dynamic filtering
- **Product Discovery**: Featured products, accessories, gas cylinders with detailed information
- **Cart & Checkout**: Multi-item cart management with payment integration
- **Order Tracking**: Real-time GPS-based delivery tracking with map integration using React Native Maps
- **Order Management**: Order history, status tracking, cancellation, and reviews
- **Notifications**: Real-time push notifications using Firebase Cloud Messaging

**Marketplace Features**:
- **Offers System**: Customers request custom offers, sellers respond with pricing
- **Product Reviews & Ratings**: Community-driven ratings and reviews
- **Wallet System**: Digital wallet for transactions and earnings tracking
- **Address Management**: Multiple saved addresses for convenient checkout

**Seller Features**:
- **Inventory Management**: Add, edit, delete products in real-time
- **Order Management**: Accept/reject orders, manage fulfillment
- **Analytics Dashboard**: Sales metrics, earnings tracking, performance insights
- **Notifications**: Real-time order alerts and customer messages

**Delivery Partner Features**:
- **Active Deliveries**: Queue of assigned deliveries with priority management
- **Delivery Confirmation**: Photo evidence, signature capture, delivery updates
- **Earnings Dashboard**: Real-time earnings tracking and payout management
- **Route Optimization**: Efficient delivery route suggestions

**Promoter Features**:
- **Referral Tracking**: Unique referral codes, network metrics
- **Commission Management**: Real-time commission calculation
- **Payout System**: Scheduled payouts and earnings history
- **Network Analytics**: Referral performance and conversion metrics

### 💾 State Management & Context System

**LanguageContext** (Localization):
- Multi-language support (English, Spanish, Portuguese)
- MMKV-based persistent language preference
- Type-safe translation function (`t()`) with fallbacks
- JSON-based translation dictionaries

**ThemeContext** (Dark/Light Mode):
- System-aware theme detection
- Manual theme override capability
- Persistent theme preference storage
- Complete color palette definitions for both themes
- Dynamic styling throughout application

**AuthContext** (User Management):
- Firebase authentication integration
- User role management (customer, seller, partner, promoter)
- Profile data synchronization
- Session persistence

### 🎨 UI/UX Architecture

**Design System**:
- **Color System**: Dynamic theming with light/dark modes, comprehensive color tokens
- **Typography**: Scalable font system with multiple variants (H1, H2, Body, Caption)
- **Spacing System**: Responsive spacing using height percentage (hp) and width percentage (wp) utilities
- **Components Library**: Reusable components (Button, Input, Card, ScreenHeader, etc.)

**Responsive Design**:
- Responsive screen utilities (hp, wp) for device-agnostic layouts
- Safe area handling for notch devices
- Platform-specific styling for Android/iOS differences
- Gesture-aware interfaces with React Native Gesture Handler

### 🔧 Technical Implementations

**Firebase Integration**:
- **Authentication**: Email/password and Google OAuth sign-in
- **Firestore**: Real-time database for orders, products, users, offers
- **Cloud Messaging**: Push notifications for order updates, offers, messages
- **Storage**: Image hosting and retrieval for products and user profiles

**Serverless Backend** (Vercel):
- **FCM Endpoint**: Sends push notifications to users
- **ImageKit Authentication**: Generates signed URLs for media uploads/downloads
- Built with Node.js and TypeScript
- Environment-based configuration for API keys

**Media Management**:
- ImageKit integration for optimized image delivery
- Image picker for camera/gallery access
- Dynamic image resolution for different device sizes
- Lazy loading for performance optimization

**Notifications**:
- Real-time push notifications via Firebase Cloud Messaging
- Local notification handling
- Notification context for global state management

**Google Ads Integration**:
- Banner ad placements on home screen and order details
- AdMob setup for monetization
- Non-personalized ads option for privacy compliance

### 📦 Technology Stack

**Frontend**:
- React Native 0.85.2 with TypeScript 5.8.3
- React 19.2.3 for component management
- React Navigation 7.x for navigation (Bottom Tabs, Native Stack)
- React Native Reanimated 4.3.1 for smooth animations
- Zustand 5.0 for lightweight state management
- React Native Gesture Handler 2.31.2 for gesture recognition
- Firebase SDK (Auth, Firestore, Cloud Messaging) v24.x

**UI Components & Libraries**:
- React Native Responsive Screen for responsive design
- React Native Maps 1.27.2 for map integration and tracking
- React Native Image Picker 8.2.1 for media selection
- React Native Google Mobile Ads 16.3.3 for monetization
- React Native Ratings 8.1.0 for user ratings
- React Native MMKV 4.3.1 for persistent storage
- React Native Bootsplash 7.3.1 for app startup animation
- React Native Vector Icons for icon library
- React Native Linear Gradient for gradient backgrounds
- React Native SVG 15.15.4 for SVG support

**Backend**:
- Firebase (Authentication, Firestore, Cloud Messaging)
- Vercel Serverless Functions (Node.js)
- Firebase Admin SDK 12.x
- ImageKit SDK 5.0 for media management

**Build & Development**:
- Babel 7.25+ for JavaScript transpilation
- Metro bundler for React Native
- Jest 29 for unit testing
- ESLint for code quality
- Prettier for code formatting
- Node.js >= 22.11.0

## Key Features Implemented

### 🛍️ E-Commerce Capabilities

1. **Product Discovery & Search**
   - Dynamic category filtering
   - Full-text search across products
   - Featured products and recommendations
   - Product details with images, pricing, availability

2. **Shopping Cart & Checkout**
   - Add/remove items from cart
   - Quantity management
   - Price calculation with taxes/discounts
   - Multiple payment options

3. **Order Management**
   - Order history with filtering
   - Order status tracking
   - Cancellation with refund handling
   - Invoice generation

4. **Marketplace Offers**
   - Customer request offers from sellers
   - Seller counter-offers with pricing
   - Negotiation history
   - Accept/reject workflow

### 📍 Delivery & Tracking

1. **Real-time Order Tracking**
   - GPS-based live delivery tracking
   - Map visualization with React Native Maps
   - Delivery status timeline
   - ETA calculations

2. **Delivery Partner Management**
   - Assignment algorithms
   - Route optimization
   - Delivery confirmation with photo/signature
   - Performance ratings

### 💳 Payment & Wallet

1. **Multi-Payment Support**
   - Online payment integration
   - Wallet top-up system
   - Transaction history
   - Secure payment processing

2. **Earning Management**
   - Real-time earnings tracking
   - Commission calculations
   - Payout scheduling
   - Financial reports

### 🔔 Notifications & Messaging

1. **Push Notifications**
   - Order updates and status changes
   - Promotional offers
   - Delivery alerts
   - Real-time customer messages

2. **In-App Notifications**
   - Gas delivery reminders
   - Active order floating banner
   - System notifications

### 🌍 Localization & Personalization

1. **Multi-Language Support**
   - English, Spanish, Portuguese
   - Dynamic language switching
   - Type-safe translation system

2. **Theme System**
   - Light and dark modes
   - System-aware theme detection
   - User preference persistence
   - Consistent color theming

3. **User Preferences**
   - Saved addresses
   - Preferred payment methods
   - Notification settings
   - Account preferences

## Architecture Highlights

### Navigation Architecture
```
RootNavigator
├── AuthStack (Login, Signup)
└── MainStack (Authenticated users)
    └── MainTabs (Bottom Tab Navigation)
        ├── HomeTab (Customer/Seller/Partner specific)
        ├── OrdersTab
        ├── OffersTab
        └── ProfileTab
    └── Modal Screens (Order Details, Tracking, etc.)
```

### State Management Flow
```
Contexts (AuthContext, ThemeContext, LanguageContext)
    ↓
Components (using hooks)
    ↓
Custom Hooks (useHome, useCart, useOrders, etc.)
    ↓
Service Layer (Firebase, API calls)
    ↓
Data
```

### Feature-Based Folder Structure
```
src/
├── features/
│   ├── auth/ (LoginScreen, SignupScreen, services)
│   ├── home/ (HomeScreen, categories, products)
│   ├── products/ (ProductDetails, Inventory)
│   ├── cart/ (CartScreen, checkout)
│   ├── orders/ (OrdersScreen, OrderDetails, tracking)
│   ├── offers/ (OffersScreen, SendOffer)
│   ├── profile/ (ProfileScreen, PersonalInfo, Addresses)
│   ├── partner/ (DeliveryPartner features)
│   ├── promoter/ (Referral, Payouts)
│   └── notification/ (NotificationsScreen)
├── common/
│   ├── components/ (Button, Input, Card, etc.)
│   └── layouts/
├── context/ (AuthContext, ThemeContext, LanguageContext)
├── hooks/ (useTheme, useAuth, useTranslation, etc.)
├── services/ (Firebase, API, Storage)
├── enums/ (Colors, Typography, Spacing)
├── navigation/ (RootNavigator, MainStack, MainTabs)
└── utils/ (Storage, Validators, Helpers)
```

## Code Statistics

- **Total Files**: 100+ TypeScript/Kotlin/Swift source files
- **Frontend Code**: 8,000+ lines of React Native (TypeScript)
- **Backend Code**: 500+ lines of Vercel serverless functions
- **Components**: 50+ reusable UI components
- **Screens**: 20+ feature screens with role-based access
- **Languages Supported**: 3 (English, Spanish, Portuguese)
- **User Roles**: 4 (Customer, Seller, Delivery Partner, Promoter)

## Challenges Overcome

1. **Multi-Role Complexity**: Implemented flexible navigation system supporting 4+ user roles with distinct feature sets
2. **Real-Time Synchronization**: Leveraged Firestore listeners for instant data synchronization across users
3. **Offline Support**: Implemented local caching with MMKV for offline-first capabilities
4. **Performance**: Optimized FlatList rendering, lazy loading, and image optimization for smooth 60fps
5. **Payment Security**: Integrated secure payment gateways with PCI compliance
6. **Scale & Growth**: Serverless architecture for automatic scaling without infrastructure management
7. **Cross-Platform Consistency**: Unified codebase with platform-specific optimizations for Android/iOS
8. **Localization**: Type-safe i18n system supporting multiple languages and regional variations

## Advanced Features

- **Gesture-based Animations**: Smooth 60fps animations using React Native Reanimated
- **Real-time Notifications**: Firebase Cloud Messaging integration for push notifications
- **Geolocation Tracking**: GPS-based delivery tracking with map visualization
- **Image Optimization**: ImageKit integration for responsive image delivery
- **Monetization**: Google Mobile Ads integration for revenue generation
- **Persistent Storage**: MMKV for high-performance local data persistence
- **Serverless Backend**: Vercel functions for scalable microservices

## Learning Outcomes

- Large-scale cross-platform mobile application architecture
- Multi-role authorization and feature management systems
- Real-time database design and synchronization patterns
- Firebase ecosystem (Auth, Firestore, Cloud Messaging, Storage)
- Serverless architecture and deployment (Vercel)
- Advanced React Native performance optimization
- State management patterns (Context API, Zustand)
- E-commerce system design and implementation
- Payment integration and financial workflows
- Geolocation and mapping integration
- Localization and internationalization strategies
- Design system and component library development

## Project Impact

- **Scalable Architecture**: Supports thousands of concurrent users
- **Multi-Platform**: Single React Native codebase for iOS and Android
- **Real-Time Features**: Instant order updates and notifications
- **Monetization**: Multiple revenue streams (commissions, ads, subscriptions)
- **User Growth**: Referral system driving organic growth
- **Operational Efficiency**: Automated delivery assignment and optimization

## Live Demo & Resources

- **GitHub**: [FahadIqball/ZiuuGas](https://github.com/FahadIqball/ZiuuGas)
- **Type**: Private repository (proprietary mobile application)
- **Status**: Active development and deployment

---

**Skills Demonstrated**: Mobile Development • React Native • TypeScript • Full-Stack Architecture • Firebase • Serverless Backend • E-Commerce Systems • Payment Integration • Real-Time Data • Geolocation Services • Multi-Language Support • State Management • Component Architecture • Cross-Platform Development • Scalability Design
