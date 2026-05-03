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
  Hacker:           '⬡',
  'Street Samurai': '◆',
  Netrunner:        '◈',
  Fixer:            '◉',
  Rigger:           '⬢',
  Media:            '◎',
  Solo:             '◇',
  Tech:             '⬣',
};

export default function CharacterCard({ character, isNew }: Props) {
  return (
    <div className={`${styles.card} ${isNew ? styles.fadeIn : ''}`}>
      {/* Top accent bar */}
      <div className={styles.topBar}>
        <span className={styles.kanji}>電脳</span>
        <span className={styles.systemLabel}>IDENT // PROFILE</span>
        <span className={styles.kanji}>未来</span>
      </div>

      <div className={styles.body}>
        {/* Left: Avatar */}
        <div className={styles.avatarCol}>
          <AvatarCanvas seed={character.avatarSeed} />

          <div className={styles.roleTag}>
            <span className={styles.roleIcon}>{ROLE_ICONS[character.role] ?? '◆'}</span>
            <span className={styles.roleName}>{character.role}</span>
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

          <div className={styles.statsBlock}>
            <div className={styles.statsHeader}>
              <span className={styles.statsLabel}>// ATTRIBUTES</span>
            </div>
            <div className={styles.statsList}>
              {statDefinitions.map((def, i) => (
                <StatBar
                  key={def.key}
                  stat={def}
                  value={character.stats[def.key]}
                  animationDelay={i * 80}
                />
              ))}
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.backstoryBlock}>
            <div className={styles.statsLabel}>// DOSSIER</div>
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
