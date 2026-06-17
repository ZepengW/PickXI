import type { Formation } from '../types';

// Pitch coords: x 0-100 (left→right), y 0-100 (own goal→attacking goal).
// GK is always near y=8 (own goal). Forwards near y=88.

export const FORMATIONS: Formation[] = [
  {
    id: '433',
    name: '4-3-3',
    nameZh: '4-3-3 攻击',
    slots: [
      { id: 'gk', position: 'GK', x: 50, y: 8 },
      { id: 'lb', position: 'LB', x: 14, y: 28 },
      { id: 'cb1', position: 'CB', x: 36, y: 24 },
      { id: 'cb2', position: 'CB', x: 64, y: 24 },
      { id: 'rb', position: 'RB', x: 86, y: 28 },
      { id: 'cm1', position: 'CM', x: 30, y: 50 },
      { id: 'cm2', position: 'CM', x: 50, y: 46 },
      { id: 'cm3', position: 'CM', x: 70, y: 50 },
      { id: 'lw', position: 'LW', x: 18, y: 80 },
      { id: 'st', position: 'ST', x: 50, y: 86 },
      { id: 'rw', position: 'RW', x: 82, y: 80 },
    ],
  },
  {
    id: '442',
    name: '4-4-2',
    nameZh: '4-4-2 经典',
    slots: [
      { id: 'gk', position: 'GK', x: 50, y: 8 },
      { id: 'lb', position: 'LB', x: 14, y: 28 },
      { id: 'cb1', position: 'CB', x: 38, y: 24 },
      { id: 'cb2', position: 'CB', x: 62, y: 24 },
      { id: 'rb', position: 'RB', x: 86, y: 28 },
      { id: 'lm', position: 'LM', x: 16, y: 54 },
      { id: 'cm1', position: 'CM', x: 40, y: 50 },
      { id: 'cm2', position: 'CM', x: 60, y: 50 },
      { id: 'rm', position: 'RM', x: 84, y: 54 },
      { id: 'st1', position: 'ST', x: 38, y: 84 },
      { id: 'st2', position: 'ST', x: 62, y: 84 },
    ],
  },
  {
    id: '352',
    name: '3-5-2',
    nameZh: '3-5-2 翼卫',
    slots: [
      { id: 'gk', position: 'GK', x: 50, y: 8 },
      { id: 'cb1', position: 'CB', x: 28, y: 24 },
      { id: 'cb2', position: 'CB', x: 50, y: 22 },
      { id: 'cb3', position: 'CB', x: 72, y: 24 },
      { id: 'lwb', position: 'LWB', x: 12, y: 52 },
      { id: 'cm1', position: 'CM', x: 34, y: 48 },
      { id: 'cdm', position: 'CDM', x: 50, y: 42 },
      { id: 'cm2', position: 'CM', x: 66, y: 48 },
      { id: 'rwb', position: 'RWB', x: 88, y: 52 },
      { id: 'st1', position: 'ST', x: 38, y: 84 },
      { id: 'st2', position: 'ST', x: 62, y: 84 },
    ],
  },
  {
    id: '4231',
    name: '4-2-3-1',
    nameZh: '4-2-3-1 现代',
    slots: [
      { id: 'gk', position: 'GK', x: 50, y: 8 },
      { id: 'lb', position: 'LB', x: 14, y: 28 },
      { id: 'cb1', position: 'CB', x: 38, y: 24 },
      { id: 'cb2', position: 'CB', x: 62, y: 24 },
      { id: 'rb', position: 'RB', x: 86, y: 28 },
      { id: 'cdm1', position: 'CDM', x: 36, y: 44 },
      { id: 'cdm2', position: 'CDM', x: 64, y: 44 },
      { id: 'lw', position: 'LW', x: 18, y: 70 },
      { id: 'cam', position: 'CAM', x: 50, y: 66 },
      { id: 'rw', position: 'RW', x: 82, y: 70 },
      { id: 'st', position: 'ST', x: 50, y: 88 },
    ],
  },
];

export const FORMATION_MAP: Record<string, Formation> = Object.fromEntries(
  FORMATIONS.map((f) => [f.id, f]),
);

export function getFormation(id: string): Formation {
  return FORMATION_MAP[id] ?? FORMATIONS[0];
}
