import { useEffect, useState } from 'react';
import type { StatDefinition } from '../types';
import styles from './StatBar.module.css';

interface Props {
  stat: StatDefinition;
  value: number;
  animationDelay?: number;
}

export default function StatBar({ stat, value, animationDelay = 0 }: Props) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate bar fill on mount / value change
  useEffect(() => {
    setDisplayValue(0);
    const timeout = setTimeout(() => {
      setDisplayValue(value);
    }, animationDelay);
    return () => clearTimeout(timeout);
  }, [value, animationDelay]);

  const tier = value >= 80 ? 'elite' : value >= 55 ? 'high' : value >= 35 ? 'mid' : 'low';

  return (
    <div className={styles.row}>
      <div className={styles.label}>
        <span className={styles.key} style={{ color: stat.color }}>
          {stat.label}
        </span>
        <span className={styles.fullName}>{stat.fullName}</span>
      </div>

      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{
            width: `${displayValue}%`,
            background: `linear-gradient(90deg, ${stat.color}88 0%, ${stat.color} 100%)`,
            boxShadow: `0 0 8px ${stat.color}88, 0 0 16px ${stat.color}44`,
          }}
        />
        {/* Tick marks */}
        {[25, 50, 75].map((tick) => (
          <div key={tick} className={styles.tick} style={{ left: `${tick}%` }} />
        ))}
      </div>

      <span className={`${styles.value} ${styles[tier]}`} style={{ color: stat.color }}>
        {displayValue.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
