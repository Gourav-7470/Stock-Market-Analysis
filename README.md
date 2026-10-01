# Stock & Financial Market Analysis Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https.opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-61DAFB.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.110-009688.svg)](https://fastapi.tiangolo.com/)
[![XGBoost](https://img.shields.io/badge/XGBoost-ML-orange.svg)](https://xgboost.readthedocs.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue.svg)](https://www.docker.com/)

A modern, full-stack **Stock & Financial Market Analysis Platform** combining Data Science, Quantitative Finance, Machine Learning, Data Visualization, and Web Development.

---

## 🏗️ System Architecture

```text
                    React Frontend (Vite + Tailwind CSS + Recharts)
                                        |
                                        ↓
                         Node.js API (Express.js + JWT)
                                        |
             ┌──────────────────────────┼──────────────────────────┐
             ↓                          ↓                          ↓
    MongoDB Database            Configured Market API          FastAPI ML Service
  (Users, Watchlists,          (yfinance / Indian Stock     (Python Data Science)
Portfolios, History)            Market Connectors)                 |
                                                                   ↓
                                                    ┌──────────────┼──────────────┐
                                                    ↓              ↓              ↓
                                                ML Models     Indicators      NLP Sentiment
                                            (XGBoost / SHAP) (SMA/RSI/MACD) (VADER Headlines)
```

---

## 🎯 Key Capabilities & Platform Modules

1. **Market Data & Interactive Stock Explorer**
   - Live quotes for major Indian equities (`RELIANCE`, `TCS`, `INFY`, `HDFCBANK`, `ICICIBANK`, `TATAMOTORS`, etc.) and indices (`NIFTY 50`, `SENSEX`).
   - Configurable market data providers (Yahoo Finance `yfinance` API with realistic offline fallback).

2. **Interactive Candlestick & Technical Indicator Engine**
   - Toggle between Line Chart, Area Chart, and Candlestick visualization.
   - Timeframes: `1D`, `1W`, `1M`, `6M`, `1Y`, `5Y`.
   - Technical Indicators: `SMA 20`, `SMA 50`, `SMA 100`, `SMA 200`, `EMA 20`, `EMA 50`, `RSI (14)`, `MACD (12,26,9)`, `Stochastic Oscillator`, `Bollinger Bands (20,2)`, `ATR (14)`, `OBV`.
   - **Educational Descriptive States**: Objective analytical states (e.g. `RSI: Neutral range (54.2)`, `Price vs SMA 50: Above`, `MACD: Positive Momentum`).

3. **Quantitative Risk & Volatility Analysis**
   - Daily & Annualized Volatility (`Daily SD * sqrt(252)`).
   - Peak-to-Trough Maximum Drawdown (`Max % decline`).
   - Historical Value at Risk (`Historical VaR 95% confidence`).
   - Sharpe Ratio (`Risk-adjusted return`).

4. **Multi-Stock Comparison & Correlation Heatmap**
   - Side-by-side performance table & normalized return chart.
   - Pearson Correlation Matrix Heatmap to analyze asset co-movement.

5. **Portfolio Analytics & Backtested Growth**
   - Construct hypothetical portfolios with custom asset weights.
   - Interactive weight allocation sliders with instant recalculation of Portfolio Return, Volatility, Sharpe Ratio, and Allocation Pie Chart.
   - Historical backtested cumulative growth curve.

6. **Machine Learning Forecasting & Explainability**
   - **Chronological Time-Series Validation**: Walk-forward / Expanding window validation to eliminate look-ahead bias.
   - Models: **XGBoost Regressor**, **Random Forest**, **Linear/Ridge Regression**, **ARIMA**.
   - Performance Metrics: `MAE`, `RMSE`, `MAPE`, `Directional Accuracy`.
   - **SHAP Feature Importance**: Bar visualization demonstrating how `Previous Close`, `Momentum`, `RSI`, `Volume`, and `Volatility` influence model estimates.

7. **Financial News NLP Sentiment Analysis**
   - Natural Language Processing pipeline analyzing financial headlines.
   - Score breakdown: `Positive %`, `Neutral %`, `Negative %`, and headline feed.

8. **Quantitative Strategy Backtesting Engine**
   - Rule-based trading strategy simulation (`SMA 20/50 Crossover`, `RSI Reversal`).
   - Friction costs incorporated: `0.1% transaction cost`, `0.05% slippage`.
   - Outputs: `Final Portfolio Value`, `Total Return %`, `Max Drawdown %`, `Win Rate %`, `Trade Log Table`, `Equity Curve`.

9. **Market Regime & Anomaly Detection**
   - K-Means clustering on return and volatility features to classify regimes (`Uptrend`, `Sideways`, `High Volatility`).
   - Isolation Forest & Z-Score anomaly detection for volume surges and extreme price spikes.

---

## 📁 Data Science Jupyter Notebooks

Located in `ml-service/notebooks/`:

```text
ml-service/notebooks/
├── 01_data_collection.ipynb       # yfinance API data collection
├── 02_data_cleaning.ipynb          # Imputation & Z-score outlier analysis
├── 03_eda.ipynb                    # Daily return distribution & cumulative return
├── 04_technical_analysis.ipynb    # Technical indicator formulas (SMA/RSI/MACD/Bollinger)
├── 05_risk_analysis.ipynb          # Volatility, Drawdown, VaR 95%, Sharpe Ratio
├── 06_feature_engineering.ipynb   # Lag features (1,2,5,10), momentum, rolling stats
├── 07_forecasting_models.ipynb     # XGBoost & Random Forest time-series training
├── 08_model_evaluation.ipynb      # MAE/RMSE metrics & SHAP explainability
├── 09_sentiment_analysis.ipynb    # NLP VADER sentiment classification
└── 10_backtesting.ipynb            # Strategy backtesting with friction costs
```

---

## 🛠️ Project Structure

```text
stock-market-platform/
├── frontend/                     # React.js + Vite + Tailwind CSS + Recharts
│   ├── src/
│   │   ├── components/          # PriceChart, IndicatorDashboard, RiskCard, ForecastCard, etc.
│   │   ├── pages/               # Dashboard, StockDetails, Compare, Portfolio, Forecast, Backtest, etc.
│   │   ├── services/            # Axios API Client
│   │   └── App.jsx
│
├── backend/                      # Node.js + Express + JWT + MongoDB Mongoose
│   ├── controllers/             # Auth, Stock, Market, Portfolio, Watchlist, ML Controllers
│   ├── models/                  # User, Watchlist, Portfolio, AnalysisHistory
│   ├── routes/                  # REST API endpoints
│   ├── services/                # MarketData, Indicators, Risk, MLClient services
│   └── server.js
│
├── ml-service/                   # Python FastAPI ML & Data Science Service
│   ├── notebooks/               # 10 Step-by-step Jupyter Notebooks
│   ├── preprocessing/           # Feature Engineering module
│   ├── forecasting/             # Time-Series Predictor & SHAP Explainability
│   ├── sentiment/               # NLP News Sentiment Analyzer
│   ├── backtesting/             # Quantitative Strategy Backtesting Engine
│   ├── regime/                  # K-Means Market Regime Detector
│   ├── anomaly/                 # Isolation Forest Anomaly Detector
│   └── app.py                   # FastAPI Application Server
│
├── docker-compose.yml            # Multi-container Orchestration
├── .env.example
└── README.md
```

---

## 🚀 Quick Start Guide

### Option 1: Using Docker Compose (Recommended)

```bash
# 1. Clone repository & navigate to directory
cd stock-market-platform

# 2. Launch all services (MongoDB, Node Backend, Python ML Service, React Frontend)
docker-compose up --build
```

Access the platform at:
- **Frontend App**: `http://localhost:3000`
- **Node Backend API**: `http://localhost:5000`
- **Python ML FastAPI**: `http://localhost:8000/docs`

---

### Option 2: Running Locally (Bare Metal)

#### 1. Start Python ML Service

```bash
cd ml-service
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

#### 2. Start Node.js Backend

```bash
cd backend
npm install
npm start
```

#### 3. Start React Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## ⚠️ Important Educational Disclaimer

> **This platform is intended strictly for educational, analytical, and research purposes.**
> Market data and model outputs may be delayed, incomplete, or inaccurate. Forecasts are statistical estimates based on historical data and time-series assumptions and are **not guarantees of future performance or personalized investment advice**. Users should independently verify information and consult a qualified financial professional before making investment decisions.

---

## 💼 Resume Description

**Stock & Financial Market Analysis Platform**
> Developed an end-to-end financial analytics platform using React, Node.js, Express, MongoDB, Python, Pandas, NumPy, Scikit-learn, and XGBoost. Implemented historical market analysis, technical indicator calculation engines, volatility and drawdown risk modeling, multi-asset portfolio analytics, time-series machine learning forecasting with SHAP explainability, NLP news sentiment classification, strategy backtesting with friction costs, and market regime detection. Built a separate Python FastAPI ML service with REST APIs and containerized the solution using Docker Compose.
