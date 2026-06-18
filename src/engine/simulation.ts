import type {
  Attributes,
  ChemistryLink,
  ChemistryResult,
  Club,
  MatchResult,
  MatchOutcome,
  Player,
  Position,
  SimResult,
  SquadSlot,
  TableEntry,
} from '../types';
import { CLUB_MAP, getCompetition, clubsForSeason, allClubsForCompetition, getSeasonClubIds } from '../data';

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
 * Position compatibility matrix inspired by FIFA/FM.
 *
 * For each (fromPos, toPos) pair, defines a penalty:
 *   0  = natural / primary — no penalty
 *   3  = very comfortable — e.g. CM→CDM, ST→CF
 *   5  = comfortable — e.g. CAM→CM, CB→CDM
 *   8  = can play but uncomfortable — e.g. LW→ST, CM→CAM
 *   12 = significantly out of position — e.g. ST→CM, CB→LB
 *   18 = completely out of position — e.g. GK→ST, ST→CB
 *
 * Only non-trivial entries are listed; missing pairs default to 18.
 * A player's `positions` array still overrides: if the slot position is
 * in the player's `positions` list, the penalty is capped at 5.
 */
const POS_COMPAT: Partial<Record<Position, Partial<Record<Position, number>>>> = {
  // --- GK ---
  GK: { GK: 0 },
  // --- Defenders ---
  CB: { CB: 0, CDM: 5, LB: 12, RB: 12, LWB: 12, RWB: 12 },
  LB: { LB: 0, LWB: 3, CB: 8, LM: 12, LW: 12 },
  RB: { RB: 0, RWB: 3, CB: 8, RM: 12, RW: 12 },
  LWB: { LWB: 0, LB: 3, LM: 8, LW: 12, CB: 12 },
  RWB: { RWB: 0, RB: 3, RM: 8, RW: 12, CB: 12 },
  // --- Midfielders ---
  CDM: { CDM: 0, CM: 3, CB: 8, CAM: 8 },
  CM: { CM: 0, CDM: 3, CAM: 5, LM: 8, RM: 8 },
  CAM: { CAM: 0, CM: 5, CF: 5, CDM: 12, LW: 8, RW: 8, ST: 12 },
  LM: { LM: 0, LW: 3, RM: 8, CM: 8, LB: 12, LWB: 12 },
  RM: { RM: 0, RW: 3, LM: 8, CM: 8, RB: 12, RWB: 12 },
  // --- Attackers ---
  LW: { LW: 0, LM: 3, RW: 5, CF: 8, ST: 8, CAM: 8 },
  RW: { RW: 0, RM: 3, LW: 5, CF: 8, ST: 8, CAM: 8 },
  CF: { CF: 0, ST: 3, CAM: 5, LW: 12, RW: 12 },
  ST: { ST: 0, CF: 3, LW: 8, RW: 8, CAM: 12 },
};

/**
 * Determine how well a player fits a slot position.
 * Returns a fit category and the actual penalty value.
 *
 * The penalty is derived from the compatibility matrix, but if the slot
 * position is in the player's `positions` list (secondary position),
 * the penalty is capped at 5 — a player who is listed as able to play
 * a position should never be penalised as harshly as someone who can't.
 */
export function positionFit(
  player: Player,
  slotPosition: Position,
): 'primary' | 'secondary' | 'other' {
  if (player.position === slotPosition) return 'primary';
  if (player.positions.includes(slotPosition)) return 'secondary';
  return 'other';
}

/** Rating penalty applied when a player is out of position. */
export function positionPenalty(
  player: Player,
  slotPosition: Position,
): number {
  if (player.position === slotPosition) return 0;

  // If the slot position is in the player's positions list (secondary),
  // use a mild penalty (0-5 range from compat matrix, capped at 5).
  const isSecondary = player.positions.includes(slotPosition);
  const compatPenalty = POS_COMPAT[player.position]?.[slotPosition] ?? 18;

  if (isSecondary) {
    return Math.min(compatPenalty, 5);
  }
  return compatPenalty;
}

// ---- Chemistry (FIFA-style) -------------------------------------------------

