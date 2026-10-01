import pandas as pd
import numpy as np

def create_features(df):
    """
    Generate ML features for stock forecasting:
    - Lags (1, 2, 5, 10)
    - Moving averages (SMA 20, SMA 50)
    - RSI (14)
    - Volatility (20D rolling)
    - Volume momentum
    """
    data = df.copy()
    data['Close'] = pd.to_numeric(data['close'] if 'close' in data.columns else data['Close'], errors='coerce')
    data['Volume'] = pd.to_numeric(data['volume'] if 'volume' in data.columns else data['Volume'], errors='coerce')

    # Target: Return over next N days or future close
    data['Target_5D'] = data['Close'].shift(-5)
    
    # Lag features
    for lag in [1, 2, 5, 10]:
        data[f'Lag_{lag}'] = data['Close'].shift(lag)
        data[f'Return_Lag_{lag}'] = data['Close'].pct_change(lag)

    # Technical Indicators
    data['SMA_20'] = data['Close'].rolling(window=20).mean()
    data['SMA_50'] = data['Close'].rolling(window=50).mean()
    data['EMA_20'] = data['Close'].ewm(span=20, adjust=False).mean()
    
    # RSI 14
    delta = data['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss.replace(0, 1e-6)
    data['RSI_14'] = 100 - (100 / (1 + rs))

    # Rolling Volatility
    data['Volatility_20D'] = data['Close'].pct_change().rolling(window=20).std() * np.sqrt(252)

    # Clean missing rows created by lags
    cleaned_df = data.dropna().reset_index(drop=True)
    return cleaned_df
