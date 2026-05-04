// Deterministic seeded PRNG (Mulberry32) so the same seed = same avatar
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NEON_PALETTE = [
  '#00f0ff',
  '#ff00aa',
  '#ffd700',
  '#39ff14',
  '#b300ff',
  '#ff6600',
];

function pickFrom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function glowColor(ctx: CanvasRenderingContext2D, color: string, blur: number) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
}

function resetGlow(ctx: CanvasRenderingContext2D) {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, accentColor: string) {
  ctx.fillStyle = '#050508';
  ctx.fillRect(0, 0, w, h);

  const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7);
  grad.addColorStop(0, `${accentColor}18`);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#ffffff09';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= w; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y <= h; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 2);
  }
}

function drawFace(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rng: () => number,
  accentColor: string,
  eyeColor: string,
  secondaryColor: string,
) {
  const faceW = 90 + rng() * 20;
  const faceH = 110 + rng() * 20;

  ctx.beginPath();
  ctx.ellipse(cx, cy, faceW / 2, faceH / 2, 0, 0, Math.PI * 2);
  const skinTone = rng() < 0.5 ? '#1a1a2e' : '#0d1117';
  ctx.fillStyle = skinTone;
  ctx.fill();

  glowColor(ctx, accentColor, 8);
  ctx.strokeStyle = accentColor + '55';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  resetGlow(ctx);

  const jawCut = rng() < 0.4;
  if (jawCut) {
    ctx.beginPath();
    ctx.moveTo(cx - faceW * 0.3, cy + faceH * 0.3);
    ctx.lineTo(cx, cy + faceH * 0.52);
    ctx.lineTo(cx + faceW * 0.3, cy + faceH * 0.3);
    ctx.strokeStyle = accentColor + '40';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const eyeY = cy - faceH * 0.08;
  const eyeSpacing = faceW * 0.3;
  const eyeRx = 12;
  const eyeRy = 6;

  [-1, 1].forEach((side) => {
    const ex = cx + side * eyeSpacing;

    ctx.beginPath();
    ctx.ellipse(ex, eyeY, eyeRx + 4, eyeRy + 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#080810';
    ctx.fill();

    glowColor(ctx, eyeColor, 18);
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, eyeRx, eyeRy, 0, 0, Math.PI * 2);
    ctx.fillStyle = eyeColor + 'cc';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(ex, eyeY, eyeRx * 0.45, eyeRy * 0.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();

    ctx.fillStyle = '#ffffff88';
    ctx.beginPath();
    ctx.ellipse(ex - 3, eyeY - 2, 2.5, 1.5, -0.4, 0, Math.PI * 2);
    ctx.fill();

    resetGlow(ctx);

    ctx.strokeStyle = eyeColor + '44';
    ctx.lineWidth = 0.5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(ex - eyeRx - 2, eyeY + i * 2);
      ctx.lineTo(ex + eyeRx + 2, eyeY + i * 2);
      ctx.stroke();
    }
  });

  ctx.beginPath();
  ctx.moveTo(cx, eyeY + 18);
  ctx.lineTo(cx - 6, eyeY + 32);
  ctx.lineTo(cx + 6, eyeY + 32);
  ctx.strokeStyle = accentColor + '30';
  ctx.lineWidth = 1;
  ctx.stroke();

  const mouthY = cy + faceH * 0.22;
  glowColor(ctx, secondaryColor, 4);
  ctx.beginPath();
  ctx.moveTo(cx - 20, mouthY);
  ctx.quadraticCurveTo(cx, mouthY + 4, cx + 20, mouthY);
  ctx.strokeStyle = secondaryColor + '60';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  resetGlow(ctx);
}

function drawHair(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  faceH: number,
  hairColor: string,
  hairStyle: number,
  rng: () => number,
) {
  const topY = cy - faceH / 2;

  glowColor(ctx, hairColor, 6);
  ctx.fillStyle = hairColor + 'cc';
  ctx.strokeStyle = hairColor;
  ctx.lineWidth = 1.5;

  if (hairStyle === 0) {
    ctx.beginPath(); ctx.rect(cx - 12, topY - 40, 24, 45); ctx.fill(); ctx.stroke();
  } else if (hairStyle === 1) {
    ctx.beginPath();
    ctx.moveTo(cx - 50, topY + 5); ctx.lineTo(cx + 30, topY + 5);
    ctx.lineTo(cx + 15, topY - 30); ctx.lineTo(cx - 65, topY - 30);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (hairStyle === 2) {
    const spikes = 5;
    for (let i = 0; i < spikes; i++) {
      const sx = cx - 50 + i * 22;
      const h = 20 + rng() * 30;
      ctx.beginPath();
      ctx.moveTo(sx, topY + 5); ctx.lineTo(sx + 11, topY + 5); ctx.lineTo(sx + 5.5, topY - h);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  } else if (hairStyle === 3) {
    ctx.beginPath();
    ctx.moveTo(cx - 55, topY + 10); ctx.lineTo(cx + 55, topY + 10);
    ctx.lineTo(cx + 40, topY - 35); ctx.lineTo(cx - 40, topY - 35);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.rect(cx - 45, topY - 20, 90, 25); ctx.fill(); ctx.stroke();
  }

  resetGlow(ctx);
}

function drawCyberware(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  accentColor: string,
  secondaryColor: string,
  rng: () => number,
) {
  const implantCount = Math.floor(rng() * 3) + 1;

  for (let i = 0; i < implantCount; i++) {
    const side = rng() < 0.5 ? -1 : 1;
    const implantType = Math.floor(rng() * 4);

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    glowColor(ctx, accentColor, 10);

    if (implantType === 0) {
      const tx = cx + side * 40;
      const ty = cy - 20;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + side * 25, ty - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tx, ty + 5); ctx.lineTo(tx + side * 20, ty + 10); ctx.stroke();
      ctx.beginPath(); ctx.arc(tx + side * 25, ty - 10, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = accentColor; ctx.fill();
    } else if (implantType === 1) {
      const startX = cx + side * 30;
      const startY = cy + 10;
      ctx.beginPath();
      ctx.moveTo(startX, startY); ctx.lineTo(startX + side * 15, startY);
      ctx.lineTo(startX + side * 15, startY + 15); ctx.lineTo(startX + side * 25, startY + 15);
      ctx.stroke();
      [0, 15].forEach((offset) => {
        ctx.beginPath();
        ctx.arc(startX + side * 15, startY + offset, 2, 0, Math.PI * 2);
        ctx.fillStyle = secondaryColor; ctx.fill();
      });
    } else if (implantType === 2) {
      ctx.beginPath(); ctx.moveTo(cx + side * 10, cy - 40); ctx.lineTo(cx + side * 38, cy - 40); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + side * 38, cy - 40, 3, 0, Math.PI * 2);
      ctx.fillStyle = accentColor; ctx.fill();
      for (let t = 0; t < 3; t++) {
        const tx = cx + side * (12 + t * 9);
        ctx.beginPath(); ctx.moveTo(tx, cy - 43); ctx.lineTo(tx, cy - 37); ctx.stroke();
      }
    } else {
      const jy = cy + 38;
      ctx.beginPath(); ctx.moveTo(cx + side * 12, jy); ctx.lineTo(cx + side * 35, jy + 5); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + side * 35, jy + 5, 2, 0, Math.PI * 2);
      ctx.fillStyle = secondaryColor; ctx.fill();
    }

    resetGlow(ctx);
  }
}

function drawCornerDecor(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  ctx.strokeStyle = color + '80';
  ctx.lineWidth = 1;
  const size = 20;
  const corners = [
    [0, 0, size, 0, 0, size],
    [w, 0, w - size, 0, w, size],
    [0, h, size, h, 0, h - size],
    [w, h, w - size, h, w, h - size],
  ] as const;
  corners.forEach(([x, y, x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
  });
}

export function drawAvatar(canvas: HTMLCanvasElement, seed: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const rng = seededRng(seed);

  const accentColor = pickFrom(NEON_PALETTE, rng);
  const eyeColor = pickFrom(NEON_PALETTE.filter((c) => c !== accentColor), rng);
  const hairColor = pickFrom(NEON_PALETTE.filter((c) => c !== accentColor && c !== eyeColor), rng);
  const secondaryColor = pickFrom(NEON_PALETTE, rng);

  drawBackground(ctx, w, h, accentColor);

  const cx = w / 2;
  const cy = h / 2 + 20;
  const faceH = 115 + rng() * 20;
  const hairStyle = Math.floor(rng() * 5);

  drawHair(ctx, cx, cy, faceH, hairColor, hairStyle, rng);
  drawFace(ctx, cx, cy, rng, accentColor, eyeColor, secondaryColor);
  drawCyberware(ctx, cx, cy, accentColor, secondaryColor, rng);
  drawCornerDecor(ctx, w, h, accentColor);

  glowColor(ctx, accentColor, 4);
  ctx.fillStyle = accentColor + '15';
  ctx.fillRect(0, h - 22, w, 22);
  ctx.strokeStyle = accentColor + '60';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(0, h - 22); ctx.lineTo(w, h - 22); ctx.stroke();
  resetGlow(ctx);

  ctx.fillStyle = accentColor + 'aa';
  ctx.font = '9px monospace';
  ctx.fillText('IDENT • VERIFIED', 10, h - 7);
  ctx.textAlign = 'right';
  ctx.fillText(`ID#${seed.toString(16).toUpperCase().padStart(5, '0')}`, w - 10, h - 7);
  ctx.textAlign = 'left';
}
