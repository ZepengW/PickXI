import type { Club, Competition, Player } from '../types';
import { CLUBS, CLUB_MAP, COMPETITIONS, COMPETITION_MAP, clubsForCompetition, getSeasonClubIds } from './competitions';
import { FORMATIONS, getFormation } from './formations';
import { EPL_PLAYERS } from './players/epl';
import { LALIGA_PLAYERS } from './players/laliga';
import { CSL_PLAYERS } from './players/csl';
import { UCL_PLAYERS } from './players/ucl';
import { WC_PLAYERS } from './players/worldcup';
import { SERIEA_PLAYERS } from './players/seriea';
import { BUNDESLIGA_PLAYERS } from './players/bundesliga';
import { FIFA_IMPORTED_PLAYERS } from './players/fifa-imported';
import { FM_EXTRA_PLAYERS } from './players/fm_extra';

export const ALL_PLAYERS: Player[] = [
  ...EPL_PLAYERS,
  ...LALIGA_PLAYERS,
  ...CSL_PLAYERS,
  ...UCL_PLAYERS,
  ...WC_PLAYERS,
  ...SERIEA_PLAYERS,
  ...BUNDESLIGA_PLAYERS,
  ...FIFA_IMPORTED_PLAYERS,
  ...FM_EXTRA_PLAYERS,
];

export { COMPETITIONS, COMPETITION_MAP, CLUBS, CLUB_MAP, clubsForCompetition, getSeasonClubIds, FORMATIONS, getFormation };

/** A club-season pair that has at least one player available to draft. */
export interface ClubSeason {
  clubId: string;
  season: string;
  competitionId: string;
  playerCount: number;
}

