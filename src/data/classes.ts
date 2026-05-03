import type { RoleClass, StatDefinition } from '../types';

export const roles: RoleClass[] = [
  'Hacker',
  'Street Samurai',
  'Netrunner',
  'Fixer',
  'Rigger',
  'Media',
  'Solo',
  'Tech',
];

// Stat weight profiles per role: values are 0-100 bias added to random roll
// Each role has a signature strength and weaknesses
export const roleStatBias: Record<RoleClass, Record<string, number>> = {
  Hacker:         { STR: -15, AGL: 0,   INT: 30,  CYW: 20,  CHR: 5,   TEC: 20 },
  'Street Samurai':{ STR: 20,  AGL: 25,  INT: -10, CYW: 15,  CHR: -5,  TEC: -5 },
  Netrunner:      { STR: -20, AGL: -5,  INT: 35,  CYW: 30,  CHR: 0,   TEC: 15 },
  Fixer:          { STR: -5,  AGL: 10,  INT: 10,  CYW: 5,   CHR: 35,  TEC: 5  },
  Rigger:         { STR: 5,   AGL: 0,   INT: 10,  CYW: 20,  CHR: -10, TEC: 30 },
  Media:          { STR: -10, AGL: 10,  INT: 15,  CYW: 5,   CHR: 30,  TEC: 5  },
  Solo:           { STR: 25,  AGL: 20,  INT: 5,   CYW: 10,  CHR: 0,   TEC: 0  },
  Tech:           { STR: 0,   AGL: -5,  INT: 15,  CYW: 10,  CHR: -5,  TEC: 35 },
};

export const statDefinitions: StatDefinition[] = [
  { key: 'STR', label: 'STR', fullName: 'Strength',    color: '#ff4444' },
  { key: 'AGL', label: 'AGL', fullName: 'Agility',     color: '#39ff14' },
  { key: 'INT', label: 'INT', fullName: 'Intelligence', color: '#00f0ff' },
  { key: 'CYW', label: 'CYW', fullName: 'Cyberware',   color: '#b300ff' },
  { key: 'CHR', label: 'CHR', fullName: 'Charisma',    color: '#ff00aa' },
  { key: 'TEC', label: 'TEC', fullName: 'Technical',   color: '#ffd700' },
];
