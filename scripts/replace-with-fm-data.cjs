/**
 * Replace ALL existing player data with FM data from imported JSON files.
 *
 * 1. Reads all JSON files from scripts/fm-import-output/
 * 2. For each league, combines all seasons
 * 3. For each club+season, selects top 11 players by 4-3-3 formation
 * 4. Generates TypeScript files with p() function calls
 * 5. Updates competitions.ts seasons and club strengths
 *
 * Usage: node scripts/replace-with-fm-data.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INPUT_DIR = path.join(ROOT, 'scripts', 'fm-import-output');
const PLAYERS_DIR = path.join(ROOT, 'src', 'data', 'players');
const COMPETITIONS_PATH = path.join(ROOT, 'src', 'data', 'competitions.ts');

// League config
const LEAGUES = {
  epl: { exportName: 'EPL_PLAYERS', fileName: 'epl.ts', teamCount: 20 },
  laliga: { exportName: 'LALIGA_PLAYERS', fileName: 'laliga.ts', teamCount: 20 },
  seriea: { exportName: 'SERIEA_PLAYERS', fileName: 'seriea.ts', teamCount: 20 },
  bundesliga: { exportName: 'BUNDESLIGA_PLAYERS', fileName: 'bundesliga.ts', teamCount: 18 },
};

// 4-3-3 formation slots
const FORMATION_SLOTS = [
  { slot: 'GK',  positions: ['GK'] },
  { slot: 'CB1', positions: ['CB'] },
  { slot: 'CB2', positions: ['CB'] },
  { slot: 'LB',  positions: ['LB', 'LWB'] },
  { slot: 'RB',  positions: ['RB', 'RWB'] },
  { slot: 'CM1', positions: ['CM', 'CDM', 'CAM'] },
  { slot: 'CM2', positions: ['CM', 'CDM', 'CAM'] },
  { slot: 'LW',  positions: ['LW', 'LM'] },
  { slot: 'RW',  positions: ['RW', 'RM'] },
  { slot: 'ST1', positions: ['ST', 'CF'] },
  { slot: 'ST2', positions: ['ST', 'CF'] },
];

// ─── Nationality Chinese translation map ───
const NAT_ZH_MAP = {
  'England': '英格兰', 'Scotland': '苏格兰', 'Wales': '威尔士', 'Ireland': '爱尔兰',
  'France': '法国', 'Germany': '德国', 'Italy': '意大利', 'Spain': '西班牙',
  'Portugal': '葡萄牙', 'Netherlands': '荷兰', 'Belgium': '比利时', 'Brazil': '巴西',
  'Argentina': '阿根廷', 'Uruguay': '乌拉圭', 'Colombia': '哥伦比亚', 'Chile': '智利',
  'Mexico': '墨西哥', 'United States': '美国', 'Canada': '加拿大', 'Japan': '日本',
  'South Korea': '韩国', 'Australia': '澳大利亚', 'Nigeria': '尼日利亚', 'Cameroon': '喀麦隆',
  'Senegal': '塞内加尔', 'Egypt': '埃及', 'Morocco': '摩洛哥', 'Tunisia': '突尼斯',
  'Algeria': '阿尔及利亚', 'Croatia': '克罗地亚', 'Serbia': '塞尔维亚', 'Poland': '波兰',
  'Czech Republic': '捷克', 'Sweden': '瑞典', 'Norway': '挪威', 'Denmark': '丹麦',
  'Switzerland': '瑞士', 'Austria': '奥地利', 'Turkey': '土耳其', 'Russia': '俄罗斯',
  'Ukraine': '乌克兰', 'Romania': '罗马尼亚', 'Hungary': '匈牙利', 'Greece': '希腊',
  'Ivory Coast': '科特迪瓦', 'Ghana': '加纳', 'Paraguay': '巴拉圭', 'Ecuador': '厄瓜多尔',
  'Peru': '秘鲁', 'Venezuela': '委内瑞拉', 'Costa Rica': '哥斯达黎加', 'Jamaica': '牙买加',
  'China PR': '中国', 'Saudi Arabia': '沙特阿拉伯', 'Iran': '伊朗', 'Georgia': '格鲁吉亚',
  'Slovakia': '斯洛伐克', 'Slovenia': '斯洛文尼亚', 'Bosnia and Herzegovina': '波黑',
  'Montenegro': '黑山', 'Kosovo': '科索沃', 'Finland': '芬兰', 'Iceland': '冰岛',
  'Northern Ireland': '北爱尔兰', 'DR Congo': '民主刚果', 'Zambia': '赞比亚',
  'Trinidad and Tobago': '特立尼达', 'Albania': '阿尔巴尼亚', 'North Macedonia': '北马其顿',
  'Bulgaria': '保加利亚', 'Suriname': '苏里南', 'Mali': '马里', 'Guinea': '几内亚',
  'GAB': '加蓬', 'TTO': '特立尼达',
};

// ─── Club name → Chinese name map (for comments) ───
const CLUB_NAME_ZH = {
  'muni': '曼联', 'ars': '阿森纳', 'che': '切尔西', 'liv': '利物浦',
  'mci': '曼城', 'tot': '热刺', 'blc': '布莱克本', 'lei': '莱斯特城',
  'eve': '埃弗顿', 'new': '纽卡斯尔', 'wlv': '狼队', 'whu': '西汉姆联',
  'cry': '水晶宫', 'bou': '伯恩茅斯', 'ful': '富勒姆', 'bri': '布莱顿',
  'ast': '阿斯顿维拉', 'sou': '南安普顿', 'nor': '诺维奇', 'wat': '沃特福德',
  'bur': '伯恩利', 'lee': '利兹联', 'shu': '谢菲尔德联', 'bre': '布伦特福德',
  'nfo': '诺丁汉森林', 'wba': '西布朗', 'stk': '斯托克城', 'swa': '斯旺西',
  'sun': '桑德兰', 'hul': '赫尔城', 'car': '卡迪夫城', 'hud': '哈德斯菲尔德',
  'qpr': 'QPR', 'mbo': '米德尔斯堡',
  'bar': '巴塞罗那', 'rma': '皇家马德里', 'atm': '马德里竞技', 'val': '瓦伦西亚',
  'sev': '塞维利亚', 'ath': '毕尔巴鄂竞技', 'soc': '皇家社会', 'vil': '比利亚雷亚尔',
  'bet': '皇家贝蒂斯', 'get': '赫塔菲', 'esp': '西班牙人', 'osa': '奥萨苏纳',
  'cad': '加的斯', 'cel': '塞尔塔', 'gra': '格拉纳达', 'mal': '马洛卡',
  'ray': '巴列卡诺', 'ala': '阿拉维斯', 'lev': '莱万特', 'val2': '巴拉多利德',
  'mlg': '马拉加', 'gir': '赫罗纳', 'elc': '埃尔切', 'hsc': '韦斯卡',
  'alm': '阿尔梅里亚', 'dep': '拉科鲁尼亚', 'eib': '埃瓦尔', 'lpa': '拉斯帕尔马斯',
  'leg': '莱加内斯',
  'juv': '尤文图斯', 'mil': 'AC米兰', 'int': '国际米兰', 'nap': '那不勒斯',
  'rom': '罗马', 'laz': '拉齐奥', 'ata': '亚特兰大', 'fio': '佛罗伦萨',
  'tor': '都灵', 'bol': '博洛尼亚', 'sas': '萨索洛', 'udc': '乌迪内斯',
  'sam': '桑普多利亚', 'gen': '热那亚', 'ver': '维罗纳', 'cag': '卡利亚里',
  'emp': '恩波利', 'lec': '莱切', 'spe': '斯佩齐亚', 'sal': '萨勒尼塔纳',
  'par': '帕尔马', 'mnz': '蒙扎', 'crm': '克雷莫内塞', 'chi': '切沃',
  'bnv': '贝内文托', 'crt': '克罗托内', 'spl': '斯帕尔', 'brc': '布雷西亚',
  'vnz': '威尼斯',
  'bay': '拜仁慕尼黑', 'dor': '多特蒙德', 'lev': '勒沃库森', 'sge': '法兰克福',
  'wol': '沃尔夫斯堡', 'fre': '弗赖堡', 'mai': '美因茨', 'glb': '门兴',
  'hof': '霍芬海姆', 'lei2': '莱比锡', 'uni': '柏林联合', 'boe': '波鸿',
  'brem': '不来梅', 'stu': '斯图加特', 'aug': '奥格斯堡', 'her': '柏林赫塔',
  'sch': '沙尔克04', 'kol': '科隆', 'ham': '汉堡', 'h96': '汉诺威96',
  'bie': '比勒费尔德', 'dus': '杜塞尔多夫', 'fut': '菲尔特', 'pad': '帕德博恩',
  'stp': '圣保利', 'nur': '纽伦堡', 'kai': '凯泽斯劳滕',
};

// ─── Club display name map (for comments) ───
const CLUB_DISPLAY_NAME = {
  'muni': 'Manchester United', 'ars': 'Arsenal', 'che': 'Chelsea', 'liv': 'Liverpool',
  'mci': 'Manchester City', 'tot': 'Tottenham', 'blc': 'Blackburn', 'lei': 'Leicester',
  'eve': 'Everton', 'new': 'Newcastle', 'wlv': 'Wolves', 'whu': 'West Ham',
  'cry': 'Crystal Palace', 'bou': 'Bournemouth', 'ful': 'Fulham', 'bri': 'Brighton',
  'ast': 'Aston Villa', 'sou': 'Southampton', 'nor': 'Norwich', 'wat': 'Watford',
  'bur': 'Burnley', 'lee': 'Leeds', 'shu': 'Sheffield Utd', 'bre': 'Brentford',
  'nfo': "Nott'm Forest", 'wba': 'West Brom', 'stk': 'Stoke', 'swa': 'Swansea',
  'sun': 'Sunderland', 'hul': 'Hull', 'car': 'Cardiff', 'hud': 'Huddersfield',
  'qpr': 'QPR', 'mbo': 'Middlesbrough',
  'bar': 'Barcelona', 'rma': 'Real Madrid', 'atm': 'Atlético Madrid', 'val': 'Valencia',
  'sev': 'Sevilla', 'ath': 'Athletic Bilbao', 'soc': 'Real Sociedad', 'vil': 'Villarreal',
  'bet': 'Real Betis', 'get': 'Getafe', 'esp': 'Espanyol', 'osa': 'Osasuna',
  'cad': 'Cádiz', 'cel': 'Celta Vigo', 'gra': 'Granada', 'mal': 'Mallorca',
  'ray': 'Rayo Vallecano', 'ala': 'Alavés', 'lev': 'Levante', 'val2': 'Valladolid',
  'mlg': 'Málaga', 'gir': 'Girona', 'elc': 'Elche', 'hsc': 'Huesca',
  'alm': 'Almería', 'dep': 'Deportivo', 'eib': 'Eibar', 'lpa': 'Las Palmas',
  'leg': 'Leganés',
  'juv': 'Juventus', 'mil': 'AC Milan', 'int': 'Inter', 'nap': 'Napoli',
  'rom': 'Roma', 'laz': 'Lazio', 'ata': 'Atalanta', 'fio': 'Fiorentina',
  'tor': 'Torino', 'bol': 'Bologna', 'sas': 'Sassuolo', 'udc': 'Udinese',
  'sam': 'Sampdoria', 'gen': 'Genoa', 'ver': 'Hellas Verona', 'cag': 'Cagliari',
  'emp': 'Empoli', 'lec': 'Lecce', 'spe': 'Spezia', 'sal': 'Salernitana',
  'par': 'Parma', 'mnz': 'Monza', 'crm': 'Cremonese', 'chi': 'Chievo',
  'bnv': 'Benevento', 'crt': 'Crotone', 'spl': 'SPAL', 'brc': 'Brescia',
  'vnz': 'Venezia',
  'bay': 'Bayern', 'dor': 'Dortmund', 'sge': 'Frankfurt', 'wol': 'Wolfsburg',
  'fre': 'Freiburg', 'mai': 'Mainz', 'glb': 'Gladbach', 'hof': 'Hoffenheim',
  'lei2': 'Leipzig', 'uni': 'Union Berlin', 'boe': 'Bochum', 'brem': 'Bremen',
  'stu': 'Stuttgart', 'aug': 'Augsburg', 'her': 'Hertha', 'sch': 'Schalke',
  'kol': 'Köln', 'ham': 'Hamburg', 'h96': 'Hannover 96', 'bie': 'Bielefeld',
  'dus': 'Düsseldorf', 'fut': 'Fürth', 'pad': 'Paderborn', 'stp': 'St. Pauli',
  'nur': 'Nürnberg', 'kai': 'Kaiserslautern',
};

/**
 * Select top 11 players for a club+season using 4-3-3 formation logic.
 */
