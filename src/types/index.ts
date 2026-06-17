// DreamXI core types

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
  /** How well the player fits this slot: 'primary' | 'secondary' | null. */
  positionFit: 'primary' | 'secondary' | null;
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
