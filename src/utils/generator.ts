import type { Character, Stats, RoleClass, DerivedStats, RoleAbility } from '../types';
import {
  firstSyllables, lastSyllables,
  handlePrefixes, handleSuffixes,
  numberSuffixes, affiliations,
} from '../data/names';
import { backstoryTemplates } from '../data/backstories';
import { roles, roleStatBias, roleAbilities } from '../data/classes';

const STAT_KEYS = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'] as const;
const STAT_MIN = 2;
const STAT_MAX = 8;
const TOTAL_POOL = 62;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(): string {
  const first = pick(firstSyllables);
  const last = pick(lastSyllables);

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

function generateBackstory(name: string, handle: string, affiliation: string): string {
  const template = pick(backstoryTemplates);
  return template
    .replace(/{name}/g, name)
    .replace(/{handle}/g, handle)
    .replace(/{affiliation}/g, affiliation);
}

function generateStats(role: RoleClass): Stats {
  const bias = roleStatBias[role];

  // Start all stats at minimum (2)
  const stats: Record<string, number> = {};
  for (const key of STAT_KEYS) {
    stats[key] = STAT_MIN;
  }

  // Points remaining to distribute: Total pool - (number of stats * minimum)
  let remaining = TOTAL_POOL - (STAT_KEYS.length * STAT_MIN);

  // Build weighted distribution based on role bias
  // Bias values range from -15 to 35, shift to positive range
  const BIAS_SHIFT = 20; // Makes all biases positive (min adjusted bias = 5)
  const weights: Record<string, number> = {};
  for (const key of STAT_KEYS) {
    weights[key] = (bias[key] ?? 0) + BIAS_SHIFT;
    if (weights[key] < 1) weights[key] = 1; // floor at 1
  }

  // Distribute remaining points with role-biased randomness
  while (remaining > 0) {
    // Calculate total weight, excluding stats that are already at max
    let totalWeight = 0;
    const eligible: string[] = [];
    for (const key of STAT_KEYS) {
      if (stats[key] < STAT_MAX) {
        totalWeight += weights[key];
        eligible.push(key);
      }
    }

    if (eligible.length === 0 || totalWeight === 0) break;

    // Roll weighted random
    const roll = Math.random() * totalWeight;
    let cumulative = 0;
    let chosen = eligible[0];

    for (const key of eligible) {
      cumulative += weights[key];
      if (roll <= cumulative) {
        chosen = key;
        break;
      }
    }

    stats[chosen]++;
    remaining--;
  }

  return {
    INT: stats['INT'],
    REF: stats['REF'],
    DEX: stats['DEX'],
    TECH: stats['TECH'],
    COOL: stats['COOL'],
    WILL: stats['WILL'],
    LUCK: stats['LUCK'],
    MOVE: stats['MOVE'],
    BODY: stats['BODY'],
    EMP: stats['EMP'],
  } as Stats;
}

export function calculateDerivedStats(stats: Stats): DerivedStats {
  const hitPoints = (stats.BODY + stats.WILL) * 5;
  const humanity = stats.EMP * 10;
  const seriouslyWounded = Math.floor(hitPoints / 2);
  const deathSave = stats.BODY;
  const initiative = stats.REF + stats.DEX;

  return {
    hitPoints,
    humanity,
    seriouslyWounded,
    deathSave,
    initiative,
  };
}

function generateRoleAbility(role: RoleClass): RoleAbility {
  return {
    name: roleAbilities[role],
    rank: 4,
  };
}

export function generateCharacter(): Character {
  const role = pick(roles);
  const name = generateName();
  const handle = generateHandle();
  const affiliation = pick(affiliations);
  const backstory = generateBackstory(name, handle, affiliation);
  const stats = generateStats(role);
  const derivedStats = calculateDerivedStats(stats);
  const roleAbility = generateRoleAbility(role);

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    handle,
    role,
    backstory,
    affiliation,
    stats,
    derivedStats,
    roleAbility,
    avatarSeed: Math.floor(Math.random() * 100000),
  };
}