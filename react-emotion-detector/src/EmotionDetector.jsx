import React, { useState } from "react";

// Subtle emotion color themes with contrast shapes and text
const emotionThemes = {
  anger: {
    bg: 'linear-gradient(-45deg, #ffe5e5 0%, #ffd6e0 100%)',
    accent: '#d7263d',
    accent2: '#a8182e',
    shapes: ['#d7263d', '#a8182e', '#ffb3b3', '#ffb199', '#ff6e7f', '#fff'],
    text: '#a8182e',
  },
  sadness: {
    bg: 'linear-gradient(-45deg, #e3e6f3 0%, #dbeafe 100%)',
    accent: '#355c7d',
    accent2: '#6c5b7b',
    shapes: ['#355c7d', '#6c5b7b', '#a8c0ff', '#6dd5ed', '#2193b0', '#fff'],
    text: '#355c7d',
  },
  joy: {
    bg: 'linear-gradient(-45deg, #fffbe5 0%, #fff6d1 100%)',
    accent: '#f7971e',
    accent2: '#ffd200',
    shapes: ['#f7971e', '#ffd200', '#ffe259', '#ffa751', '#fffbe5', '#fff'],
    text: '#b8860b',
  },
  love: {
    bg: 'linear-gradient(-45deg, #ffe5f0 0%, #ffe5ec 100%)',
    accent: '#ff6a88',
    accent2: '#ff99ac',
    shapes: ['#ff6a88', '#ff99ac', '#fbc2eb', '#fcb69f', '#ffb6b9', '#fff'],
    text: '#c2185b',
  },
  fear: {
    bg: 'linear-gradient(-45deg, #eaeaea 0%, #cfd9df 100%)',
    accent: '#232526',
    accent2: '#414345',
    shapes: ['#232526', '#414345', '#636363', '#757f9a', '#434343', '#fff'],
    text: '#232526',
  },
  surprise: {
    bg: 'linear-gradient(-45deg, #e0f7fa 0%, #e1f5fe 100%)',
    accent: '#43cea2',
    accent2: '#185a9d',
    shapes: ['#185a9d', '#43cea2', '#f7971e', '#ffd200', '#43e97b', '#fff'],
    text: '#185a9d',
  },
  default: {
    bg: 'linear-gradient(-45deg, #f6f8fb 0%, #fbc2eb 50%, #fad0c4 100%, #e3e6f3 100%)',
    accent: '#7f53ac',
    accent2: '#647dee',
    shapes: ['#7f53ac', '#647dee', '#a18cd1', '#fbc2eb', '#fad0c4', '#fff'],
    text: '#22223b',
  },
};

