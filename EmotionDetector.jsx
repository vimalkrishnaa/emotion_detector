import React, { useState } from "react";

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    background: "#f0f4f8",
    padding: 50,
    textAlign: "center",
    minHeight: "100vh",
  },
  h2: { color: "#333" },
  input: {
    padding: 10,
    width: "60%",
    fontSize: 16,
    border: "1px solid #ccc",
    borderRadius: 8,
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    marginTop: 10,
    border: "none",
    backgroundColor: "#007BFF",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  results: {
    marginTop: 30,
    fontSize: 18,
    color: "#333",
    textAlign: "left",
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  modelResult: {
    marginBottom: 20,
    padding: 10,
    borderLeft: "5px solid #007BFF",
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
};

export default function EmotionDetector() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setError("");
    setResult(null);
    if (!inputText.trim()) {
      setError("Please enter some text.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.body}>
      <h2 style={styles.h2}>Emotion Detection App (BERT)</h2>
      <input
        type="text"
        style={styles.input}
        value={inputText}
        placeholder="Type a sentence to detect emotion..."
        onChange={e => setInputText(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") handlePredict(); }}
        disabled={loading}
      />
      <br /><br />
      <button
        style={styles.button}
        onClick={handlePredict}
        disabled={loading}
      >
        {loading ? "Predicting..." : "Predict Emotion"}
      </button>
      <div style={styles.results}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {result && (
          <div style={styles.modelResult}>
            <strong>🔹 BERT Prediction</strong><br />
            Emotion: <b>{result.prediction}</b><br />
            Confidence: {result.confidence}%
          </div>
        )}
      </div>
    </div>
  );
}
