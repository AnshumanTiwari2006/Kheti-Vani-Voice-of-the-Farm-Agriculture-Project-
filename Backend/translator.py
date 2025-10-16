# translator.py
import google.generativeai as genai
import os

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "AIzaSyCAC-IaVXi3-K9Q4SfBq5Q0biweeOkqsmM"))
model = genai.GenerativeModel("gemini-1.5-flash")

def translate_text(text: str, target_language: str) -> str:
    """
    Translate text to target language using Gemini AI
    target_language: 'hi' (Hindi), 'en' (English), 'or' (Odia)
    """
    lang_names = {
        "hi": "Hindi",
        "en": "English",
        "or": "Odia"
    }
    
    prompt = f"""
    Translate the following text to {lang_names.get(target_language, 'English')} exactly as is.
    Do NOT add explanations or formatting. Just return the translated text.
    
    Text: {text}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Translation failed for '{text}': {e}")
        return text  # fallback to original

def translate_batch(texts: list, target_language: str) -> list:
    """
    Translate a list of strings
    """
    return [translate_text(text, target_language) for text in texts]

def get_translated_ui_labels(target_language: str) -> dict:
    """
    Return all UI labels in the requested language
    """
    if target_language == "en":
        return {
            "title": "Farmer Advisory Assistant",
            "subtitle": "Expert guidance for your farming",
            "dashboard": "Dashboard",
            "prediction": "Crop Prediction",
            "weather": "Weather Update",
            "soil": "Soil Health",
            "market": "Market Rates",
            "expectedYield": "Expected Yield",
            "soilMoisture": "Soil Moisture",
            "todayWeather": "Today's Weather",
            "aiPrediction": "AI-Powered Crop Prediction",
            "aiDescription": "Get AI recommendations to increase your crop productivity",
            "getAI": "Get AI Suggestions",
            "uploadPhoto": "Upload Photo",
            "filterSearch": "Search by Filters",
            "weatherDetails": "Weather Details",
            "soilHealthDetails": "Soil Health Details",
            "marketRates": "Today's Market Rates",
            "temperature": "Temperature",
            "humidity": "Humidity",
            "rainfall": "Rainfall",
            "phLevel": "pH Level",
            "nitrogen": "Nitrogen",
            "phosphorus": "Phosphorus",
            "bestPlantingTime": "Best Planting Time",
            "irrigationSchedule": "Irrigation Schedule",
            "aiSuggestions": "AI Suggestions",
            "increase": "Increase",
            "decrease": "Decrease",
            "stable": "Stable",
            "comparedToLastYear": "Compared to last year",
            "idealLevel": "Ideal level",
            "todayMarketRate": "Today's market rate",
            "weatherCondition": "Weather Condition",
            "withinNormalRange": "Within normal range",
            "soilImprovementSuggestions": "🌱 Soil Improvement Suggestions:",
            "addDAPFertilizer": "Add DAP fertilizer to address phosphorus deficiency",
            "improveWithOrganic": "Improve soil quality using organic manure",
            "useMulching": "Use mulching to maintain soil moisture",
            "marketTrends": "📈 Market Trends:",
            "oilseedDemand": "• Demand for oilseed crops (soybean, mustard) is increasing",
            "wheatStable": "• Wheat prices expected to remain stable",
            "cottonVolatile": "• Cotton price volatility continues",
            "fromLastWeek": "From last week",
            "loadingAdvice": "Loading agricultural advice...",
            "pleaseSelectFilters": "Please select filters to get AI suggestions",
            "quintal": "quintal"
        }
    
    # List of keys and English texts
    keys = [
        "title", "subtitle", "dashboard", "prediction", "weather", "soil", "market",
        "expectedYield", "soilMoisture", "todayWeather", "aiPrediction", "aiDescription",
        "getAI", "uploadPhoto", "filterSearch", "weatherDetails", "soilHealthDetails",
        "marketRates", "temperature", "humidity", "rainfall", "phLevel", "nitrogen",
        "phosphorus", "bestPlantingTime", "irrigationSchedule", "aiSuggestions",
        "increase", "decrease", "stable", "comparedToLastYear", "idealLevel",
        "todayMarketRate", "weatherCondition", "withinNormalRange",
        "soilImprovementSuggestions", "addDAPFertilizer", "improveWithOrganic",
        "useMulching", "marketTrends", "oilseedDemand", "wheatStable", "cottonVolatile",
        "fromLastWeek", "loadingAdvice", "pleaseSelectFilters", "quintal"
    ]
    
    english_texts = [
        "Farmer Advisory Assistant", "Expert guidance for your farming", "Dashboard",
        "Crop Prediction", "Weather Update", "Soil Health", "Market Rates",
        "Expected Yield", "Soil Moisture", "Today's Weather", "AI-Powered Crop Prediction",
        "Get AI recommendations to increase your crop productivity", "Get AI Suggestions",
        "Upload Photo", "Search by Filters", "Weather Details", "Soil Health Details",
        "Today's Market Rates", "Temperature", "Humidity", "Rainfall", "pH Level",
        "Nitrogen", "Phosphorus", "Best Planting Time", "Irrigation Schedule",
        "AI Suggestions", "Increase", "Decrease", "Stable", "Compared to last year",
        "Ideal level", "Today's market rate", "Weather Condition", "Within normal range",
        "🌱 Soil Improvement Suggestions:", "Add DAP fertilizer to address phosphorus deficiency",
        "Improve soil quality using organic manure", "Use mulching to maintain soil moisture",
        "📈 Market Trends:", "• Demand for oilseed crops (soybean, mustard) is increasing",
        "• Wheat prices expected to remain stable", "• Cotton price volatility continues",
        "From last week", "Loading agricultural advice...", "Please select filters to get AI suggestions",
        "quintal"
    ]
    
    translations = translate_batch(english_texts, target_language)
    return dict(zip(keys, translations))