export default function EmotionDetector({ fullPage, accent, accent2, inputBg, inputShadow, buttonShadow, animatedBg, keyframes }) {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [emotion, setEmotion] = useState('default');

  // Get theme for current emotion
  const theme = emotionThemes[emotion] || emotionThemes.default;

  // Animated background for emotion
  const animatedEmotionBg = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    background: theme.bg,
    backgroundSize: '400% 400%',
    animation: 'gradientBG 12s ease-in-out infinite',
    transition: 'background 1s',
  };

  // More floating shapes, with high contrast for each emotion
  const floatingShapes = (
    <svg style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1,pointerEvents:'none'}}>
      {theme.shapes.map((color, i) => (
        i % 2 === 0 ? (
          <circle key={i} cx={`${10 + (i*13)%80}%`} cy={`${20 + (i*17)%60}%`} r={18 + (i%3)*10} fill={color} opacity={i%3===0?0.32:0.22}>
            <animate attributeName="cy" values={`${20 + (i*17)%60}%;${80 - (i*13)%60}%;${20 + (i*17)%60}%`} dur={`${10 + i*2}s`} repeatCount="indefinite"/>
            <animate attributeName="fill" values={theme.shapes.join(';')+`;${color}`} dur="12s" repeatCount="indefinite"/>
          </circle>
        ) : (
          <rect key={i} x={`${10 + (i*11)%80}%`} y={`${10 + (i*19)%70}%`} width={24 + (i%3)*18} height={24 + (i%3)*18} rx={12 + (i%3)*9} fill={color} opacity={i%2===0?0.28:0.18}>
            <animate attributeName="y" values={`${10 + (i*19)%70}%;${60 - (i*11)%50}%;${10 + (i*19)%70}%`} dur={`${12 + i*2}s`} repeatCount="indefinite"/>
            <animate attributeName="fill" values={theme.shapes.slice().reverse().join(';')+`;${color}`} dur="13s" repeatCount="indefinite"/>
          </rect>
        )
      ))}
    </svg>
  );

  const containerStyle = fullPage
    ? {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
        padding: 0,
        boxSizing: 'border-box',
        overflowX: 'hidden',
        position: 'relative',
        zIndex: 2,
        transition: 'background 1s',
      }
    : {};

  const inputStyle = {
    padding: '18px 20px',
    fontSize: 19,
    border: 'none',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.95)',
    boxShadow: inputShadow,
    outline: inputFocused ? `2px solid ${theme.accent}` : 'none',
    marginBottom: 22,
    width: 'min(420px, 90vw)',
    transition: 'box-shadow 0.2s, outline 0.2s',
    color: theme.text,
    fontWeight: 500,
    zIndex: 3,
    letterSpacing: 0.2,
  };

  const buttonStyle = {
    padding: '16px 40px',
    fontSize: 20,
    fontWeight: 700,
    border: 'none',
    borderRadius: 12,
    background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.accent2} 100%)`,
    color: '#fff',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginBottom: 10,
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
    boxShadow: buttonShadow,
    maxWidth: '100%',
    zIndex: 3,
    letterSpacing: 0.5,
    opacity: loading ? 0.7 : 1,
  };

  const resultStyle = {
    marginTop: 28,
    width: 'min(420px, 90vw)',
    minHeight: 60,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    boxShadow: '0 2px 12px #7f53ac22',
    padding: '20px 18px 16px 18px',
    fontSize: 19,
    color: theme.text,
    zIndex: 3,
    animation: 'fadeIn 0.5s',
    fontWeight: 500,
    textAlign: 'center',
    border: `2px solid ${theme.accent2}`,
    transition: 'border 1s, color 1s',
  };

  const errorStyle = {
    color: '#e74c3c',
    fontWeight: 600,
    margin: '10px 0 0 0',
    fontSize: 17,
    minHeight: 24,
    zIndex: 3,
    textAlign: 'center',
  };

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
        setEmotion((data.prediction || '').toLowerCase() in emotionThemes ? data.prediction.toLowerCase() : 'default');
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <style>{keyframes}</style>
      <div style={animatedEmotionBg} />
      {floatingShapes}
      <h2 style={{ color: theme.text, fontWeight: 800, fontSize: 34, margin: 0, marginBottom: 18, letterSpacing: 0.5, textAlign: 'center', zIndex: 3, textShadow: '0 2px 12px #fff8', transition: 'color 1s' }}>
        Emotion Detection App <span role="img" aria-label="BERT">✨</span>
      </h2>
      <input
        type="text"
        style={inputStyle}
        value={inputText}
        placeholder="Type a sentence to detect emotion..."
        onChange={e => setInputText(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") handlePredict(); }}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        disabled={loading}
      />
      <button
        style={buttonStyle}
        onClick={handlePredict}
        disabled={loading}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {loading ? "Predicting..." : "Predict Emotion"}
      </button>
      <div style={{ width: 'min(420px, 90vw)', zIndex: 3 }}>
        {error && <div style={errorStyle}>{error}</div>}
        {result && (
          <div style={resultStyle}>
            <strong style={{ color: theme.accent2 }}>🔹 BERT Prediction</strong><br />
            Emotion: <b style={{ color: theme.text }}>{result.prediction}</b><br />
            Confidence: {result.confidence}%
          </div>
        )}
      </div>
    </div>
  );
}
