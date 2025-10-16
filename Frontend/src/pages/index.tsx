import { useState, useEffect } from 'react';
import AdvisoryCard from '@/components/AdvisoryCard';
import FiltersSection, { type FilterState } from '@/components/FiltersSection';
import { fetchAdvisory, type AdvisoryResponse } from '@/lib/api';
import { Button } from "@/components/ui/button";

const translations = {
  hi: {
    title: "Kheti Vani - Voice of the Farm",
    subtitle: "आपकी खेती के लिए विशेषज्ञ मार्गदर्शन",
    dashboard: "डैशबोर्ड",
    prediction: "फसल पूर्वानुमान",
    weather: "मौसम अपडेट",
    soil: "मिट्टी स्वास्थ्य",
    market: "बाजार भाव",
    expectedYield: "अपेक्षित उत्पादन",
    soilMoisture: "मिट्टी की नमी",
    todayWeather: "आज का मौसम",
    wheatPrice: "गेहूं भाव",
    aiPrediction: "AI-Powered फसल पूर्वानुमान",
    aiDescription: "अपनी फसल की उत्पादकता बढ़ाने के लिए AI सुझाव प्राप्त करें",
    getAI: "AI सुझाव प्राप्त करें",
    uploadPhoto: "फोटो अपलोड करें",
    filterSearch: "फिल्टर द्वारा खोजें",
    weatherDetails: "मौसम विवरण",
    soilHealthDetails: "मिट्टी स्वास्थ्य",
    marketRates: "आज के बाजार भाव",
    temperature: "तापमान",
    humidity: "नमी",
    rainfall: "वर्षा",
    phLevel: "pH स्तर",
    nitrogen: "नाइट्रोजन",
    phosphorus: "फास्फोरस",
    bestPlantingTime: "बुवाई का समय",
    irrigationSchedule: "सिंचाई शेड्यूल",
    aiSuggestions: "AI सुझाव",
    increase: "वृद्धि",
    decrease: "कमी",
    stable: "स्थिर",
    comparedToLastYear: "पिछले साल की तुलना में",
    idealLevel: "आदर्श स्तर",
    todayMarketRate: "आज के बाजार भाव",
    weatherCondition: "मौसम की स्थिति",
    withinNormalRange: "सामान्य रेंज में",
    soilImprovementSuggestions: "🌱 मिट्टी सुधार के सुझाव:",
    addDAPFertilizer: "फास्फोरस की कमी को पूरा करने के लिए DAP खाद डालें",
    improveWithOrganic: "जैविक खाद का उपयोग करके मिट्टी की गुणवत्ता बढ़ाएं",
    useMulching: "मिट्टी की नमी बनाए रखने के लिए mulching करें",
    marketTrends: "📈 बाजार ट्रेंड्स:",
    oilseedDemand: "• तिलहनी फसलों (सोयाबीन, सरसों) की मांग बढ़ रही है",
    wheatStable: "• गेहूं के दाम स्थिर रहने की उम्मीद",
    cottonVolatile: "• कपास की कीमतों में अस्थिरता जारी",
    fromLastWeek: "पिछले सप्ताह से",
    loadingAdvice: "कृषि सलाह लोड कर रहे हैं...",
    loadingData: "डेटा लोड कर रहे हैं...",
    quintal: "क्विंटल",
    pleaseSelectFilters: "कृपया AI सुझाव पाने के लिए फिल्टर चुनें",
    wheat: "गेहूं",
    rice: "धान", 
    sugarcane: "गन्ना",
    maize: "मक्का",
    soybean: "सोयाबीन",
    cotton: "कपास",
    pulses: "दाल",
    potato: "आलू",
    onion: "प्याज"
  },
  en: {
    title: "Kheti Vani - Voice of the Farm",
    subtitle: "Expert guidance for your farming",
    dashboard: "Dashboard",
    prediction: "Crop Prediction",
    weather: "Weather Update",
    soil: "Soil Health",
    market: "Market Rates",
    expectedYield: "Expected Yield",
    soilMoisture: "Soil Moisture",
    todayWeather: "Today's Weather",
    wheatPrice: "Wheat Price",
    aiPrediction: "AI-Powered Crop Prediction",
    aiDescription: "Get AI recommendations to increase your crop productivity",
    getAI: "Get AI Suggestions",
    uploadPhoto: "Upload Photo",
    filterSearch: "Search by Filters",
    weatherDetails: "Weather Details",
    soilHealthDetails: "Soil Health Details",
    marketRates: "Today's Market Rates",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfall: "Rainfall",
    phLevel: "pH Level",
    nitrogen: "Nitrogen",
    phosphorus: "Phosphorus",
    bestPlantingTime: "Best Planting Time",
    irrigationSchedule: "Irrigation Schedule",
    aiSuggestions: "AI Suggestions",
    increase: "Increase",
    decrease: "Decrease",
    stable: "Stable",
    comparedToLastYear: "Compared to last year",
    idealLevel: "Ideal level",
    todayMarketRate: "Today's market rate",
    weatherCondition: "Weather Condition",
    withinNormalRange: "Within normal range",
    soilImprovementSuggestions: "🌱 Soil Improvement Suggestions:",
    addDAPFertilizer: "Add DAP fertilizer to address phosphorus deficiency",
    improveWithOrganic: "Improve soil quality using organic manure",
    useMulching: "Use mulching to maintain soil moisture",
    marketTrends: "📈 Market Trends:",
    oilseedDemand: "• Demand for oilseed crops (soybean, mustard) is increasing",
    wheatStable: "• Wheat prices expected to remain stable",
    cottonVolatile: "• Cotton price volatility continues",
    fromLastWeek: "From last week",
    loadingAdvice: "Loading agricultural advice...",
    loadingData: "Loading data...",
    quintal: "quintal",
    pleaseSelectFilters: "Please select filters to get AI suggestions",
    wheat: "Wheat",
    rice: "Rice",
    sugarcane: "Sugarcane",
    maize: "Maize",
    soybean: "Soybean",
    cotton: "Cotton",
    pulses: "Pulses",
    potato: "Potato",
    onion: "Onion"
  },
  or: {
    title: "Kheti Vani - Voice of the Farm",
    subtitle: "ଆପଣଙ୍କ ଚାଷ ପାଇଁ ବିଶେଷଜ୍ଞ ମାର୍ଗଦର୍ଶନ",
    dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    prediction: "ଫସଲ ପୂର୍ବାନୁମାନ",
    weather: "ପାଣିପାଗ ଅପଡେଟ",
    soil: "ମାଟିର ସ୍ୱାସ୍ଥ୍ୟ",
    market: "ବଜାର ଦର",
    expectedYield: "ଆଶା କରାଯାଉଥିବା ଉତ୍ପାଦନ",
    soilMoisture: "ମାଟିର ଆର୍ଦ୍ରତା",
    todayWeather: "ଆଜିର ପାଣିପାଗ",
    wheatPrice: "ଗହମ ଦର",
    aiPrediction: "AI-Powered ଫସଲ ପୂର୍ବାନୁମାନ",
    aiDescription: "ଆପଣଙ୍କ ଫସଲର ଉତ୍ପାଦକତା ବଢ଼ାଇବା ପାଇଁ AI ପରାମର୍ଶ ପାଆନ୍ତୁ",
    getAI: "AI ପରାମର୍ଶ ପାଆନ୍ତୁ",
    uploadPhoto: "ଫଟୋ ଅପଲୋଡ କରନ୍ତୁ",
    filterSearch: "ଫିଲ୍ଟର ଦ୍ୱାରା ଖୋଜନ୍ତୁ",
    weatherDetails: "ପାଣିପାଗ ବିବରଣୀ",
    soilHealthDetails: "ମାଟିର ସ୍ୱାସ୍ଥ୍ୟ ବିବରଣୀ",
    marketRates: "ଆଜିର ବଜାର ଦର",
    temperature: "ତାପମାତ୍ରା",
    humidity: "ଆର୍ଦ୍ରତା",
    rainfall: "ବର୍ଷା",
    phLevel: "pH ସ୍ତର",
    nitrogen: "ନାଇଟ୍ରୋଜେନ",
    phosphorus: "ଫସଫରସ",
    bestPlantingTime: "ବୁଣିବାର ସମୟ",
    irrigationSchedule: "ଜଳସେଚନ କାର୍ଯ୍ୟସୂଚୀ",
    aiSuggestions: "AI ପରାମର୍ଶ",
    increase: "ବୃଦ୍ଧି",
    decrease: "ହ୍ରାସ",
    stable: "ସ୍ଥିର",
    comparedToLastYear: "ଗତ ବର୍ଷ ତୁଳନାରେ",
    idealLevel: "ଆଦର୍ଶ ସ୍ତର",
    todayMarketRate: "ଆଜିର ବଜାର ଦର",
    weatherCondition: "ପାଣିପାଗ ଅବସ୍ଥା",
    withinNormalRange: "ସାମାନ୍ୟ ପରିସର ମଧ୍ୟରେ",
    soilImprovementSuggestions: "🌱 ମାଟି ଉନ୍ନତି ପାଇଁ ପରାମର୍ଶ:",
    addDAPFertilizer: "ଫସଫରସ ଅଭାବ ପୂରଣ ପାଇଁ DAP ସାର ପ୍ରୟୋଗ କରନ୍ତୁ",
    improveWithOrganic: "ଜୈବିକ ସାର ବ୍ୟବହାର କରି ମାଟିର ଗୁଣବତ୍ତା ବଢ଼ାନ୍ତୁ",
    useMulching: "ମାଟିର ଆର୍ଦ୍ରତା ବଜାୟ ରଖିବା ପାଇଁ ମଲଚିଂ କରନ୍ତୁ",
    marketTrends: "📈 ବଜାର ଧାରା:",
    oilseedDemand: "• ତେଲ ବିହନ ଫସଲ (ସୋୟାବିନ, ସରିଷା)ର ଚାହିଦା ବଢ଼ୁଛି",
    wheatStable: "• ଗହମ ଦର ସ୍ଥିର ରହିବାର ଆଶା",
    cottonVolatile: "• କପା ଦରରେ ଅସ୍ଥିରତା ଜାରି",
    fromLastWeek: "ଗତ ସପ୍ତାହରୁ",
    loadingAdvice: "କୃଷି ପରାମର୍ଶ ଲୋଡ ହେଉଛି...",
    loadingData: "ତଥ୍ୟ ଲୋଡ ହେଉଛି...",
    quintal: "କ୍ୱିଣ୍ଟାଲ",
    pleaseSelectFilters: "AI ପରାମର୍ଶ ପାଇବା ପାଇଁ ଦୟାକରି ଫିଲ୍ଟର ବାଛନ୍ତୁ",
    wheat: "ଗହମ",
    rice: "ଧାନ",
    sugarcane: "ଆଖୁ", 
    maize: "ମକା",
    soybean: "ସୋୟାବିନ",
    cotton: "କପା",
    pulses: "ଡାଲି",
    potato: "ଆଳୁ",
    onion: "ପିଆଜ"
  }
};

