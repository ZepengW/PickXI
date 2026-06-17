import type { Attributes, Player, Position } from '../../types';

// attr order: pace, shooting, passing, dribbling, defending, physical
type AttrTuple = [number, number, number, number, number, number];

let counter = 0;

/**
 * Compact player factory. Generates a stable id from a running counter
 * plus a slug of the name so ids stay readable in devtools.
 */
export function p(
  name: string,
  nameZh: string,
  position: Position,
  positions: Position[],
  clubId: string,
  season: string,
  competitionId: string,
  rating: number,
  attr: AttrTuple,
  nationality: string,
  nationalityZh: string,
  number?: number,
): Player {
  counter += 1;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    id: `${competitionId}-${counter}-${slug}`,
    name,
    nameZh,
    position,
    positions,
    clubId,
    season,
    competitionId,
    rating,
    attr: {
      pace: attr[0],
      shooting: attr[1],
      passing: attr[2],
      dribbling: attr[3],
      defending: attr[4],
      physical: attr[5],
    } satisfies Attributes,
    nationality,
    nationalityZh,
    number,
  };
}