function selectTop11(players) {
  const selected = [];
  const used = new Set();

  for (const slot of FORMATION_SLOTS) {
    // Try to find best player whose primary position matches
    let best = null;
    let bestRating = -1;

    for (let i = 0; i < players.length; i++) {
      if (used.has(i)) continue;
      const p = players[i];
      if (slot.positions.includes(p.position)) {
        if (p.rating > bestRating) {
          bestRating = p.rating;
          best = i;
        }
      }
    }

    // If no primary match, try positions array
    if (best === null) {
      for (let i = 0; i < players.length; i++) {
        if (used.has(i)) continue;
        const p = players[i];
        const hasSlotPos = p.positions.some(pos => slot.positions.includes(pos));
        if (hasSlotPos) {
          if (p.rating > bestRating) {
            bestRating = p.rating;
            best = i;
          }
        }
      }
    }

    // If still no match, pick best remaining player
    if (best === null) {
      for (let i = 0; i < players.length; i++) {
        if (used.has(i)) continue;
        if (players[i].rating > bestRating) {
          bestRating = players[i].rating;
          best = i;
        }
      }
    }

    if (best !== null) {
      selected.push(players[best]);
      used.add(best);
    }
  }

  return selected;
}

/**
 * Escape a string for use in a single-quoted TS string literal.
 */
function escStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Generate a p() call string for a player.
 */
function playerToPCall(player) {
  const a = player.attr;
  const attrArr = `[${a.pace},${a.shooting},${a.passing},${a.dribbling},${a.defending},${a.physical}]`;
  const positionsStr = `[${player.positions.map(p => `'${p}'`).join(', ')}]`;
  const natZh = player.nationalityZh || NAT_ZH_MAP[player.nationality] || player.nationality;
  const nat = player.nationality;

  return `  p('${escStr(player.name)}', '${escStr(player.nameZh || player.name)}', '${player.position}', ${positionsStr}, '${player.clubId}', '${player.season}', '${player.competitionId}', ${player.rating}, ${attrArr}, '${escStr(nat)}', '${escStr(natZh)}')`;
}

/**
 * Generate the full TypeScript file content for a league.
 */
function generateLeagueFile(competitionId, players) {
  const league = LEAGUES[competitionId];
  const header = `import type { Player } from '../../types';
import { p } from './_helpers';

// FM data — ${competitionId.toUpperCase()} players from 2019-20 to 2022-23.
// Ratings use curved FM-converted scale (FM 1→15, FM 10→58, FM 15→80, FM 20→99).
export const ${league.exportName}: Player[] = [`;

  // Group players by club+season
  const groups = {};
  for (const player of players) {
    const key = `${player.clubId}|${player.season}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(player);
  }

  // Sort groups: by season first, then by clubId
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    const [clubA, seasonA] = a.split('|');
    const [clubB, seasonB] = b.split('|');
    if (seasonA !== seasonB) return seasonA.localeCompare(seasonB);
    return clubA.localeCompare(clubB);
  });

  const entries = [];
  for (const key of sortedKeys) {
    const [clubId, season] = key.split('|');
    const clubName = CLUB_DISPLAY_NAME[clubId] || clubId;
    const clubNameZh = CLUB_NAME_ZH[clubId] || clubId;
    entries.push(`\n  // ===== ${clubName} ${season} =====`);
    const groupPlayers = groups[key].sort((a, b) => b.rating - a.rating);
    for (const player of groupPlayers) {
      entries.push(playerToPCall(player) + ',');
    }
  }

  return header + entries.join('\n') + '\n];\n';
}

