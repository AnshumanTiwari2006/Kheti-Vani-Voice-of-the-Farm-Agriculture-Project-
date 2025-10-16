# ==============code with LLM + Prediction========================

from fastapi import FastAPI
import pandas as pd
from pydantic import BaseModel
import os
import google.generativeai as genai
import requests
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi.middleware.cors import CORSMiddleware
import geocoder
import json
import joblib

# Load pre-trained ML model at startup
ml_model = joblib.load("crop_yield_model.pkl")

def predict_yield_ml(crop: str, district: str, region: str, irrigation: str, weather_data: Dict) -> float:
    """Predict yield (tons/ha) using saved ML model."""
    sample = pd.DataFrame([{
        "state": region,
        "district": district,
        "crop": crop,
        "irrigation_source": irrigation,
        "rainfall_mm": weather_data.get("precipitation_sum", 0),  # Get actual rainfall from weather data
        "avg_temp_C": weather_data.get("temperature_2m", 0),  # Get actual temperature from weather data
        "soil_ph": 6.5,  # Get actual soil pH from weather data
        "soil_organic_carbon_pct": 0.8,
        "irrigation_pct": 60,
        "fertilizer_kg_ha": 150
    }])
    prediction = ml_model.predict(sample)[0]
    return round(prediction, 2)
    
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FilterState(BaseModel):
    cropType: str = ""
    soilType: str = ""
    season: str = ""
    irrigation: str = ""
    fertilizer: str = ""
    pestDisease: str = ""
    region: str = ""
    district: str = ""
    budget: str = ""

genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
def get_coordinates(district: str, state: str) -> Optional[Dict[str, float]]:
    try:
        location = geocoder.arcgis(f"{district}, {state}, India")
        if location.ok:
            return {"lat": location.lat, "lng": location.lng}
        return None
    except Exception:
        return None

def get_weather_data(lat: float, lng: float) -> Dict[str, Any]:
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto"
        response = requests.get(url)
        data = response.json()
        
        weather_codes = {
            0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
            55: "Dense drizzle", 56: "Light freezing drizzle", 57: "Dense freezing drizzle",
            61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
            66: "Light freezing rain", 67: "Heavy freezing rain", 71: "Slight snow fall",
            73: "Moderate snow fall", 75: "Heavy snow fall", 77: "Snow grains",
            80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
            85: "Slight snow showers", 86: "Heavy snow showers", 95: "Thunderstorm",
            96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
        }
        
        current = data.get("current", {})
        daily = data.get("daily", {})
        
        weather_condition = weather_codes.get(current.get("weather_code", 0), "Unknown")
        
        return {
            "temperature": current.get("temperature_2m", 0),
            "humidity": current.get("relative_humidity_2m", 0),
            "precipitation": current.get("precipitation", 0),
            "weather_condition": weather_condition,
            "max_temp": daily.get("temperature_2m_max", [0])[0] if daily.get("temperature_2m_max") else 0,
            "min_temp": daily.get("temperature_2m_min", [0])[0] if daily.get("temperature_2m_min") else 0,
            "precipitation_sum": daily.get("precipitation_sum", [0])[0] if daily.get("precipitation_sum") else 0
        }
    except Exception as e:
        print(f"Weather API error: {e}")
        return {}

def get_soil_data(district: str, state: str, crop: str) -> Dict[str, Any]:
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")  # Updated model name
        prompt = f"""
        Generate realistic soil data for {district}, {state} for growing {crop}.
        Provide only a JSON response with these exact keys:
        - soil_moisture (percentage)
        - ph_level (number between 4-9)
        - nitrogen_level (text: low, medium, high)
        - phosphorus_level (text: low, medium, high)
        - improvement_suggestions (array of 3 strings with specific suggestions)
        
        Make it realistic for the region and crop. Return only JSON, no other text.
        """
        
        response = model.generate_content(prompt)
        json_str = response.text.strip().replace('```json', '').replace('```', '').strip()
        return json.loads(json_str)
    except Exception as e:
        print(f"Soil data generation error: {e}")
        return {
            "soil_moisture": 65,
            "ph_level": 6.5,
            "nitrogen_level": "medium",
            "phosphorus_level": "medium",
            "improvement_suggestions": [
                "Add organic compost to improve soil structure",
                "Use cover crops to prevent erosion",
                "Test soil regularly to monitor nutrient levels"
            ]
        }

