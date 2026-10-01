# 🎬 Video Demo Script: Stock & Financial Market Analysis Platform

* **Target Video Duration:** 4 to 5 Minutes
* **Pacing:** Confident, clear, professional
* **Target Audience:** Recruiters, Senior Engineers, Data Scientists, and Financial Analysts

---

## ⏱️ Scene Breakdown & Voiceover Transcript

### Scene 1: Hook & Project Introduction (0:00 – 0:35)

| Time | Visual Scene / Screen Action | Voiceover Script | Key Feature Callouts |
|---|---|---|---|
| **0:00** | Full-screen view of the **FinAnalytics AI** Home Page (`http://localhost:3001`). Move mouse smoothly over the hero banner, index cards, and quick search bar. | *"Hi everyone! Today I'm excited to demonstrate **FinAnalytics AI**—a full-stack Stock & Financial Market Analysis Platform that combines Data Science, Machine Learning, Financial Analytics, and Modern Web Development."* | FinAnalytics AI Landing Page |
| **0:15** | Quick screen transition to system architecture diagram showing **React + Express Node.js + MongoDB + Python FastAPI (XGBoost/SHAP)**. | *"Built with React, Tailwind CSS, Express, MongoDB, and a dedicated Python FastAPI ML service powering XGBoost time-series models, this platform provides institutional-grade market data, quantitative risk analytics, strategy backtesting, and machine learning price forecasting."* | Microservices Architecture |

---

### Scene 2: Live Market Dashboard & Stock Search (0:35 – 1:10)

| Time | Visual Scene / Screen Action | Voiceover Script | Key Feature Callouts |
|---|---|---|---|
| **0:35** | Click on **Dashboard** (`/dashboard`). Move cursor over **NIFTY 50**, **SENSEX**, and **Market Breadth Cards** (Advances vs Declines). | *"Let's start on the Market Overview Dashboard. Here we get real-time snapshots of major benchmark indices like NIFTY 50 and SENSEX, live market breadth statistics, top gainers, decliners, and the most active stocks by trading volume."* | Live Indices & Market Breadth |
| **0:50** | Click on the Navbar Search Bar. Type `RELIANCE` and click on the autocomplete dropdown result. | *"Using the instant search bar with symbol autocomplete, let's search for **Reliance Industries** to launch its full analytical suite."* | Autocomplete Search Engine |

---

### Scene 3: Interactive Charts, Indicators & Risk Engine (1:10 – 2:05)

| Time | Visual Scene / Screen Action | Voiceover Script | Key Feature Callouts |
|---|---|---|---|
| **1:10** | On `/stocks/RELIANCE`, highlight quote header (₹2,850, +1.42%, 52W High/Low). Toggle timeframe buttons (`1M`, `6M`, `1Y`) and chart modes (**Area**, **Line**, **Candlestick**). | *"On the stock details page, we immediately see current quotes, volume, and 52-week ranges. Below, our interactive Recharts component allows seamless switching between Area, Line, and Candlestick modes across multiple timeframes."* | Interactive Recharts Engine |
| **1:30** | Check **SMA 20** and **SMA 50** overlay checkboxes on the chart. Scroll down to **Technical Indicator Dashboard**. | *"We can toggle technical indicator overlays directly onto the price action, such as 20-day and 50-day Moving Averages. The Technical Indicator Dashboard computes RSI, MACD, Stochastic Oscillator, and Bollinger Bands—presenting objective, descriptive analytical states rather than simplistic buy-sell signals."* | Descriptive Indicator States |
| **1:45** | Highlight the **Risk Analysis Card** (Annualized Volatility, Max Drawdown, Historical VaR 95%, Sharpe Ratio). | *"Right below is our Quantitative Risk Engine. It calculates 252-day Annualized Volatility, Peak-to-Trough Maximum Drawdown, 1-day 95% Historical Value-at-Risk (VaR), and Sharpe Ratio for risk-adjusted performance evaluation."* | Quantitative Risk & VaR Engine |

---

### Scene 4: Machine Learning Forecasting & SHAP Explainability (2:05 – 2:55)

