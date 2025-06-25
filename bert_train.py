import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import BertTokenizer, BertForSequenceClassification
from torch.optim import AdamW
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from tqdm import tqdm
import os

# Load dataset
df = pd.read_csv(r"D:\visual studio\bert_emotion_detector\text.csv")
df = df.dropna(subset=["text", "label"])
df["label"] = df["label"].astype(int)

# Updated label map
LABELS = {
    0: "sadness", 1: "joy", 2: "love",
    3: "anger", 4: "fear", 5: "surprise"
}
NUM_LABELS = len(LABELS)
MODEL_NAME = "bert-base-uncased"
BATCH_SIZE = 16
EPOCHS = 3
LR = 2e-5
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Tokenizer
tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)

# Dataset class
class EmotionDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        encoding = self.tokenizer(
            self.texts[idx],
            truncation=True,
            padding="max_length",
            max_length=self.max_len,
            return_tensors="pt"
        )
        return {
            "input_ids": encoding["input_ids"].squeeze(),
            "attention_mask": encoding["attention_mask"].squeeze(),
            "labels": torch.tensor(self.labels[idx], dtype=torch.long)
        }
df = df.sample(n=3000, random_state=42).reset_index(drop=True)

# Split data
X_train, X_val, y_train, y_val = train_test_split(df["text"], df["label"], test_size=0.2, stratify=df["label"], random_state=42)
train_dataset = EmotionDataset(X_train.tolist(), y_train.tolist(), tokenizer)
val_dataset = EmotionDataset(X_val.tolist(), y_val.tolist(), tokenizer)
train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE)

# Load model
model = BertForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=NUM_LABELS)
model = model.to(DEVICE)

# Optimizer
optimizer = AdamW(model.parameters(), lr=LR)

# Training loop
model.train()
for epoch in range(EPOCHS):
    print(f"\nEpoch {epoch + 1}/{EPOCHS}")
    epoch_loss = 0
    for batch in tqdm(train_loader):
        input_ids = batch["input_ids"].to(DEVICE)
        attention_mask = batch["attention_mask"].to(DEVICE)
        labels = batch["labels"].to(DEVICE)

        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            labels=labels
        )
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
        epoch_loss += loss.item()

    print(f"Train Loss: {epoch_loss / len(train_loader):.4f}")

# Evaluation
model.eval()
all_preds = []
all_labels = []

with torch.no_grad():
    for batch in val_loader:
        input_ids = batch["input_ids"].to(DEVICE)
        attention_mask = batch["attention_mask"].to(DEVICE)
        labels = batch["labels"].to(DEVICE)

        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        logits = outputs.logits
        preds = torch.argmax(logits, dim=1)

        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.cpu().numpy())

acc = accuracy_score(all_labels, all_preds)
print(f"\nValidation Accuracy: {acc:.4f}")
print("\nClassification Report:\n", classification_report(all_labels, all_preds, target_names=LABELS.values()))

# Save model and tokenizer
save_path = "saved_model"
model.save_pretrained(save_path)
tokenizer.save_pretrained(os.path.join(save_path, "tokenizer"))
print(f"\n✅ Model and tokenizer saved to: {save_path}")
