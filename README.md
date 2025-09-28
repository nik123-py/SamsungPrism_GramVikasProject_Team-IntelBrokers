# Gram Vikas Agricultural Marketplace Platform

**Team**: IntelBrokers  
**Hackathon**: Samsung PRISM GenAI Hackathon 2025  
**Submission Tag**: `SamsungPRISMGenAIHackathon2025`

**Demo Video**: https://drive.google.com/file/d/16I97oxgyqRVKZwcrvVrfy9Gl_AMwIm8R/view?usp=sharing

## 🌾 Project Overview

Gram Vikas is a comprehensive agricultural marketplace platform designed to bridge the gap between rural farmers and urban buyers. The platform provides real-time analytics, multi-role dashboards, and innovative features tailored for agricultural communities in India.

## 🚀 Key Features

### 🏪 Agricultural Marketplace
- **Product Listings**: Farmers can list agricultural products with detailed descriptions
- **Bidding System**: Real-time auction system for fair price discovery
- **Search & Filter**: Advanced product search with categories and filters
- **Order Management**: Complete order processing workflow
- **Payment Integration**: Secure Razorpay payment gateway

### 👥 Multi-Role User Management
- **Buyer Dashboard**: Purchase analytics, order tracking, spending patterns
- **Farmer Dashboard**: Sales analytics, listing management, revenue tracking
- **Admin Dashboard**: Platform-wide analytics, user management, system monitoring
- **Hub Operator Dashboard**: Hub-specific analytics, logistics management
- **SHG Leader Dashboard**: Group analytics, member management, collective sales

### 📊 Real-time Analytics
- **Live Charts**: 4 chart types (line, bar, pie) updating every 5 seconds
- **User Growth Tracking**: Monthly user registration trends
- **Transaction Volume**: Real-time transaction monitoring
- **Revenue Analytics**: Category-wise revenue breakdown
- **User Distribution**: Role-based user analytics

### 📱 Rural Technology Integration
- **USSD Support**: Mobile USSD integration for feature phones
- **OTP Authentication**: SMS-based verification for rural users
- **Offline Capability**: Designed for low-connectivity areas
- **Multi-language Support**: Hindi and English interface

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Authentication**: JWT tokens with OTP verification
- **API Design**: RESTful API with comprehensive endpoints
- **Data Storage**: In-memory storage with mock data
- **Security**: Rate limiting, input validation, CORS protection

### Frontend
- **Framework**: Next.js 15.5.4 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Recharts library for data visualization
- **State Management**: React hooks and context
- **Real-time**: Automatic data refresh every 5 seconds