/**
 * Adjacency map for formation slots.
 * Two slots are "adjacent" if their players should have a chemistry link.
 * Inspired by FIFA: each player links to nearby position neighbours.
 * We define adjacency by position group proximity on the pitch.
 */
const ADJACENCY: Record<string, string[]> = {
  // 4-3-3
  gk: ['cb1', 'cb2'],
  lb: ['cb1', 'cm1'],
  cb1: ['gk', 'lb', 'cb2', 'cm1', 'cm2'],
  cb2: ['gk', 'rb', 'cb1', 'cm2', 'cm3'],
  rb: ['cb2', 'cm3'],
  cm1: ['lb', 'cb1', 'cm2', 'lw', 'cm3'],
  cm2: ['cb1', 'cb2', 'cm1', 'cm3', 'st'],
  cm3: ['cb2', 'rb', 'cm2', 'cm1', 'rw'],
  lw: ['cm1', 'st'],
  st: ['cm2', 'lw', 'rw'],
  rw: ['cm3', 'st'],
  // 4-4-2
  lm: ['lb', 'cm1', 'st1'],
  rm: ['rb', 'cm2', 'st2'],
  st1: ['lm', 'cm1', 'st2'],
  st2: ['rm', 'cm2', 'st1'],
  // 3-5-2
  cb3: ['cb2', 'rwb'],
  lwb: ['cb1', 'cm1'],
  cdm: ['cb1', 'cb2', 'cb3', 'cm1', 'cm2'],
  rwb: ['cb3', 'cm2'],
  // 4-2-3-1
  cdm1: ['cb1', 'cb2', 'cdm2', 'lw'],
  cdm2: ['cb1', 'cb2', 'cdm1', 'rw'],
  cam: ['cdm1', 'cdm2', 'lw', 'rw', 'st'],
  // 4-5-1
  // 3-4-3
  // 4-1-4-1
  // 5-3-2
  // 4-4-2 Diamond
  // 3-6-1
};

/** Get adjacency list for a slot, with fallback to position-group neighbours. */
function getAdjacent(slotId: string, allSlotIds: string[]): string[] {
  // Try explicit adjacency first
  if (ADJACENCY[slotId]) {
    return ADJACENCY[slotId].filter((id) => allSlotIds.includes(id));
  }
  return [];
}

/** Chemistry bonus values. */
const CHEM_CLUB_BONUS = 3;   // same club
const CHEM_NATION_BONUS = 1; // same nationality

/**
 * Calculate chemistry for a squad.
 * Each adjacent pair of filled slots generates a link:
 * - Same club → +3 bonus (green line)
 * - Same nationality → +1 bonus (yellow line)
 * - No link → 0 (no line drawn)
 */
export function calculateChemistry(slots: SquadSlot[]): ChemistryResult {
  const filled = slots.filter((s) => s.player !== null);
  const allSlotIds = slots.map((s) => s.slotId);
  const links: ChemistryLink[] = [];
  const seen = new Set<string>();

  for (const slot of filled) {
    const neighbours = getAdjacent(slot.slotId, allSlotIds);
    for (const neighbourId of neighbours) {
      const neighbour = slots.find((s) => s.slotId === neighbourId);
      if (!neighbour?.player) continue;

      // Avoid duplicate links (A→B and B→A)
      const key = [slot.slotId, neighbourId].sort().join('-');
      if (seen.has(key)) continue;
      seen.add(key);

      const p1 = slot.player!;
      const p2 = neighbour.player!;

      let type: ChemistryLink['type'] = 'none';
      let bonus = 0;

      if (p1.clubId === p2.clubId) {
        type = 'club';
        bonus = CHEM_CLUB_BONUS;
      } else if (p1.nationality === p2.nationality) {
        type = 'nation';
        bonus = CHEM_NATION_BONUS;
      }

      links.push({
        fromSlotId: slot.slotId,
        toSlotId: neighbourId,
        type,
        bonus,
      });
    }
  }

  const totalBonus = links.reduce((sum, l) => sum + l.bonus, 0);
  // Max possible: ~20 links * 3 = 60. Scale to 0-100.
  const maxPossible = 60;
  const rating = Math.round(Math.min(100, (totalBonus / maxPossible) * 100));

  return { links, totalBonus, rating };
}

