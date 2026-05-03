import { useState, useCallback, useMemo } from 'react';
import type { Character, Stats, RoleClass } from './types';
import { generateCharacter, calculateDerivedStats } from './utils/generator';
import { roles, statDefinitions } from './data/classes';
import CharacterCard from './components/CharacterCard';
import StatBar from './components/StatBar';
import Particles from './components/Particles';
import './App.css';

const STAT_KEYS = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'] as const;
const TOTAL_POOL = 62;

export default function App() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Editing state
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [editingStats, setEditingStats] = useState<Stats | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // Calculate remaining points
  const pointsUsed = useMemo(() => {
    if (!editingStats) return 0;
    return STAT_KEYS.reduce((sum, k) => sum + editingStats[k], 0);
  }, [editingStats]);

  const remaining = TOTAL_POOL - pointsUsed;
  const isStatValid = remaining === 0;

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setIsNew(false);
    setConfirmed(false);

    setTimeout(() => {
      const ch = generateCharacter((selectedRole || undefined) as RoleClass | undefined);


      // Put stats into editing mode
      setEditingStats({ ...ch.stats });
      setCharacter(ch);
      setIsNew(true);
      setIsGenerating(false);
      setConfirmed(false);
    }, 120);
  }, [selectedRole]);

  const handleConfirm = useCallback(() => {
    if (!character || !editingStats || remaining !== 0) return;
    const derived = calculateDerivedStats(editingStats);
    setCharacter({
      ...character,
      stats: editingStats,
      derivedStats: derived,
    });
    setConfirmed(true);
    setEditingStats(null);
  }, [character, editingStats, remaining]);

  const adjustStat = useCallback((key: keyof Stats, delta: number) => {
    setEditingStats((prev) => {
      if (!prev) return prev;
      const current = prev[key];
      const newVal = current + delta;
      if (newVal < 2 || newVal > 8) return prev;
      // Check if we have enough remaining points
      if (delta > 0 && remaining - delta < 0) return prev;
      if (delta < 0 && remaining - delta > TOTAL_POOL - 20) return prev; // sanity
      return { ...prev, [key]: newVal };
    });
  }, [remaining]);

  const handleRoleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  }, []);

  const remainingColor = remaining === 0 ? '#39ff14' : remaining < 0 ? '#ff4444' : '#ffd700';

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
        {/* Controls */}
        <div className="controls">
          {/* Role Selector */}
          <div className="roleSelector">
            <label className="roleLabel">ROLE</label>
            <select
              className="roleDropdown"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              <option value="">— RANDOM —</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Generate button */}
          <button
            className={`generate-btn${isGenerating ? ' generating' : ''}`}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <span className="btn-icon">◈</span>
            <span className="btn-text">
              {isGenerating ? 'GENERATING...' : character && !confirmed ? 'REROLL' : character ? 'REROLL' : 'GENERATE'}
            </span>
            <span className="btn-icon">◈</span>
          </button>
        </div>

        {/* Stats Editor (shown before confirmation) */}
        {editingStats && !confirmed && (
          <div className="editorCard">
            <div className="editorHeader">
              <span className="editorTitle">
                {character?.role ? `// ${character.role.toUpperCase()} ATTRIBUTES` : '// ATTRIBUTE ALLOCATION'}
              </span>
              <div className="pointsDisplay" style={{ borderColor: remainingColor + '44' }}>
                <span className="pointsLabel">POINTS</span>
                <span className="pointsValue" style={{ color: remainingColor }}>
                  {pointsUsed}/{TOTAL_POOL}
                </span>
                <span className="pointsRemain" style={{ color: remainingColor }}>
                  ({remaining >= 0 ? `${remaining} left` : `${Math.abs(remaining)} over`})
                </span>
              </div>
            </div>

            {remaining !== 0 && (
              <div className="validationMsg" style={{ color: remaining < 0 ? '#ff4444' : '#ffd700' }}>
                {remaining < 0
                  ? 'Total stats exceed 62 — reduce some attributes'
                  : `Distribute ${remaining} more points (total must be exactly 62)`}
              </div>
            )}

            <div className="editorStats">
              {statDefinitions.map((def) => (
                <StatBar
                  key={def.key}
                  stat={def}
                  value={editingStats[def.key]}
                  readonly={false}
                  onIncrement={() => adjustStat(def.key, 1)}
                  onDecrement={() => adjustStat(def.key, -1)}
                />
              ))}
            </div>

            <button
              className={`confirmBtn ${isStatValid ? 'confirmBtnReady' : ''}`}
              onClick={handleConfirm}
              disabled={!isStatValid}
            >
              {isStatValid ? 'CONFIRM CHARACTER' : 'ALLOCATE ALL POINTS'}
            </button>
          </div>
        )}

        {/* Character Card (shown after confirmation) */}
        {character && confirmed && (
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
