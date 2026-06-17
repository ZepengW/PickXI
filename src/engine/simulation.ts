import type {
  Attributes,
  Club,
  MatchResult,
  MatchOutcome,
  Player,
  Position,
  SimResult,
  SquadSlot,
} from '../types';
import { CLUB_MAP, getCompetition, ALL_PLAYERS } from '../data';

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

// ---- Position fit -----------------------------------------------------------

/**
 * Determine how well a player fits a slot position.
 * - 'primary': the slot position is the player's primary position
 * - 'secondary': the slot position is in the player's positions list but not primary
 * - 'other': the player can play here but not ideally (out of position)
 * Any player can play any position — only the rating penalty differs.
 */
export function positionFit(player: Player, slotPosition: Position): 'primary' | 'secondary' | 'other' {
  if (player.position === slotPosition) return 'primary';
  if (player.positions.includes(slotPosition)) return 'secondary';
  return 'other';
}

/** Rating penalty applied when a player is out of position. */
export function positionPenalty(fit: 'primary' | 'secondary' | 'other' | null): number {
  if (fit === 'primary') return 0;
  if (fit === 'secondary') return 5;
  return 15; // 'other' or null (treated as out of position)
}

// ---- Team strength ----------------------------------------------------------

/**
 * Compute overall team strength (0-100) from a filled XI.
 * Accounts for position fit — players in secondary positions contribute less.
 */
