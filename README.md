# 🌾 AgroSmart — AI-Powered Crop Recommendation System

A full-stack web application using **MEAN Stack** (MongoDB, Express.js, Angular 21, Node.js) with a **Python ML microservice** that recommends optimal crops based on soil quality, weather conditions, and location. Includes real-time crop rate tracking across all 36 Indian States & UTs.

## 🏗️ Architecture

```
┌────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Angular 21    │────▶│  Node.js/Express  │────▶│  Python/Flask    │
│  Frontend      │     │  Backend API      │     │  ML Service      │
│  (Port 4200)   │     │  (Port 3000)      │     │  (Port 5000)     │
└────────────────┘     └──────────────────┘     └──────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  MongoDB         │
                       │  (Port 27017)    │
                       └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **Python** 3.9+
- **MongoDB** (local or Atlas)

### 1. Initial Setup
Run these commands to install dependencies for all services and train the ML model:
```bash
# Install root dependencies
npm install

# Install Backend dependencies
cd server && npm install && cd ..

# Install Frontend dependencies
cd client && npm install && cd ..

# Install ML Service dependencies & train model
cd ml-service
pip install -r requirements.txt
python train_model.py
cd ..
```

### 2. Start All Services
Run this single command from the root directory to start the ML Service, Backend, and Frontend simultaneously:
```bash
npm start
```
- **Frontend** runs on http://localhost:4200
- **Backend** runs on http://localhost:3000
- **ML Service** runs on http://localhost:5000


## 📊 Features

| Feature | Description |
|---------|------------|
| 🤖 AI Recommendations | Random Forest ML model with 95%+ accuracy |
| 📈 Price Tracking | Real-time crop prices from data.gov.in API |
| 📊 Interactive Charts | Chart.js visualizations for price trends |
| 🔐 Authentication | JWT-based signup/login system |
| 📱 Responsive | Works on desktop, tablet, and mobile |
| 🌗 Theme Support | Dynamic light and dark themes with premium glassmorphism |

## 🔑 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Recommendations
- `POST /api/recommendations/predict` - Get crop recommendation
- `GET /api/recommendations/history` - Get recommendation history
- `GET /api/recommendations/stats` - Get user stats

### Crop Prices
- `GET /api/crop-prices/search` - Search crop prices
- `GET /api/crop-prices/states` - List states
- `GET /api/crop-prices/commodities` - List commodities
- `GET /api/crop-prices/trends` - Get price trends

## 📁 Tech Stack

- **Frontend**: Angular 21 (Zoneless, Standalone), SCSS, Chart.js
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **ML**: Python, scikit-learn, Flask
- **Auth**: JWT, bcrypt
- **API**: data.gov.in (AGMARKNET)