### Data Simulation
- **Language**: Python 3.x
- **Libraries**: requests, json, time, threading
- **Architecture**: Multi-threaded simulators for each user role
- **Data Flow**: HTTP POST requests to backend analytics endpoints

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nik123-py/SamsungPrism_GramVikasProject_Team-IntelBrokers.git
   cd SamsungPrism_GramVikasProject_Team-IntelBrokers
   ```

2. **Start Backend Server**
   ```bash
   cd uploads/workspace/backend
   npm install
   node mock-server.js
   ```

3. **Start Frontend Application**
   ```bash
   cd uploads/workspace/frontend
   npm install
   npm run dev
   ```

4. **Start Chart Simulators** (Optional - for live data)
   ```bash
   cd uploads/workspace/chart_simulator
   pip install -r requirements.txt
   python startup.py
   ```

### Access the Application
- **Frontend**: http://localhost:3001
- **Analytics Dashboard**: http://localhost:3001/analytics
- **Backend API**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000/health

## 🔐 Test Credentials

| Role | Mobile | OTP |
|------|--------|-----|
| **Buyer** | 9876543211 | 123456 |
| **Farmer** | 9876543210 | 123456 |
| **Admin** | 9999999999 | 123456 |
| **Hub Operator** | 8888888888 | 123456 |
| **SHG Leader** | 7777777777 | 123456 |

## 📁 Project Structure

```
SamsungPrism_GramVikasProject_Team-IntelBrokers/
├── uploads/workspace/
│   ├── backend/                 # Node.js API server
│   │   ├── controllers/         # Business logic
│   │   ├── routes/             # API endpoints
│   │   ├── models/             # Data models
│   │   ├── middleware/         # Authentication & validation
│   │   └── mock-server.js      # Main server file
│   ├── frontend/               # Next.js React application
│   │   ├── components/         # React components
│   │   ├── pages/             # Next.js pages
│   │   ├── lib/               # API client & utilities
│   │   └── styles/            # CSS styles
│   └── chart_simulator/        # Python data simulators
│       ├── *_simulator.py     # Role-specific simulators
│       ├── main_simulator.py  # Main orchestrator
│       └── startup.py         # Automated startup
├── gram_vikas_prd.md          # Product Requirements Document
├── gram_vikas_system_design.md # System Design Document
├── project_analysis.md        # Project Analysis
└── README.md                  # This file
```

## 🎯 Key Features Demo

### Real-time Analytics Dashboard
- Visit `/analytics` to see live charts updating every 5 seconds
- View user growth trends, transaction volumes, and revenue analytics
- Interactive charts with hover effects and data tooltips

### Multi-Role Dashboards
- Each user role has a customized dashboard
- Role-specific analytics and features
- Responsive design for all device sizes

### Agricultural Marketplace
- Browse products by category
- Place bids on agricultural products
- Track orders and payments
- Manage product listings

## 🔧 Development

### Backend Development
```bash
cd uploads/workspace/backend
npm install
node mock-server.js
```

### Frontend Development
```bash
cd uploads/workspace/frontend
npm install
npm run dev
```

### Running Tests
```bash
cd uploads/workspace/chart_simulator
python test_analytics.py
```

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login with OTP
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/verify-otp` - OTP verification

### Marketplace
- `GET /api/v1/marketplace/listings` - Get product listings
- `POST /api/v1/marketplace/listings` - Create new listing
- `GET /api/v1/marketplace/search` - Search products

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard analytics
- `GET /api/v1/analytics/users/:id` - User-specific analytics
- `POST /api/v1/analytics/dashboard` - Store analytics data

## 🌟 Innovation Highlights

### Agricultural Technology
- **Rural-First Design**: Built specifically for agricultural communities
- **Multi-Device Support**: Works on smartphones and feature phones
- **Real-time Analytics**: Live data visualization for informed decisions
- **Offline Capability**: Designed for areas with limited connectivity

### Technical Innovation
- **Real-time Data Pipeline**: Python simulators → Backend API → Frontend Charts
- **Multi-threaded Architecture**: Concurrent data generation and processing
- **Responsive Analytics**: Charts update automatically every 5 seconds
- **Mock API Strategy**: Complete API simulation for demonstration

## 🤝 Contributing

This project was developed for the Samsung PRISM GenAI Hackathon 2025. For questions or feedback, please contact the IntelBrokers team.

## 📄 License

This project is developed for the Samsung PRISM GenAI Hackathon 2025 submission.

## 🏆 Samsung PRISM GenAI Hackathon 2025

**Repository**: https://github.com/nik123-py/SamsungPrism_GramVikasProject_Team-IntelBrokers  
**Submission Tag**: `SamsungPRISMGenAIHackathon2025`  
**Team**: IntelBrokers  
**Project**: Gram Vikas Agricultural Marketplace Platform

### Submission Highlights
- ✅ Complete agricultural marketplace platform
- ✅ Real-time analytics with live chart updates
- ✅ Multi-role user management system
- ✅ Rural technology integration (USSD, OTP)
- ✅ Responsive design for all devices
- ✅ Comprehensive API with mock data
- ✅ Python simulators for live data generation
- ✅ Production-ready codebase with documentation

---

**Built with ❤️ by Team IntelBrokers for Samsung PRISM GenAI Hackathon 2025**