/**
 * Read all FM JSON files and return players grouped by competition.
 */
function loadFMData() {
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'));
  const byCompetition = {};

  console.log(`Found ${files.length} JSON files in ${INPUT_DIR}`);

  for (const file of files) {
    const filePath = path.join(INPUT_DIR, file);
    const players = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`  ${file}: ${players.length} players`);

    for (const player of players) {
      const comp = player.competitionId;
      if (!byCompetition[comp]) byCompetition[comp] = [];
      byCompetition[comp].push(player);
    }
  }

  return byCompetition;
}

/**
 * Process a competition: select top 11 per club+season, return selected players.
 */
function processCompetition(competitionId, allPlayers) {
  // Group by club+season
  const groups = {};
  for (const player of allPlayers) {
    const key = `${player.clubId}|${player.season}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(player);
  }

  const selected = [];
  const seasonClubCounts = {}; // season → Set of clubIds with 11 players

  for (const [key, players] of Object.entries(groups)) {
    const [clubId, season] = key.split('|');
    // Sort by rating descending for selection
    const sorted = [...players].sort((a, b) => b.rating - a.rating);
    const top11 = selectTop11(sorted);
    selected.push(...top11);

    if (top11.length >= 11) {
      if (!seasonClubCounts[season]) seasonClubCounts[season] = new Set();
      seasonClubCounts[season].add(clubId);
    }
  }

  // Determine which seasons have sufficient data (at least 15 clubs with 11 players)
  const validSeasons = [];
  for (const [season, clubs] of Object.entries(seasonClubCounts)) {
    console.log(`  ${competitionId} ${season}: ${clubs.size} clubs with 11 players`);
    if (clubs.size >= 15) {
      validSeasons.push(season);
    }
  }
  validSeasons.sort();

  return { selected, validSeasons, seasonClubCounts };
}

/**
 * Calculate club strength from player data.
 * For each club, average rating of top 11 players across all seasons.
 */
function calculateClubStrengths(competitionId, allPlayers) {
  // Group by club
  const clubPlayers = {};
  for (const player of allPlayers) {
    if (!clubPlayers[player.clubId]) clubPlayers[player.clubId] = [];
    clubPlayers[player.clubId].push(player);
  }

  const strengths = {};
  for (const [clubId, players] of Object.entries(clubPlayers)) {
    // Get top 11 by rating
    const sorted = [...players].sort((a, b) => b.rating - a.rating);
    const top11 = sorted.slice(0, 11);
    const avgRating = top11.reduce((sum, p) => sum + p.rating, 0) / top11.length;
    // Scale: FM avg ~55-65 → strength should be in similar range
    // Round to nearest integer
    strengths[clubId] = Math.round(avgRating);
  }

  return strengths;
}

/**
 * Update competitions.ts with new seasons and club strengths.
 */
function updateCompetitionsTs(leagueSeasons, clubStrengths) {
  let content = fs.readFileSync(COMPETITIONS_PATH, 'utf-8');

  // Update seasons for each league
  for (const [competitionId, seasons] of Object.entries(leagueSeasons)) {
    if (seasons.length === 0) continue;

    const seasonsStr = seasons.map(s => `'${s}'`).join(', ');

    // Find and replace the seasons array for this competition
    // Pattern: look for the competition id, then find the seasons array
    const compRegex = new RegExp(
      `(id:\\s*'${competitionId}'[\\s\\S]*?seasons:\\s*\\[)[^\\]]*?(\\])`,
      'm'
    );

    const match = content.match(compRegex);
    if (match) {
      content = content.replace(compRegex, `$1${seasonsStr}$2`);
      console.log(`  Updated ${competitionId} seasons: [${seasonsStr}]`);
    } else {
      console.log(`  WARNING: Could not find seasons for ${competitionId}`);
    }
  }

  // Update club strengths
  for (const [clubId, strength] of Object.entries(clubStrengths)) {
    // Find the club entry and update its strength
    // Pattern: { id: 'clubId', ... strength: old }
    const clubRegex = new RegExp(
      `(\\{\\s*id:\\s*'${clubId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?strength:\\s*)\\d+`
    );

    const match = content.match(clubRegex);
    if (match) {
      content = content.replace(clubRegex, `$1${strength}`);
    }
  }
  console.log('  Updated club strengths');

  // Update SEASON_CLUBS
  for (const [competitionId, seasonData] of Object.entries(leagueSeasons)) {
    if (!seasonData || seasonData.length === 0) continue;

    // We need the seasonClubCounts for this competition
    // This will be passed separately
  }

  fs.writeFileSync(COMPETITIONS_PATH, content, 'utf-8');
  console.log(`  Written ${COMPETITIONS_PATH}`);
}

