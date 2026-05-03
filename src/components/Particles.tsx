import { useMemo } from 'react';
import styles from './Particles.module.css';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const COLORS = ['#00f0ff', '#ff00aa', '#39ff14', '#b300ff', '#ffd700'];

export default function Particles() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      duration: 8 + Math.random() * 16,
      delay: -(Math.random() * 20),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
