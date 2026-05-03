import type { Character, Stats, RoleClass } from '../types';
import {
  firstSyllables, lastSyllables,
  handlePrefixes, handleSuffixes,
  numberSuffixes, affiliations,
} from '../data/names';
import { backstoryTemplates } from '../data/backstories';
import { roles, roleStatBias } from '../data/classes';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function generateName(): string {
  const first = pick(firstSyllables);
  const last = pick(lastSyllables);

  // Occasionally add a number suffix
  const variant = Math.random();
  if (variant < 0.25) {
    return `${first}${pick(numberSuffixes)}`;
  } else if (variant < 0.5) {
    return `${first} ${last}`;
  } else if (variant < 0.75) {
    return `${first}-${last}`;
  } else {
    return `${first} ${last}${pick(numberSuffixes)}`;
  }
}

function generateHandle(): string {
  const prefix = pick(handlePrefixes);
  const suffix = pick(handleSuffixes);
  const sep = Math.random() < 0.5 ? '_' : '.';
  return `@${prefix}${sep}${suffix}`;
}

function generateStats(role: RoleClass): Stats {
  const bias = roleStatBias[role];
  const rollStat = (key: string) => {
    const base = rand(20, 75);
    const biasVal = bias[key] ?? 0;
    // Apply bias then clamp to 1-100
    return clamp(base + biasVal + rand(-5, 5), 1, 100);
  };

  return {
    STR: rollStat('STR'),
    AGL: rollStat('AGL'),
    INT: rollStat('INT'),
    CYW: rollStat('CYW'),
    CHR: rollStat('CHR'),
    TEC: rollStat('TEC'),
  };
}

function generateBackstory(name: string, handle: string, affiliation: string): string {
  const template = pick(backstoryTemplates);
  return template
    .replace(/{name}/g, name)
    .replace(/{handle}/g, handle)
    .replace(/{affiliation}/g, affiliation);
}

export function generateCharacter(): Character {
  const role = pick(roles);
  const name = generateName();
  const handle = generateHandle();
  const affiliation = pick(affiliations);
  const backstory = generateBackstory(name, handle, affiliation);
  const stats = generateStats(role);

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    handle,
    role,
    backstory,
    affiliation,
    stats,
    avatarSeed: Math.floor(Math.random() * 100000),
  };
}
