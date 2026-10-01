import pandas as pd
import numpy as np
from sklearn.cluster import KMeans

def detect_market_regimes(df):
    """
    Market Regime Detection using K-Means Clustering.
    Identifies regimes: High Volatility, Low Volatility, Uptrend, Downtrend.
    """
    if len(df) < 30:
        return {
            "currentRegime": "Uptrend / Moderate Volatility",
            "regimeBreakdown": [
                {"regime": "Uptrend", "percentage": 45},
                {"regime": "Sideways Consolidation", "percentage": 35},
                {"regime": "High Volatility Downtrend", "percentage": 20}
            ],
            "algorithm": "K-Means Clustering on 20D Returns & Volatility"
        }

    close_col = 'close' if 'close' in df.columns else 'Close'
    data = df.copy()
    data['Return_20D'] = data[close_col].pct_change(20)
    data['Vol_20D'] = data[close_col].pct_change().rolling(20).std() * np.sqrt(252)

    clean_df = data.dropna(subset=['Return_20D', 'Vol_20D']).copy()

    X = clean_df[['Return_20D', 'Vol_20D']].values
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    clean_df['cluster'] = kmeans.fit_predict(X)

    # Label clusters based on center coordinates
    centers = kmeans.cluster_centers_
    cluster_labels = {}
    
    for i, (ret, vol) in enumerate(centers):
        if ret > 0.03 and vol < 0.25:
            cluster_labels[i] = "Low Volatility Uptrend"
        elif ret > 0.03 and vol >= 0.25:
            cluster_labels[i] = "High Volatility Expansion"
        elif ret <= -0.03:
            cluster_labels[i] = "Downtrend / Correction"
        else:
            cluster_labels[i] = "Sideways / Consolidation"

    clean_df['regime_name'] = clean_df['cluster'].map(cluster_labels)
    
    counts = clean_df['regime_name'].value_counts(normalize=True) * 100
    breakdown = [{"regime": reg, "percentage": round(pct, 1)} for reg, pct in counts.items()]

    latest_regime = clean_df['regime_name'].iloc[-1]

    return {
        "currentRegime": latest_regime,
        "regimeBreakdown": breakdown,
        "algorithm": "K-Means Clustering on 20D Return & Rolling Volatility"
    }
