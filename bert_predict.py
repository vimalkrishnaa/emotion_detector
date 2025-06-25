import torch
from transformers import BertTokenizer, BertForSequenceClassification
import sys

# Label map
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
model.eval()

# Use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

def predict_emotion(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
    inputs = {key: val.to(device) for key, val in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = torch.nn.functional.softmax(logits, dim=1)
        pred = torch.argmax(probs, dim=1).item()
        confidence = probs[0][pred].item() * 100

    return label_map[pred], confidence

# Run from command line
if __name__ == "__main__":
    input_text = " ".join(sys.argv[1:])
    if not input_text:
        print("⚠️ Please provide a sentence to predict.")
    else:
        emotion, confidence = predict_emotion(input_text)
        print(f"Prediction: {emotion} (Confidence: {confidence:.2f}%)")
