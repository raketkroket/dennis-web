import * as THREE from 'three';

// Procedural textures for the 3D room preview, drawn on canvases so the
// preview needs no image downloads. A seeded random keeps them identical on
// every visit.

function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function canvas(size: number) {
  const element = document.createElement('canvas');
  element.width = size;
  element.height = size;
  return { element, context: element.getContext('2d') as CanvasRenderingContext2D };
}

function finish(element: HTMLCanvasElement, color: boolean) {
  const texture = new THREE.CanvasTexture(element);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Stone-look tiles with soft mottling and recessed grout (colour + bump map). */
export function tileTextures({ base, grout, columns, rows, seed, variation = 10 }: { base: string; grout: string; columns: number; rows: number; seed: number; variation?: number }) {
  const size = 512;
  const random = seeded(seed);
  const color = canvas(size);
  const bump = canvas(size);
  const tileW = size / columns;
  const tileH = size / rows;
  const groutWidth = 4;

  color.context.fillStyle = grout;
  color.context.fillRect(0, 0, size, size);
  bump.context.fillStyle = '#000';
  bump.context.fillRect(0, 0, size, size);

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      const x = column * tileW + groutWidth / 2;
      const y = row * tileH + groutWidth / 2;
      const w = tileW - groutWidth;
      const h = tileH - groutWidth;
      const shift = (random() - 0.5) * variation;
      color.context.fillStyle = shade(base, shift);
      color.context.fillRect(x, y, w, h);
      // Soft stone mottling.
      for (let speck = 0; speck < 140; speck += 1) {
        color.context.fillStyle = `rgba(${random() > 0.5 ? '255,255,255' : '60,45,30'},${0.02 + random() * 0.05})`;
        const radius = 2 + random() * 14;
        color.context.beginPath();
        color.context.arc(x + random() * w, y + random() * h, radius, 0, Math.PI * 2);
        color.context.fill();
      }
      bump.context.fillStyle = '#fff';
      bump.context.fillRect(x, y, w, h);
    }
  }
  return { map: finish(color.element, true), bumpMap: finish(bump.element, false) };
}

/** Oak-like grain for the vanity. */
export function woodTexture(seed = 7) {
  const size = 512;
  const random = seeded(seed);
  const { element, context } = canvas(size);
  const gradient = context.createLinearGradient(0, 0, size, 0);
  gradient.addColorStop(0, '#8d6a48');
  gradient.addColorStop(0.5, '#9b7651');
  gradient.addColorStop(1, '#876444');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  for (let line = 0; line < 90; line += 1) {
    const y = random() * size;
    const amplitude = 2 + random() * 6;
    const frequency = 0.004 + random() * 0.01;
    context.strokeStyle = `rgba(${random() > 0.5 ? '70,48,30' : '190,150,110'},${0.08 + random() * 0.14})`;
    context.lineWidth = 0.6 + random() * 1.6;
    context.beginPath();
    for (let x = 0; x <= size; x += 8) {
      const offset = Math.sin(x * frequency + line) * amplitude;
      if (x === 0) context.moveTo(x, y + offset);
      else context.lineTo(x, y + offset);
    }
    context.stroke();
  }
  return finish(element, true);
}

/** Fine brushed-metal stripes for the drain grate. */
export function grateTexture() {
  const { element, context } = canvas(128);
  context.fillStyle = '#9aa0a3';
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = '#2a2d2f';
  for (let x = 4; x < 128; x += 12) context.fillRect(x, 0, 5, 128);
  return finish(element, true);
}

function shade(hex: string, amount: number) {
  const value = parseInt(hex.slice(1), 16);
  const clamp = (channel: number) => Math.max(0, Math.min(255, Math.round(channel + amount)));
  const r = clamp((value >> 16) & 255);
  const g = clamp((value >> 8) & 255);
  const b = clamp(value & 255);
  return `rgb(${r},${g},${b})`;
}
