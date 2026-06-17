/**
 * Convert FIFA Complete Dataset CSV to DreamXI player JSON.
 *
 * Source: https://github.com/4m4n5/fifa18-all-player-statistics
 *         Complete/CompleteDataset.csv (FIFA 18 snapshot, ~17k players)
 *
 * Mapping FIFA attributes → DreamXI six-axis model:
 *   PAC (pace)        = avg(Acceleration, Sprint speed)
 *   SHO (shooting)    = avg(Finishing, Long shots, Shot power, Volleys, Penalties)
 *   PAS (passing)     = avg(Short passing, Long passing, Crossing, Vision)
 *   DRI (dribbling)   = avg(Dribbling, Ball control, Agility, Balance)
 *   DEF (defending)   = avg(Marking, Standing tackle, Sliding tackle, Interceptions)
 *   PHY (physical)    = avg(Strength, Stamina, Jumping, Aggression)
 *
 * Position mapping: FIFA "Preferred Positions" → DreamXI Position codes.
 *
 * Usage: node scripts/convert-fifa-data.mjs
 *   Reads  fifa_complete.csv  (in project root)
 *   Writes src/data/players/fifa-imported.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';

const raw = readFileSync('fifa_complete.csv', 'utf-8');
const records = parse(raw, { columns: true, skip_empty_lines: true });

// FIFA position → DreamXI position mapping
const POS_MAP = {
  GK: 'GK',
  RB: 'RB', RCB: 'CB', CB: 'CB', LCB: 'CB', LB: 'LB',
  RWB: 'RWB', LWB: 'LWB',
  CDM: 'CDM', LDM: 'CDM', RDM: 'CDM',
  CM: 'CM', LCM: 'CM', RCM: 'CM',
  CAM: 'CAM', LAM: 'CAM', RAM: 'CAM',
  LM: 'LM', RM: 'RM',
  LW: 'LW', RW: 'RW',
  CF: 'CF',
  ST: 'ST', LS: 'ST', RS: 'ST',
};

// Club name → DreamXI club ID mapping (only clubs we have in competitions.ts)
const CLUB_MAP = {
  // EPL
  'Manchester United': { id: 'muni', comp: 'epl' },
  'Manchester City': { id: 'mci', comp: 'epl' },
  'Liverpool': { id: 'liv', comp: 'epl' },
  'Chelsea': { id: 'che', comp: 'epl' },
  'Arsenal': { id: 'ars', comp: 'epl' },
  'Tottenham Hotspur': { id: 'tot', comp: 'epl' },
  'Leicester City': { id: 'lei', comp: 'epl' },
  'Everton': { id: 'eve', comp: 'epl' },
  // La Liga
  'FC Barcelona': { id: 'fcb', comp: 'laliga' },
  'Real Madrid CF': { id: 'rma', comp: 'laliga' },
  'Atlético Madrid': { id: 'atm', comp: 'laliga' },
  'Valencia CF': { id: 'val', comp: 'laliga' },
  'Sevilla FC': { id: 'sev', comp: 'laliga' },
  // Serie A
  'Juventus': { id: 'juv', comp: 'seriea' },
  'AC Milan': { id: 'mil', comp: 'seriea' },
  'Inter': { id: 'int', comp: 'seriea' },
  'Napoli': { id: 'nap', comp: 'seriea' },
  'Roma': { id: 'rom', comp: 'seriea' },
  'Lazio': { id: 'laz', comp: 'seriea' },
  // Bundesliga
  'FC Bayern München': { id: 'bay', comp: 'bundesliga' },
  'Borussia Dortmund': { id: 'dor', comp: 'bundesliga' },
  'Bayer 04 Leverkusen': { id: 'lev', comp: 'bundesliga' },
  'Eintracht Frankfurt': { id: 'sge', comp: 'bundesliga' },
};

function avg(...vals) {
  const valid = vals.filter((v) => !isNaN(v));
  return valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 50;
}

function parseNum(s) {
  const n = parseInt(s, 10);
  return isNaN(n) ? 50 : n;
}

// Chinese name translations for well-known players (top 100 or so)
const ZH_NAMES = {
  'L. Messi': '梅西',
  'Cristiano Ronaldo': 'C罗',
  'Neymar Jr': '内马尔',
  'L. Suárez': '苏亚雷斯',
  'R. Lewandowski': '莱万多夫斯基',
  'De Gea': '德赫亚',
  'E. Hazard': '阿扎尔',
  'T. Kroos': '克罗斯',
  'K. De Bruyne': '德布劳内',
  'H. Kane': '凯恩',
  'A. Griezmann': '格列兹曼',
  'G. Bale': '贝尔',
  'S. Agüero': '阿圭罗',
  'M. Neuer': '诺伊尔',
  'T. Courtois': '库尔图瓦',
  'David Silva': '大卫·席尔瓦',
  'J. Boateng': '博阿滕',
  'P. Pogba': '博格巴',
  'G. Higuaín': '伊瓜因',
  'A. Sánchez': '桑切斯',
  'I. Rakitić': '拉基蒂奇',
  'M. Hummels': '胡梅尔斯',
  'L. Modrić': '莫德里奇',
  'M. Salah': '萨拉赫',
  'K. Mbappé': '姆巴佩',
  'A. Alisson': '阿利松',
  'V. van Dijk': '范戴克',
  'E. Can': '埃姆雷·詹',
  'S. Mané': '马内',
  'R. Firmino': '菲尔米诺',
  'P. Aubameyang': '奥巴梅扬',
  'H. Son': '孙兴慜',
  'K. Walker': '沃克',
  'D. Alli': '阿里',
  'C. Eriksen': '埃里克森',
  'H. Lloris': '洛里',
  'D. Godín': '戈丁',
  'J. Oblak': '奥布拉克',
  'K. Navas': '纳瓦斯',
  'S. Umtiti': '乌姆蒂蒂',
  'G. Chiellini': '基耶利尼',
  'L. Bonucci': '博努奇',
  'G. Buffon': '布冯',
  'D. Costa': '道格拉斯·科斯塔',
  'P. Dybala': '迪巴拉',
  'M. Benatia': '贝纳蒂亚',
  'M. Pjanić': '皮亚尼奇',
  'A. Sandro': '阿莱士·桑德罗',
  'M. Reus': '罗伊斯',
  'A. Robben': '罗本',
  'F. Ribéry': '里贝里',
  'J. Rodríguez': 'J罗',
  'T. Müller': '穆勒',
  'M. Götze': '格策',
  'P. Lahm': '拉姆',
  'B. Schweinsteiger': '施魏因斯泰格',
  'F. Neuer': '诺伊尔',
  'M. Verratti': '维拉蒂',
  'Á. Di María': '迪马利亚',
  'Thiago Silva': '蒂亚戈·席尔瓦',
  'Marquinhos': '马尔基尼奥斯',
  'E. Cavani': '卡瓦尼',
  'Kylian Mbappé': '姆巴佩',
  'N. Kanté': '坎特',
  'P. Lahm': '拉姆',
  'M. Özil': '厄齐尔',
  'A. Lacazette': '拉卡泽特',
  'P. Aubameyang': '奥巴梅扬',
  'M. Özil': '厄齐尔',
  'A. Ramsey': '拉姆塞',
  'H. Bellerín': '贝莱林',
  'N. Kanté': '坎特',
  'E. Hazard': '阿扎尔',
  'Willian': '威廉',
  'Pedro': '佩德罗',
  'O. Giroud': '吉鲁',
  'M. Alonso': '马科斯·阿隆索',
  'C. Azpilicueta': '阿斯皮利奎塔',
  'D. Luiz': '大卫·路易斯',
  'T. Bakayoko': '巴卡约科',
  'T. Hazard': '阿扎尔',
  'T. Alexander-Arnold': '阿诺德',
  'A. Robertson': '罗伯逊',
  'V. van Dijk': '范戴克',
  'D. Lovren': '洛夫伦',
  'J. Matip': '马蒂普',
  'A. Wijnaldum': '维纳尔杜姆',
  'J. Henderson': '亨德森',
  'Fabinho': '法比尼奥',
  'Xherdan Shaqiri': '沙奇里',
  'D. Origi': '奥里吉',
  'N. Keïta': '凯塔',
  'A. Lacroix': '拉克鲁瓦',
  'J. Kimmich': '基米希',
  'L. Hernández': '卢卡斯·埃尔南德斯',
  'N. Süle': '聚勒',
  'R. Goretzka': '格雷茨卡',
  'T. Müller': '穆勒',
  'K. Coman': '科曼',
  'S. Gnabry': '格纳布里',
  'J. Sané': '萨内',
  'L. Sané': '萨内',
};

// Nationality translations (common ones)
const ZH_NAT = {
  'Argentina': '阿根廷', 'Brazil': '巴西', 'Portugal': '葡萄牙',
  'France': '法国', 'Germany': '德国', 'Spain': '西班牙',
  'Italy': '意大利', 'England': '英格兰', 'Belgium': '比利时',
  'Netherlands': '荷兰', 'Croatia': '克罗地亚', 'Uruguay': '乌拉圭',
  'Chile': '智利', 'Colombia': '哥伦比亚', 'Mexico': '墨西哥',
  'Poland': '波兰', 'Wales': '威尔士', 'Scotland': '苏格兰',
  'Ireland': '爱尔兰', 'Northern Ireland': '北爱尔兰',
  'Switzerland': '瑞士', 'Austria': '奥地利', 'Sweden': '瑞典',
  'Norway': '挪威', 'Denmark': '丹麦', 'Finland': '芬兰',
  'Czech Republic': '捷克', 'Slovakia': '斯洛伐克', 'Hungary': '匈牙利',
  'Greece': '希腊', 'Turkey': '土耳其', 'Russia': '俄罗斯',
  'Ukraine': '乌克兰', 'Romania': '罗马尼亚', 'Serbia': '塞尔维亚',
  'Bosnia Herzegovina': '波黑', 'Albania': '阿尔巴尼亚',
  'Nigeria': '尼日利亚', 'Ghana': '加纳', 'Senegal': '塞内加尔',
  'Ivory Coast': '科特迪瓦', 'Cameroon': '喀麦隆', 'Morocco': '摩洛哥',
  'Algeria': '阿尔及利亚', 'Tunisia': '突尼斯', 'Egypt': '埃及',
  'South Africa': '南非', 'Gabon': '加蓬',
  'Japan': '日本', 'South Korea': '韩国', 'China PR': '中国',
  'Australia': '澳大利亚', 'Iran': '伊朗', 'Saudi Arabia': '沙特阿拉伯',
  'United States': '美国', 'Canada': '加拿大', 'Costa Rica': '哥斯达黎加',
  'Jamaica': '牙买加', 'Ecuador': '厄瓜多尔', 'Peru': '秘鲁',
  'Paraguay': '巴拉圭', 'Venezuela': '委内瑞拉', 'Bolivia': '玻利维亚',
};

const output = [];
let count = 0;

for (const r of records) {
  const clubName = r['Club']?.trim();
  const clubInfo = CLUB_MAP[clubName];
  if (!clubInfo) continue; // only import players from clubs we support

  const overall = parseNum(r['Overall']);
  if (overall < 75) continue; // only import rated players (reduces size)

  const name = r['Name']?.trim();
  if (!name) continue;

  // Parse positions
  const rawPositions = r['Preferred Positions']?.trim().split(/\s+/) ?? [];
  const positions = rawPositions.map((p) => POS_MAP[p]).filter(Boolean);
  const uniquePositions = [...new Set(positions)];
  if (uniquePositions.length === 0) continue;
  const primaryPos = uniquePositions[0];

  // Compute six-axis attributes
  const pace = avg(parseNum(r['Acceleration']), parseNum(r['Sprint speed']));
  const shooting = avg(
    parseNum(r['Finishing']), parseNum(r['Long shots']),
    parseNum(r['Shot power']), parseNum(r['Volleys']), parseNum(r['Penalties']),
  );
  const passing = avg(
    parseNum(r['Short passing']), parseNum(r['Long passing']),
    parseNum(r['Crossing']), parseNum(r['Vision']),
  );
  const dribbling = avg(
    parseNum(r['Dribbling']), parseNum(r['Ball control']),
    parseNum(r['Agility']), parseNum(r['Balance']),
  );
  const defending = avg(
    parseNum(r['Marking']), parseNum(r['Standing tackle']),
    parseNum(r['Sliding tackle']), parseNum(r['Interceptions']),
  );
  const physical = avg(
    parseNum(r['Strength']), parseNum(r['Stamina']),
    parseNum(r['Jumping']), parseNum(r['Aggression']),
  );

  const nationality = r['Nationality']?.trim() ?? 'Unknown';
  const nationalityZh = ZH_NAT[nationality] ?? nationality;
  const nameZh = ZH_NAMES[name] ?? name;
  const kitNumber = r['Kit Number'] && r['Kit Number'] !== 'nan' ? parseNum(r['Kit Number']) : undefined;

  // Generate stable ID from FIFA ID
  const id = `fifa18-${r['ID']}`;

  output.push(
    `  p(${JSON.stringify(name)}, ${JSON.stringify(nameZh)}, '${primaryPos}', [${uniquePositions.map((p) => `'${p}'`).join(', ')}], '${clubInfo.id}', '2017-18', '${clubInfo.comp}', ${overall}, [${pace}, ${shooting}, ${passing}, ${dribbling}, ${defending}, ${physical}], ${JSON.stringify(nationality)}, ${JSON.stringify(nationalityZh)}${kitNumber ? `, ${kitNumber}` : ''}),`,
  );
  count++;
}

const header = `import type { Player } from '../../types';
import { p } from './_helpers';

// Data source: FIFA 18 Complete Player Dataset (SoFifa snapshot, 2017-18 season)
// https://github.com/4m4n5/fifa18-all-player-statistics
// Attributes mapped from FIFA's 30+ stats to the six-axis model:
//   PAC = avg(Acceleration, Sprint speed)
//   SHO = avg(Finishing, Long shots, Shot power, Volleys, Penalties)
//   PAS = avg(Short passing, Long passing, Crossing, Vision)
//   DRI = avg(Dribbling, Ball control, Agility, Balance)
//   DEF = avg(Marking, Standing tackle, Sliding tackle, Interceptions)
//   PHY = avg(Strength, Stamina, Jumping, Aggression)
// Only players with Overall >= 75 from supported clubs are included.
// Ratings are EA/FIFA attributes, used here for a fan-made game.

export const FIFA_IMPORTED_PLAYERS: Player[] = [
${output.join('\n')}
];
`;

writeFileSync('src/data/players/fifa-imported.ts', header);
console.log(`Imported ${count} players from FIFA 18 dataset`);
