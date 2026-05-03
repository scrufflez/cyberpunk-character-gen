import type { RoleClass, StatDefinition } from '../types';

export const roles: RoleClass[] = [
  'Solo',
  'Netrunner',
  'Rockerboy',
  'Tech',
  'Medtech',
  'Media',
  'Exec',
  'Lawman',
  'Fixer',
];

// Role ability definitions per the task spec
export const roleAbilities: Record<RoleClass, string> = {
  Solo: 'Combat Awareness',
  Netrunner: 'Interface',
  Rockerboy: 'Charismatic Impact',
  Tech: 'Maker',
  Medtech: 'Medicine',
  Media: 'Screamsheet',
  Exec: 'Team',
  Lawman: 'Backup',
  Fixer: 'Operator',
};

// Stat weight profiles per role: values are 0-100 bias added to random roll
// Each role has signature strengths aligned with Cyberpunk RED conventions
export const roleStatBias: Record<RoleClass, Record<string, number>> = {
  Solo:       { INT: 0,   REF: 30,  DEX: 15,  TECH: 0,   COOL: 20,  WILL: 10,  LUCK: 10,  MOVE: 20,  BODY: 25,  EMP: -10 },
  Netrunner:  { INT: 35,  REF: 10,  DEX: 10,  TECH: 20,  COOL: 0,   WILL: 20,  LUCK: 5,   MOVE: -5,  BODY: -15, EMP: -5  },
  Rockerboy:  { INT: 5,   REF: 10,  DEX: 5,   TECH: -5,  COOL: 30,  WILL: 10,  LUCK: 15,  MOVE: 10,  BODY: 10,  EMP: 25  },
  Tech:       { INT: 20,  REF: 5,   DEX: 10,  TECH: 35,  COOL: 5,   WILL: 10,  LUCK: 5,   MOVE: 5,   BODY: 5,   EMP: 0   },
  Medtech:    { INT: 25,  REF: 5,   DEX: 25,  TECH: 15,  COOL: 10,  WILL: 15,  LUCK: 5,   MOVE: 5,   BODY: 5,   EMP: 15  },
  Media:      { INT: 15,  REF: 5,   DEX: 5,   TECH: 5,   COOL: 20,  WILL: 15,  LUCK: 10,  MOVE: 10,  BODY: 0,   EMP: 25  },
  Exec:       { INT: 20,  REF: 5,   DEX: 0,   TECH: 10,  COOL: 25,  WILL: 15,  LUCK: 10,  MOVE: 5,   BODY: 5,   EMP: 20  },
  Lawman:     { INT: 5,   REF: 20,  DEX: 10,  TECH: 0,   COOL: 20,  WILL: 20,  LUCK: 5,   MOVE: 15,  BODY: 20,  EMP: 10  },
  Fixer:      { INT: 15,  REF: 10,  DEX: 5,   TECH: 5,   COOL: 20,  WILL: 10,  LUCK: 25,  MOVE: 10,  BODY: 5,   EMP: 20  },
};

export const statDefinitions: StatDefinition[] = [
  {
    key: 'INT',
    label: 'INT',
    fullName: 'Intelligence',
    color: '#00d4ff',
    description: 'Knowledge, analysis, and data processing',
  },
  {
    key: 'REF',
    label: 'REF',
    fullName: 'Reflexes',
    color: '#39ff14',
    description: 'Reaction time, speed, and coordination',
  },
  {
    key: 'DEX',
    label: 'DEX',
    fullName: 'Dexterity',
    color: '#ffd700',
    description: 'Fine motor skills and manual precision',
  },
  {
    key: 'TECH',
    label: 'TECH',
    fullName: 'Technique',
    color: '#ff6b35',
    description: 'Technical aptitude and repair skills',
  },
  {
    key: 'COOL',
    label: 'COOL',
    fullName: 'Cool',
    color: '#ff00ff',
    description: 'Composure, nerve, and intimidation',
  },
  {
    key: 'WILL',
    label: 'WILL',
    fullName: 'Willpower',
    color: '#aa66ff',
    description: 'Mental fortitude and resistance',
  },
  {
    key: 'LUCK',
    label: 'LUCK',
    fullName: 'Luck',
    color: '#ff4444',
    description: 'Chance and fortunate breaks',
  },
  {
    key: 'MOVE',
    label: 'MOVE',
    fullName: 'Movement',
    color: '#00ff88',
    description: 'Running speed and agility',
  },
  {
    key: 'BODY',
    label: 'BODY',
    fullName: 'Body',
    color: '#ff4500',
    description: 'Physical strength and endurance',
  },
  {
    key: 'EMP',
    label: 'EMP',
    fullName: 'Empathy',
    color: '#ff69b4',
    description: 'Social awareness and humanity',
  },
];
