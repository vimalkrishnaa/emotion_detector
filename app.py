from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import BertTokenizer, BertForSequenceClassification

# Flask setup
app = Flask(__name__)
CORS(app)

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Emotion label map
label_map = {
    0: "sadness",
    1: "joy",
    2: "love",
    3: "anger",
    4: "fear",
    5: "surprise"
}

# Load model and tokenizer
model = BertForSequenceClassification.from_pretrained("saved_model")
tokenizer = BertTokenizer.from_pretrained("saved_model/tokenizer")
model = model.to(device)
model.eval()

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_text = data.get("text", "").strip()

    if not input_text:
        return jsonify({"error": "No text provided"}), 400

    inputs = tokenizer(
        input_text,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=128
    )

    inputs = {key: val.to(device) for key, val in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = torch.nn.functional.softmax(logits, dim=1)
        pred = torch.argmax(probs, dim=1).item()
        confidence = probs[0][pred].item() * 100

    result = {
        "prediction": label_map[pred],
        "confidence": round(confidence, 2)
    }

    return jsonify(result)

# Run the server
if __name__ == '__main__':
    app.run(debug=True)
