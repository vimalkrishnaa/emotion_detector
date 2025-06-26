# BERT Emotion Detector

A full-stack web application for emotion detection using a fine-tuned BERT model. Enter any sentence and instantly discover if it expresses sadness, joy, love, anger, fear, or surprise!

## 🎥 Video Demo

👉 [Watch the video demo on Google Drive](https://drive.google.com/file/d/1YCYIH7TRZYQ0BzxRSjW70VnV4lJPonEr/view?usp=sharing)


## Features
- BERT-based emotion classification (6 emotions)
- Modern, immersive React frontend with dynamic visuals
- Flask REST API backend
- Easy to run locally

## Backend (Flask + PyTorch)

### Setup
1. Install Python 3.8+
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Download the pre-trained model:

   [Download the pre-trained model from Google Drive](https://drive.google.com/file/d/1von36xmWwhaVcajE0UvMgqkDrmYrbYcT/view?usp=sharing)
   
   After downloading, extract the contents and place them in the saved_model/ directory.
   
4. Train the model (optional, pre-trained model included):
   ```bash
   python bert_train.py
   ```
5. Start the API server:
   ```bash
   python app.py
   ```
   The API will run at http://127.0.0.1:5000

## Frontend (React + Vite)

### Setup
1. Go to the frontend directory:
   ```bash
   cd react-emotion-detector
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run at http://localhost:5173

## Usage
- Open the frontend in your browser.
- Enter a sentence and click "Predict Emotion".
- The background and visuals will change to match the detected emotion.

## Project Structure
- `bert_train.py` — Model training script
- `bert_predict.py` — Command-line prediction
- `app.py` — Flask API
- `react-emotion-detector/` — React frontend
- `saved_model/` — Model and tokenizer files

## License
MIT