export function teamStrength(slots: SquadSlot[]): {
  overall: number;
  attack: number;
  midfield: number;
  defence: number;
} {
  const filled = slots.filter((s) => s.player !== null);
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

  for (const slot of filled) {
    const pl = slot.player!;
    const w = POSITION_WEIGHT[slot.position] ?? 1;
    const penalty = positionPenalty(slot.positionFit);
    const effectiveRating = Math.max(30, pl.rating - penalty);
    const attrAvg = avgAttr(pl.attr);
    const score = effectiveRating * 0.6 + attrAvg * 0.4;
    totalWeight += w;
    totalScore += score * w;

    const group = positionGroup(slot.position);
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

  const xgFor = clamp(1.35 + attackDelta * 0.045 + gaussian() * 0.55, 0.15, 5.5);
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
 *
 * If `opponentSeason` is provided, opponents are drawn from clubs that have
 * players in that specific season (giving a realistic era-appropriate pool).
 */
export function simulateSeason(
  competitionId: string,
  slots: SquadSlot[],
  opponentSeason?: string,
  rng: () => number = Math.random,
): SimResult {
  const comp = getCompetition(competitionId);
  const matchCount = comp?.matches ?? 38;
  const teamCount = comp?.teamCount ?? 20;
  const { overall, attack, defence } = teamStrength(slots);

  // Build opponent pool from the competition's clubs.
  let oppClubs: Club[] = Object.values(CLUB_MAP).filter(
    (c) => c.competitionId === competitionId,
  );

  // If opponentSeason is specified, filter to clubs that have players in that season.
  if (opponentSeason) {
    const clubIdsWithPlayers = new Set(
      ALL_PLAYERS
        .filter((p) => p.competitionId === competitionId && p.season === opponentSeason)
        .map((p) => p.clubId),
    );
    const filtered = oppClubs.filter((c) => clubIdsWithPlayers.has(c.id));
    if (filtered.length > 0) oppClubs = filtered;
  }

  const opponentPool =
    oppClubs.length > 0 ? oppClubs : Object.values(CLUB_MAP).slice(0, 10);

  const matches: MatchResult[] = [];
  let points = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  let cleanSheets = 0;
  let failedToScore = 0;

  const isCup = comp?.type === 'cup';

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
    if (gf === 0) failedToScore += 1;
    if (ga === 0) cleanSheets += 1;

    if (gf > ga) {
      wins += 1;
      points += 3;
    } else if (gf === ga) {
      draws += 1;
      points += 1;
    } else {
      losses += 1;
      if (isCup) break;
    }
  }

  // Final position.
  const matchesPlayed = matches.length;
  let position: number;
  if (isCup) {
    if (losses === 0) {
      position = 1;
    } else {
      const bracket = Math.pow(2, matchCount - matchesPlayed + 1);
      position = clamp(Math.round(bracket), 2, teamCount);
    }
  } else {
    position = estimateLeaguePosition(points, overall, teamCount);
  }

  // Extended stats
  const goalDifference = goalsFor - goalsAgainst;
  const goalsPerGame = matchesPlayed > 0 ? goalsFor / matchesPlayed : 0;
  const concededPerGame = matchesPlayed > 0 ? goalsAgainst / matchesPlayed : 0;
  const pointsPerGame = matchesPlayed > 0 ? points / matchesPlayed : 0;

  // Biggest win / loss
  let biggestWin: SimResult['biggestWin'] = null;
  let biggestLoss: SimResult['biggestLoss'] = null;
  let biggestWinDiff = 0;
  let biggestLossDiff = 0;
  for (const m of matches) {
    const diff = m.goalsFor - m.goalsAgainst;
    const score = `${m.goalsFor}-${m.goalsAgainst}`;
    if (diff > 0 && diff > biggestWinDiff) {
      biggestWinDiff = diff;
      biggestWin = { opponentName: m.opponentName, opponentNameZh: m.opponentNameZh, score };
    } else if (diff < 0 && -diff > biggestLossDiff) {
      biggestLossDiff = -diff;
      biggestLoss = { opponentName: m.opponentName, opponentNameZh: m.opponentNameZh, score };
    }
  }

  // Streaks
  let longestWinStreak = 0;
  let currentWinStreak = 0;
  let longestUnbeatenRun = 0;
  let currentUnbeaten = 0;
  for (const m of matches) {
    const o = outcomeOf(m);
    if (o === 'W') {
      currentWinStreak += 1;
      currentUnbeaten += 1;
    } else {
      longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
      currentWinStreak = 0;
      if (o === 'D') {
        currentUnbeaten += 1;
      } else {
        longestUnbeatenRun = Math.max(longestUnbeatenRun, currentUnbeaten);
        currentUnbeaten = 0;
      }
    }
  }
  longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
  longestUnbeatenRun = Math.max(longestUnbeatenRun, currentUnbeaten);

  // Form guide (last 5)
  const formGuide: MatchOutcome[] = matches.slice(-5).map(outcomeOf);

  // Grade
  const grade = computeGrade(position, teamCount, pointsPerGame, isCup, losses);

  return {
    matches,
    points,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    position,
    teams: teamCount,
    unbeaten: losses === 0,
    perfect: losses === 0 && draws === 0,
    cleanSheets,
    failedToScore,
    biggestWin,
    biggestLoss,
    longestWinStreak,
    longestUnbeatenRun,
    goalsPerGame,
    concededPerGame,
    pointsPerGame,
    goalDifference,
    grade,
    formGuide,
  };
}

function computeGrade(
  position: number,
  teams: number,
  ppg: number,
  isCup: boolean,
  losses: number,
): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
  if (isCup) {
    if (position === 1 && losses === 0) return 'S';
    if (position <= 2) return 'A';
    if (position <= 4) return 'B';
    if (position <= 8) return 'C';
    if (position <= 16) return 'D';
    return 'F';
  }
  const topPct = position / teams;
  if (topPct <= 0.05 && ppg >= 2.0) return 'S';
  if (topPct <= 0.15) return 'A';
  if (topPct <= 0.35) return 'B';
  if (topPct <= 0.55) return 'C';
  if (topPct <= 0.8) return 'D';
  return 'F';
}

/**
 * Estimate where a team with the given points & strength would finish in a league.
 */
function estimateLeaguePosition(userPoints: number, userStrength: number, teams: number): number {
  const totals: number[] = [];
  for (let i = 0; i < teams - 1; i++) {
    const base = 40 + (Math.random() - 0.5) * 50 + (userStrength - 75) * 0.4;
    totals.push(clamp(base + gaussian() * 12, 5, 105));
  }
  totals.push(userPoints);
  totals.sort((a, b) => b - a);
  return totals.indexOf(userPoints) + 1;
}

/** Human-readable outcome letter for a match. */
export function outcomeOf(m: MatchResult): MatchOutcome {
  if (m.goalsFor > m.goalsAgainst) return 'W';
  if (m.goalsFor < m.goalsAgainst) return 'L';
  return 'D';
}
