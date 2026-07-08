// Convert FM import JSON output into TS player files using the p() factory.
// Filters: rating >= 10, min 7 players per club-season, top 18 per club.
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, 'fm-import-output');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'players');

const LEAGUES = [
  { id: 'eredivisie', exportName: 'EREDIVISIE_PLAYERS', label: 'Eredivisie' },
  { id: 'primeira', exportName: 'PRIMEIRA_PLAYERS', label: 'Primeira Liga' },
  { id: 'spl', exportName: 'SPL_PLAYERS', label: 'Scottish Premiership' },
  { id: 'superlig', exportName: 'SUPERLIG_PLAYERS', label: 'Süper Lig' },
  { id: 'gsl', exportName: 'GSL_PLAYERS', label: 'Greek Super League' },
];

const SEASONS = ['2019-20', '2020-21', '2021-22', '2022-23'];
const SEASON_FILES = {
  '2019-20': 'fm20data.csv',
  '2020-21': 'fm21data.csv',
  '2021-22': 'fm22data.csv',
  '2022-23': 'fm2023.csv',
};

const MIN_RATING = 10;
const MIN_PER_CLUB_SEASON = 7;
const MAX_PER_CLUB = 18;

/** Escape a string for use in a single-quoted JS literal. */
function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** Format a player as a p() call. */
function formatPlayer(pl) {
  const attr = `[${pl.attr.pace},${pl.attr.shooting},${pl.attr.passing},${pl.attr.dribbling},${pl.attr.defending},${pl.attr.physical}]`;
  const positions = `[${pl.positions.map((p) => `'${p}'`).join(', ')}]`;
  const parts = [
    `'${esc(pl.name)}'`,
    `'${esc(pl.nameZh)}'`,
    `'${pl.position}'`,
    positions,
    `'${pl.clubId}'`,
    `'${pl.season}'`,
    `'${pl.competitionId}'`,
    String(pl.rating),
    attr,
    `'${esc(pl.nationality)}'`,
    `'${esc(pl.nationalityZh)}'`,
  ];
  if (pl.number != null) parts.push(String(pl.number));
  return `  p(${parts.join(', ')}),`;
}

/** Sort players within a club-season for stable output:
 *  by rating desc, then name asc. */
function sortPlayers(arr) {
  return arr.slice().sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });
}

/** Group players by clubId. */
function groupByClub(players) {
  const map = {};
  for (const p of players) {
    (map[p.clubId] ??= []).push(p);
  }
  return map;
}

for (const league of LEAGUES) {
  const allPlayers = [];
  const seasonGroups = []; // [{ season, clubMap }]
  for (const season of SEASONS) {
    const file = path.join(INPUT_DIR, `fm-${league.id}-${season.replace('-', '_')}.json`);
    if (!fs.existsSync(file)) {
      console.warn(`Missing: ${file}`);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const filtered = data.filter((p) => p.rating >= MIN_RATING);
    const clubMap = groupByClub(filtered);
    // Apply min players per club-season filter
    const kept = {};
    for (const [clubId, list] of Object.entries(clubMap)) {
      if (list.length >= MIN_PER_CLUB_SEASON) {
        const sorted = sortPlayers(list).slice(0, MAX_PER_CLUB);
        kept[clubId] = sorted;
        allPlayers.push(...sorted);
      }
    }
    seasonGroups.push({ season, clubMap: kept });
  }

  // Build TS file content
  const lines = [];
  lines.push("import type { Player } from '../../types';");
  lines.push("import { p } from './_helpers';");
  lines.push('');
  lines.push(`// FM data — ${league.label} players from 2019-20 to 2022-23.`);
  lines.push('// Ratings use FM native 1-20 scale (no conversion to 1-99).');
  lines.push(`export const ${league.exportName}: Player[] = [`);

  for (const { season, clubMap } of seasonGroups) {
    const clubIds = Object.keys(clubMap).sort();
    for (const clubId of clubIds) {
      lines.push(`  // ===== ${clubId} ${season} =====`);
      for (const pl of clubMap[clubId]) {
        lines.push(formatPlayer(pl));
      }
      lines.push('');
    }
  }

  lines.push('];');
  lines.push('');

  const outPath = path.join(OUTPUT_DIR, `${league.id}.ts`);
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(
    `${league.id}: ${allPlayers.length} players → ${outPath}`,
  );
}

console.log('Done.');
