export interface Stats {
  INT: number;
  REF: number;
  DEX: number;
  TECH: number;
  COOL: number;
  WILL: number;
  LUCK: number;
  MOVE: number;
  BODY: number;
  EMP: number;
}

export interface DerivedStats {
  hitPoints: number;
  humanity: number;
  seriouslyWounded: number;
  deathSave: number;
  initiative: number;
}

export interface RoleAbility {
  name: string;
  rank: number;
}

export interface Character {
  id: string;
  name: string;
  handle: string;
  role: RoleClass;
  backstory: string;
  affiliation: string;
  stats: Stats;
  derivedStats: DerivedStats;
  roleAbility: RoleAbility;
  avatarSeed: number;
}

export type RoleClass =
  | 'Solo'
  | 'Netrunner'
  | 'Rockerboy'
  | 'Tech'
  | 'Medtech'
  | 'Media'
  | 'Exec'
  | 'Lawman'
  | 'Fixer';

export interface StatDefinition {
  key: keyof Stats;
  label: string;
  fullName: string;
  color: string;
  description: string;
}
