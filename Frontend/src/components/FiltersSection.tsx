import { useState, useEffect } from 'react';
import FilterDropdown from './FilterDropdown';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface FilterState {
  cropType: string;
  soilType: string;
  season: string;
  irrigation: string;
  fertilizer: string;
  pestDisease: string;
  region: string;
  district: string;
  budget: string;
}

interface FiltersSectionProps {
  filters: FilterState;
  onFilterChange: (filterType: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
  currentLanguage: 'hi' | 'en' | 'or';
}

// State names in different languages
const stateNamesTranslation = {
  en: {
    "Andhra Pradesh": "Andhra Pradesh",
    "Arunachal Pradesh": "Arunachal Pradesh",
    "Assam": "Assam",
    "Bihar": "Bihar",
    "Chhattisgarh": "Chhattisgarh",
    "Goa": "Goa",
    "Gujarat": "Gujarat",
    "Haryana": "Haryana",
    "Himachal Pradesh": "Himachal Pradesh",
    "Jharkhand": "Jharkhand",
    "Karnataka": "Karnataka",
    "Kerala": "Kerala",
    "Madhya Pradesh": "Madhya Pradesh",
    "Maharashtra": "Maharashtra",
    "Manipur": "Manipur",
    "Meghalaya": "Meghalaya",
    "Mizoram": "Mizoram",
    "Nagaland": "Nagaland",
    "Odisha": "Odisha",
    "Punjab": "Punjab",
    "Rajasthan": "Rajasthan",
    "Sikkim": "Sikkim",
    "Tamil Nadu": "Tamil Nadu",
    "Telangana": "Telangana",
    "Tripura": "Tripura",
    "Uttar Pradesh": "Uttar Pradesh",
    "Uttarakhand": "Uttarakhand",
    "West Bengal": "West Bengal",
    "Andaman and Nicobar Islands": "Andaman and Nicobar Islands",
    "Chandigarh": "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu": "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi": "Delhi",
    "Jammu and Kashmir": "Jammu and Kashmir",
    "Ladakh": "Ladakh",
    "Lakshadweep": "Lakshadweep",
    "Puducherry": "Puducherry"
  },
  hi: {
    "Andhra Pradesh": "आंध्र प्रदेश",
    "Arunachal Pradesh": "अरुणाचल प्रदेश",
    "Assam": "असम",
    "Bihar": "बिहार",
    "Chhattisgarh": "छत्तीसगढ़",
    "Goa": "गोवा",
    "Gujarat": "गुजरात",
    "Haryana": "हरियाणा",
    "Himachal Pradesh": "हिमाचल प्रदेश",
    "Jharkhand": "झारखंड",
    "Karnataka": "कर्नाटक",
    "Kerala": "केरल",
    "Madhya Pradesh": "मध्य प्रदेश",
    "Maharashtra": "महाराष्ट्र",
    "Manipur": "मणिपुर",
    "Meghalaya": "मेघालय",
    "Mizoram": "मिजोरम",
    "Nagaland": "नागालैंड",
    "Odisha": "ओडिशा",
    "Punjab": "पंजाब",
    "Rajasthan": "राजस्थान",
    "Sikkim": "सिक्किम",
    "Tamil Nadu": "तमिल नाडु",
    "Telangana": "तेलंगाना",
    "Tripura": "त्रिपुरा",
    "Uttar Pradesh": "उत्तर प्रदेश",
    "Uttarakhand": "उत्तराखंड",
    "West Bengal": "पश्चिम बंगाल",
    "Andaman and Nicobar Islands": "अंडमान और निकोबार द्वीप समूह",
    "Chandigarh": "चंडीगढ़",
    "Dadra and Nagar Haveli and Daman and Diu": "दादरा और नगर हवेली और दमन और दीव",
    "Delhi": "दिल्ली",
    "Jammu and Kashmir": "जम्मू और कश्मीर",
    "Ladakh": "लद्दाख",
    "Lakshadweep": "लक्षद्वीप",
    "Puducherry": "पुडुचेरी"
  },
  or: {
    "Andhra Pradesh": "ଆନ୍ଧ୍ର ପ୍ରଦେଶ",
    "Arunachal Pradesh": "ଅରୁଣାଚଳ ପ୍ରଦେଶ",
    "Assam": "ଆସାମ",
    "Bihar": "ବିହାର",
    "Chhattisgarh": "ଛତିଶଗଡ଼",
    "Goa": "ଗୋଆ",
    "Gujarat": "ଗୁଜରାଟ",
    "Haryana": "ହରିୟାଣା",
    "Himachal Pradesh": "ହିମାଚଳ ପ୍ରଦେଶ",
    "Jharkhand": "ଝାଡ଼ଖଣ୍ଡ",
    "Karnataka": "କର୍ଣ୍ଣାଟକ",
    "Kerala": "କେରଳ",
    "Madhya Pradesh": "ମଧ୍ୟ ପ୍ରଦେଶ",
    "Maharashtra": "ମହାରାଷ୍ଟ୍ର",
    "Manipur": "ମଣିପୁର",
    "Meghalaya": "ମେଘାଳୟ",
    "Mizoram": "ମିଜୋରାମ",
    "Nagaland": "ନାଗାଲ୍ୟାଣ୍ଡ",
    "Odisha": "ଓଡ଼ିଶା",
    "Punjab": "ପଞ୍ଜାବ",
    "Rajasthan": "ରାଜସ୍ଥାନ",
    "Sikkim": "ସିକିମ",
    "Tamil Nadu": "ତାମିଲନାଡୁ",
    "Telangana": "ତେଲେଙ୍ଗାନା",
    "Tripura": "ତ୍ରିପୁରା",
    "Uttar Pradesh": "ଉତ୍ତର ପ୍ରଦେଶ",
    "Uttarakhand": "ଉତ୍ତରାଖଣ୍ଡ",
    "West Bengal": "ପଶ୍ଚିମ ବଙ୍ଗ",
    "Andaman and Nicobar Islands": "ଆଣ୍ଡାମାନ ଓ ନିକୋବର ଦ୍ୱୀପପୁଞ୍ଜ",
    "Chandigarh": "ଚଣ୍ଡୀଗଡ଼",
    "Dadra and Nagar Haveli and Daman and Diu": "ଦାଦରା ଓ ନଗର ହାଭେଲି ଓ ଦମନ ଓ ଦିଉ",
    "Delhi": "ଦିଲ୍ଲୀ",
    "Jammu and Kashmir": "ଜମ୍ମୁ ଓ କାଶ୍ମୀର",
    "Ladakh": "ଲଦାଖ",
    "Lakshadweep": "ଲକ୍ଷଦ୍ୱୀପ",
    "Puducherry": "ପୁଡୁଚେରୀ"
  }
};

// Complete state and district data with translations
const stateDistrictData = {
  en: {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
    "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Dima Hasao", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela Pendra Marwahi", "Janjgir Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chachaura", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Maihar", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Kolasib", "Khawzawl", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
    "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Noklak", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
    "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
    // Union Territories
    "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
    "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
    "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
    "Ladakh": ["Kargil", "Leh"],
    "Lakshadweep": ["Lakshadweep"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
  },
  hi: {
    "Andhra Pradesh": ["अनंतपुर", "चित्तूर", "पूर्वी गोदावरी", "गुंटूर", "कृष्णा", "कुर्नूल", "प्रकाशम", "श्रीकाकुलम", "विशाखापत्तनम", "विजयनगरम", "पश्चिम गोदावरी", "वाईएसआर कडापा"],
    "Arunachal Pradesh": ["अंजॉ", "चांगलांग", "दिबांग घाटी", "पूर्वी कामेंग", "पूर्वी सियांग", "कामले", "क्रा दादी", "कुरुंग कुमे", "लेपा राडा", "लोहित", "लॉन्गडिंग", "निचली दिबांग घाटी", "निचली सियांग", "निचली सुबानसिरी", "नामसाई", "पक्के केसांग", "पपुम पारे", "शि योमी", "सियांग", "तवांग", "तिरप", "ऊपरी सियांग", "ऊपरी सुबानसिरी", "पश्चिम कामेंग", "पश्चिम सियांग"],
    "Assam": ["बक्सा", "बारपेटा", "बिश्वनाथ", "बोंगाईगांव", "कछार", "चरैदेव", "चिरांग", "दरांग", "धेमाजी", "धुबरी", "डिब्रूगढ़", "गोयालपाड़ा", "गोलाघाट", "हैलाकांडी", "होजाई", "जोरहाट", "कामरूप", "कामरूप महानगर", "कार्बी आंगलोंग", "करीमगंज", "कोकराझार", "लखीमपुर", "माजुली", "मोरीगांव", "नगांव", "नलबाड़ी", "दीमा हसाओ", "शिवसागर", "शोणितपुर", "दक्षिण शालमारा-मानकचर", "तिनसुकिया", "उदालगुड़ी", "पश्चिम कार्बी आंगलोंग"],
    "Bihar": ["अरारिया", "अरवल", "औरंगाबाद", "बांका", "बेगूसराय", "भागलपुर", "भोजपुर", "बक्सर", "दरभंगा", "पूर्वी चंपारण", "गया", "गोपालगंज", "जमुई", "जहानाबाد", "कैमूर", "कटिहार", "खगड़िया", "किशनगंज", "लखीसराय", "मधेपुरा", "मधुबनी", "मुंगेर", "मुजफ्फरपुर", "नालंदा", "नवादा", "पटना", "पूर्णिया", "रोहतास", "सहरसा", "समस्तीपुर", "सारण", "शेखपुरा", "शिवहर", "सीतामढ़ी", "सीवान", "सुपौल", "वैशाली", "पश्चिम चंपारण"],
    "Chhattisgarh": ["बालोद", "बलौदा बाजार", "बलरामपुर", "बस्तर", "बेमेतरा", "बीजापुर", "बिलासपुर", "दंतेवाड़ा", "धमतरी", "दुर्ग", "गरियाबंद", "गौरेला पेंड्रा मरवाही", "जांजगीर चांपा", "जशपुर", "कबीरधाम", "कांकेर", "कोंडागांव", "कोरबा", "कोरिया", "महासमुंद", "मुंगेली", "नारायणपुर", "रायगढ़", "रायपुर", "राजनांदगांव", "सुकमा", "सूरजपुर", "सरगुजा"],
    "Goa": ["उत्तर गोवा", "दक्षिण गोवा"],
    "Gujarat": ["अहमदाबाद", "अमरेली", "आनंद", "अरावली", "बनासकांठा", "भरूच", "भावनगर", "बोटाद", "छोटा उदयपुर", "दाहोद", "डांग", "देवभूमि द्वारका", "गांधीनगर", "गिर सोमनाथ", "जामनगर", "जूनागढ़", "खेड़ा", "कच्छ", "महिसागर", "मेहसाना", "मोरबी", "नर्मदा", "नवसारी", "पंचमहल", "पाटण", "पोरबंदर", "राजकोट", "साबरकांठा", "सूरत", "सुरेंद्रनगर", "तापी", "वडोदरा", "वलसाड"],
    "Haryana": ["अम्बाला", "भिवानी", "चरखी दादरी", "फरीदाबाद", "फतेहाबाद", "गुरुग्राम", "हिसार", "झज्जर", "जींद", "कैथल", "करनाल", "कुरुक्षेत्र", "महेंद्रगढ़", "नूह", "पलवल", "पंचकुला", "पानीपत", "रेवाड़ी", "रोहतक", "सिरसा", "सोनीपत", "यमुनानगर"],
    "Himachal Pradesh": ["बिलासपुर", "चम्बा", "हमीरपुर", "कांगड़ा", "किन्नौर", "कुल्लू", "लाहौल और स्पीति", "मंडी", "शिमला", "सिरमौर", "सोलन", "उना"],
    "Jharkhand": ["बोकारो", "चतरा", "देवघर", "धनबाद", "दुमका", "पूर्वी सिंहभूम", "गढ़वा", "गिरिडीह", "गोड्डा", "गुमला", "हजारीबाग", "जामताड़ा", "खूंटी", "कोडरमा", "लातेहार", "लोहरदगा", "पाकुड़", "पलामू", "रामगढ़", "रांची", "साहिबगंज", "सरायकेला खरसावां", "सिमडेगा", "पश्चिम सिंहभूम"],
    "Karnataka": ["बागलकोट", "बल्लारी", "बेलगावी", "बेंगलुरु ग्रामीण", "बेंगलुरु शहरी", "बीदर", "चामराजनगर", "चिकबल्लापुर", "चिकमगलूर", "चित्रदुर्ग", "दक्षिण कन्नड़", "दावणगेरे", "धारवाड़", "गडग", "हासन", "हावेरी", "कलबुर्गी", "कोडागु", "कोलार", "कोप्पल", "मांड्या", "मैसूरु", "रायचूर", "रामनगर", "शिवमोग्गा", "तुमकूर", "उडुपी", "उत्तर कन्नड़", "विजयपुरा", "यादगीर"],
    "Kerala": ["अलाप्पुझा", "एर्णाकुलम", "इडुक्की", "कन्नूर", "कासरगोड", "कोल्लम", "कोट्टायम", "कोझिकोड", "मलप्पुरम", "पालक्कड़", "पथानामथिट्टा", "तिरुवनंतपुरम", "त्रिशूर", "वायनाड"],
    "Madhya Pradesh": ["आगर मालवा", "अलीराजपुर", "अनूपपुर", "अशोकनगर", "बालाघाट", "बड़वानी", "बेतूल", "भिंड", "भोपाल", "बुरहानपुर", "चचौड़ा", "छतरपुर", "छिंदवाड़ा", "दमोह", "दतिया", "देवास", "धार", "डिंडोरी", "गुना", "ग्वालियर", "हरदा", "होशंगाबाद", "इंदौर", "जबलपुर", "झाबुआ", "कटनी", "खंडवा", "खरगोन", "मैहर", "मंडला", "मंदसौर", "मुरैना", "नरसिंहपुर", "नीमच", "निवारी", "पन्ना", "रायसेन", "राजगढ़", "रतलाम", "रीवा", "सागर", "सतना", "सीहोर", "सिवनी", "शहडोल", "शाजापुर", "श्योपुर", "शिवपुरी", "सीधी", "सिंगरौली", "टीकमगढ़", "उज्जैन", "उमरिया", "विदिशा"],
    "Maharashtra": ["अहमदनगर", "अकोला", "अमरावती", "औरंगाबाद", "बीड", "भंडारा", "बुलढाणा", "चंद्रपुर", "धुले", "गढ़चिरोली", "गोंदिया", "हिंगोली", "जलगांव", "जालना", "कोल्हापुर", "लातूर", "मुंबई शहर", "मुंबई उपनगर", "नागपुर", "नांदेड", "नंदुरबार", "नासिक", "उस्मानाबाद", "पालघर", "परभणी", "पुणे", "रायगढ़", "रत्नागिरी", "सांगली", "सातारा", "सिंधुदुर्ग", "सोलापुर", "ठाणे", "वर्धा", "वाशिम", "यवतमाल"],
    "Manipur": ["बिष्णुपुर", "चांदेल", "चुराचांदपुर", "इम्फाल पूर्व", "इम्फाल पश्चिम", "जिरिबाम", "काकचिंग", "कामजोंग", "कांगपोकपी", "नोनी", "फर्जवल", "सेनापति", "तामेंगलॉन्ग", "तेंगनौपाल", "थौबल", "उखरूल"],
    "Meghalaya": ["पूर्वी गारो हिल्स", "पूर्वी जयंतिया हिल्स", "पूर्वी खासी हिल्स", "उत्तर गारो हिल्स", "री भोई", "दक्षिण गारो हिल्स", "दक्षिण पश्चिम गारो हिल्स", "दक्षिण पश्चिम खासी हिल्स", "पश्चिम गारो हिल्स", "पश्चिम जयंतिया हिल्स", "पश्चिम खासी हिल्स"],
    "Mizoram": ["आइजोल", "चंपई", "नहथियल", "कोलासिब", "खावजावल", "लॉन्गतलाई", "लुंगलेई", "मामित", "सैहा", "साईतुआल", "सेरछिप"],
    "Nagaland": ["दीमापुर", "किफिरे", "कोहिमा", "लोंगलेंग", "मोकोकचुंग", "मोन", "नोकलक", "पेरेन", "फेक", "तुएनसांग", "वोखा", "जुन्हेबोतो"],
    "Odisha": ["अंगुल", "बलांगीर", "बालासोर", "बरगढ़", "भद्रक", "बौध", "कटक", "देवगढ़", "धेनकनाल", "गजपति", "गंजम", "जगतसिंहपुर", "जाजपुर", "झारसुगुड़ा", "कलाहांडी", "कंधमाल", "केंद्रपाड़ा", "केंदुझार", "खोर्धा", "कोरापुट", "मलकानगिरी", "मयूरभंज", "नबरंगपुर", "नयागढ़", "नुआपड़ा", "पुरी", "रायगड़ा", "संबलपुर", "सुबर्णपुर", "सुंदरगढ़"],
    "Punjab": ["अमृतसर", "बरनाला", "बठिंडा", "फरीदकोट", "फतेहगढ़ साहिब", "फाजिल्का", "फिरोजपुर", "गुरदासपुर", "होशियारपुर", "जलंधर", "कपूरथला", "लुधियाना", "मानसा", "मोगा", "मुक्तसर", "नवांशहर", "पठानकोट", "पटियाला", "रुपनगर", "संगरूर", "तरन तारन"],
    "Rajasthan": ["अजमेर", "अलवर", "बांसवाड़ा", "बारां", "बाड़मेर", "भरतपुर", "भीलवाड़ा", "बीकानेर", "बूंदी", "चित्तौड़गढ़", "चुरू", "दौसा", "धौलपुर", "डूंगरपुर", "हनुमानगढ़", "जयपुर", "जैसलमेर", "जालौर", "झालावाड़", "झुंझुनू", "जोधपुर", "करौली", "कोटा", "नागौर", "पाली", "प्रतापगढ़", "राजसमंद", "सवाई माधोपुर", "सीकर", "सिरोही", "श्री गंगानगर", "टोंक", "उदयपुर"],
    "Sikkim": ["पूर्वी सिक्किम", "उत्तर सिक्किम", "दक्षिण सिक्किम", "पश्चिम सिक्किम"],
    "Tamil Nadu": ["अरियलुर", "चेंगलपट्टु", "चेन्नई", "कोयम्बटूर", "कुड्डालोर", "धर्मपुरी", "डिंडीगुल", "इरोड", "कल्लकुरिची", "कांचीपुरम", "कन्याकुमारी", "करूर", "कृष्णगिरी", "मदुरै", "मयिलादुथुरै", "नागपट्टिनम", "नमक्कल", "नीलगिरि", "पेरम्बलुर", "पुदुकोट्टै", "रामनाथपुरम", "रानीपेत", "सलेम", "शिवगंगा", "तेनकासी", "तंजावुर", "थेनी", "थूथुकुडी", "तिरुचिरापल्ली", "तिरुनेलवेली", "तिरुपत्तूर", "तिरुप्पूर", "तिरुवल्लुर", "तिरुवन्नामलै", "तिरुवरूर", "वेल्लोर", "विल्लुपुरम", "विरुधुनगर"],
    "Telangana": ["आदिलाबाद", "भद्राद्री कोथागुडेम", "हैदराबाद", "जगतियाल", "जनगांव", "जयशंकर भूपालपल्ली", "जोगुलाम्बा गडवाल", "कामारेड्डी", "करीमनगर", "खम्माम", "कोमराम भीम आसिफाबाद", "महबूबाबाद", "महबूबनगर", "मंचेरियाल", "मेडक", "मेडचल मलकजगिरी", "मुलुगु", "नगरकुरनूल", "नलगोंडा", "नारायणपेट", "निर्मल", "निजामाबाद", "पेड्डापल्ली", "राजन्ना सिरसिल्ला", "रंगारेड्डी", "संगारेड्डी", "सिद्दीपेट", "सूर्यापेट", "विकाराबाद", "वानपर्थी", "वरंगल ग्रामीण", "वरंगल शहरी", "यादाद्री भुवनगिरी"],
    "Tripura": ["धलाई", "गोमती", "खोवाई", "उत्तर त्रिपुरा", "सेपाहिजला", "दक्षिण त्रिपुरा", "उनकोटी", "पश्चिम त्रिपुरा"],
    "Uttar Pradesh": ["आगरा", "अलीगढ़", "अम्बेडकरनगर", "अमेठी", "अमरोहा", "औरैया", "अयोध्या", "आजमगढ़", "बागपत", "बहराइच", "बलिया", "बलरामपुर", "बांदा", "बाराबंकी", "बरेली", "बस्ती", "भदोही", "बिजनौर", "बदायूं", "बुलंदशहर", "चंदौली", "चित्रकूट", "देवरिया", "एटा", "इटावा", "फर्रुखाबाद", "फतेहपुर", "फिरोजाबाद", "गौतमबुद्ध नगर", "गाजियाबाद", "गाजीपुर", "गोंडा", "गोरखपुर", "हमीरपुर", "हापुड़", "हरदोई", "हाथरस", "जालौन", "जौनपुर", "झांसी", "कन्नौज", "कानपुर देहात", "कानपुर नगर", "कासगंज", "कौशाम्बी", "खेरी", "कुशीनगर", "ललितपुर", "लखनऊ", "महाराजगंज", "महोबा", "मैनपुरी", "मथुरा", "मऊ", "मेरठ", "मिर्जापुर", "मुरादाबाद", "मुजफ्फरनगर", "पीलीभीत", "प्रतापगढ़", "प्रयागराज", "रायबरेली", "रामपुर", "सहारनपुर", "संभल", "संत कबीरनगर", "शाहजहांपुर", "शामली", "श्रावस्ती", "सिद्धार्थनगर", "सीतापुर", "सोनभद्र", "सुल्तानपुर", "उन्नाव", "वाराणसी"],
    "Uttarakhand": ["अल्मोड़ा", "बागेश्वर", "चमोली", "चम्पावत", "देहरादून", "हरिद्वार", "नैनीताल", "पौड़ी गढ़वाल", "पिथौरागढ़", "रुद्रप्रयाग", "टिहरी गढ़वाल", "उधम सिंह नगर", "उत्तरकाशी"],
    "West Bengal": ["अलीपुरद्वार", "बांकुड़ा", "बीरभूम", "कूच बिहार", "दक्षिण दिनाजपुर", "दार्जिलिंग", "हुगली", "हावड़ा", "जलपाईगुड़ी", "झारग्राम", "कलिम्पोंग", "कोलकाता", "मालदा", "मुर्शिदाबाद", "नदिया", "उत्तर 24 परगना", "पश्चिम बर्धमान", "पश्चिम मेदिनीपुर", "पूर्व बर्धमान", "पूर्व मेदिनीपुर", "पुरुलिया", "दक्षिण 24 परगना", "उत्तर दिनाजपुर"],
    // Union Territories
    "Andaman and Nicobar Islands": ["निकोबार", "उत्तर और मध्य अंडमान", "दक्षिण अंडमान"],
    "Chandigarh": ["चंडीगढ़"],
    "Dadra and Nagar Haveli and Daman and Diu": ["दादरा और नगर हवेली", "दमन", "दीव"],
    "Delhi": ["केंद्रीय दिल्ली", "पूर्वी दिल्ली", "नई दिल्ली", "उत्तरी दिल्ली", "उत्तर पूर्व दिल्ली", "उत्तर पश्चिम दिल्ली", "शाहदरा", "दक्षिण दिल्ली", "दक्षिण पूर्व दिल्ली", "दक्षिण पश्चिम दिल्ली", "पश्चिम दिल्ली"],
    "Jammu and Kashmir": ["अनंतनाग", "बांदीपोरा", "बारामूला", "बुडगाम", "डोडा", "गांदरबल", "जम्मू", "कठुआ", "किश्तवाड़", "कुलगाम", "कुपवाड़ा", "पुंछ", "पुलवामा", "राजौरी", "रामबन", "रीसी", "सांबा", "शोपियां", "श्रीनगर", "उधमपुर"],
    "Ladakh": ["कारगिल", "लेह"],
    "Lakshadweep": ["लक्षद्वीप"],
    "Puducherry": ["करईकल", "माहे", "पुडुचेरी", "यानम"]
  },
  or: {
    "Andhra Pradesh": ["ଅନନ୍ତପୁର", "ଚିତ୍ତୁର", "ପୂର୍ବ ଗୋଦାବରୀ", "ଗୁଣ୍ଟୁର", "କୃଷ୍ଣା", "କର୍ଣ୍ଣୁଲ", "ପ୍ରକାଶମ", "ଶ୍ରୀକାକୁଲମ", "ବିଶାଖାପତ୍ତନମ", "ବିଜୟନଗରମ", "ପଶ୍ଚିମ ଗୋଦାବରୀ", "ୱାଇଏସଆର କାଦାପା"],
    "Arunachal Pradesh": ["ଅଞ୍ଜୋ", "ଚାଙ୍ଗଲାଙ୍ଗ", "ଦିବାଙ୍ଗ ଉପତ୍ୟକା", "ପୂର୍ବ କାମେଙ୍ଗ", "ପୂର୍ବ ସିୟାଙ୍ଗ", "କାମଲେ", "କ୍ରା ଦାଦୀ", "କୁରୁଙ୍ଗ କୁମେ", "ଲେପା ରାଦା", "ଲୋହିତ", "ଲଙ୍ଗଡିଙ୍ଗ", "ନିମ୍ନ ଦିବାଙ୍ଗ ଉପତ୍ୟକା", "ନିମ୍ନ ସିୟାଙ୍ଗ", "ନିମ୍ନ ସୁବାନସିରୀ", "ନାମସାଇ", "ପାକେ କେସାଙ୍ଗ", "ପାପୁମ ପାରେ", "ଶି ୟୋମୀ", "ସିୟାଙ୍ଗ", "ତାୱାଙ୍ଗ", "ତିରାପ", "ଉପର ସିୟାଙ୍ଗ", "ଉପର ସୁବାନସିରୀ", "ପଶ୍ଚିମ କାମେଙ୍ଗ", "ପଶ୍ଚିମ ସିୟାଙ୍ଗ"],
    "Assam": ["ବକ୍ସା", "ବାରପେଟା", "ବିଶ୍ୱନାଥ", "ବୋଙ୍ଗାଇଗାଁ", "କାଛାର", "ଚରାଇଦେଓ", "ଚିରାଙ୍ଗ", "ଦରାଙ୍ଗ", "ଧେମାଜୀ", "ଧୁବରୀ", "ଡିବ୍ରୁଗଡ଼", "ଗୋୟାଲପାଡ଼ା", "ଗୋଲାଘାଟ", "ହାଇଲାକାଣ୍ଡି", "ହୋଜାଇ", "ଜୋରହାଟ", "କାମରୁପ", "କାମରୁପ ମେଟ୍ରୋପଲିଟାନ", "କାର୍ବି ଆଙ୍ଗଲଙ୍ଗ", "କରୀମଗଞ୍ଜ", "କୋକରାଝାର", "ଲଖିମପୁର", "ମାଜୁଲୀ", "ମୋରୀଗାଁ", "ନଗାଁ", "ନଲବାଡ଼ୀ", "ଦିମା ହାସାଓ", "ଶିବସାଗର", "ଶୋଣିତପୁର", "ଦକ୍ଷିଣ ଶାଲମାରା-ମାନକାଚର", "ତିନସୁକିଆ", "ଉଦାଲଗୁଡ଼ୀ", "ପଶ୍ଚିମ କାର୍ବି ଆଙ୍ଗଲଙ୍ଗ"],
    "Bihar": ["ଅରାରିଆ", "ଅରୱାଲ", "ଔରଙ୍ଗାବାଦ", "ବାଙ୍କା", "ବେଗୁସରାଇ", "ଭାଗଲପୁର", "ଭୋଜପୁର", "ବକ୍ସର", "ଦରଭଙ୍ଗା", "ପୂର୍ବ ଚମ୍ପାରଣ", "ଗୟା", "ଗୋପାଲଗଞ୍ଜ", "ଜମୁଇ", "ଜହାନାବାଦ", "କଇମୁର", "କଟିହାର", "ଖଗଡ଼ିଆ", "କିଶନଗଞ୍ଜ", "ଲଖୀସରାଇ", "ମଧେପୁରା", "ମଧୁବନୀ", "ମୁଙ୍ଗେର", "ମୁଜଫ୍ଫରପୁର", "ନାଲନ୍ଦା", "ନୱାଦା", "ପାଟଣା", "ପୂର୍ଣ୍ଣିଆ", "ରୋହତାସ", "ସହରସା", "ସମସ୍ତୀପୁର", "ସାରଣ", "ଶେଖପୁରା", "ଶିବହର", "ସୀତାମଢ଼ୀ", "ସୀୱାନ", "ସୁପାଉଲ", "ବୈଶାଲୀ", "ପଶ୍ଚିମ ଚମ୍ପାରଣ"],
    "Chhattisgarh": ["ବାଲୋଦ", "ବଲୋଦା ବାଜାର", "ବଲରାମପୁର", "ବସ୍ତର", "ବେମେତରା", "ବିଜାପୁର", "ବିଲାସପୁର", "ଦନ୍ତେୱାଦା", "ଧମତରୀ", "ଦୁର୍ଗ", "ଗରିଆବନ୍ଦ", "ଗୌରେଲା ପେନ୍ଦ୍ରା ମରୱାହୀ", "ଜାଞ୍ଜଗୀର ଚାମ୍ପା", "ଜଶପୁର", "କବୀରଧାମ", "କାଙ୍କେର", "କୋଣ୍ଡାଗାଁ", "କୋରବା", "କୋରିଆ", "ମହାସମୁନ୍ଦ", "ମୁଙ୍ଗେଲୀ", "ନାରାୟଣପୁର", "ରାୟଗଡ଼", "ରାୟପୁର", "ରାଜନାନ୍ଦଗାଁ", "ସୁକମା", "ସୂରଜପୁର", "ସରଗୁଜା"],
    "Goa": ["ଉତ୍ତର ଗୋଆ", "ଦକ୍ଷିଣ ଗୋଆ"],
    "Gujarat": ["ଅହମଦାବାଦ", "ଅମରେଲୀ", "ଆନନ୍ଦ", "ଅରାବଲୀ", "ବନାସକାଣ୍ଠା", "ଭରୁଚ", "ଭାବନଗର", "ବୋଟାଦ", "ଛୋଟ ଉଦୟପୁର", "ଦାହୋଦ", "ଡାଙ୍ଗ", "ଦେବଭୂମି ଦ୍ୱାରକା", "ଗାନ୍ଧୀନଗର", "ଗିର ସୋମନାଥ", "ଜାମନଗର", "ଜୂନାଗଡ଼", "ଖେଡ଼ା", "କଚ୍ଛ", "ମହିସାଗର", "ମେହସାନା", "ମୋରବି", "ନର୍ମଦା", "ନବସାରୀ", "ପଞ୍ଚମହଲ", "ପାଟଣ", "ପୋରବନ୍ଦର", "ରାଜକୋଟ", "ସାବରକାଣ୍ଠା", "ସୁରତ", "ସୁରେନ୍ଦ୍ରନଗର", "ତାପୀ", "ବଡୋଦରା", "ବଲସାଦ"],
    "Haryana": ["ଅମ୍ବାଲା", "ଭିୱାନୀ", "ଚରଖୀ ଦାଦରୀ", "ଫରୀଦାବାଦ", "ଫତେହାବାଦ", "ଗୁରୁଗ୍ରାମ", "ହିସାର", "ଝଜ୍ଜର", "ଜୀନ୍ଦ", "କୈଥଲ", "କରନାଲ", "କୁରୁକ୍ଷେତ୍ର", "ମହେନ୍ଦ୍ରଗଡ଼", "ନୂହ", "ପଲୱାଲ", "ପଞ୍ଚକୁଲା", "ପାନୀପତ", "ରେୱାଡ଼ୀ", "ରୋହତକ", "ସିରସା", "ସୋନୀପତ", "ଯମୁନାନଗର"],
    "Himachal Pradesh": ["ବିଲାସପୁର", "ଚମ୍ବା", "ହମୀରପୁର", "କାଙ୍ଗଡ଼ା", "କିନ୍ନୌର", "କୁଲ୍ଲୁ", "ଲାହୋଲ ଓ ସ୍ପୀତି", "ମଣ୍ଡି", "ସିମଲା", "ସିରମୌର", "ସୋଲାନ", "ଉନା"],
    "Jharkhand": ["ବୋକାରୋ", "ଚତ୍ରା", "ଦେବଗଡ଼", "ଧନବାଦ", "ଦୁମକା", "ପୂର୍ବ ସିଂହଭୂମ", "ଗଡ଼ୱା", "ଗିରିଡିହ", "ଗୋଡ୍ଡା", "ଗୁମଲା", "ହଜାରୀବାଗ", "ଜାମତାଡ଼ା", "ଖୁଣ୍ଟି", "କୋଡରମା", "ଲାତେହାର", "ଲୋହରଦଗା", "ପାକୁଡ଼", "ପାଲାମୁ", "ରାମଗଡ଼", "ରାଞ୍ଚି", "ସାହିବଗଞ୍ଜ", "ସରାଇକେଲା ଖରସାୱାଁ", "ସିମଡେଗା", "ପଶ୍ଚିମ ସିଂହଭୂମ"],
    "Karnataka": ["ବାଗଲକୋଟ", "ବଲ୍ଲାରୀ", "ବେଲଗାଭୀ", "ବେଙ୍ଗଳୁରୁ ଗ୍ରାମାଞ୍ଚଳ", "ବେଙ୍ଗଳୁରୁ ସହରୀ", "ବୀଦର", "ଚାମରାଜନଗର", "ଚିକବଲ୍ଲାପୁର", "ଚିକମଗଲୂର", "ଚିତ୍ରଦୁର୍ଗ", "ଦକ୍ଷିଣ କନ୍ନଡ଼", "ଦାବଣଗେରେ", "ଧାରୱାଡ଼", "ଗାଦାଗ", "ହାସନ", "ହାବେରୀ", "କାଲବୁର୍ଗୀ", "କୋଡାଗୁ", "କୋଲାର", "କୋପ୍ପଲ", "ମାଣ୍ଡ୍ୟା", "ମୈସୂରୁ", "ରାୟଚୁର", "ରାମନଗର", "ଶିବମୋଗ୍ଗା", "ତୁମକୂରୁ", "ଉଡୁପୀ", "ଉତ୍ତର କନ୍ନଡ଼", "ବିଜୟପୁରା", "ଯାଦଗୀର"],
    "Kerala": ["ଅଲାପ୍ପୁଝା", "ଏର୍ଣାକୁଲମ", "ଇଡୁକ୍କି", "କନ୍ନୁର", "କାସରଗୋଡ", "କୋଲ୍ଲମ", "କୋଟ୍ଟାୟମ", "କୋଝିକୋଡ", "ମଲପ୍ପୁରମ", "ପାଲକ୍କଡ଼", "ପଥାନାମଥିଟ୍ଟା", "ତିରୁବନନ୍ତପୁରମ", "ତ୍ରିଶୂର", "ୱାୟନାଡ"],
    "Madhya Pradesh": ["ଆଗର ମାଲୱା", "ଅଲୀରାଜପୁର", "ଅନୂପପୁର", "ଅଶୋକନଗର", "ବାଲାଘାଟ", "ବଡ଼ୱାନୀ", "ବେତୁଲ", "ଭିଣ୍ଡ", "ଭୋପାଲ", "ବୁରହାନପୁର", "ଚଚୌଡ଼ା", "ଛତରପୁର", "ଛିନ୍ଦୱାଡ଼ା", "ଦମୋହ", "ଦତିଆ", "ଦେୱାସ", "ଧାର", "ଡିଣ୍ଡୋରୀ", "ଗୁନା", "ଗ୍ୱାଲିୟର", "ହରଦା", "ହୋଶଙ୍ଗାବାଦ", "ଇନ୍ଦୋର", "ଜବଲପୁର", "ଝାବୁଆ", "କଟନୀ", "ଖଣ୍ଡୱା", "ଖରଗୋନ", "ମୈହର", "ମଣ୍ଡଲା", "ମନ୍ଦସୌର", "ମୁରୈନା", "ନରସିଂହପୁର", "ନୀମଚ", "ନିୱାରୀ", "ପନ୍ନା", "ରାଇସେନ", "ରାଜଗଡ଼", "ରତଲାମ", "ରେୱା", "ସାଗର", "ସତନା", "ସୀହୋର", "ସିଓନୀ", "ଶହଡୋଲ", "ଶାଜାପୁର", "ଶ୍ୟୋପୁର", "ଶିବପୁରୀ", "ସୀଧୀ", "ସିଂଗରୌଲୀ", "ଟୀକମଗଡ଼", "ଉଜ୍ଜୈନ", "ଉମରିଆ", "ବିଦିଶା"],
    "Maharashtra": ["ଅହମଦନଗର", "ଅକୋଲା", "ଅମରାବତୀ", "ଔରଙ୍ଗାବାଦ", "ବୀଡ", "ଭଣ୍ଡାରା", "ବୁଲଢାଣା", "ଚନ୍ଦ୍ରପୁର", "ଧୁଲେ", "ଗଡ଼ଚିରୋଲୀ", "ଗୋନ୍ଦିଆ", "ହିଙ୍ଗୋଲୀ", "ଜଲଗାଁ", "ଜାଲନା", "କୋଲ୍ହାପୁର", "ଲାତୁର", "ମୁମ୍ବାଇ ନଗର", "ମୁମ୍ବାଇ ଉପନଗର", "ନାଗପୁର", "ନାନ୍ଦେଡ", "ନନ୍ଦୁରବାର", "ନାସିକ", "ଉସ୍ମାନାବାଦ", "ପାଲଘର", "ପର୍ଭଣୀ", "ପୁଣେ", "ରାୟଗଡ଼", "ରତ୍ନାଗିରୀ", "ସାଂଗଲୀ", "ସାତାରା", "ସିନ୍ଧୁଦୁର୍ଗ", "ସୋଲାପୁର", "ଠାଣେ", "ୱର୍ଧା", "ୱାସିମ", "ୟବତମାଲ"],
    "Manipur": ["ବିଷ୍ଣୁପୁର", "ଚାନ୍ଦେଲ", "ଚୁରାଚାନ୍ଦପୁର", "ଇମ୍ଫାଲ ପୂର୍ବ", "ଇମ୍ଫାଲ ପଶ୍ଚିମ", "ଜିରିବାମ", "କାକଚିଙ୍ଗ", "କାମଜୋଂ", "କାଙ୍ଗପୋକପୀ", "ନୋନୀ", "ଫର୍ଜୱାଲ", "ସେନାପତି", "ତାମେଙ୍ଗଲଂ", "ତେଙ୍ଗନୌପାଲ", "ଥୌବଲ", "ଉଖ୍ରୁଲ"],
    "Meghalaya": ["ପୂର୍ବ ଗାରୋ ପର୍ବତ", "ପୂର୍ବ ଜୟନ୍ତିଆ ପର୍ବତ", "ପୂର୍ବ ଖାସି ପର୍ବତ", "ଉତ୍ତର ଗାରୋ ପର୍ବତ", "ରୀ ଭୋଇ", "ଦକ୍ଷିଣ ଗାରୋ ପର୍ବତ", "ଦକ୍ଷିଣ ପଶ୍ଚିମ ଗାରୋ ପର୍ବତ", "ଦକ୍ଷିଣ ପଶ୍ଚିମ ଖାସି ପର୍ବତ", "ପଶ୍ଚିମ ଗାରୋ ପର୍ବତ", "ପଶ୍ଚିମ ଜୟନ୍ତିଆ ପର୍ବତ", "ପଶ୍ଚିମ ଖାସି ପର୍ବତ"],
    "Mizoram": ["ଆଇଜୋଲ", "ଚମ୍ପହାଇ", "ନହଥିୟଲ", "କୋଲାସିବ", "ଖାୱଜାୱଲ", "ଲଂତଲାଇ", "ଲୁଙ୍ଗଲେଇ", "ମାମିତ", "ସାଇହା", "ସାଇତୁଆଲ", "ସେର୍ଛିପ"],
    "Nagaland": ["ଦୀମାପୁର", "କିଫିରେ", "କୋହିମା", "ଲଙ୍ଗଲେଙ୍ଗ", "ମୋକୋକଚୁଙ୍ଗ", "ମୋନ", "ନୋକଲାକ", "ପେରେନ", "ଫେକ", "ତୁଏନସାଙ୍ଗ", "ୱୋଖା", "ଜୁନ୍ହେବୋତୋ"],
    "Odisha": ["ଅଙ୍ଗୁଲ", "ବଲାଙ୍ଗୀର", "ବାଲେଶ୍ୱର", "ବରଗଡ଼", "ଭଦ୍ରକ", "ବୌଦ୍ଧ", "କଟକ", "ଦେବଗଡ଼", "ଢେଙ୍କାନାଳ", "ଗଜପତି", "ଗଞ୍ଜାମ", "ଜଗତସିଂହପୁର", "ଯାଜପୁର", "ଝାରସୁଗୁଡ଼ା", "କଳାହାଣ୍ଡି", "କନ୍ଧମାଳ", "କେନ୍ଦ୍ରାପଡ଼ା", "କେନ୍ଦୁଝର", "ଖୋର୍ଦ୍ଧା", "କୋରାପୁଟ", "ମାଲକାନଗିରି", "ମୟୂରଭଞ୍ଜ", "ନବରଙ୍ଗପୁର", "ନୟାଗଡ଼", "ନୂଆପଡ଼ା", "ପୁରୀ", "ରାୟଗଡ଼ା", "ସମ୍ବଲପୁର", "ସୁବର୍ଣ୍ଣପୁର", "ସୁନ୍ଦରଗଡ଼"],
    "Punjab": ["ଅମୃତସର", "ବରନାଲା", "ବଠିଣ୍ଡା", "ଫରୀଦକୋଟ", "ଫତେହଗଡ଼ ସାହିବ", "ଫାଜିଲକା", "ଫିରୋଜପୁର", "ଗୁରଦାସପୁର", "ହୋଶିୟାରପୁର", "ଜଲନ୍ଧର", "କପୂରଥଲା", "ଲୁଧିଆନା", "ମାନସା", "ମୋଗା", "ମୁକ୍ତସର", "ନୱାଂଶହର", "ପଠାନକୋଟ", "ପଟିଆଲା", "ରୁପନଗର", "ସଂଗରୂର", "ତରନ ତାରନ"],
    "Rajasthan": ["ଅଜମେର", "ଅଲୱର", "ବାଂସୱାଡ଼ା", "ବାରାଂ", "ବାଡ଼ମେର", "ଭରତପୁର", "ଭୀଲୱାଡ଼ା", "ବୀକାନେର", "ବୁନ୍ଦୀ", "ଚିତ୍ତୌଡ଼ଗଡ଼", "ଚୁରୁ", "ଦୌସା", "ଧୌଲପୁର", "ଡୁଙ୍ଗରପୁର", "ହନୁମାନଗଡ଼", "ଜୟପୁର", "ଜୈସଲମେର", "ଜାଲୋର", "ଝାଲାୱାଡ଼", "ଝୁଞ୍ଜୁନୁ", "ଜୋଧପୁର", "କରୌଲୀ", "କୋଟା", "ନାଗୌର", "ପାଲୀ", "ପ୍ରତାପଗଡ଼", "ରାଜସମନ୍ଦ", "ସୱାଇ ମାଧୋପୁର", "ସୀକର", "ସିରୋହୀ", "ଶ୍ରୀ ଗଙ୍ଗାନଗର", "ଟୋଙ୍କ", "ଉଦୟପୁର"],
    "Sikkim": ["ପୂର୍ବ ସିକିମ", "ଉତ୍ତର ସିକିମ", "ଦକ୍ଷିଣ ସିକିମ", "ପଶ୍ଚିମ ସିକିମ"],
    "Tamil Nadu": ["ଅରିୟାଲୁର", "ଚେଙ୍ଗଲପଟ୍ଟୁ", "ଚେନ୍ନାଇ", "କୋୟମ୍ବଟୁର", "କୁଡ୍ଡାଲୋର", "ଧର୍ମପୁରୀ", "ଡିଣ୍ଡିଗୁଲ", "ଇରୋଡ", "କଲ୍ଲକୁରିଚି", "କାଞ୍ଚୀପୁରମ", "କନ୍ୟାକୁମାରୀ", "କାରୁର", "କୃଷ୍ଣଗିରି", "ମଦୁରୈ", "ମୟିଲାଦୁଥୁରୈ", "ନାଗପଟ୍ଟିନମ", "ନାମକଲ", "ନୀଲଗିରି", "ପେରମ୍ବଲୁର", "ପୁଦୁକୋଟ୍ଟୈ", "ରାମନାଥପୁରମ", "ରାନୀପେଟ", "ସାଲେମ", "ଶିବଗଙ୍ଗା", "ତେନକାସୀ", "ତଞ୍ଜାବୁର", "ଥେନୀ", "ଥୁଥୁକୁଡି", "ତିରୁଚିରାପଲ୍ଲୀ", "ତିରୁନେଲବେଲୀ", "ତିରୁପତ୍ତୁର", "ତିରୁପ୍ପୁର", "ତିରୁବଲ୍ଲୁର", "ତିରୁବନ୍ନାମଲୈ", "ତିରୁବାରୁର", "ବେଲ୍ଲୋର", "ବିଲୁପୁରମ", "ବିରୁଧୁନଗର"],
    "Telangana": ["ଆଦିଲାବାଦ", "ଭଦ୍ରାଦ୍ରି କୋଥାଗୁଡେମ", "ହୈଦ୍ରାବାଦ", "ଜଗତିୟାଲ", "ଜଙ୍ଗାଁ", "ଜୟଶଙ୍କର ଭୂପାଲପଲ୍ଲୀ", "ଜୋଗୁଲାମ୍ବା ଗଡୱାଲ", "କାମାରେଡ୍ଡି", "କରୀମନଗର", "ଖମ୍ମାମ", "କୋମାରମ ଭୀମ ଆସିଫାବାଦ", "ମହବୁବାବାଦ", "ମହବୁବନଗର", "ମାଞ୍ଚେରିଆଲ", "ମେଦକ", "ମେଦଚଲ ମଲକାଜଗିରୀ", "ମୁଲୁଗୁ", "ନଗରକୁର୍ନୁଲ", "ନଲଗୋଣ୍ଡା", "ନାରାୟଣପେଟ", "ନିର୍ମଲ", "ନିଜାମାବାଦ", "ପେଡ୍ଡାପଲ୍ଲୀ", "ରାଜନ୍ନା ସିରସିଲ୍ଲା", "ରଙ୍ଗାରେଡ୍ଡି", "ସଙ୍ଗାରେଡ୍ଡି", "ସିଦ୍ଧୀପେଟ", "ସୂର୍ଯ୍ୟାପେଟ", "ବିକାରାବାଦ", "ୱାନପର୍ଥୀ", "ୱାରଙ୍ଗଲ ଗ୍ରାମାଞ୍ଚଳ", "ୱାରଙ୍ଗଲ ସହରୀ", "ଯାଦାଦ୍ରି ଭୁବନଗିରୀ"],
    "Tripura": ["ଧଲାଇ", "ଗୋମତୀ", "ଖୋୱାଇ", "ଉତ୍ତର ତ୍ରିପୁରା", "ସେପାହିଜଲା", "ଦକ୍ଷିଣ ତ୍ରିପୁରା", "ଉନକୋଟୀ", "ପଶ୍ଚିମ ତ୍ରିପୁରା"],
    "Uttar Pradesh": ["ଆଗ୍ରା", "ଅଲୀଗଡ଼", "ଅମ୍ବେଡକରନଗର", "ଅମେଠୀ", "ଅମରୋହା", "ଔରୈୟା", "ଅଯୋଧ୍ୟା", "ଆଜମଗଡ଼", "ବାଗପତ", "ବହରାଇଚ", "ବଲିଆ", "ବଲରାମପୁର", "ବାନ୍ଦା", "ବାରାବଙ୍କୀ", "ବରେଲୀ", "ବସ୍ତୀ", "ଭଦୋହୀ", "ବିଜନୌର", "ବଦାୟୁଁ", "ବୁଲନ୍ଦଶହର", "ଚନ୍ଦୌଲୀ", "ଚିତ୍ରକୂଟ", "ଦେବରିଆ", "ଏଟା", "ଇଟାୱା", "ଫର୍ରୁଖାବାଦ", "ଫତେହପୁର", "ଫିରୋଜାବାଦ", "ଗୌତମବୁଦ୍ଧ ନଗର", "ଗାଜିୟାବାଦ", "ଗାଜୀପୁର", "ଗୋଣ୍ଡା", "ଗୋରଖପୁର", "ହମୀରପୁର", "ହାପୁଡ଼", "ହରଦୋଇ", "ହାଥରସ", "ଜାଲୌନ", "ଜୌନପୁର", "ଝାଂସୀ", "କନ୍ନୌଜ", "କାନପୁର ଦେହାତ", "କାନପୁର ନଗର", "କାସଗଞ୍ଜ", "କୌଶାମ୍ବୀ", "ଖେରୀ", "କୁଶୀନଗର", "ଲଲିତପୁର", "ଲଖନଉ", "ମହାରାଜଗଞ୍ଜ", "ମହୋବା", "ମୈନପୁରୀ", "ମଥୁରା", "ମଉ", "ମେରଠ", "ମିର୍ଜାପୁର", "ମୁରାଦାବାଦ", "ମୁଜଫ୍ଫରନଗର", "ପୀଲୀଭୀତ", "ପ୍ରତାପଗଡ଼", "ପ୍ରୟାଗରାଜ", "ରାୟବରେଲୀ", "ରାମପୁର", "ସହାରନପୁର", "ସମ୍ଭଲ", "ସନ୍ତ କବୀରନଗର", "ଶାହଜହାଁପୁର", "ଶାମଲୀ", "ଶ୍ରାବସ୍ତୀ", "ସିଦ୍ଧାର୍ଥନଗର", "ସୀତାପୁର", "ସୋନଭଦ୍ର", "ସୁଲ୍ତାନପୁର", "ଉନ୍ନାବ", "ବାରାଣସୀ"],
    "Uttarakhand": ["ଅଲ୍ମୋଡ଼ା", "ବାଗେଶ୍ୱର", "ଚମୋଲୀ", "ଚମ୍ପାୱତ", "ଦେହରାଦୂନ", "ହରିଦ୍ୱାର", "ନୈନୀତାଲ", "ପୌଡ଼ୀ ଗଡ଼ୱାଲ", "ପିଥୋରାଗଡ଼", "ରୁଦ୍ରପ୍ରୟାଗ", "ଟିହରୀ ଗଡ଼ୱାଲ", "ଉଧମ ସିଂହ ନଗର", "ଉତ୍ତରକାଶୀ"],
    "West Bengal": ["ଅଲୀପୁରଦୁଆର", "ବାଙ୍କୁଡ଼ା", "ବୀରଭୂମ", "କୁଚ ବିହାର", "ଦକ୍ଷିଣ ଦିନାଜପୁର", "ଦାର୍ଜିଲିଙ୍ଗ", "ହୁଗଲୀ", "ହାୱଡ଼ା", "ଜଲପାଇଗୁଡ଼ୀ", "ଝାଡ଼ଗ୍ରାମ", "କାଲିମ୍ପଙ୍ଗ", "କୋଲକାତା", "ମାଲଦା", "ମୁର୍ଶିଦାବାଦ", "ନଦିଆ", "ଉତ୍ତର ୨୪ ପରଗଣା", "ପଶ୍ଚିମ ବର୍ଦ୍ଧମାନ", "ପଶ୍ଚିମ ମେଦିନୀପୁର", "ପୂର୍ବ ବର୍ଦ୍ଧମାନ", "ପୂର୍ବ ମେଦିନୀପୁର", "ପୁରୁଲିଆ", "ଦକ୍ଷିଣ ୨୪ ପରଗଣା", "ଉତ୍ତର ଦିନାଜପୁର"],
    // Union Territories
    "Andaman and Nicobar Islands": ["ନିକୋବର", "ଉତ୍ତର ଓ ମଧ୍ୟ ଅଣ୍ଡାମାନ", "ଦକ୍ଷିଣ ଅଣ୍ଡାମାନ"],
    "Chandigarh": ["ଚଣ୍ଡୀଗଡ଼"],
    "Dadra and Nagar Haveli and Daman and Diu": ["ଦାଦରା ଓ ନଗର ହାଭେଲି", "ଦମନ", "ଦିଉ"],
    "Delhi": ["କେନ୍ଦ୍ରୀୟ ଦିଲ୍ଲୀ", "ପୂର୍ବ ଦିଲ୍ଲୀ", "ନୂଆ ଦିଲ୍ଲୀ", "ଉତ୍ତର ଦିଲ୍ଲୀ", "ଉତ୍ତର ପୂର୍ବ ଦିଲ୍ଲୀ", "ଉତ୍ତର ପଶ୍ଚିମ ଦିଲ୍ଲୀ", "ଶାହଦରା", "ଦକ୍ଷିଣ ଦିଲ୍ଲୀ", "ଦକ୍ଷିଣ ପୂର୍ବ ଦିଲ୍ଲୀ", "ଦକ୍ଷିଣ ପଶ୍ଚିମ ଦିଲ୍ଲୀ", "ପଶ୍ଚିମ ଦିଲ୍ଲୀ"],
    "Jammu and Kashmir": ["ଅନନ୍ତନାଗ", "ବାନ୍ଦିପୋରା", "ବାରାମୁଲ୍ଲା", "ବୁଡଗାମ", "ଡୋଡା", "ଗାନ୍ଦର୍ବଲ", "ଜମ୍ମୁ", "କଠୁଆ", "କିଶ୍ତୱାଡ଼", "କୁଲଗାମ", "କୁପୱାଡ଼ା", "ପୁଞ୍ଚ", "ପୁଲୱାମା", "ରାଜୌରୀ", "ରାମବନ", "ରୀଆସି", "ସାମ୍ବା", "ଶୋପିଆଁ", "ଶ୍ରୀନଗର", "ଉଧମପୁର"],
    "Ladakh": ["କାରଗିଲ", "ଲେହ"],
    "Lakshadweep": ["ଲକ୍ଷଦ୍ୱୀପ"],
    "Puducherry": ["କରୈକଲ", "ମାହେ", "ପୁଡୁଚେରୀ", "ୟାନମ"]
  }
};

const getFilterOptions = (language: 'hi' | 'en' | 'or') => {
  const allStatesEn = Object.keys(stateDistrictData.en);
  const allStates = allStatesEn.map(state => stateNamesTranslation[language][state as keyof typeof stateNamesTranslation.en]);
  
  const options = {
    hi: {
      cropType: ["सभी", "गेहूं", "चावल", "मक्का", "दाल", "गन्ना", "कपास", "आलू", "प्याज"],
      soilType: ["सभी", "दोमट", "काली", "लाल", "रेतीली", "चिकनी", "कंकरीली"],
      season: ["सभी", "खरीफ", "रबी", "जायद", "साल भर"],
      irrigation: ["सभी", "ड्रिप", "स्प्रिंकलर", "नहर", "ट्यूबवेल", "बारिश पर निर्भर"],
      fertilizer: ["सभी", "जैविक", "रासायनिक", "मिश्रित", "कंपोस्ट", "वर्मीकंपोस्ट"],
      pestDisease: ["सभी", "कीट नियंत्रण", "फंगल रोग", "बैक्टीरियल रोग", "वायरल रोग", "खरपतवार"],
      region: ["सभी", ...allStates],
      budget: ["सभी", "कम (₹10,000 तक)", "मध्यम (₹10,000-50,000)", "अधिक (₹50,000+)"]
    },
    en: {
      cropType: ["All", "Wheat", "Rice", "Maize", "Pulses", "Sugarcane", "Cotton", "Potato", "Onion"],
      soilType: ["All", "Loam", "Black", "Red", "Sandy", "Clay", "Rocky"],
      season: ["All", "Kharif", "Rabi", "Zaid", "Year Round"],
      irrigation: ["All", "Drip", "Sprinkler", "Canal", "Tubewell", "Rain Fed"],
      fertilizer: ["All", "Organic", "Chemical", "Mixed", "Compost", "Vermicompost"],
      pestDisease: ["All", "Pest Control", "Fungal Disease", "Bacterial Disease", "Viral Disease", "Weeds"],
      region: ["All", ...allStates],
      budget: ["All", "Low (Up to ₹10,000)", "Medium (₹10,000-50,000)", "High (₹50,000+)"]
    },
    or: {
      cropType: ["ସବୁ", "ଗହମ", "ଧାନ", "ମକା", "ଡାଲି", "ଆଖୁ", "କପା", "ଆଳୁ", "ପିଆଜ"],
      soilType: ["ସବୁ", "ଦୋରସା", "କଳା", "ଲାଲ", "ବାଲି", "ମାଟି", "ପଥର"],
      season: ["ସବୁ", "ଖରିଫ", "ରବି", "ଜାଇଦ", "ବର୍ଷସାରା"],
      irrigation: ["ସବୁ", "ଡ୍ରିପ", "ସ୍ପ୍ରିଙ୍କଲର", "କେନାଲ", "ଟ୍ୟୁବୱେଲ", "ବର୍ଷା ଉପରେ ନିର୍ଭରଶୀଳ"],
      fertilizer: ["ସବୁ", "ଜୈବିକ", "ରାସାୟନିକ", "ମିଶ୍ରିତ", "କମ୍ପୋଷ୍ଟ", "କୀଟକମ୍ପୋଷ୍ଟ"],
      pestDisease: ["ସବୁ", "କୀଟ ନିୟନ୍ତ୍ରଣ", "ଫଙ୍ଗଲ ରୋଗ", "ବ୍ୟାକଟେରିଆଲ ରୋଗ", "ଭାଇରାଲ ରୋଗ", "ତୃଣ"],
      region: ["ସବୁ", ...allStates],
      budget: ["ସବୁ", "କମ (₹10,000 ପର୍ଯ୍ୟନ୍ତ)", "ମଧ୍ୟମ (₹10,000-50,000)", "ଅଧିକ (₹50,000+)"]
    }
  };

  return options[language];
};

const getDistrictOptions = (selectedRegion: string, language: 'hi' | 'en' | 'or') => {
  if (!selectedRegion || selectedRegion === "" || selectedRegion === "All" || selectedRegion === "सभी" || selectedRegion === "ସବୁ") {
    return language === 'hi' ? ["सभी"] : language === 'or' ? ["ସବୁ"] : ["All"];
  }

  // Find the English state name from the translated name
  let englishStateName = selectedRegion;
  if (language !== 'en') {
    const stateEntries = Object.entries(stateNamesTranslation[language]);
    const foundEntry = stateEntries.find(([englishName, translatedName]) => translatedName === selectedRegion);
    if (foundEntry) {
      englishStateName = foundEntry[0];
    }
  }

  const districts =
    stateDistrictData[language][englishStateName as keyof typeof stateDistrictData[typeof language]] || [];
  const allText = language === 'hi' ? "सभी" : language === 'or' ? "ସବୁ" : "All";

  return [allText, ...districts];
};

const getLabels = (language: 'hi' | 'en' | 'or') => {
  const labels = {
    hi: {
      filterBySearch: "फिल्टर द्वारा खोजें",
      clearFilters: "फिल्टर साफ़ करें",
      cropType: "फसल",
      soilType: "मिट्टी",
      season: "मौसम",
      irrigation: "सिंचाई",
      fertilizer: "उर्वरक",
      pestDisease: "कीट/रोग",
      region: "राज्य/केंद्र शासित प्रदेश",
      district: "जिला",
      budget: "बजट",
      guidance: "मार्गदर्शन"
    },
    en: {
      filterBySearch: "Search by Filters",
      clearFilters: "Clear Filters",
      cropType: "Crop",
      soilType: "Soil",
      season: "Season",
      irrigation: "Irrigation",
      fertilizer: "Fertilizer",
      pestDisease: "Pest/Disease",
      region: "State/UT",
      district: "District",
      budget: "Budget",
      guidance: "Guidance"
    },
    or: {
      filterBySearch: "ଫିଲ୍ଟର ଦ୍ୱାରା ଖୋଜନ୍ତୁ",
      clearFilters: "ଫିଲ୍ଟର ସଫା କରନ୍ତୁ",
      cropType: "ଫସଲ",
      soilType: "ମାଟି",
      season: "ଋତୁ",
      irrigation: "ଜଳସେଚନ",
      fertilizer: "ସାର",
      pestDisease: "କୀଟ/ରୋଗ",
      region: "ରାଜ୍ୟ/କେନ୍ଦ୍ରଶାସିତ ଅଞ୍ଚଳ",
      district: "ଜିଲ୍ଲା",
      budget: "ବଜେଟ",
      guidance: "ମାର୍ଗଦର୍ଶନ"
    }
  };

  return labels[language];
};

export default function FiltersSection({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  currentLanguage 
}: FiltersSectionProps) {
  const labels = getLabels(currentLanguage);
  const filterOptions = getFilterOptions(currentLanguage);
  const districtOptions = getDistrictOptions(filters.region, currentLanguage);

  // Handle region change and reset district
  const handleRegionChange = (value: string) => {
    onFilterChange('region', value);
    // Reset district when region changes
    onFilterChange('district', '');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">🔍</span>
        {labels.filterBySearch}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
        <FilterDropdown
          label={labels.cropType}
          placeholder={currentLanguage === 'hi' ? 'फसल चुनें' : currentLanguage === 'or' ? 'ଫସଲ ବାଛନ୍ତୁ' : 'Select Crop'}
          options={filterOptions.cropType}
          value={filters.cropType}
          onChange={(value) => onFilterChange('cropType', value)}
          guidanceLabel={labels.guidance}
          currentLanguage={currentLanguage}
        />
        
        <FilterDropdown
          label={labels.soilType}
          placeholder={currentLanguage === 'hi' ? 'मिट्टी चुनें' : currentLanguage === 'or' ? 'ମାଟି ବାଛନ୍ତୁ' : 'Select Soil'}
          options={filterOptions.soilType}
          value={filters.soilType}
          onChange={(value) => onFilterChange('soilType', value)}
          guidanceLabel={labels.guidance}
          currentLanguage={currentLanguage}
        />
        
        <FilterDropdown
          label={labels.season}
          placeholder={currentLanguage === 'hi' ? 'मौसम चुनें' : currentLanguage === 'or' ? 'ଋତୁ ବାଛନ୍ତୁ' : 'Select Season'}
          options={filterOptions.season}
          value={filters.season}
          onChange={(value) => onFilterChange('season', value)}
          guidanceLabel={labels.guidance}
          currentLanguage={currentLanguage}
        />
        
        <FilterDropdown
          label={labels.irrigation}
          placeholder={currentLanguage === 'hi' ? 'सिंचाई चुनें' : currentLanguage === 'or' ? 'ଜଳସେଚନ ବାଛନ୍ତୁ' : 'Select Irrigation'}
          options={filterOptions.irrigation}
          value={filters.irrigation}
          onChange={(value) => onFilterChange('irrigation', value)}
          guidanceLabel={labels.guidance}
          currentLanguage={currentLanguage}
        />
        
        <FilterDropdown
          label={labels.fertilizer}
          placeholder={currentLanguage === 'hi' ? 'उर्वरक चुनें' : currentLanguage === 'or' ? 'ସାର ବାଛନ୍ତୁ' : 'Select Fertilizer'}
          options={filterOptions.fertilizer}
          value={filters.fertilizer}
          onChange={(value) => onFilterChange('fertilizer', value)}
          guidanceLabel={labels.guidance}
          currentLanguage={currentLanguage}
        />
        
        <FilterDropdown
          label={labels.pestDisease}
          placeholder={currentLanguage === 'hi' ? 'कीट/रोग चुनें' : currentLanguage === 'or' ? 'କୀଟ/ରୋଗ ବାଛନ୍ତୁ' : 'Select Pest/Disease'}
          options={filterOptions.pestDisease}
          value={filters.pestDisease}
          onChange={(value) => onFilterChange('pestDisease', value)}
          guidanceLabel={labels.guidance}
          currentLanguage={currentLanguage}
        />
        
        <FilterDropdown
          label={labels.region}
          placeholder={currentLanguage === 'hi' ? 'राज्य चुनें' : currentLanguage === 'or' ? 'ରାଜ୍ୟ ବାଛନ୍ତୁ' : 'Select State'}
          options={filterOptions.region}
          value={filters.region}
          onChange={handleRegionChange}
          guidanceLabel={labels.guidance}
          currentLanguage={currentLanguage}
        />
        
        <FilterDropdown
          label={labels.district}
          placeholder={currentLanguage === 'hi' ? 'जिला चुनें' : currentLanguage === 'or' ? 'ଜିଲ୍ଲା ବାଛନ୍ତୁ' : 'Select District'}
          options={districtOptions}
          value={filters.district}
          onChange={(value) => onFilterChange('district', value)}
          guidanceLabel={labels.guidance}
          currentLanguage={currentLanguage}
          disabled={!filters.region || filters.region === "" || filters.region === "All" || filters.region === "सभी" || filters.region === "ସବୁ"}
        />
        
        <FilterDropdown
          label={labels.budget}
          placeholder={currentLanguage === 'hi' ? 'बजट चुनें' : currentLanguage === 'or' ? 'ବଜେଟ୍ ବାଛନ୍ତୁ' : 'Select Budget'}
          options={filterOptions.budget}
          value={filters.budget}
          onChange={(value) => onFilterChange('budget', value)}
          guidanceLabel={labels.guidance}
          currentLanguage={currentLanguage}
        />
      </div>
      
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {labels.clearFilters}
        </Button>
      )}
    </div>
  );
}