/**
 * Update SEASON_CLUBS in competitions.ts based on actual player data.
 */
function updateSeasonClubs(leagueSeasonClubCounts) {
  let content = fs.readFileSync(COMPETITIONS_PATH, 'utf-8');

  for (const [competitionId, seasonClubCounts] of Object.entries(leagueSeasonClubCounts)) {
    // Build the new SEASON_CLUBS entry for this competition
    const seasonEntries = [];
    const sortedSeasons = Object.keys(seasonClubCounts).sort();
    for (const season of sortedSeasons) {
      const clubIds = [...seasonClubCounts[season]].sort();
      if (clubIds.length >= 15) { // Only include seasons with enough clubs
        seasonEntries.push(`    '${season}': [${clubIds.map(c => `'${c}'`).join(',')}]`);
      }
    }

    if (seasonEntries.length === 0) continue;

    const newEntry = `  ${competitionId}: {\n${seasonEntries.join(',\n')}\n  }`;

    // Find and replace the SEASON_CLUBS entry for this competition
    // Pattern: competitionId: { ... }
    const scRegex = new RegExp(
      `(${competitionId}:\\s*\\{)[^}]*?(\\})`,
      's'
    );

    const match = content.match(scRegex);
    if (match) {
      content = content.replace(scRegex, newEntry);
      console.log(`  Updated SEASON_CLUBS for ${competitionId}`);
    } else {
      console.log(`  WARNING: Could not find SEASON_CLUBS for ${competitionId}`);
    }
  }

  fs.writeFileSync(COMPETITIONS_PATH, content, 'utf-8');
}

