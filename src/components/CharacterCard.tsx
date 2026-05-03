import type { Character } from '../types';
import { statDefinitions } from '../data/classes';
import AvatarCanvas from './AvatarCanvas';
import StatBar from './StatBar';
import styles from './CharacterCard.module.css';

interface Props {
  character: Character;
  isNew: boolean;
}

const ROLE_ICONS: Record<string, string> = {
  Solo:      '◆',
  Netrunner: '◈',
  Rockerboy: '♪',
  Tech:      '⬣',
  Medtech:   '✚',
  Media:     '◎',
  Exec:      '★',
  Lawman:    '⬡',
  Fixer:     '◉',
};

const ROLE_COLORS: Record<string, string> = {
  Solo:      '#ff4444',
  Netrunner: '#00f0ff',
  Rockerboy: '#ff00aa',
  Tech:      '#ffd700',
  Medtech:   '#39ff14',
  Media:     '#ff6b35',
  Exec:      '#aa66ff',
  Lawman:    '#4488ff',
  Fixer:     '#ff69b4',
};

export default function CharacterCard({ character, isNew }: Props) {
  const roleColor = ROLE_COLORS[character.role] ?? '#b300ff';
  const roleIcon = ROLE_ICONS[character.role] ?? '◆';
  const ds = character.derivedStats;

  return (
    <div className={`${styles.card} ${isNew ? styles.fadeIn : ''}`}>
      {/* Top accent bar */}
      <div className={styles.topBar} style={{ borderBottomColor: roleColor + '44', background: roleColor + '08' }}>
        <span className={styles.kanji}>電脳</span>
        <span className={styles.systemLabel}>IDENT // PROFILE</span>
        <span className={styles.kanji}>未来</span>
      </div>

      <div className={styles.body}>
        {/* Left: Avatar */}
        <div className={styles.avatarCol}>
          <AvatarCanvas seed={character.avatarSeed} />

          <div className={styles.roleTag} style={{ borderColor: roleColor + '77', background: roleColor + '15', boxShadow: `0 0 10px ${roleColor}33` }}>
            <span className={styles.roleIcon} style={{ color: roleColor, textShadow: `0 0 8px ${roleColor}` }}>{roleIcon}</span>
            <span className={styles.roleName} style={{ color: roleColor, textShadow: `0 0 8px ${roleColor}99` }}>{character.role}</span>
          </div>

          {/* Role Ability */}
          <div className={styles.abilityTag}>
            <span className={styles.abilityLabel}>ABILITY</span>
            <span className={styles.abilityValue}>{character.roleAbility.name} [{character.roleAbility.rank}]</span>
          </div>

          <div className={styles.affiliationBadge}>
            <span className={styles.affiliationLabel}>AFFIL.</span>
            <span className={styles.affiliationValue}>{character.affiliation}</span>
          </div>
        </div>

        {/* Right: Info */}
        <div className={styles.infoCol}>
          <div className={styles.nameBlock}>
            <h2 className={styles.name}>{character.name}</h2>
            <span className={styles.handle}>{character.handle}</span>
          </div>

          <div className={styles.divider} />

          {/* Stats */}
          <div className={styles.statsBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>// ATTRIBUTES</span>
            </div>
            <div className={styles.statsGrid}>
              {statDefinitions.map((def) => (
                <StatBar
                  key={def.key}
                  stat={def}
                  value={character.stats[def.key]}
                  readonly
                />
              ))}
            </div>
          </div>

          {/* Derived Stats */}
          <div className={styles.divider} />
          <div className={styles.derivedBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>// DERIVED STATS</span>
            </div>
            <div className={styles.derivedGrid}>
              <div className={styles.derivedItem}>
                <span className={styles.derivedKey}>HP</span>
                <span className={styles.derivedVal}>{ds.hitPoints}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedKey}>HR</span>
                <span className={styles.derivedVal}>{ds.humanity}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedKey}>SW</span>
                <span className={styles.derivedVal}>{ds.seriouslyWounded}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedKey}>DEATH</span>
                <span className={styles.derivedVal}>{ds.deathSave}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedKey}>INIT</span>
                <span className={styles.derivedVal}>{ds.initiative}</span>
              </div>
            </div>
          </div>

          {/* Backstory */}
          <div className={styles.divider} />
          <div className={styles.backstoryBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>// DOSSIER</span>
            </div>
            <p className={styles.backstory}>{character.backstory}</p>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className={styles.bottomBar}>
        <span className={styles.idCode}>
          ID:{character.id.split('-')[0]}
        </span>
        <span className={styles.kanji}>都市</span>
        <span className={styles.statusPing}>■ ACTIVE</span>
      </div>
    </div>
  );
}
