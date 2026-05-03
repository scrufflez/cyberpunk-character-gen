import type { StatDefinition } from '../types';
import styles from './StatBar.module.css';

interface Props {
  stat: StatDefinition;
  value: number;
  readonly?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export default function StatBar({ stat, value, readonly = true, onIncrement, onDecrement }: Props) {
  const pct = (value / 8) * 100;

  return (
    <div className={styles.row}>
      <div className={styles.label}>
        <span className={styles.key} style={{ color: stat.color }}>
          {stat.label}
        </span>
        <span className={styles.fullName} title={stat.description}>
          {stat.fullName}
        </span>
      </div>

      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${stat.color}88 0%, ${stat.color} 100%)`,
            boxShadow: `0 0 8px ${stat.color}88, 0 0 16px ${stat.color}44`,
          }}
        />
        {[2, 4, 6].map((tick) => (
          <div key={tick} className={styles.tick} style={{ left: `${(tick / 8) * 100}%` }} />
        ))}
      </div>

      {!readonly && onDecrement && (
        <button
          className={`${styles.adjBtn} ${styles.decBtn}`}
          onClick={onDecrement}
          disabled={value <= 2}
          aria-label={`Decrease ${stat.label}`}
        >
          −
        </button>
      )}

      <span className={styles.value} style={{ color: stat.color, minWidth: readonly ? '18px' : '22px' }}>
        {value}
      </span>

      {!readonly && onIncrement && (
        <button
          className={`${styles.adjBtn} ${styles.incBtn}`}
          onClick={onIncrement}
          disabled={value >= 8}
          aria-label={`Increase ${stat.label}`}
        >
          +
        </button>
      )}
    </div>
  );
}
