export interface Stats {
  STR: number;
  AGL: number;
  INT: number;
  CYW: number;
  CHR: number;
  TEC: number;
}

export interface Character {
  id: string;
  name: string;
  handle: string;
  role: RoleClass;
  backstory: string;
  affiliation: string;
  stats: Stats;
  avatarSeed: number;
}

export type RoleClass =
  | 'Hacker'
  | 'Street Samurai'
  | 'Netrunner'
  | 'Fixer'
  | 'Rigger'
  | 'Media'
  | 'Solo'
  | 'Tech';

export interface StatDefinition {
  key: keyof Stats;
  label: string;
  fullName: string;
  color: string;
}