const icons = {
  wheat: "🌾",
  chartBar: "📊", 
  trendingUp: "📈",
  droplets: "💧",
  dollarSign: "💰",
  cloud: "☁️",
  leaf: "🌿",
  camera: "📷",
  target: "🎯",
  calendar: "📅",
  thermometer: "🌡️",
  eye: "👁️"
};

interface DashboardData {
  expectedYield: number;
  yieldTrend: string;
  soilMoisture: number;
  weather: {
    temperature: number;
    humidity: number;
    precipitation: number;
    condition: string;
  };
  marketPrice: number;
  priceTrend: string;
}

const Index = () => {
  const [advisory, setAdvisory] = useState<AdvisoryResponse | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAILoading, setIsAILoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [soilData, setSoilData] = useState<any>(null);
  const [marketData, setMarketData] = useState<any>(null);
  const [yieldData, setYieldData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState<'hi' | 'en' | 'or'>('hi');

  const t = translations[currentLanguage];

  const getWeatherCondition = (condition: string) => {
    const conditions = {
      'Clear sky': {
        hi: "साफ आसमान",
        en: "Clear sky", 
        or: "ପରିଷ୍କାର ଆକାଶ"
      },
      'Partly cloudy': {
        hi: "आंशिक बादल",
        en: "Partly Cloudy", 
        or: "ଆଂଶିକ ମେଘାଛନ୍ନ"
      },
      'Overcast': {
        hi: "बादल छाए",
        en: "Overcast", 
        or: "ମେଘାଚ୍ଛନ୍ନ"
      }
    };
    return conditions[condition]?.[currentLanguage] || condition;
  };

  const [filters, setFilters] = useState<FilterState>({
    cropType: "",
    soilType: "",
    season: "",
    irrigation: "",
    fertilizer: "",
    pestDisease: "",
    region: "",
    district: "",
    budget: "",
  });

  const getSelectedCropName = () => {
    if (!filters.cropType || filters.cropType === 'सभी' || filters.cropType === 'All' || filters.cropType === 'ସବୁ') {
      return t.wheat;
    }
    const cropTranslations = {
      'गेहूं': { hi: 'गेहूं', en: 'Wheat', or: 'ଗହମ' },
      'Wheat': { hi: 'गेहूं', en: 'Wheat', or: 'ଗହମ' },
      'ଗହମ': { hi: 'गेहूं', en: 'Wheat', or: 'ଗହମ' },
      'चावल': { hi: 'चावल', en: 'Rice', or: 'ଧାନ' },
      'Rice': { hi: 'चावल', en: 'Rice', or: 'ଧାନ' },
      'ଧାନ': { hi: 'चावल', en: 'Rice', or: 'ଧାନ' },
      'गन्ना': { hi: 'गन्ना', en: 'Sugarcane', or: 'ଆଖୁ' },
      'Sugarcane': { hi: 'गन्ना', en: 'Sugarcane', or: 'ଆଖୁ' },
      'ଆଖୁ': { hi: 'गन्ना', en: 'Sugarcane', or: 'ଆଖୁ' },
      'मक्का': { hi: 'मक्का', en: 'Maize', or: 'ମକା' },
      'Maize': { hi: 'मक्का', en: 'Maize', or: 'ମକା' },
      'ମକା': { hi: 'मक्का', en: 'Maize', or: 'ମକା' },
      'दाल': { hi: 'दाल', en: 'Pulses', or: 'ଡାଲି' },
      'Pulses': { hi: 'दाल', en: 'Pulses', or: 'ଡାଲି' },
      'ଡାଲି': { hi: 'दाल', en: 'Pulses', or: 'ଡାଲି' },
      'कपास': { hi: 'कपास', en: 'Cotton', or: 'କପା' },
      'Cotton': { hi: 'कपास', en: 'Cotton', or: 'କପା' },
      'କପା': { hi: 'कपास', en: 'Cotton', or: 'କପା' },
      'आलू': { hi: 'आलू', en: 'Potato', or: 'ଆଳୁ' },
      'Potato': { hi: 'आलू', en: 'Potato', or: 'ଆଳୁ' },
      'ଆଳୁ': { hi: 'आलू', en: 'Potato', or: 'ଆଳୁ' },
      'प्याज': { hi: 'प्याज', en: 'Onion', or: 'ପିଆଜ' },
      'Onion': { hi: 'प्याज', en: 'Onion', or: 'ପିଆଜ' },
      'ପିଆଜ': { hi: 'प्याज', en: 'Onion', or: 'ପିଆଜ' }
    };
    return cropTranslations[filters.cropType]?.[currentLanguage] || filters.cropType;
  };

  const getDynamicPriceLabel = () => {
    const cropName = getSelectedCropName();
    const priceWord = currentLanguage === 'hi' ? 'भाव' : currentLanguage === 'en' ? 'Price' : 'ଦର';
    return `${cropName} ${priceWord}`;
  };

  const handleNewAdvisory = (newAdvisory: AdvisoryResponse) => {
    setAdvisory(newAdvisory);
  };

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      cropType: "",
      soilType: "",
      season: "",
      irrigation: "",
      fertilizer: "",
      pestDisease: "",
      region: "",
      district: "",
      budget: "",
    });
    setAdvisory(null);
    setDashboardData(null);
    setSoilData(null);
    setMarketData(null);
    setYieldData(null);
  };

  const handleGetAIPrediction = async () => {
    if (!filters.cropType || !filters.region || !filters.district) {
      alert(t.pleaseSelectFilters);
      return;
    }
    setIsAILoading(true);
    try {
      const newAdvisory = await fetchAdvisory(filters);
      setAdvisory(newAdvisory);
      
      setDashboardData({
        expectedYield: newAdvisory.yield_data?.expected_yield || 75,
        yieldTrend: newAdvisory.yield_data?.yield_trend || 'stable',
        soilMoisture: newAdvisory.soil_data?.soil_moisture || 65,
        weather: {
          temperature: newAdvisory.weather_data?.temperature || 28,
          humidity: newAdvisory.weather_data?.humidity || 65,
          precipitation: newAdvisory.weather_data?.precipitation || 12,
          condition: newAdvisory.weather_data?.weather_condition || 'Partly cloudy'
        },
        marketPrice: newAdvisory.market_data?.current_price || 2500,
        priceTrend: newAdvisory.market_data?.price_trend || 'stable'
      });
      
      setSoilData(newAdvisory.soil_data);
      setMarketData(newAdvisory.market_data);
      setYieldData(newAdvisory.yield_data);
    } catch (error) {
      console.error('Failed to fetch AI prediction:', error);
    } finally {
      setIsAILoading(false);
    }
  };

  const handlePhotoUpload = () => {
    const message = currentLanguage === 'hi' ? "फोटो अपलोड फीचर जल्द ही आएगा!" : 
                   currentLanguage === 'en' ? "Photo upload feature coming soon!" : 
                   "ଫଟୋ ଅପଲୋଡ ବୈଶିଷ୍ଟ୍ୟ ଶୀଘ୍ର ଆସୁଛି!";
    alert(message);
  };

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: icons.chartBar },
    { id: 'prediction', label: t.prediction, icon: icons.trendingUp },
    { id: 'weather', label: t.weather, icon: icons.cloud },
    { id: 'soil', label: t.soil, icon: icons.leaf },
    { id: 'market', label: t.market, icon: icons.dollarSign },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 py-4 text-white shadow-md" style={{ backgroundColor: '#5E936C' }}>
        <div className="max-w-full px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0 gap-2">
              <span className="flex-shrink-0 text-2xl">{icons.wheat}</span>
              <div className="min-w-0">
                <h1 className="text-xl font-bold truncate md:text-2xl">{t.title}</h1>
                <p className="text-sm truncate md:text-base" style={{ color: '#E8FFD7' }}>{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center flex-shrink-0 gap-4">
              <select 
                className="px-3 py-1 text-sm text-white rounded md:text-base"
                style={{ backgroundColor: '#3E5F44' }}
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as 'hi' | 'en' | 'or')}
              >
                <option value="hi">हिंदी</option>
                <option value="en">English</option>
                <option value="or">ଓଡ଼ିଆ</option>
              </select>
            </div>
          </div>
        </div>
      </header>
      <div className="flex pt-20">
        <aside className="fixed bottom-0 left-0 w-48 overflow-y-auto bg-white shadow-lg md:w-64 top-20" style={{ borderRightColor: '#E8FFD7', borderRightWidth: '1px' }}>
          <nav className="p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors text-sm md:text-base ${
                  activeSection === item.id 
                    ? 'text-white' 
                    : 'hover:bg-gray-100'
                }`}
                style={activeSection === item.id ? { backgroundColor: '#93DA97' } : {}}
              >
                <span className="flex-shrink-0 text-lg">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 max-w-full p-4 ml-48 overflow-hidden md:ml-64 md:p-6">
          {activeSection === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
                {!dashboardData ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="min-w-0 p-4 bg-white border rounded-lg shadow-sm animate-pulse">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-16 h-8 mb-1 bg-gray-200 rounded"></div>
                      <div className="w-24 h-3 bg-gray-200 rounded"></div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="min-w-0 p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md" style={{ borderColor: '#E8FFD7' }}>
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 text-lg" style={{ color: '#5E936C' }}>{icons.trendingUp}</span>
                        <span className="text-xs text-gray-600 truncate md:text-sm">{t.expectedYield}</span>
                      </div>
                      <p className="text-xl font-bold md:text-2xl" style={{ color: '#5E936C' }}>
                        {dashboardData.expectedYield}% {dashboardData.yieldTrend === 'increase' ? '↑' : ''}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{t.comparedToLastYear}</p>
                    </div>
                    <div className="min-w-0 p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md" style={{ borderColor: '#E8FFD7' }}>
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 text-lg" style={{ color: '#5E936C' }}>{icons.droplets}</span>
                        <span className="text-xs text-gray-600 truncate md:text-sm">{t.soilMoisture}</span>
                      </div>
                      <p className="text-xl font-bold md:text-2xl" style={{ color: '#5E936C' }}>
                        {dashboardData.soilMoisture}%
                      </p>
                      <p className="text-xs text-gray-500 truncate">{t.idealLevel}</p>
                    </div>
                    <div className="min-w-0 p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md" style={{ borderColor: '#E8FFD7' }}>
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 text-lg" style={{ color: '#5E936C' }}>{icons.cloud}</span>
                        <span className="text-xs text-gray-600 truncate md:text-sm">{t.todayWeather}</span>
                      </div>
                      <p className="text-xl font-bold md:text-2xl" style={{ color: '#5E936C' }}>
                        {dashboardData.weather.temperature}°C
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {getWeatherCondition(dashboardData.weather.condition)}
                      </p>
                    </div>
                    <div className="min-w-0 p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md" style={{ borderColor: '#E8FFD7' }}>
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 text-lg" style={{ color: '#5E936C' }}>{icons.dollarSign}</span>
                        <span className="text-xs text-gray-600 truncate md:text-sm">{getDynamicPriceLabel()}</span>
                      </div>
                      <p className="text-lg font-bold md:text-2xl" style={{ color: '#5E936C' }}>
                        ₹{dashboardData.marketPrice}/{t.quintal}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{t.todayMarketRate}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="p-4 mb-6 overflow-hidden text-white rounded-xl md:p-6" 
                   style={{ background: 'linear-gradient(135deg, #93DA97 0%, #5E936C 100%)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl md:text-2xl">🤖</div>
                  <h2 className="text-lg font-bold truncate md:text-xl">{t.aiPrediction}</h2>
                </div>
                <p className="mb-4 text-sm md:text-base" style={{ color: '#E8FFD7' }}>{t.aiDescription}</p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={handleGetAIPrediction}
                    disabled={isAILoading}
                    className="px-4 py-2 text-sm font-semibold transition-colors bg-white rounded-lg md:px-6 hover:bg-gray-100 md:text-base"
                    style={{ color: '#3E5F44' }}
                  >
                    {isAILoading ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-t-2 border-gray-300 rounded-full mr-2"></span>
                        {t.loadingAdvice}
                      </>
                    ) : (
                      t.getAI
                    )}
                  </button>
                  <button 
                    onClick={handlePhotoUpload}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors rounded-lg md:px-6 hover:opacity-90 md:text-base"
                    style={{ backgroundColor: '#3E5F44' }}
                  >
                    <span>{icons.camera}</span>
                    {t.uploadPhoto}
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <FiltersSection 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  currentLanguage={currentLanguage}
                />
              </div>
              {!advisory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-t-2 border-gray-300 rounded-full md:h-8 md:w-8 animate-spin" 
                       style={{ borderTopColor: '#5E936C' }}></div>
                  <span className="ml-2 text-base md:text-lg">{t.loadingAdvice}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <AdvisoryCard 
                    advisory={advisory} 
                    onNewAdvisory={handleNewAdvisory}
                    currentLanguage={currentLanguage}
                    filters={filters}
                  />
                </div>
              )}
            </>
          )}
          {activeSection === 'prediction' && (
            <div className="p-6 bg-white border rounded-lg shadow-lg" style={{ borderColor: '#E8FFD7' }}>
              <h2 className="flex items-center gap-2 mb-4 text-xl font-bold">
                <span className="text-2xl" style={{ color: '#5E936C' }}>{icons.trendingUp}</span>
                {t.prediction}
              </h2>
              <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8FFD7' }}>
                  <span className="block mb-2 text-2xl" style={{ color: '#5E936C' }}>{icons.target}</span>
                  <h3 className="font-semibold">{t.expectedYield}</h3>
                  <p className="text-2xl font-bold" style={{ color: '#5E936C' }}>
                    {yieldData?.expected_yield || 75}% {yieldData?.yield_trend === 'increase' ? '↑' : ''}
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8FFD7' }}>
                  <span className="block mb-2 text-2xl" style={{ color: '#5E936C' }}>{icons.calendar}</span>
                  <h3 className="font-semibold">{t.bestPlantingTime}</h3>
                  <p className="text-lg font-semibold" style={{ color: '#3E5F44' }}>
                    {yieldData?.best_planting_time}
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8FFD7' }}>
                  <span className="block mb-2 text-2xl" style={{ color: '#5E936C' }}>{icons.droplets}</span>
                  <h3 className="font-semibold">{t.irrigationSchedule}</h3>
                  <p className="text-lg font-semibold" style={{ color: '#3E5F44' }}>
                    {yieldData?.irrigation_schedule}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-semibold">🎯 {t.aiSuggestions}:</h3>
                <ul className="space-y-3">
                  {(yieldData?.ai_suggestions || [
                    currentLanguage === 'hi' ? "मिट्टी में नाइट्रोजन की मात्रा बढ़ाएं" : 
                    currentLanguage === 'en' ? "Increase nitrogen content in soil" : 
                    "ମାଟିରେ ନାଇଟ୍ରୋଜେନର ପରିମାଣ ବଢ଼ାନ୍ତୁ"
                  ]).map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#E8FFD7' }}>
                      <span className="text-lg font-bold" style={{ color: '#5E936C' }}>✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activeSection === 'weather' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="p-6 bg-white border rounded-lg shadow" style={{ borderColor: '#E8FFD7' }}>
                <h3 className="flex items-center gap-2 mb-4 text-lg font-bold">
                  <span className="text-2xl" style={{ color: '#5E936C' }}>{icons.cloud}</span>
                  {t.weatherDetails}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#E8FFD7' }}>
                    <span>{t.temperature}:</span>
                    <span className="font-bold" style={{ color: '#5E936C' }}>
                      {dashboardData?.weather.temperature || 28}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#E8FFD7' }}>
                    <span>{t.humidity}:</span>
                    <span className="font-bold" style={{ color: '#5E936C' }}>
                      {dashboardData?.weather.humidity || 65}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#E8FFD7' }}>
                    <span>{t.rainfall}:</span>
                    <span className="font-bold" style={{ color: '#5E936C' }}>
                      {dashboardData?.weather.precipitation || 12}mm
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#E8FFD7' }}>
                    <span>{t.weatherCondition}:</span>
                    <span className="font-bold" style={{ color: '#3E5F44' }}>
                      {getWeatherCondition(dashboardData?.weather.condition || 'Partly cloudy')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white border rounded-lg shadow" style={{ borderColor: '#E8FFD7' }}>
                <h3 className="flex items-center gap-2 mb-4 text-lg font-bold">
                  <span className="text-2xl" style={{ color: '#5E936C' }}>{icons.leaf}</span>
                  {t.soilHealthDetails}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#E8FFD7' }}>
                    <span>{t.soilMoisture}:</span>
                    <span className="font-bold" style={{ color: '#5E936C' }}>
                      {soilData?.soil_moisture || 65}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#E8FFD7' }}>
                    <span>{t.phLevel}:</span>
                    <span className="font-bold" style={{ color: '#5E936C' }}>
                      {soilData?.ph_level || 6.5}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#E8FFD7' }}>
                    <span>{t.nitrogen}:</span>
                    <span className="font-bold" style={{ color: '#5E936C' }}>
                      {soilData?.nitrogen_level || "medium"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#E8FFD7' }}>
                    <span>{t.phosphorus}:</span>
                    <span className="font-bold" style={{ color: '#3E5F44' }}>
                      {soilData?.phosphorus_level || "medium"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'soil' && (
            <div className="space-y-6">
              <div className="p-6 bg-white border rounded-lg shadow" style={{ borderColor: '#E8FFD7' }}>
                <h2 className="flex items-center gap-2 mb-4 text-xl font-bold">
                  <span className="text-2xl" style={{ color: '#5E936C' }}>{icons.leaf}</span>
                  {t.soilHealthDetails}
                </h2>
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8FFD7' }}>
                    <span className="block mb-2 text-2xl" style={{ color: '#5E936C' }}>{icons.droplets}</span>
                    <h3 className="font-semibold">{t.soilMoisture}</h3>
                    <p className="text-2xl font-bold" style={{ color: '#5E936C' }}>
                      {soilData?.soil_moisture || 65}%
                    </p>
                    <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                      <div className="h-2 rounded-full" 
                           style={{ 
                             width: `${soilData?.soil_moisture || 65}%`,
                             backgroundColor: '#5E936C'
                           }}></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8FFD7' }}>
                    <h3 className="font-semibold">{t.phLevel}</h3>
                    <p className="text-2xl font-bold" style={{ color: '#5E936C' }}>6.5</p>
                    <p className="text-sm text-gray-600">{t.withinNormalRange}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8FFD7' }}>
                    <h3 className="font-semibold">{t.nitrogen}</h3>
                    <p className="text-2xl font-bold" style={{ color: '#5E936C' }}>
                      {soilData?.nitrogen_level || "medium"}
                    </p>
                    <p className="text-sm" style={{ color: '#5E936C' }}>
                      {soilData?.nitrogen_level === "high" ? "85%" : soilData?.nitrogen_level === "medium" ? "65%" : "45%"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8FFD7' }}>
                    <h3 className="font-semibold">{t.phosphorus}</h3>
                    <p className="text-2xl font-bold" style={{ color: '#3E5F44' }}>
                      {soilData?.phosphorus_level || "medium"}
                    </p>
                    <p className="text-sm" style={{ color: '#3E5F44' }}>
                      {soilData?.phosphorus_level === "high" ? "75%" : soilData?.phosphorus_level === "medium" ? "62%" : "40%"}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8FFD7' }}>
                  <h3 className="mb-3 font-semibold">{t.soilImprovementSuggestions}</h3>
                  <ul className="space-y-2">
                    {(soilData?.improvement_suggestions || [
                      t.addDAPFertilizer,
                      t.improveWithOrganic,
                      t.useMulching
                    ]).map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span style={{ color: '#5E936C' }}>✓</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'market' && (
            <div className="p-6 bg-white border rounded-lg shadow" style={{ borderColor: '#E8FFD7' }}>
              <h3 className="flex items-center gap-2 mb-4 text-lg font-bold">
                <span className="text-2xl" style={{ color: '#5E936C' }}>{icons.dollarSign}</span>
                {t.marketRates}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(marketData?.nearby_districts || [
                  { name: "District 1", price: 2450 },
                  { name: "District 2", price: 2550 },
                  { name: "District 3", price: 2400 },
                  { name: "District 4", price: 2600 },
                  { name: "District 5", price: 2500 },
                  { name: "District 6", price: 2480 },
                  { name: "District 7", price: 2680 },
                  { name: "District 8", price: 2610 },
                  { name: "District 9", price: 2310 }
                ]).map((crop, index) => (
                  <div key={index} className="p-4 border-l-4 rounded-lg" 
                       style={{ 
                         backgroundColor: '#E8FFD7',
                         borderLeftColor: '#5E936C'
                       }}>
                    <h4 className="text-lg font-semibold">{crop.name}</h4>
                    <p className="text-2xl font-bold" style={{ color: '#5E936C' }}>
                      ₹{crop.price}/{t.quintal}
                    </p>
                    <p className="text-sm" style={{ color: '#5E936C' }}>
                      {marketData?.price_trend === 'increasing' ? '↑' : marketData?.price_trend === 'decreasing' ? '↓' : '→'} {marketData?.price_trend === 'increasing' ? '+2.5%' : marketData?.price_trend === 'decreasing' ? '-1.2%' : '0%'} {marketData?.price_trend === 'increasing' ? t.increase : marketData?.price_trend === 'decreasing' ? t.decrease : t.stable}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">{t.fromLastWeek}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 mt-6 rounded-lg" style={{ backgroundColor: '#E8FFD7' }}>
                <h4 className="mb-3 font-semibold">{t.marketTrends}</h4>
                <ul className="space-y-2 text-sm">
                  {(marketData?.market_trends || [
                    t.oilseedDemand,
                    t.wheatStable,
                    t.cottonVolatile
                  ]).map((trend, index) => (
                    <li key={index}>{trend}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
      <button 
        onClick={handlePhotoUpload}
        className="fixed z-40 p-3 text-white transition-colors rounded-full shadow-lg bottom-6 right-6 md:p-4 hover:opacity-90"
        style={{ backgroundColor: '#5E936C' }}
        title={t.uploadPhoto}
      >
        {icons.camera}
      </button>
    </div>
  );
};

export default Index;




















































