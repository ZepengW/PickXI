// Pick XI core types

/** On-pitch position codes. */
export type Position =
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'LWB'
  | 'RWB'
  | 'CDM'
  | 'CM'
  | 'CAM'
  | 'LM'
  | 'RM'
  | 'LW'
  | 'RW'
  | 'ST'
  | 'CF';

/** Simplified FM-style six-attribute profile. */
export interface Attributes {
  pace: number; // PAC
  shooting: number; // SHO
  passing: number; // PAS
  dribbling: number; // DRI
  defending: number; // DEF
  physical: number; // PHY
}

export interface Player {
  id: string;
  name: string; // Latin script
  nameZh: string; // Chinese
  position: Position; // primary position
  positions: Position[]; // all playable positions
  clubId: string;
  season: string; // e.g. "2019-20"
  competitionId: string;
  rating: number; // overall 40-99
  attr: Attributes;
  nationality: string;
  nationalityZh: string;
  number?: number;
}

export interface Club {
  id: string;
  name: string;
  nameZh: string;
  shortName: string;
  shortNameZh: string;
  color: string; // primary
  color2: string; // secondary
  competitionId: string;
  /** Base strength used when this club is a sim opponent (0-100). */
  strength: number;
}

export type CompetitionType = 'league' | 'cup';

export interface Competition {
  id: string;
  name: string;
  nameZh: string;
  type: CompetitionType;
  /** Number of matches your drafted XI plays in a full run. */
  matches: number;
  /** Total teams in the competition (for league table / cup bracket). */
  teamCount: number;
  seasons: string[]; // available seasons, ordered
  region: string;
  regionZh: string;
  /** Accent color for the competition identity. */
  accent: string;
  blurb: string;
  blurbZh: string;
}

export interface FormationSlot {
  id: string;
  position: Position;
  /** Pitch coordinates, 0-100 (x = left→right, y = own goal→attacking goal). */
  x: number;
  y: number;
}

export interface Formation {
  id: string;
  name: string;
  nameZh: string;
  slots: FormationSlot[];
}

/** A filled slot in the user's XI. */
export interface SquadSlot {
  slotId: string;
  position: Position;
  player: Player | null;
  /** How well the player fits this slot. null = empty slot. */
  positionFit: 'primary' | 'secondary' | 'other' | null;
  /** Actual rating penalty for this position assignment. 0 = primary. */
  positionPenalty: number;
}

export interface MatchResult {
  round: number;
  opponentId: string;
  opponentName: string;
  opponentNameZh: string;
  home: boolean;
  goalsFor: number;
  goalsAgainst: number;
}

export type MatchOutcome = 'W' | 'D' | 'L';

/** Chemistry link between two adjacent players on the pitch. */
export interface ChemistryLink {
  fromSlotId: string;
  toSlotId: string;
  /** Link strength: 'club' = same club (strongest), 'nation' = same nationality, 'none' = no link. */
  type: 'club' | 'nation' | 'none';
  /** Bonus value applied to both players. */
  bonus: number;
}

/** Chemistry summary for the whole squad. */
export interface ChemistryResult {
  links: ChemistryLink[];
  /** Total chemistry bonus (sum of all link bonuses, each counted once per pair). */
  totalBonus: number;
  /** Chemistry rating 0-100. */
  rating: number;
}

/** A single team's row in the final league table. */
export interface TableEntry {
  position: number;
  clubId: string;
  clubName: string;
  clubNameZh: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  /** Whether this entry is the user's XI. */
  isUser: boolean;
}

export interface SimResult {
  matches: MatchResult[];
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  /** Final league position (1 = champion). Lower is better. */
  position: number;
  /** Total teams in the simulated table. */
  teams: number;
  unbeaten: boolean;
  perfect: boolean;
  /** Full league table (all teams, sorted by points). */
  table: TableEntry[];
  // Extended stats
  cleanSheets: number;
  failedToScore: number;
  biggestWin: { opponentName: string; opponentNameZh: string; score: string } | null;
  biggestLoss: { opponentName: string; opponentNameZh: string; score: string } | null;
  longestWinStreak: number;
  longestUnbeatenRun: number;
  goalsPerGame: number;
  concededPerGame: number;
  pointsPerGame: number;
  goalDifference: number;
  /** Season grade S/A/B/C/D/F based on performance. */
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  /** Form guide: last 5 results, oldest first. */
  formGuide: MatchOutcome[];
}

export type Lang = 'zh' | 'en';

/** Difficulty levels — controls what info is visible during draft. */
export type Difficulty = 'easy' | 'normal' | 'hard' | 'divine';

/** What information is visible at a given difficulty level. */
export interface DifficultyConfig {
  /** Show player overall rating. */
  showRatings: boolean;
  /** Show recommended position (primary/secondary highlight). */
  showPosition: boolean;
  /** Show tier color coding on cards. */
  showTier: boolean;
  /** Show nationality / country. */
  showNationality: boolean;
  /** Show team strength bars. */
  showTeamScore: boolean;
  /** Show chemistry lines between players. */
  showChemistry: boolean;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    showRatings: true,
    showPosition: true,
    showTier: true,
    showNationality: true,
    showTeamScore: true,
    showChemistry: true,
  },
  normal: {
    showRatings: true,
    showPosition: true,
    showTier: true,
    showNationality: true,
    showTeamScore: false,
    showChemistry: true,
  },
  hard: {
    showRatings: false,
    showPosition: true,
    showTier: false,
    showNationality: true,
    showTeamScore: false,
    showChemistry: false,
  },
  divine: {
    showRatings: false,
    showPosition: false,
    showTier: false,
    showNationality: false,
    showTeamScore: false,
    showChemistry: false,
  },
};