/** Build the set of draftable club-season pairs, indexed by competition. */
function buildClubSeasonIndex(): Record<string, ClubSeason[]> {
  const map: Record<string, ClubSeason[]> = {};
  const counts: Record<string, number> = {};
  for (const pl of ALL_PLAYERS) {
    const key = `${pl.competitionId}|${pl.clubId}|${pl.season}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  for (const [key, count] of Object.entries(counts)) {
    const [competitionId, clubId, season] = key.split('|');
    (map[competitionId] ??= []).push({ clubId, season, competitionId, playerCount: count });
  }
  for (const list of Object.values(map)) {
    list.sort((a, b) => a.season.localeCompare(b.season) || a.clubId.localeCompare(b.clubId));
  }
  return map;
}

const CLUB_SEASON_INDEX = buildClubSeasonIndex();

// =============================================================================
// Dynamic club registry — clubs derived from player data, not just static CLUBS.
// This allows historical seasons to have different team rosters (promotion /
// relegation) without hardcoding every season's 20 teams.
// =============================================================================

/** Cache: competitionId -> season -> Club[] */
const DYNAMIC_CLUB_CACHE: Record<string, Record<string, Club[]>> = {};

/** Generate a color from a string hash (for dynamic clubs without static colors). */
function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 35%)`;
}

/** Build a Club object from player data for clubs not in the static CLUBS array. */
function buildDynamicClub(clubId: string, competitionId: string, players: Player[]): Club {
  // Try to find a real club name from player data
  const staticClub = CLUB_MAP[clubId];
  if (staticClub) {
    return {
      ...staticClub,
      competitionId,
      strength: estimateClubStrength(players),
    };
  }

  // Derive club name from clubId (best effort)
  const clubName = clubId
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || clubId;

  return {
    id: clubId,
    name: clubName,
    nameZh: clubName,
    shortName: clubName.slice(0, 12),
    shortNameZh: clubName.slice(0, 6),
    color: hashColor(clubId),
    color2: '#ffffff',
    competitionId,
    strength: estimateClubStrength(players),
  };
}

/** Estimate a club's strength (0-100) from its players' average rating. */
function estimateClubStrength(players: Player[]): number {
  if (players.length === 0) return 65;
  const topPlayers = players
    .map((p) => p.rating)
    .sort((a, b) => b - a)
    .slice(0, 11);
  const avg = topPlayers.reduce((sum, r) => sum + r, 0) / topPlayers.length;
  return Math.round(Math.max(50, Math.min(92, avg)));
}

/** Get all clubs that participated in a specific competition+season.
 *  Combines static CLUBS with dynamically discovered clubs from player data. */
export function clubsForSeason(competitionId: string, season: string): Club[] {
  // Check cache
  if (!DYNAMIC_CLUB_CACHE[competitionId]) DYNAMIC_CLUB_CACHE[competitionId] = {};
  if (DYNAMIC_CLUB_CACHE[competitionId][season]) {
    return DYNAMIC_CLUB_CACHE[competitionId][season];
  }

  // Get all clubIds that have players in this competition+season
  const seasonPlayers = ALL_PLAYERS.filter(
    (p) => p.competitionId === competitionId && p.season === season,
  );

  const clubPlayerMap: Record<string, Player[]> = {};
  for (const p of seasonPlayers) {
    if (!clubPlayerMap[p.clubId]) clubPlayerMap[p.clubId] = [];
    clubPlayerMap[p.clubId].push(p);
  }

  const clubIds = Object.keys(clubPlayerMap);

  // Build Club objects
  const clubs: Club[] = clubIds
    .filter((id) => clubPlayerMap[id].length >= 3) // need at least 3 players
    .map((id) => buildDynamicClub(id, competitionId, clubPlayerMap[id]));

  // Sort by strength descending for consistent ordering
  clubs.sort((a, b) => b.strength - a.strength);

  DYNAMIC_CLUB_CACHE[competitionId][season] = clubs;
  return clubs;
}

/** Get all clubs for a competition across ALL seasons (union). */
export function allClubsForCompetition(competitionId: string): Club[] {
  const staticClubs = clubsForCompetition(competitionId);
  const seenIds = new Set(staticClubs.map((c) => c.id));
  const result = [...staticClubs];

  // Add dynamic clubs from player data
  const compPlayers = ALL_PLAYERS.filter((p) => p.competitionId === competitionId);
  const clubPlayerMap: Record<string, Player[]> = {};
  for (const p of compPlayers) {
    if (!clubPlayerMap[p.clubId]) clubPlayerMap[p.clubId] = [];
    clubPlayerMap[p.clubId].push(p);
  }

  for (const [clubId, players] of Object.entries(clubPlayerMap)) {
    if (!seenIds.has(clubId) && players.length >= 3) {
      result.push(buildDynamicClub(clubId, competitionId, players));
      seenIds.add(clubId);
    }
  }

  return result;
}

/** All draftable club-seasons for a competition, optionally filtered to a season range.
 *  Only includes club-seasons with at least 7 players (enough to fill most of an XI). */
export function clubSeasonsFor(
  competitionId: string,
  seasonRange?: [string, string],
): ClubSeason[] {
  const all = (CLUB_SEASON_INDEX[competitionId] ?? []).filter((cs) => cs.playerCount >= 7);
  if (!seasonRange) return all;
  const [from, to] = seasonRange;
  return all.filter((cs) => cs.season >= from && cs.season <= to);
}

/** Players available to draft for a given club-season (excluding already-drafted ids). */
export function playersForClubSeason(
  clubId: string,
  season: string,
  excludeIds: Set<string> = new Set(),
): Player[] {
  return ALL_PLAYERS.filter(
    (pl) => pl.clubId === clubId && pl.season === season && !excludeIds.has(pl.id),
  );
}

/** Seasons that actually have draftable data for a competition (intersection with metadata). */
export function availableSeasons(competitionId: string): string[] {
  const comp = COMPETITION_MAP[competitionId];
  if (!comp) return [];
  const withData = new Set((CLUB_SEASON_INDEX[competitionId] ?? []).map((cs) => cs.season));
  return comp.seasons.filter((s) => withData.has(s));
}

export function getClub(id: string): Club | undefined {
  return CLUB_MAP[id];
}

export function getCompetition(id: string): Competition | undefined {
  return COMPETITION_MAP[id];
}

export function totalPlayerCount(): number {
  return ALL_PLAYERS.length;
}
