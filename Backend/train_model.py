# train_model.py
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Load dataset
df = pd.read_csv("crop_yield_50000.csv")

# Features & target
X = df[["state", "district", "crop", "irrigation_source", 
        "rainfall_mm", "avg_temp_C", "soil_ph", 
        "soil_organic_carbon_pct", "irrigation_pct", "fertilizer_kg_ha"]]
y = df["yield_t_ha"]

# Preprocessing
categorical = ["state", "district", "crop", "irrigation_source"]
numeric = ["rainfall_mm", "avg_temp_C", "soil_ph", "soil_organic_carbon_pct", 
           "irrigation_pct", "fertilizer_kg_ha"]

preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
    ("num", "passthrough", numeric)
])

# Train model
model = Pipeline([
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model.fit(X_train, y_train)

# Save trained model
joblib.dump(model, "crop_yield_model.pkl")
print("✅ Model trained and saved as crop_yield_model.pkl")