// ---- Team strength ----------------------------------------------------------

/**
 * Compute overall team strength (0-100) from a filled XI.
 * Accounts for position fit and chemistry — players in secondary positions
 * contribute less, while chemistry links provide a bonus.
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

  // Calculate chemistry bonus per player
  const chem = calculateChemistry(slots);
  const chemBonusPerSlot: Record<string, number> = {};
  for (const link of chem.links) {
    if (link.bonus > 0) {
      chemBonusPerSlot[link.fromSlotId] = (chemBonusPerSlot[link.fromSlotId] ?? 0) + link.bonus;
      chemBonusPerSlot[link.toSlotId] = (chemBonusPerSlot[link.toSlotId] ?? 0) + link.bonus;
    }
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
    const penalty = positionPenalty(pl, slot.position);
    const chemBonus = chemBonusPerSlot[slot.slotId] ?? 0;
    const effectiveRating = Math.max(30, pl.rating - penalty + chemBonus);
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
  // Priority:
  // 1. If SEASON_CLUBS has an exact mapping for this competition+season, use it.
  //    This gives historically accurate team lists (correct promotion/relegation).
  // 2. For cups (WC, UCL): use all static clubs (32 teams).
  // 3. Fallback: dynamic clubs from player data + static padding.
  const isCupComp = comp?.type === 'cup';
  let oppClubs: Club[];

  // Try season-specific club list first (most accurate)
  const seasonClubIds = opponentSeason
    ? getSeasonClubIds(competitionId, opponentSeason)
    : null;

  if (seasonClubIds && seasonClubIds.length > 0) {
    // Use the explicitly defined season club list
    oppClubs = seasonClubIds
      .map((id) => CLUB_MAP[id])
      .filter((c): c is Club => c != null);
  } else if (isCupComp) {
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
  // Each club plays every other club twice (home & away), producing a
  // realistic league table where strong teams consistently beat weak ones.
  for (const opp of opponentPool) {
    let oppWins = 0;
    let oppDraws = 0;
    let oppLosses = 0;
    let oppGF = 0;
    let oppGA = 0;

    for (const other of opponentPool) {
      if (other.id === opp.id) continue;

      // Simulate two matches (home & away) between these two clubs.
      for (let leg = 0; leg < 2; leg++) {
        const isHome = leg === 0;
        const homeBoost = isHome ? 4 : 0;
        const strengthDelta = opp.strength - other.strength + homeBoost;

        // Expected goals based on strength difference
        const xgFor = clamp(1.35 + strengthDelta * 0.045 + gaussian() * 0.45, 0.2, 4.5);
        const xgAgainst = clamp(1.25 - strengthDelta * 0.04 + gaussian() * 0.45, 0.2, 4.5);

        const gf = poisson(xgFor);
        const ga = poisson(xgAgainst);
        oppGF += gf;
        oppGA += ga;
        if (gf > ga) oppWins += 1;
        else if (gf === ga) oppDraws += 1;
        else oppLosses += 1;
      }
    }

    // Scale to match the actual match count (opponentPool-1)*2 may differ from matchCount.
    // If we have more/fewer simulated matches than needed, scale the results proportionally.
    const simMatches = (opponentPool.length - 1) * 2;
    const scale = simMatches > 0 ? matchCount / simMatches : 1;

    const scaledWins = Math.round(oppWins * scale);
    const scaledDraws = Math.round(oppDraws * scale);
    const scaledLosses = matchCount - scaledWins - scaledDraws;
    const scaledGF = Math.round(oppGF * scale);
    const scaledGA = Math.round(oppGA * scale);

    const oppPoints = scaledWins * 3 + scaledDraws;
    table.push({
      position: 0,
      clubId: opp.id,
      clubName: opp.shortName,
      clubNameZh: opp.shortNameZh,
      played: matchCount,
      won: scaledWins,
      drawn: scaledDraws,
      lost: scaledLosses,
      goalsFor: scaledGF,
      goalsAgainst: scaledGA,
      goalDifference: scaledGF - scaledGA,
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
