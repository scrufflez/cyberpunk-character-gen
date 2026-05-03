import { useEffect, useRef } from 'react';
import { drawAvatar } from '../utils/avatar';
import styles from './AvatarCanvas.module.css';

interface Props {
  seed: number;
}

export default function AvatarCanvas({ seed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawAvatar(canvasRef.current, seed);
    }
  }, [seed]);

  return (
    <div className={styles.wrapper}>
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className={styles.canvas}
      />
    </div>
  );
}