| Time | Visual Scene / Screen Action | Voiceover Script | Key Feature Callouts |
|---|---|---|---|
| **2:05** | Scroll to **ML Forecast** section (`/forecast`). Point to the **5-Day Estimated Price Range** (e.g. ₹2,790 – ₹2,930). | *"Next is our Machine Learning Price Forecasting module. To prevent look-ahead bias, our Python service evaluates historical data using strict chronological walk-forward time-series validation."* | Walk-Forward Time-Series Validation |
| **2:25** | Click model toggles (**XGBoost** ➔ **Random Forest** ➔ **Linear/Ridge**). Show updated MAE, RMSE, MAPE, and Directional Accuracy metrics. | *"We can select between XGBoost Regressor, Random Forest, and Ridge models, as well as adjust forecast horizons. The platform calculates out-of-sample evaluation metrics including MAE, RMSE, MAPE, and Directional Accuracy percentage."* | XGBoost & Random Forest Models |
| **2:40** | Hover cursor over **SHAP Model Explainability** progress bars (`Previous Close`, `5D Momentum`, `RSI`, `Volatility`). | *"Crucially, we incorporate **SHAP Model Explainability** to show exactly which input features—such as previous close, momentum, RSI, or rolling volatility—exerted the highest weight on the model's estimate."* | SHAP Model Feature Explainability |

---

### Scene 5: Multi-Stock Comparison & Correlation Heatmap (2:55 – 3:35)

| Time | Visual Scene / Screen Action | Voiceover Script | Key Feature Callouts |
|---|---|---|---|
| **2:55** | Click **Compare** (`/compare`). Select `TCS`, `INFY`, `HCLTECH`, and `RELIANCE`. | *"Under the Stock Comparison module, users can compare multiple assets side-by-side. The platform renders a comparative risk metric table alongside a normalized relative return performance chart."* | Comparative Return Chart |
| **3:15** | Scroll down to the **Pearson Return Correlation Heatmap**. Point at the matrix cells. | *"It also computes a full Pearson Correlation Matrix Heatmap, helping investors analyze asset co-movement and diversification benefits across sector equities."* | Pearson Correlation Matrix |

---

### Scene 6: Portfolio Analytics & Strategy Backtesting (3:35 – 4:25)

| Time | Visual Scene / Screen Action | Voiceover Script | Key Feature Callouts |
|---|---|---|---|
| **3:35** | Click **Portfolio** (`/portfolio`). Drag allocation weight sliders and click **Recalculate Portfolio Metrics**. Point to updated Pie Chart and Equity Growth Curve. | *"In the Portfolio Analytics section, users can build a hypothetical multi-asset portfolio. As we adjust asset allocation weights, the platform dynamically recalculates portfolio returns, volatility, Sharpe ratio, and renders a 1-year historical backtested equity growth curve."* | Interactive Portfolio Weight Sliders |
| **4:00** | Click **Backtest** (`/backtest`). Select **SMA 20/50 Crossover Strategy** and click **Run Backtest**. Scroll through **Executed Trade Log Table**. | *"For quantitative traders, our Strategy Backtesting Engine evaluates rule-based strategies like SMA Crossover and RSI Reversal against historical data—factoring in realistic friction costs like 0.1% transaction fees and 0.05% slippage to show final equity, total return, win rate, and detailed trade execution logs."* | Backtesting Friction Cost Simulation |

---

### Scene 7: Jupyter Notebooks, Docker & Outro (4:25 – 4:55)

| Time | Visual Scene / Screen Action | Voiceover Script | Key Feature Callouts |
|---|---|---|---|
| **4:25** | Briefly switch screen to VS Code showing the 10 Data Science Jupyter Notebooks in `ml-service/notebooks/` (`01_data_collection.ipynb` to `10_backtesting.ipynb`) and `docker-compose.yml`. | *"Behind the scenes, the entire data science pipeline is documented step-by-step across 10 Jupyter Notebooks, and the complete application is containerized using Docker Compose for seamless cloud deployment."* | 10 Data Science Notebooks & Docker |
| **4:45** | Switch back to the platform home screen. Show clickable links and disclaimer banner. | *"Thank you for watching! Check out the full source code on GitHub, and feel free to reach out with any questions or feedback. Have a great day!"* | GitHub Portfolio Showcase |

---

## 📋 Production Checklist for Recording

1. **Screen Resolution:** Record at 1080p (1920x1080) at 60fps.
2. **Theme:** Keep dark mode enabled on the web application for visual contrast.
3. **Audio:** Use a clean noise-cancelled microphone.
4. **Services Active:** Ensure all 3 background services are running prior to recording:
   - React Frontend: `http://localhost:3001`
   - Express Backend API: `http://localhost:5000`
   - Python ML FastAPI Engine: `http://localhost:8000`
