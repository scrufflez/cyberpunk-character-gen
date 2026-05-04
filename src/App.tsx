import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Character, Stats, RoleClass } from './types';
import { generateCharacter, calculateDerivedStats } from './utils/generator';
import { roles, statDefinitions } from './data/classes';
import CharacterCard from './components/CharacterCard';
import StatBar from './components/StatBar';
import Particles from './components/Particles';
import './App.css';

const STAT_KEYS = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'] as const;
const TOTAL_POOL = 62;

interface SavedEntry {
  id: string;
  name: string;
  role: string;
  handle: string;
  createdAt: string;
}

export default function App() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [editingStats, setEditingStats] = useState<Stats | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [savedChars, setSavedChars] = useState<SavedEntry[]>([]);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch saved characters on mount
  useEffect(() => {
    fetchSavedCharacters();
  }, []);

  async function fetchSavedCharacters() {
    try {
      const res = await fetch('/api/characters');
      if (res.ok) {
        const data = await res.json();
        setSavedChars(data);
      }
    } catch {}
  }

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
    setViewingId(null);
    setCharacter(null);

    setTimeout(() => {
      const ch = generateCharacter((selectedRole || undefined) as RoleClass | undefined);
      setEditingStats({ ...ch.stats });
      setCharacter(ch);
      setIsNew(true);
      setIsGenerating(false);
      setConfirmed(false);
    }, 120);
  }, [selectedRole]);

  const handleConfirm = useCallback(async () => {
    if (!character || !editingStats || remaining !== 0) return;
    const derived = calculateDerivedStats(editingStats);
    const finalChar = {
      ...character,
      stats: editingStats,
      derivedStats: derived,
    };
    setCharacter(finalChar);
    setConfirmed(true);
    setEditingStats(null);

    // Auto-save to database
    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalChar.name,
          handle: finalChar.handle,
          role: finalChar.role,
          affiliation: finalChar.affiliation,
          backstory: finalChar.backstory,
          avatarSeed: finalChar.avatarSeed,
          stats: finalChar.stats,
          derivedStats: finalChar.derivedStats,
          roleAbility: finalChar.roleAbility,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setViewingId(saved.id);
        await fetchSavedCharacters();
      }
    } catch {}
  }, [character, editingStats, remaining]);

  const handleLoadCharacter = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/characters/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      const ch: Character = {
        id: data.id,
        name: data.name,
        handle: data.handle,
        role: data.role,
        affiliation: data.affiliation,
        backstory: data.backstory,
        stats: data.stats as Stats,
        derivedStats: data.derivedStats,
        roleAbility: data.roleAbility,
        avatarSeed: data.avatarSeed,
      };
      setCharacter(ch);
      setConfirmed(true);
      setViewingId(data.id);
      setEditingStats(null);
      setIsNew(false);
    } catch {}
  }, []);

  const handleDeleteCharacter = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/characters/${id}`, { method: 'DELETE' });
      if (viewingId === id) {
        setCharacter(null);
        setConfirmed(false);
        setViewingId(null);
      }
      await fetchSavedCharacters();
    } catch {}
  }, [viewingId]);

  const adjustStat = useCallback((key: keyof Stats, delta: number) => {
    setEditingStats((prev) => {
      if (!prev) return prev;
      const current = prev[key];
      const newVal = current + delta;
      if (newVal < 2 || newVal > 8) return prev;
      if (delta > 0 && remaining - delta < 0) return prev;
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

      <div className="appBody">
        <main className="main">
          <div className="controls">
            <div className="roleSelector">
              <label className="roleLabel">ROLE</label>
              <select className="roleDropdown" value={selectedRole} onChange={handleRoleChange}>
                <option value="">— RANDOM —</option>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <button className={`generate-btn${isGenerating ? ' generating' : ''}`} onClick={handleGenerate} disabled={isGenerating}>
              <span className="btn-icon">◈</span>
              <span className="btn-text">{isGenerating ? 'GENERATING...' : character && !confirmed ? 'REROLL' : character ? 'REROLL' : 'GENERATE'}</span>
              <span className="btn-icon">◈</span>
            </button>
          </div>

          {editingStats && !confirmed && (
            <div className="editorCard">
              <div className="editorHeader">
                <span className="editorTitle">{character?.role ? `// ${character.role.toUpperCase()} ATTRIBUTES` : '// ATTRIBUTE ALLOCATION'}</span>
                <div className="pointsDisplay" style={{ borderColor: remainingColor + '44' }}>
                  <span className="pointsLabel">POINTS</span>
                  <span className="pointsValue" style={{ color: remainingColor }}>{pointsUsed}/{TOTAL_POOL}</span>
                  <span className="pointsRemain" style={{ color: remainingColor }}>({remaining >= 0 ? `${remaining} left` : `${Math.abs(remaining)} over`})</span>
                </div>
              </div>
              {remaining !== 0 && (
                <div className="validationMsg" style={{ color: remaining < 0 ? '#ff4444' : '#ffd700' }}>
                  {remaining < 0 ? 'Total stats exceed 62 — reduce some attributes' : `Distribute ${remaining} more points (total must be exactly 62)`}
                </div>
              )}
              <div className="editorStats">
                {statDefinitions.map((def) => (
                  <StatBar key={def.key} stat={def} value={editingStats[def.key]} readonly={false}
                    onIncrement={() => adjustStat(def.key, 1)}
                    onDecrement={() => adjustStat(def.key, -1)} />
                ))}
              </div>
              <button className={`confirmBtn ${isStatValid ? 'confirmBtnReady' : ''}`} onClick={handleConfirm} disabled={!isStatValid}>
                {isStatValid ? 'CONFIRM CHARACTER' : 'ALLOCATE ALL POINTS'}
              </button>
            </div>
          )}

          {character && confirmed && (
            <div className="card-wrapper">
              <CharacterCard character={character} isNew={isNew} />
              {viewingId && (
                <button className="deleteBtn" onClick={(e) => handleDeleteCharacter(viewingId, e as any)}>DELETE</button>
              )}
            </div>
          )}

          {!character && (
            <div className="empty-state">
              <div className="empty-prompt">
                <span className="empty-cursor">_</span>
                <span className="empty-text">AWAITING IDENTITY GENERATION</span>
              </div>
              <p className="empty-sub">Press GENERATE to create your cyberpunk persona</p>
            </div>
          )}
        </main>

        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebarHeader">
            <span className="sidebarTitle">SAVED</span>
            <span className="sidebarCount">{savedChars.length}</span>
          </div>
          <button className="toggleSidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '▶' : '◀'}
          </button>
          <div className="savedList">
            {savedChars.map((entry) => (
              <div key={entry.id}
                className={`savedItem ${viewingId === entry.id ? 'active' : ''}`}
                onClick={() => handleLoadCharacter(entry.id)}>
                <span className="savedName">{entry.name}</span>
                <span className="savedRole">{entry.role}</span>
                <button className="savedDelete" onClick={(e) => handleDeleteCharacter(entry.id, e as any)}>✕</button>
              </div>
            ))}
            {savedChars.length === 0 && (
              <div className="savedEmpty">No saved characters</div>
            )}
          </div>
        </aside>
      </div>

      <footer className="footer">
        <span>NIGHT CITY // {new Date().getFullYear()}</span>
        <span className="footer-kanji">電脳都市</span>
        <span>NETRUNNER V2.0</span>
      </footer>
    </div>
  );
}
