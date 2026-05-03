import { useState, useCallback } from 'react';
import type { Character } from './types';
import { generateCharacter } from './utils/generator';
import CharacterCard from './components/CharacterCard';
import Particles from './components/Particles';
import './App.css';

export default function App() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setIsNew(false);

    // Brief flash before new character for snappier feel
    setTimeout(() => {
      setCharacter(generateCharacter());
      setIsNew(true);
      setIsGenerating(false);
    }, 120);
  }, []);

  return (
    <div className="app">
      <Particles />

      <div className="scanline-overlay" aria-hidden="true" />

      <header className="header">
        <div className="header-decor" aria-hidden="true">
          <span className="kanji-decor">電脳</span>
          <span className="kanji-decor">未来</span>
          <span className="kanji-decor">都市</span>
        </div>
        <h1 className="title">
          <span className="title-cyber">CYBER</span>
          <span className="title-punk">PUNK</span>
          <br />
          <span className="title-sub">CHARACTER GENERATOR</span>
        </h1>
        <p className="tagline">// ROLL YOUR IDENTITY. CLAIM YOUR STREET NAME.</p>
      </header>

      <main className="main">
        <button
          className={`generate-btn${isGenerating ? ' generating' : ''}`}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <span className="btn-icon">◈</span>
          <span className="btn-text">
            {isGenerating ? 'GENERATING...' : character ? 'REROLL' : 'GENERATE'}
          </span>
          <span className="btn-icon">◈</span>
        </button>

        {character && (
          <div className="card-wrapper">
            <CharacterCard character={character} isNew={isNew} />
          </div>
        )}

        {!character && (
          <div className="empty-state">
            <div className="empty-prompt">
              <span className="empty-cursor">_</span>
              <span className="empty-text">AWAITING IDENTITY GENERATION</span>
            </div>
            <p className="empty-sub">
              Press GENERATE to create your cyberpunk persona
            </p>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>NIGHT CITY // {new Date().getFullYear()}</span>
        <span className="footer-kanji">電脳都市</span>
        <span>NETRUNNER V2.0</span>
      </footer>
    </div>
  );
}
