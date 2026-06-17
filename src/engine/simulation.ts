import type {
  Attributes,
  Club,
  MatchResult,
  Player,
  Position,
  SimResult,
} from '../types';
import { CLUB_MAP, getCompetition } from '../data';

// ---- Position weighting & grouping -----------------------------------------

const POSITION_WEIGHT: Partial<Record<Position, number>> = {
  GK: 1.15, // a weak keeper costs you
  CB: 1.0,
  LB: 0.9,
  RB: 0.9,
  LWB: 0.9,
  RWB: 0.9,
  CDM: 1.05,
  CM: 1.0,
  CAM: 1.0,
  LM: 0.9,
  RM: 0.9,
  LW: 1.0,
  RW: 1.0,
  ST: 1.05,
  CF: 1.0,
};

export type PositionGroup = 'GK' | 'DEF' | 'MID' | 'ATT';

export function positionGroup(pos: Position): PositionGroup {
  switch (pos) {
    case 'GK':
      return 'GK';
    case 'CB':
    case 'LB':
    case 'RB':
    case 'LWB':
    case 'RWB':
      return 'DEF';
    case 'CDM':
    case 'CM':
    case 'CAM':
    case 'LM':
    case 'RM':
      return 'MID';
    default:
      return 'ATT';
  }
}

// ---- Team strength ----------------------------------------------------------

/**
 * Compute overall team strength (0-100) from a filled XI.
 * Blends the player's overall rating with the average of their six attributes,
 * weighted by position importance. Penalises squads with empty slots.
 */
export function teamStrength(players: (Player | null)[]): {
  overall: number;
  attack: number;
  midfield: number;
  defence: number;
} {
  const filled = players.filter((p): p is Player => p !== null);
  if (filled.length === 0) {
    return { overall: 50, attack: 50, midfield: 50, defence: 50 };
  }

  let totalWeight = 0;
  let totalScore = 0;
  let attSum = 0;
  let attW = 0;
  let midSum = 0;
  let midW = 0;
  let defSum = 0;
  let defW = 0;

  for (const pl of filled) {
    const w = POSITION_WEIGHT[pl.position] ?? 1;
    const attrAvg = avgAttr(pl.attr);
    // Blend overall (which already encodes reputation) with raw attributes.
    const score = pl.rating * 0.6 + attrAvg * 0.4;
    totalWeight += w;
    totalScore += score * w;

    const group = positionGroup(pl.position);
    if (group === 'ATT') {
      attSum += score * w;
      attW += w;
    } else if (group === 'MID') {
      midSum += score * w;
      midW += w;
    } else if (group === 'DEF' || group === 'GK') {
      defSum += score * w;
      defW += w;
    }
  }

  const overall = totalScore / totalWeight;
  // Penalty for incomplete squads — each missing slot drags the rating down.
  const missing = 11 - filled.length;
  const penalty = missing * 2.2;

  return {
    overall: clamp(overall - penalty, 30, 99),
    attack: attW ? clamp(attSum / attW, 30, 99) : overall,
    midfield: midW ? clamp(midSum / midW, 30, 99) : overall,
    defence: defW ? clamp(defSum / defW, 30, 99) : overall,
  };
}

