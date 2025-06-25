import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EmotionDetector from "./EmotionDetector";

// Animated gradient background using CSS keyframes
const animatedBg = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 0,
  background: 'linear-gradient(-45deg, #a18cd1 0%, #fbc2eb 50%, #fad0c4 100%, #8fd3f4 100%)',
  backgroundSize: '400% 400%',
  animation: 'gradientBG 12s ease-in-out infinite',
};

const keyframes = `
@keyframes gradientBG {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}
`;

const accent = '#7f53ac';
const accent2 = '#647dee';
const inputBg = 'rgba(255,255,255,0.85)';
const inputShadow = '0 4px 24px 0 rgba(127,83,172,0.10)';
const buttonShadow = '0 2px 12px 0 rgba(100,125,222,0.18)';

function IntroPage({ onStart }) {
  return (
    <div style={{
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
      zIndex: 1,
    }}>
      <style>{keyframes}</style>
      <div style={animatedBg} />
      <h2 style={{ color: accent, fontWeight: 800, fontSize: 36, margin: 0, marginBottom: 18, letterSpacing: 0.5, textAlign: 'center', zIndex: 2, textShadow: '0 2px 12px #fff8' }}>
        Welcome to the Emotion Detection App <span role="img" aria-label="BERT">✨</span>
      </h2>
      <p style={{ color: '#333', fontSize: 20, margin: '0 0 28px 0', textAlign: 'center', lineHeight: 1.7, maxWidth: 520, zIndex: 2, textShadow: '0 2px 12px #fff8' }}>
        This app uses a BERT-based AI model to analyze your text and predict the underlying emotion.<br /><br />
        Enter any sentence and instantly discover if it expresses sadness, joy, love, anger, fear, or surprise!
      </p>
      <button
        style={{
          padding: '16px 40px',
          fontSize: 20,
          fontWeight: 700,
          border: 'none',
          borderRadius: 12,
          background: `linear-gradient(90deg, ${accent} 0%, ${accent2} 100%)`,
          color: '#fff',
          cursor: 'pointer',
          marginTop: 10,
          transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
          boxShadow: buttonShadow,
          maxWidth: '100%',
          zIndex: 2,
          letterSpacing: 0.5,
        }}
        onClick={onStart}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Start Predicting
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('intro');
  return page === 'intro'
    ? <IntroPage onStart={() => setPage('predict')} />
    : <EmotionDetector fullPage accent={accent} accent2={accent2} inputBg={inputBg} inputShadow={inputShadow} buttonShadow={buttonShadow} animatedBg={animatedBg} keyframes={keyframes} />;
}