def get_market_data(district: str, state: str, crop: str) -> Dict[str, Any]:
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")  # Updated model name
        prompt = f"""
        Generate realistic market data for {crop} in districts near {district}, {state}.
        Provide only a JSON response with these exact keys:
        - current_price (number in ₹/quintal)
        - price_trend (text: increasing, decreasing, stable)
        - nearby_districts (array of objects with name and price for 9 nearby districts)
        - market_trends (array of 3 strings with current market insights)
        
        Make it realistic for the region and crop. Return only JSON, no other text.
        """

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)

    except Exception as e:
        print(f"Market data generation error: {e}")
        return {
            "current_price": 2500,
            "price_trend": "stable",
            "nearby_districts": [
                {"name": "District 1", "price": 2450},
                {"name": "District 2", "price": 2550},
                {"name": "District 3", "price": 2400},
                {"name": "District 4", "price": 2600},
                {"name": "District 5", "price": 2500},
                {"name": "District 6", "price": 2480},
                {"name": "District 7", "price": 2580},
                {"name": "District 8", "price": 2610},
                {"name": "District 9", "price": 2310}
            ],
            "market_trends": [
                "Demand is steady with normal supply",
                "Prices expected to remain stable in coming weeks",
                "Good quality produce fetching premium prices"
            ]
        }

def get_yield_prediction(filters: FilterState, weather_data: Dict, soil_data: Dict) -> Dict[str, Any]:
    try:
        ml_yield = predict_yield_ml(
            filters.cropType,
            filters.district,
            filters.region,
            filters.irrigation,
            weather_data
        )

        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""
        A farmer in {filters.district}, {filters.region} is growing {filters.cropType}.
        Predicted yield: {ml_yield} tons/ha.
        Weather: {weather_data}
        Soil: {soil_data}
        Irrigation: {filters.irrigation}

        Return ONLY JSON in this exact format:
        {{
          "best_planting_time": "string",
          "irrigation_schedule": "string",
          "ai_suggestions": ["string1", "string2", "string3"]
        }}
        """
        response = model.generate_content(prompt)

        raw_text = response.text.strip()
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        try:
            llm_data = json.loads(raw_text)
        except Exception:
            print("⚠️ Bad LLM JSON, falling back.")
            llm_data = {}

        return {
            "expected_yield": ml_yield,
            "yield_trend": "stable",
            "best_planting_time": llm_data.get("best_planting_time", "October to November"),
            "irrigation_schedule": llm_data.get("irrigation_schedule", "Every 7-10 days depending on rainfall"),
            "ai_suggestions": llm_data.get("ai_suggestions", [
                "Monitor soil moisture regularly",
                "Apply balanced fertilizer at right growth stages",
                "Implement integrated pest management"
            ])
        }

    except Exception as e:
        print(f"Yield prediction error: {e}")
        return {
            "expected_yield": 75,
            "yield_trend": "increasing",
            "best_planting_time": "October to November",
            "irrigation_schedule": "Every 7-10 days depending on rainfall",
            "ai_suggestions": [
                "Monitor soil moisture regularly",
                "Apply balanced fertilizer at right growth stages",
                "Implement integrated pest management"
            ]
        }

@app.post("/api/advisory")
async def get_advisory(filters: FilterState):
    if not filters.district or not filters.region or not filters.cropType:
        return {"error": "Please select region, district and crop type to get recommendations"}
    
    coords = get_coordinates(filters.district, filters.region)
    if not coords:
        return {"error": "Could not find location coordinates"}
    
    weather_data = get_weather_data(coords["lat"], coords["lng"])
    soil_data = get_soil_data(filters.district, filters.region, filters.cropType)
    market_data = get_market_data(filters.district, filters.region, filters.cropType)
    yield_data = get_yield_prediction(filters, weather_data, soil_data)
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")  # Updated model name
        prompt = f"""
        As an agricultural expert, provide exactly 10 specific, actionable recommendations for a farmer in {filters.district}, {filters.region} growing {filters.cropType}:

        1. Soil preparation: {filters.soilType} soil type
        2. Planting schedule: Optimal timing for {filters.season} season
        3. Irrigation: Methods suitable for {filters.irrigation} availability
        4. Fertilization: Plan for {filters.fertilizer} type
        5. Pest/disease control: Strategies for {filters.pestDisease} issues
        6. Weather adaptation: Using current conditions {weather_data}
        7. Budget optimization: Practices for {filters.budget} budget level
        8. Yield improvement: Specific techniques to increase production
        9. Harvesting: Best practices for harvesting and post-harvest handling
        10. Market strategy: Timing and approach based on {market_data} trends

        Provide only a numbered list with concise, practical advice. Each point should be one clear action item. No additional text, explanations, or formatting.
        """
        
        response = model.generate_content(prompt)
        recommendation = response.text
    except Exception as e:
        recommendation = "Unable to generate AI recommendations at this time. Please try again later."
    
    return {
        "recommendation": recommendation,
        "weather_data": weather_data,
        "soil_data": soil_data,
        "market_data": market_data,
        "yield_data": yield_data,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/")
def read_root():
    return {"message": "Farmer Advisory API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)