function avgAttr(a: Attributes): number {
  return (a.pace + a.shooting + a.passing + a.dribbling + a.defending + a.physical) / 6;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// ---- Match simulation -------------------------------------------------------

/** Box-Muller transform for a standard normal sample. */
function gaussian(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Simulate a single match. Expected goals are derived from the attack/defence
 * differential plus a home advantage, then sampled via a Poisson-like model.
 */
export function simulateMatch(
  myAttack: number,
  myDefence: number,
  oppStrength: number,
  home: boolean,
): { goalsFor: number; goalsAgainst: number } {
  const homeBoost = home ? 4 : 0;
  const attackDelta = myAttack - oppStrength + homeBoost;
  const defenceDelta = myDefence - oppStrength;

  // Expected goals for my team — centred near 1.4, scaled by attack edge.
  const xgFor = clamp(1.35 + attackDelta * 0.045 + gaussian() * 0.55, 0.15, 5.5);
  // Expected goals against — centred near 1.25, reduced by defensive edge.
  const xgAgainst = clamp(1.25 - defenceDelta * 0.04 + gaussian() * 0.55, 0.1, 5.5);

  return {
    goalsFor: poisson(xgFor),
    goalsAgainst: poisson(xgAgainst),
  };
}

/** Sample a non-negative integer from a Poisson distribution with mean λ. */
function poisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k += 1;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

// ---- Season / tournament simulation ----------------------------------------

/**
 * Simulate a full run for the user's XI.
 *
 * - League: plays `matches` games against opponents drawn from the competition's
 *   clubs, alternating home/away. A synthetic league table is generated and the
 *   user's final position is computed.
 * - Cup: plays `matches` single-leg knockout-style games against progressively
 *   stronger opponents; each defeat ends the run early.
 */
export function simulateSeason(
  competitionId: string,
  players: (Player | null)[],
  rng: () => number = Math.random,
): SimResult {
  const comp = getCompetition(competitionId);
  const matchCount = comp?.matches ?? 38;
  const { overall, attack, defence } = teamStrength(players);

  // Build opponent pool from the competition's clubs.
  const oppClubs: Club[] = Object.values(CLUB_MAP).filter(
    (c) => c.competitionId === competitionId,
  );
  const opponentPool =
    oppClubs.length > 0 ? oppClubs : Object.values(CLUB_MAP).slice(0, 10);

  const matches: MatchResult[] = [];
  let points = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  const isCup = comp?.type === 'cup';

  // Seeded shuffle helper using the provided rng.
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const opponents = shuffle(opponentPool);

  for (let i = 0; i < matchCount; i++) {
    const opp = opponents[i % opponents.length];
    const home = i % 2 === 0;

    // In cup mode, opponents get progressively tougher as you advance.
    let oppStrength = opp.strength;
    if (isCup) {
      const progress = i / Math.max(1, matchCount - 1);
      oppStrength = clamp(opp.strength * (0.82 + progress * 0.3), 60, 95);
    }

    const { goalsFor: gf, goalsAgainst: ga } = simulateMatch(
      attack,
      defence,
      oppStrength,
      home,
    );

    matches.push({
      round: i + 1,
      opponentId: opp.id,
      opponentName: opp.shortName,
      opponentNameZh: opp.shortNameZh,
      home,
      goalsFor: gf,
      goalsAgainst: ga,
    });

    goalsFor += gf;
    goalsAgainst += ga;
    if (gf > ga) {
      wins += 1;
      points += 3;
    } else if (gf === ga) {
      draws += 1;
      points += 1;
    } else {
      losses += 1;
      if (isCup) break; // knocked out
    }
  }

  // Estimate final position.
  const teams = isCup ? 32 : opponentPool.length || 20;
  const matchesPlayed = matches.length;
  let position: number;
  if (isCup) {
    if (losses === 0) {
      position = 1; // won every round → champion
    } else {
      // Knocked out in round `matchesPlayed`. Map to a bracket position:
      // losing the final (last round) = 2, losing first round = ~teams.
      const bracket = Math.pow(2, matchCount - matchesPlayed + 1);
      position = clamp(Math.round(bracket), 2, teams);
    }
  } else {
    position = estimateLeaguePosition(points, overall, teams);
  }

  return {
    matches,
    points,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    position,
    teams,
    unbeaten: losses === 0,
    perfect: losses === 0 && draws === 0,
  };
}

/**
 * Estimate where a team with the given points & strength would finish in a league.
 * Models the rest of the league's point totals around the user's strength.
 */
function estimateLeaguePosition(userPoints: number, userStrength: number, teams: number): number {
  // Generate synthetic opponent point totals.
  const totals: number[] = [];
  for (let i = 0; i < teams - 1; i++) {
    // Opponent strength varies; map to a plausible points total (0-100 range).
    const base = 40 + (Math.random() - 0.5) * 50 + (userStrength - 75) * 0.4;
    totals.push(clamp(base + gaussian() * 12, 5, 105));
  }
  totals.push(userPoints);
  totals.sort((a, b) => b - a);
  return totals.indexOf(userPoints) + 1;
}

/** Human-readable outcome letter for a match. */
export function outcomeOf(m: MatchResult): 'W' | 'D' | 'L' {
  if (m.goalsFor > m.goalsAgainst) return 'W';
  if (m.goalsFor < m.goalsAgainst) return 'L';
  return 'D';
}
