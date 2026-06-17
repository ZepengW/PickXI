import type { Club, Competition, Player } from '../types';
import { CLUBS, CLUB_MAP, COMPETITIONS, COMPETITION_MAP, clubsForCompetition } from './competitions';
import { FORMATIONS, getFormation } from './formations';
import { EPL_PLAYERS } from './players/epl';
import { LALIGA_PLAYERS } from './players/laliga';
import { CSL_PLAYERS } from './players/csl';
import { UCL_PLAYERS } from './players/ucl';
import { WC_PLAYERS } from './players/worldcup';

export const ALL_PLAYERS: Player[] = [
  ...EPL_PLAYERS,
  ...LALIGA_PLAYERS,
  ...CSL_PLAYERS,
  ...UCL_PLAYERS,
  ...WC_PLAYERS,
];

export { COMPETITIONS, COMPETITION_MAP, CLUBS, CLUB_MAP, clubsForCompetition, FORMATIONS, getFormation };

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

/** All draftable club-seasons for a competition, optionally filtered to a season range. */
export function clubSeasonsFor(
  competitionId: string,
  seasonRange?: [string, string],
): ClubSeason[] {
  const all = CLUB_SEASON_INDEX[competitionId] ?? [];
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
