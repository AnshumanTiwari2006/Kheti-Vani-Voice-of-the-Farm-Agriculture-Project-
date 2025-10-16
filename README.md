🌾 Kheti Vaani - Voice of the Farm

Kheti Vaani is an AI-powered, multilingual platform designed to provide farmers with comprehensive and detailed expert guidance for their crops.
Leveraging a FastAPI backend with an integrated Machine Learning Model for crop yield prediction and a Language Model (LLM) for generating personalized advisory, the application helps farmers optimize their practices for better productivity and informed decision-making.

✨ Features

AI-Powered Advisory: Generates expert farming recommendations based on user-selected filters (Crop Type, Soil Type, Season, Region, Budget, etc.).

Crop Yield Prediction: Utilizes a custom ML model (crop_yield_model.pkl) to predict expected crop yield based on various environmental and agricultural factors.

Detailed Metrics: Provides essential data on weather, soil health, and market trends.

Multilingual Support: User interface and advisory content are available in multiple languages (including Hindi, English, and Oriya).

Interactive Filters: Allows users to drill down on specific farming conditions to receive highly relevant advice.

🛠️ Prerequisites

To run this project locally, ensure the following are installed:

Backend

Python 3.8+

Pip (Python package installer)

Virtual Environment Tool (e.g., venv or conda)

Frontend

Node.js (LTS version recommended)

npm or yarn (Package manager)

🚀 Setup & Installation

Before starting, it is crucial to organize the uploaded files into separate directories for the backend and frontend.

1. Project Cloning
# Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd kheti-vaani

2. Backend Setup (FastAPI & Machine Learning)

The backend handles the API logic, communication with the AI/LLM, and serving the machine learning predictions.

Assumption: Place the following files into a backend/ directory:

app.py

requirements.txt

crop_yield_50000.csv

(Crucial) Your model training code (e.g., train_model.py)

A. Environment and Dependencies
cd backend


Create a Python virtual environment and activate it:

python -m venv venv

# On Windows
.\venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate


Install dependencies:

pip install -r requirements.txt

B. Machine Learning Model Generation

The app.py file requires a pre-trained and pickled ML model named crop_yield_model.pkl to load at startup.
Run your model training script to generate this file from the provided dataset.

# Assuming your training script is named train_model.py
python train_model.py


⚠️ This step is mandatory for the app to function, as app.py automatically loads the generated crop_yield_model.pkl file.

C. Run the Backend Server

Start the FastAPI server with auto-reloading:

uvicorn app:app --reload


The backend API will now be running at:
👉 http://127.0.0.1:8000

3. Frontend Setup (React/TypeScript)

The frontend provides the user interface for inputting farm details and viewing the AI advisory and predictions.

Assumption: Place your frontend files (e.g., index.tsx, AdvisoryCard.tsx, etc.) in a frontend/ directory with the following structure.

Navigate to the frontend directory:

cd ../frontend


Install dependencies:

npm install
# or
yarn install


Run the development server:

npm run dev
# or
yarn dev


Frontend runs by default at:
👉 http://localhost:3000

📁 Project Structure (Recommended)
kheti-vaani/
├── backend/
│   ├── app.py                  # FastAPI entry point
│   ├── requirements.txt        # Python dependencies
│   ├── crop_yield_50000.csv    # Dataset for ML training
│   ├── crop_yield_model.pkl    # Generated ML model
│   └── train_model.py          # Script to train ML model
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdvisoryCard.tsx
│   │   │   ├── FilterDropdown.tsx
│   │   │   ├── FiltersSection.tsx
│   │   │   └── GuideModal.tsx
│   │   ├── pages/
│   │   │   ├── index.tsx
│   │   │   └── NotFound.tsx
│   ├── package.json
│   └── tsconfig.json
│
└── README.md

🤝 Contribution

We welcome contributions to Kheti Vaani! 🌱
If you have suggestions for new features, bug fixes, or improvements to the ML model, follow these steps:

# 1. Fork the repository
# 2. Create a new feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'Add some AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature


Then open a Pull Request 🚀

📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

(You should create a LICENSE file and choose a license that suits your project.)
