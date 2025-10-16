# Kheti-Vani-Voice-of-the-Farm-Agriculture-Project-
🌾 Kheti Vaani - Voice of the Farm
Kheti Vaani is an AI-powered, multilingual platform designed to provide farmers with comprehensive and detailed expert guidance for their crops. Leveraging a FastAPI backend with an integrated Machine Learning Model for crop yield prediction and a powerful Language Model (LLM) for generating personalized advisory, the application helps farmers optimize their practices for better productivity and informed decision-making.

✨ Features
AI-Powered Advisory: Generates expert farming recommendations based on user-selected filters (Crop Type, Soil Type, Season, Region, Budget, etc.).

Crop Yield Prediction: Utilizes a custom ML model (crop_yield_model.pkl) to predict expected crop yield based on various environmental and agricultural factors.

Detailed Metrics: Provides essential data on weather, soil health, and market trends.

Multilingual Support: User interface and advisory content are available in multiple languages (inferred to include Hindi, English, and Oriya from the frontend files).

Interactive Filters: Allows users to drill down on specific farming conditions to receive highly relevant advice.

🛠️ Prerequisites
To run this project locally, you will need the following installed:

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
<img width="362" height="96" alt="image" src="https://github.com/user-attachments/assets/1aeefb7c-f679-4903-9bc2-886da4ac958b" />

2. Backend Setup (FastAPI & Machine Learning)
The backend handles the API logic, communication with the AI/LLM, and serving the machine learning predictions.

Assumption: Please ensure you organize the following files into a backend/ directory:

app.py

requirements.txt

crop_yield_50000.csv

(Crucial) Your model training code (e.g., train_model.py)

A. Environment and Dependencies
Navigate to the backend directory:
<img width="167" height="50" alt="image" src="https://github.com/user-attachments/assets/78777376-ba90-4de5-87f9-ca0ce5e29f0d" />
Create a Python virtual environment and activate it:
<img width="320" height="142" alt="image" src="https://github.com/user-attachments/assets/9627d0d0-7b6d-4a9d-b052-f4149e19b500" />
Install the required dependencies:
<img width="381" height="40" alt="image" src="https://github.com/user-attachments/assets/cbb6d0a2-cb20-4035-9b1c-a86a3c20d4d7" />

B. Machine Learning Model Generation
The app.py file requires a pre-trained and pickled ML model named crop_yield_model.pkl to load at startup. You must first run your model training script to generate this file from the provided dataset.

Download and place your model training script (which utilizes the crop_yield_50000.csv dataset and saves the output as crop_yield_model.pkl) into the backend/ directory.

Execute the training script:
<img width="615" height="67" alt="image" src="https://github.com/user-attachments/assets/1a2dc7fe-cf84-4837-ad1a-628105534b35" />

This step is MANDATORY for the app to function, as app.py automatically loads the generated crop_yield_model.pkl file.

C. Run the Backend Server
Start the FastAPI server with auto-reloading:
<img width="282" height="40" alt="image" src="https://github.com/user-attachments/assets/e534f784-3867-435a-bb8d-c281691f3938" />
The backend API will now be running, typically accessible at http://127.0.0.1:8000.

3. Frontend Setup (React/TypeScript)
The frontend provides the user interface for inputting farm details and viewing the AI advisory and predictions.

Assumption: Please ensure your frontend files (e.g., index.tsx, AdvisoryCard.tsx, etc.) are placed in the appropriate frontend structure (e.g., inside a frontend/ directory, with components in frontend/src/components).

Navigate to the frontend directory:
<img width="477" height="53" alt="image" src="https://github.com/user-attachments/assets/9defb4e8-83b8-435b-bc1b-7f3af127eb90" />
Install the Node.js dependencies:
<img width="202" height="96" alt="image" src="https://github.com/user-attachments/assets/5ee4f501-9656-436a-ab38-e038efd1ec1e" />
Run the Development Server:
<img width="198" height="88" alt="image" src="https://github.com/user-attachments/assets/01810e75-5fc8-4afa-ace9-673d7ea54e45" />

The frontend application will now be running, typically accessible at http://localhost:3000 (or another port specified by your frontend framework).

📁 Project Structure (Recommended)
For a clean and maintainable project, the repository should be structured as follows:
<img width="816" height="541" alt="image" src="https://github.com/user-attachments/assets/d4076108-060b-46b6-b966-ba6fbf18e525" />
🤝 Contribution
We welcome contributions to Kheti Vaani! If you have suggestions for new features, bug fixes, or improvements to the ML model, please follow these steps:

Fork the repository.

Create a new feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details (You should create a LICENSE file and choose a license that suits your project).
