import type {
  Attributes,
  Club,
  MatchResult,
  MatchOutcome,
  Player,
  Position,
  SimResult,
  SquadSlot,
  TableEntry,
} from '../types';
import { CLUB_MAP, getCompetition, clubsForSeason, allClubsForCompetition } from '../data';

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
  teamName?: string,
  rng: () => number = Math.random,
): SimResult {
  const comp = getCompetition(competitionId);
  const matchCount = comp?.matches ?? 38;
  const teamCount = comp?.teamCount ?? 20;
  const { attack, defence } = teamStrength(slots);

  // Build opponent pool.
  // Strategy:
  // - Leagues (EPL, La Liga, Serie A, Bundesliga, CSL): use dynamic clubs
  //   from player data for the specific season, then pad with static
  //   clubs to reach teamCount. This preserves promotion/relegation feel
  //   while ensuring enough opponents for a full season.
  // - Cups (WC, UCL): use ALL statically-defined clubs (32 nations / elite
  //   clubs). Cups don't need player-data filtering because opponents don't
  //   need to be user-draftable — they just need a strength rating.
  const isCupComp = comp?.type === 'cup';
  let oppClubs: Club[];

  if (isCupComp) {
    // Cups: 32 static teams
    oppClubs = Object.values(CLUB_MAP).filter(
      (c) => c.competitionId === competitionId,
    );
  } else {
    // Leagues: start with dynamic (player-data) clubs for the chosen season
    // then pad with static clubs if we need more opponents.
    const staticClubs = Object.values(CLUB_MAP).filter(
      (c) => c.competitionId === competitionId,
    );

    if (opponentSeason) {
      const dynamicClubs = clubsForSeason(competitionId, opponentSeason);
      const dynamicIds = new Set(dynamicClubs.map((c) => c.id));
      // Start with dynamic clubs (the ones with player data in this
      // season), then add static clubs not already covered.
      oppClubs = [...dynamicClubs];
      for (const s of staticClubs) {
        if (!dynamicIds.has(s.id)) oppClubs.push(s);
      }
    } else {
      // No season: use all clubs ever seen (dynamic + static).
      const dynamicClubs = allClubsForCompetition(competitionId);
      const dynamicIds = new Set(dynamicClubs.map((c) => c.id));
      oppClubs = [...dynamicClubs];
      for (const s of staticClubs) {
        if (!dynamicIds.has(s.id)) oppClubs.push(s);
      }
    }
  }

  // Safety fallback: should never trigger, but guarantees >= 4 opponents.
  if (oppClubs.length < 4) {
    oppClubs = Object.values(CLUB_MAP).filter(
      (c) => c.competitionId === competitionId,
    );
  }

  const opponentPool = oppClubs;

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

  // Generate full league table.
  const table: TableEntry[] = [];

  // Add user's XI to the table.
  table.push({
    position: 0, // will be set after sorting
    clubId: 'user-xi',
    clubName: teamName || 'Your XI',
    clubNameZh: teamName || '你的十一人',
    played: matchesPlayed,
    won: wins,
    drawn: draws,
    lost: losses,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points,
    isUser: true,
  });

  // Generate simulated records for all opponent clubs.
  for (const opp of opponentPool) {
    // Simulate this club's season against other opponents.
    const oppMatches = matchCount;
    let oppWins = 0;
    let oppDraws = 0;
    let oppLosses = 0;
    let oppGF = 0;
    let oppGA = 0;

    // Base strength determines expected performance.
    const strengthFactor = (opp.strength - 70) / 20; // -0.5 to 1.0 roughly
    const baseXG = 1.4 + strengthFactor * 0.3;
    const baseXGA = 1.3 - strengthFactor * 0.2;

    for (let i = 0; i < oppMatches; i++) {
      // Simulate a match against a random opponent (not including user XI for simplicity).
      const xgFor = clamp(baseXG + gaussian() * 0.6, 0.2, 4.5);
      const xgAgainst = clamp(baseXGA + gaussian() * 0.6, 0.2, 4.5);
      const gf = poisson(xgFor);
      const ga = poisson(xgAgainst);
      oppGF += gf;
      oppGA += ga;
      if (gf > ga) oppWins += 1;
      else if (gf === ga) oppDraws += 1;
      else oppLosses += 1;
    }

    const oppPoints = oppWins * 3 + oppDraws;
    table.push({
      position: 0,
      clubId: opp.id,
      clubName: opp.shortName,
      clubNameZh: opp.shortNameZh,
      played: oppMatches,
      won: oppWins,
      drawn: oppDraws,
      lost: oppLosses,
      goalsFor: oppGF,
      goalsAgainst: oppGA,
      goalDifference: oppGF - oppGA,
      points: oppPoints,
      isUser: false,
    });
  }

  // Sort by points (desc), then goal difference (desc), then goals for (desc).
  table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  // Assign positions.
  for (let i = 0; i < table.length; i++) {
    table[i].position = i + 1;
  }

  // Find user's position.
  const userEntry = table.find((e) => e.isUser);
  position = userEntry?.position ?? 1;

  // Cap table to actual number of participating teams (dynamic) or teamCount, whichever is larger.
  const actualTeamCount = Math.max(teamCount, opponentPool.length + 1);
  const finalTable = table.slice(0, actualTeamCount);

  if (isCup) {
    if (losses === 0) {
      position = 1;
    } else {
      const bracket = Math.pow(2, matchCount - matchesPlayed + 1);
      position = clamp(Math.round(bracket), 2, teamCount);
    }
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
    teams: finalTable.length,
    unbeaten: losses === 0,
    perfect: losses === 0 && draws === 0,
    table: finalTable,
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

// Estimate function removed - using actual table generation instead

/** Human-readable outcome letter for a match. */
export function outcomeOf(m: MatchResult): MatchOutcome {
  if (m.goalsFor > m.goalsAgainst) return 'W';
  if (m.goalsFor < m.goalsAgainst) return 'L';
  return 'D';
}
