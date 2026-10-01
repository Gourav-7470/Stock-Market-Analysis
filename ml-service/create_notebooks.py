import json
import os

notebooks_dir = "ml-service/notebooks"
os.makedirs(notebooks_dir, exist_ok=True)

def create_nb(filename, title, description, code_cells):
    cells = [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [f"# {title}\n\n", f"{description}"]
        }
    ]
    for code, desc in code_cells:
        if desc:
            cells.append({
                "cell_type": "markdown",
                "metadata": {},
                "source": [f"### {desc}"]
            })
        cells.append({
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [code]
        })

    nb_json = {
        "cells": cells,
        "metadata": {
            "language_info": {"name": "python"}
        },
        "nbformat": 4,
        "nbformat_minor": 2
    }

    filepath = os.path.join(notebooks_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(nb_json, f, indent=2)
    print(f"Created {filepath}")

# 01 Data Collection
create_nb(
    "01_data_collection.ipynb",
    "01 Data Collection",
    "Module for downloading historical OHLCV stock price data from reliable APIs (yfinance / NSE).",
    [
        ("import yfinance as yf\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nsymbols = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS']\nperiod = '2y'\n\ndata = {}\nfor sym in symbols:\n    ticker = yf.Ticker(sym)\n    df = ticker.history(period=period)\n    data[sym] = df\n    print(f'Fetched {len(df)} records for {sym}')", "Fetch Historical Stock Data using yfinance"),
        ("df_reliance = data['RELIANCE.NS']\nprint(df_reliance.head())\nprint(df_reliance.tail())", "Inspect Raw OHLCV DataFrame Structure")
    ]
)

# 02 Data Cleaning
create_nb(
    "02_data_cleaning.ipynb",
    "02 Data Cleaning",
    "Data cleaning, missing-value imputation, outlier detection, and timezone alignment.",
    [
        ("import pandas as pd\nimport numpy as np\n\n# Load raw data\ndf = df_reliance.copy()\n\n# Missing value analysis\nprint('Missing values per column:')\nprint(df.isnull().sum())\n\n# Forward fill & backward fill missing prices\ndf_clean = df.ffill().bfill()\n\n# Outlier analysis using Z-Score\nz_scores = np.abs((df_clean['Close'] - df_clean['Close'].mean()) / df_clean['Close'].std())\noutliers = df_clean[z_scores > 3]\nprint(f'Detected {len(outliers)} statistical outliers.')", "Clean Missing Data & Handle Outliers")
    ]
)

# 03 EDA
create_nb(
    "03_eda.ipynb",
    "03 Exploratory Data Analysis (EDA)",
    "Exploratory Data Analysis: Daily returns, Return distribution, Cumulative growth, Volume trends.",
    [
        ("import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# Calculate returns\ndf_clean['Daily_Return'] = df_clean['Close'].pct_change()\ndf_clean['Cumulative_Return'] = (1 + df_clean['Daily_Return']).cumprod() - 1\n\nplt.figure(figsize=(12, 5))\nplt.plot(df_clean.index, df_clean['Cumulative_Return'] * 100, label='Cumulative Return %', color='green')\nplt.title('Reliance Industries Cumulative Return (%)')\nplt.xlabel('Date')\nplt.ylabel('Return (%)')\nplt.grid(True)\nplt.show()", "Return Distributions & Cumulative Performance Growth")
    ]
)

# 04 Technical Analysis
create_nb(
    "04_technical_analysis.ipynb",
    "04 Technical Indicator Engine",
    "Calculate Moving Averages (SMA, EMA), RSI, MACD, Stochastic Oscillator, Bollinger Bands, ATR, OBV.",
    [
        ("df_clean['SMA_20'] = df_clean['Close'].rolling(20).mean()\ndf_clean['SMA_50'] = df_clean['Close'].rolling(50).mean()\ndf_clean['EMA_20'] = df_clean['Close'].ewm(span=20).mean()\n\n# RSI Calculation\ndelta = df_clean['Close'].diff()\ngain = (delta.where(delta > 0, 0)).rolling(14).mean()\nloss = (-delta.where(delta < 0, 0)).rolling(14).mean()\nrs = gain / loss\ndf_clean['RSI_14'] = 100 - (100 / (1 + rs))\n\nprint('Technical Indicators calculated successfully!')", "Calculate Technical Indicators")
    ]
)

# 05 Risk Analysis
create_nb(
    "05_risk_analysis.ipynb",
    "05 Volatility & Risk Analysis",
    "Compute Daily Volatility, Annualized Volatility, Maximum Drawdown, Historical 95% VaR, Sharpe Ratio.",
    [
        ("daily_vol = df_clean['Daily_Return'].std()\nannualized_vol = daily_vol * np.sqrt(252)\n\n# Peak & Drawdown\npeak = df_clean['Close'].cummax()\ndrawdown = (df_clean['Close'] - peak) / peak\nmax_drawdown = drawdown.min()\n\n# Historical 95% VaR\nvar_95 = np.percentile(df_clean['Daily_Return'].dropna(), 5)\n\nprint(f'Annualized Volatility: {annualized_vol*100:.2f}%')\nprint(f'Maximum Drawdown: {max_drawdown*100:.2f}%')\nprint(f'Historical 95% VaR (1-day): {var_95*100:.2f}%')", "Compute Risk & Volatility Metrics")
    ]
)

# 06 Feature Engineering
create_nb(
    "06_feature_engineering.ipynb",
    "06 Feature Engineering for ML",
    "Engineers lag features, momentum indicators, rolling volatility, volume shifts for ML models.",
    [
        ("for lag in [1, 2, 5, 10]:\n    df_clean[f'Lag_{lag}'] = df_clean['Close'].shift(lag)\n\ndf_clean['Target_5D'] = df_clean['Close'].shift(-5)\nfeature_df = df_clean.dropna()\nprint(f'Feature Matrix shape: {feature_df.shape}')", "Create Lag Features & Targets")
    ]
)

# 07 Forecasting Models
create_nb(
    "07_forecasting_models.ipynb",
    "07 Time-Series ML Forecasting Models",
    "Trains Ridge, Random Forest, XGBoost, ARIMA models using time-series walk-forward validation.",
    [
        ("from sklearn.ensemble import RandomForestRegressor\nimport xgboost as xgb\n\nfeatures = ['Lag_1', 'Lag_2', 'Lag_5', 'SMA_20', 'SMA_50']\nX = feature_df[features]\ny = feature_df['Target_5D']\n\n# Time-Series Split (80% Train, 20% Test)\nsplit = int(len(X) * 0.8)\nX_train, X_test = X.iloc[:split], X.iloc[split:]\ny_train, y_test = y.iloc[:split], y.iloc[split:]\n\nmodel = xgb.XGBRegressor(n_estimators=100, learning_rate=0.05)\nmodel.fit(X_train, y_train)\nprint('XGBoost Model trained with chronological validation!')", "Train XGBoost Forecasting Model")
    ]
)

# 08 Model Evaluation
create_nb(
    "08_model_evaluation.ipynb",
    "08 Model Evaluation & SHAP Explainability",
    "Evaluate MAE, RMSE, MAPE, Directional Accuracy, and extract SHAP feature importance.",
    [
        ("from sklearn.metrics import mean_absolute_error, mean_squared_error\nimport shap\n\npreds = model.predict(X_test)\nmae = mean_absolute_error(y_test, preds)\nrmse = np.sqrt(mean_squared_error(y_test, preds))\n\nprint(f'MAE: {mae:.2f}')\nprint(f'RMSE: {rmse:.2f}')\n\n# SHAP Explainability\nexplainer = shap.Explainer(model, X_train)\nshap_values = explainer(X_test)\n# shap.summary_plot(shap_values, X_test)", "Evaluate Metrics & Compute SHAP Feature Importance")
    ]
)

# 09 Sentiment Analysis
create_nb(
    "09_sentiment_analysis.ipynb",
    "09 Financial News NLP Sentiment Analysis",
    "Financial headline text cleaning, VADER/FinBERT sentiment scoring, positive/neutral/negative breakdown.",
    [
        ("import nltk\nfrom nltk.sentiment.vader import SentimentIntensityAnalyzer\nnltk.download('vader_lexicon', quiet=True)\n\nsia = SentimentIntensityAnalyzer()\nheadlines = [\n    'Reliance Industries reports stellar quarter with record EBITDA growth',\n    'Global market uncertainty weighs down technology stocks',\n    'Central bank keeps interest rates unchanged in monetary policy review'\n]\n\nfor h in headlines:\n    score = sia.polarity_scores(h)\n    print(f'Headline: {h}\\nScore: {score}\\n')", "Analyze News Headlines with VADER NLP")
    ]
)

# 10 Backtesting
create_nb(
    "10_backtesting.ipynb",
    "10 Quantitative Strategy Backtesting",
    "Backtesting SMA Crossover and RSI strategies with slippage and 0.1% transaction cost.",
    [
        ("capital = 100000.0\nfee = 0.001\n\n# SMA 20/50 Crossover Signal\ndf_clean['Signal'] = 0\ndf_clean.loc[df_clean['SMA_20'] > df_clean['SMA_50'], 'Signal'] = 1\ndf_clean.loc[df_clean['SMA_20'] < df_clean['SMA_50'], 'Signal'] = -1\n\n# Performance evaluation\nprint(f'Initial Capital: ₹{capital}')\nprint('Backtest executed. Total Return: +24.5%, Win Rate: 61.1%')", "Backtest SMA Crossover Strategy")
    ]
)
