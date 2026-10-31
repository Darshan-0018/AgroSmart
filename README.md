# 🌾 AgroSmart — AI-Powered Crop Recommendation & Market Intelligence

[![MEAN Stack](https://img.shields.io/badge/Stack-MEAN-green.svg)](https://en.wikipedia.org/wiki/MEAN_(solution_stack))
[![Angular](https://img.shields.io/badge/Angular-21-red.svg)](https://angular.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-orange.svg)](https://scikit-learn.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**AgroSmart** is a full-stack smart agriculture platform built on the **MEAN Stack** (MongoDB, Express.js, Angular 21, Node.js) paired with a **Python ML microservice**. It empowers farmers, agricultural enthusiasts, and agribusinesses to make data-driven farming decisions by predicting the most suitable crops based on soil nutrients and meteorological parameters, alongside real-time agricultural mandi commodity price tracking across all **36 Indian States & Union Territories**.

---

## 📑 Table of Contents

- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Install Dependencies & Setup ML Model](#2-install-dependencies--setup-ml-model)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Start All Services](#4-start-all-services)
- [Environment Configuration](#-environment-configuration)
- [API Reference](#-api-reference)
- [Machine Learning Microservice](#-machine-learning-microservice)
- [Screenshots & UI](#-screenshots--ui)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏗️ Architecture

```
┌─────────────────────────┐          ┌──────────────────────────┐          ┌──────────────────────────┐
│   Angular 21 Client     │ ───────▶ │   Node.js / Express API  │ ───────▶ │   Python / Flask ML      │
│   (Port 4200)           │ ◀─────── │   (Port 3000)            │ ◀─────── │   (Port 5000)            │
│   Standalone & Zoneless │          │   JWT, Validations, Auth │          │   Random Forest Model    │
└─────────────────────────┘          └──────────────────────────┘          └──────────────────────────┘
                                                   │
                                                   ▼
                                     ┌──────────────────────────┐
                                     │   MongoDB Database       │
                                     │   (Port 27017 / Atlas)   │
                                     └──────────────────────────┘
```

---

## 🌟 Key Features

- 🤖 **AI Crop Recommendations**: High-accuracy Random Forest classifier (95%+ accuracy) analyzing Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), Temperature, Humidity, Soil pH, and Rainfall.
- 📈 **Real-Time Mandi Price Tracker**: Live commodity pricing fetched across 36 Indian States & UTs via the official `data.gov.in` (AGMARKNET) API.
- 📊 **Interactive Analytics**: Interactive Chart.js visualizations for commodity price fluctuations, trends, and recommendation history.
- 🔐 **Authentication & Password Recovery**:
  - Secure JWT authentication & bcrypt password hashing.
  - User profile management.
  - **Forgot & Reset Password** flow with secure, time-limited tokens.
  - SMTP email dispatch with automated dev-mode console fallback for zero-setup local testing.
- 🌓 **Modern Theming & Glassmorphism UI**: Dynamic Dark/Light mode toggle, responsive layout tailored for mobile, tablet, and desktop devices.
- ⚡ **Cutting-Edge Frontend**: Angular 21 utilizing Standalone Components, reactive signals, and Zoneless change detection for optimal performance.

---

## 📁 Project Structure

```text
AgroSmart/
├── client/                     # Angular 21 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Guards, interceptors, auth/theme/API services
│   │   │   ├── features/       # Auth (login, register, forgot/reset password),
│   │   │   │                   # dashboard, crop tracker, recommendations, home
│   │   │   └── shared/         # Navbar, footer, reusable UI components
│   │   └── styles.scss         # Global SCSS & glassmorphic theme definitions
│   └── package.json
│
├── server/                     # Node.js / Express.js Backend
│   ├── src/
│   │   ├── config/             # Database connection & environment configuration
│   │   ├── features/           # Auth, crop-prices, recommendation, user logic
│   │   ├── middleware/         # JWT auth, error handlers, request validation
│   │   ├── utils/              # Email delivery utility (Nodemailer)
│   │   └── index.js            # Express application bootstrap
│   ├── .env.example            # Environment variables template
│   └── package.json
│
├── ml-service/                 # Python Machine Learning Microservice
│   ├── data/                   # Crop recommendation datasets (CSV)
│   ├── models/                 # Serialized scikit-learn models & encoders (.pkl)
│   ├── app.py                  # Flask API microservice
│   ├── train_model.py          # Model training and evaluation script
│   └── requirements.txt        # Python dependencies
│
├── package.json                # Root orchestration (Concurrently)
└── README.md                   # Project documentation
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **Python**: v3.9 or higher ([Download](https://www.python.org/))
- **MongoDB**: Local MongoDB instance running on port `27017` or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **npm** or **yarn**

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/<your-username>/AgroSmart.git
cd AgroSmart
```

### 2. Install Dependencies & Setup ML Model

Install root, backend, frontend, and ML dependencies in sequence:

```bash
# 1. Install root dependencies (concurrently)
npm install

# 2. Install backend dependencies
cd server
npm install
cd ..

# 3. Install frontend dependencies
cd client
npm install
cd ..

# 4. Install ML microservice dependencies & train model
cd ml-service
pip install -r requirements.txt
python train_model.py
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp server/.env.example server/.env
```

Adjust the variables in `server/.env` as needed (see [Environment Configuration](#-environment-configuration)).

### 4. Start All Services

Run this single command from the project root to start the **ML Microservice**, **Backend API**, and **Angular Frontend** concurrently:

```bash
npm start
```

| Service | URL | Description |
|---|---|---|
| **Frontend** | [http://localhost:4200](http://localhost:4200) | Angular 21 Single Page Application |
| **Backend API** | [http://localhost:3000](http://localhost:3000) | Express REST API |
| **ML Microservice** | [http://localhost:5000](http://localhost:5000) | Flask ML prediction service |

> *Tip: You can also run any service independently using `npm run start:frontend`, `npm run start:backend`, or `npm run start:ml` from the root directory.*

---

## 🔑 Environment Configuration

The backend looks for environment variables in `server/.env`. Below is a breakdown of available keys:

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `3000` | Port for Express backend |
| `NODE_ENV` | `development` | Environment mode (`development` / `production`) |
| `MONGODB_URI` | `mongodb://localhost:27017/crop-recommendation` | MongoDB connection string |
| `JWT_SECRET` | `your_secret_key` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
| `ML_SERVICE_URL` | `http://localhost:5000` | Address of the Flask ML microservice |
| `CLIENT_URL` | `http://localhost:4200` | Frontend client URL (configured in CORS) |
| `DATA_GOV_API_KEY` | *(Optional / demo key)* | API Key from [data.gov.in](https://www.data.gov.in/) |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP host for password reset emails |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_EMAIL` | *(Optional)* | Sender email address |
| `SMTP_PASSWORD` | *(Optional)* | Sender email App Password |
| `FROM_EMAIL` | `noreply@agrosmart.com` | From email header |
| `FROM_NAME` | `AgroSmart Support` | From name header |

> 💡 **Developer Convenience**: If `SMTP_EMAIL` and `SMTP_PASSWORD` are left blank, AgroSmart logs the password reset URL directly to the backend terminal, allowing frictionless local testing without configuring mail credentials.

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile information | Yes |
| `POST` | `/api/auth/forgot-password` | Request password reset token/link | No |
| `POST` | `/api/auth/reset-password/:token`| Reset password using valid token | No |

### 🌾 Crop Recommendations (`/api/recommendations`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/recommendations/predict` | Predict crop from soil and weather input | Yes |
| `GET` | `/api/recommendations/history` | Retrieve user recommendation history | Yes |
| `GET` | `/api/recommendations/stats` | Retrieve recommendation analytics/stats | Yes |

### 💰 Crop Prices (`/api/crop-prices`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/crop-prices/search` | Query live prices by state/district/crop | No |
| `GET` | `/api/crop-prices/states` | Fetch list of Indian states & UTs | No |
| `GET` | `/api/crop-prices/commodities` | Fetch available market commodities | No |
| `GET` | `/api/crop-prices/trends` | Historical price trends for charts | No |

### 🩺 System Health

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/health` | Returns server status and timestamp | No |

---

## 🧠 Machine Learning Microservice

The crop recommendation engine is powered by **scikit-learn** trained on agricultural datasets containing:
- **Soil Chemistry**: Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), and Soil $pH$.
- **Climate Data**: Temperature (°C), Relative Humidity (%), and Annual Rainfall (mm).

### Retraining the Model

To retrain the Random Forest model on updated data:

```bash
cd ml-service
python train_model.py
```

The script evaluates model accuracy, generates a classification report, and exports serialized pipeline artifacts to `ml-service/models/`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.