// ─── Main ───
function main() {
  console.log('=== Replace Player Data with FM Data ===\n');

  // 1. Load all FM JSON data
  const allData = loadFMData();

  const leagueSeasons = {};
  const leagueSeasonClubCounts = {};
  const allClubStrengths = {};

  // 2. Process each league
  for (const [competitionId, config] of Object.entries(LEAGUES)) {
    console.log(`\n--- Processing ${competitionId} ---`);

    if (!allData[competitionId]) {
      console.log(`  No data for ${competitionId}, skipping`);
      continue;
    }

    const players = allData[competitionId];
    console.log(`  Total players: ${players.length}`);

    // Count unique clubs and seasons
    const clubs = new Set(players.map(p => p.clubId));
    const seasons = new Set(players.map(p => p.season));
    console.log(`  Unique clubs: ${clubs.size}, Unique seasons: ${seasons.size}`);

    // Select top 11 per club+season
    const { selected, validSeasons, seasonClubCounts } = processCompetition(competitionId, players);
    console.log(`  Selected ${selected.length} players (top 11 per club+season)`);
    console.log(`  Valid seasons (≥15 clubs): [${validSeasons.join(', ')}]`);

    leagueSeasons[competitionId] = validSeasons;
    leagueSeasonClubCounts[competitionId] = seasonClubCounts;

    // Calculate club strengths
    const strengths = calculateClubStrengths(competitionId, selected);
    Object.assign(allClubStrengths, strengths);

    // Generate TypeScript file
    const fileContent = generateLeagueFile(competitionId, selected);
    const outputPath = path.join(PLAYERS_DIR, config.fileName);
    fs.writeFileSync(outputPath, fileContent, 'utf-8');
    console.log(`  Written ${outputPath} (${selected.length} players)`);
  }

  // 3. Update competitions.ts
  console.log('\n--- Updating competitions.ts ---');
  updateCompetitionsTs(leagueSeasons, allClubStrengths);

  // 4. Update SEASON_CLUBS
  console.log('\n--- Updating SEASON_CLUBS ---');
  updateSeasonClubs(leagueSeasonClubCounts);

  console.log('\n=== Done! ===');
  console.log('\nSummary:');
  for (const [compId, seasons] of Object.entries(leagueSeasons)) {
    console.log(`  ${compId}: seasons [${seasons.join(', ')}]`);
  }
  console.log(`  Total club strengths updated: ${Object.keys(allClubStrengths).length}`);
}

main();
