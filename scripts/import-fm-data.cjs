/**
 * FM Data Import Script
 *
 * Reads FM CSV data (fm2023.csv, fm22data.csv, fm21data.csv, fm20data.csv),
 * Maps FM attributes using FM's native 1-20 scale directly (no conversion to 1-99).
 * divisions, and clubs, then outputs JSON files per league+season.
 *
 * CRITICAL: fm22data.csv has unquoted Position fields with commas
 * (e.g. "AM (RC), ST (C)") which breaks standard CSV parsing.
 * We use a robust line-by-line parser that reads attributes from the END
 * of each line (attributes are always the last ~40 columns).
 *
 * Usage: node scripts/import-fm-data.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CSV_DIR = path.join(ROOT, 'download_datasets', 'FM150k_extracted');
const OUTPUT_DIR = path.join(ROOT, 'scripts', 'fm-import-output');

// ─── FM file → season mapping ───
const FM_FILES = [
  { file: 'fm2023.csv', season: '2022-23' },
  { file: 'fm22data.csv', season: '2021-22' },
  { file: 'fm21data.csv', season: '2020-21' },
  { file: 'fm20data.csv', season: '2019-20' },
];

// ─── FM Division → project competition ID ───
const DIVISION_MAP = {
  'Premier League': 'epl',
  'English Premier Division': 'epl',
  'La Liga': 'laliga',
  'LaLiga Santander': 'laliga',
  'Spanish First Division': 'laliga',
  'Serie A': 'seriea',
  'Italian Serie A': 'seriea',
  'Serie A TIM': 'seriea',
  'Bundesliga': 'bundesliga',
};

// ─── FM Position → project position mapping ───
const POSITION_MAP = {
  'GK':       { position: 'GK',  positions: ['GK'] },
  'D (C)':    { position: 'CB',  positions: ['CB'] },
  'D (L)':    { position: 'LB',  positions: ['LB'] },
  'D (R)':    { position: 'RB',  positions: ['RB'] },
  'D (LC)':   { position: 'CB',  positions: ['CB', 'LB'] },
  'D (RC)':   { position: 'CB',  positions: ['CB', 'RB'] },
  'D (RL)':   { position: 'LB',  positions: ['LB', 'RB'] },
  'D (RLC)':  { position: 'CB',  positions: ['CB', 'LB', 'RB'] },
  'WB (L)':   { position: 'LWB', positions: ['LWB', 'LB'] },
  'WB (R)':   { position: 'RWB', positions: ['RWB', 'RB'] },
  'DM':       { position: 'CDM', positions: ['CDM'] },
  'M (C)':    { position: 'CM',  positions: ['CM'] },
  'M (L)':    { position: 'LM',  positions: ['LM', 'LW'] },
  'M (R)':    { position: 'RM',  positions: ['RM', 'RW'] },
  'M (LC)':   { position: 'CM',  positions: ['CM', 'CDM', 'LM'] },
  'M (RC)':   { position: 'CM',  positions: ['CM', 'CDM', 'RM'] },
  'AM (C)':   { position: 'CAM', positions: ['CAM'] },
  'AM (L)':   { position: 'LW',  positions: ['LW', 'LM'] },
  'AM (R)':   { position: 'RW',  positions: ['RW', 'RM'] },
  'AM (LC)':  { position: 'CAM', positions: ['CAM', 'CM', 'LW'] },
  'AM (RC)':  { position: 'CAM', positions: ['CAM', 'CM', 'RW'] },
  'AM (RLC)': { position: 'CAM', positions: ['CAM', 'CM', 'LW', 'RW'] },
  'ST (C)':   { position: 'ST',  positions: ['ST'] },
  'AM/S (C)': { position: 'ST',  positions: ['ST', 'CAM'] },
  'M/AM (C)':  { position: 'CM',  positions: ['CM', 'CAM'] },
  'M/AM (LC)': { position: 'CM',  positions: ['CM', 'CAM', 'LM'] },
  'M/AM (RC)': { position: 'CM',  positions: ['CM', 'CAM', 'RM'] },
  'M/AM (RLC)':{ position: 'CM',  positions: ['CM', 'CAM', 'LM', 'RM'] },
  'D/WB (L)':  { position: 'LB',  positions: ['LB', 'LWB'] },
  'D/WB (R)':  { position: 'RB',  positions: ['RB', 'RWB'] },
  'D/M (C)':   { position: 'CDM', positions: ['CDM', 'CB'] },
  'D/M (LC)':  { position: 'CDM', positions: ['CDM', 'CB', 'LB'] },
  'D/M (RC)':  { position: 'CDM', positions: ['CDM', 'CB', 'RB'] },
  'AM/S (LC)': { position: 'LW',  positions: ['LW', 'ST', 'CAM'] },
  'AM/S (RC)': { position: 'RW',  positions: ['RW', 'ST', 'CAM'] },
  'AM/S (RLC)':{ position: 'CAM', positions: ['CAM', 'ST', 'LW', 'RW'] },
};

// ─── Club data (from competitions.ts) ───
const CLUBS = [
  // EPL
  { id: 'muni', name: 'Manchester United', shortName: 'Man Utd', competitionId: 'epl' },
  { id: 'ars', name: 'Arsenal', shortName: 'Arsenal', competitionId: 'epl' },
  { id: 'che', name: 'Chelsea', shortName: 'Chelsea', competitionId: 'epl' },
  { id: 'liv', name: 'Liverpool', shortName: 'Liverpool', competitionId: 'epl' },
  { id: 'mci', name: 'Manchester City', shortName: 'Man City', competitionId: 'epl' },
  { id: 'tot', name: 'Tottenham Hotspur', shortName: 'Spurs', competitionId: 'epl' },
  { id: 'blc', name: 'Blackburn Rovers', shortName: 'Blackburn', competitionId: 'epl' },
  { id: 'lei', name: 'Leicester City', shortName: 'Leicester', competitionId: 'epl' },
  { id: 'eve', name: 'Everton', shortName: 'Everton', competitionId: 'epl' },
  { id: 'new', name: 'Newcastle United', shortName: 'Newcastle', competitionId: 'epl' },
  { id: 'wlv', name: 'Wolverhampton', shortName: 'Wolves', competitionId: 'epl' },
  { id: 'whu', name: 'West Ham United', shortName: 'West Ham', competitionId: 'epl' },
  { id: 'cry', name: 'Crystal Palace', shortName: 'Palace', competitionId: 'epl' },
  { id: 'bou', name: 'Bournemouth', shortName: 'Bournemouth', competitionId: 'epl' },
  { id: 'ful', name: 'Fulham', shortName: 'Fulham', competitionId: 'epl' },
  { id: 'bri', name: 'Brighton', shortName: 'Brighton', competitionId: 'epl' },
  { id: 'ast', name: 'Aston Villa', shortName: 'Villa', competitionId: 'epl' },
  { id: 'sou', name: 'Southampton', shortName: 'Southampton', competitionId: 'epl' },
  { id: 'nor', name: 'Norwich City', shortName: 'Norwich', competitionId: 'epl' },
  { id: 'wat', name: 'Watford', shortName: 'Watford', competitionId: 'epl' },
  { id: 'bur', name: 'Burnley', shortName: 'Burnley', competitionId: 'epl' },
  { id: 'lee', name: 'Leeds United', shortName: 'Leeds', competitionId: 'epl' },
  { id: 'shu', name: 'Sheffield United', shortName: 'Sheff Utd', competitionId: 'epl' },
  { id: 'bre', name: 'Brentford', shortName: 'Brentford', competitionId: 'epl' },
  { id: 'nfo', name: 'Nottingham Forest', shortName: "Nott'm Forest", competitionId: 'epl' },
  { id: 'wba', name: 'West Bromwich Albion', shortName: 'West Brom', competitionId: 'epl' },
  { id: 'stk', name: 'Stoke City', shortName: 'Stoke', competitionId: 'epl' },
  { id: 'swa', name: 'Swansea City', shortName: 'Swansea', competitionId: 'epl' },
  { id: 'sun', name: 'Sunderland', shortName: 'Sunderland', competitionId: 'epl' },
  { id: 'hul', name: 'Hull City', shortName: 'Hull', competitionId: 'epl' },
  { id: 'car', name: 'Cardiff City', shortName: 'Cardiff', competitionId: 'epl' },
  { id: 'hud', name: 'Huddersfield Town', shortName: 'Huddersfield', competitionId: 'epl' },
  { id: 'qpr', name: 'Queens Park Rangers', shortName: 'QPR', competitionId: 'epl' },
  { id: 'mbo', name: 'Middlesbrough', shortName: 'Middlesbrough', competitionId: 'epl' },
  // La Liga
  { id: 'bar', name: 'FC Barcelona', shortName: 'Barça', competitionId: 'laliga' },
  { id: 'rma', name: 'Real Madrid', shortName: 'Real Madrid', competitionId: 'laliga' },
  { id: 'atm', name: 'Atlético Madrid', shortName: 'Atlético', competitionId: 'laliga' },
  { id: 'val', name: 'Valencia', shortName: 'Valencia', competitionId: 'laliga' },
  { id: 'sev', name: 'Sevilla', shortName: 'Sevilla', competitionId: 'laliga' },
  { id: 'ath', name: 'Athletic Bilbao', shortName: 'Athletic', competitionId: 'laliga' },
  { id: 'soc', name: 'Real Sociedad', shortName: 'Sociedad', competitionId: 'laliga' },
  { id: 'vil', name: 'Villarreal', shortName: 'Villarreal', competitionId: 'laliga' },
  { id: 'bet', name: 'Real Betis', shortName: 'Betis', competitionId: 'laliga' },
  { id: 'get', name: 'Getafe', shortName: 'Getafe', competitionId: 'laliga' },
  { id: 'esp', name: 'Espanyol', shortName: 'Espanyol', competitionId: 'laliga' },
  { id: 'osa', name: 'Osasuna', shortName: 'Osasuna', competitionId: 'laliga' },
  { id: 'cad', name: 'Cádiz', shortName: 'Cádiz', competitionId: 'laliga' },
  { id: 'cel', name: 'Celta Vigo', shortName: 'Celta', competitionId: 'laliga' },
  { id: 'gra', name: 'Granada', shortName: 'Granada', competitionId: 'laliga' },
  { id: 'mal', name: 'Mallorca', shortName: 'Mallorca', competitionId: 'laliga' },
  { id: 'ray', name: 'Rayo Vallecano', shortName: 'Rayo', competitionId: 'laliga' },
  { id: 'ala', name: 'Alavés', shortName: 'Alavés', competitionId: 'laliga' },
  { id: 'lev', name: 'Levante', shortName: 'Levante', competitionId: 'laliga' },
  { id: 'val2', name: 'Real Valladolid', shortName: 'Valladolid', competitionId: 'laliga' },
  { id: 'mlg', name: 'Málaga', shortName: 'Málaga', competitionId: 'laliga' },
  { id: 'gir', name: 'Girona', shortName: 'Girona', competitionId: 'laliga' },
  { id: 'elc', name: 'Elche', shortName: 'Elche', competitionId: 'laliga' },
  { id: 'hsc', name: 'Huesca', shortName: 'Huesca', competitionId: 'laliga' },
  { id: 'alm', name: 'Almería', shortName: 'Almería', competitionId: 'laliga' },
  { id: 'dep', name: 'Deportivo La Coruña', shortName: 'Dépor', competitionId: 'laliga' },
  { id: 'eib', name: 'Eibar', shortName: 'Eibar', competitionId: 'laliga' },
  { id: 'lpa', name: 'Las Palmas', shortName: 'Las Palmas', competitionId: 'laliga' },
  { id: 'leg', name: 'Leganés', shortName: 'Leganés', competitionId: 'laliga' },
  // Serie A
  { id: 'juv', name: 'Juventus', shortName: 'Juve', competitionId: 'seriea' },
  { id: 'mil', name: 'AC Milan', shortName: 'Milan', competitionId: 'seriea' },
  { id: 'int', name: 'Inter Milan', shortName: 'Inter', competitionId: 'seriea' },
  { id: 'nap', name: 'Napoli', shortName: 'Napoli', competitionId: 'seriea' },
  { id: 'rom', name: 'AS Roma', shortName: 'Roma', competitionId: 'seriea' },
  { id: 'laz', name: 'Lazio', shortName: 'Lazio', competitionId: 'seriea' },
  { id: 'ata', name: 'Atalanta', shortName: 'Atalanta', competitionId: 'seriea' },
  { id: 'fio', name: 'Fiorentina', shortName: 'Fiorentina', competitionId: 'seriea' },
  { id: 'tor', name: 'Torino', shortName: 'Torino', competitionId: 'seriea' },
  { id: 'bol', name: 'Bologna', shortName: 'Bologna', competitionId: 'seriea' },
  { id: 'sas', name: 'Sassuolo', shortName: 'Sassuolo', competitionId: 'seriea' },
  { id: 'udc', name: 'Udinese', shortName: 'Udinese', competitionId: 'seriea' },
  { id: 'sam', name: 'Sampdoria', shortName: 'Sampdoria', competitionId: 'seriea' },
  { id: 'gen', name: 'Genoa', shortName: 'Genoa', competitionId: 'seriea' },
  { id: 'ver', name: 'Hellas Verona', shortName: 'Verona', competitionId: 'seriea' },
  { id: 'cag', name: 'Cagliari', shortName: 'Cagliari', competitionId: 'seriea' },
  { id: 'emp', name: 'Empoli', shortName: 'Empoli', competitionId: 'seriea' },
  { id: 'lec', name: 'Lecce', shortName: 'Lecce', competitionId: 'seriea' },
  { id: 'spe', name: 'Spezia', shortName: 'Spezia', competitionId: 'seriea' },
  { id: 'sal', name: 'Salernitana', shortName: 'Salernitana', competitionId: 'seriea' },
  { id: 'par', name: 'Parma', shortName: 'Parma', competitionId: 'seriea' },
  { id: 'mnz', name: 'Monza', shortName: 'Monza', competitionId: 'seriea' },
  { id: 'crm', name: 'Cremonese', shortName: 'Cremonese', competitionId: 'seriea' },
  { id: 'chi', name: 'Chievo', shortName: 'Chievo', competitionId: 'seriea' },
  { id: 'bnv', name: 'Benevento', shortName: 'Benevento', competitionId: 'seriea' },
  { id: 'crt', name: 'Crotone', shortName: 'Crotone', competitionId: 'seriea' },
  { id: 'spl', name: 'SPAL', shortName: 'SPAL', competitionId: 'seriea' },
  { id: 'brc', name: 'Brescia', shortName: 'Brescia', competitionId: 'seriea' },
  { id: 'vnz', name: 'Venezia', shortName: 'Venezia', competitionId: 'seriea' },
  // Bundesliga
  { id: 'bay', name: 'Bayern München', shortName: 'Bayern', competitionId: 'bundesliga' },
  { id: 'dor', name: 'Borussia Dortmund', shortName: 'Dortmund', competitionId: 'bundesliga' },
  { id: 'lev', name: 'Bayer Leverkusen', shortName: 'Leverkusen', competitionId: 'bundesliga' },
  { id: 'sge', name: 'Eintracht Frankfurt', shortName: 'Frankfurt', competitionId: 'bundesliga' },
  { id: 'wol', name: 'VfL Wolfsburg', shortName: 'Wolfsburg', competitionId: 'bundesliga' },
  { id: 'fre', name: 'Freiburg', shortName: 'Freiburg', competitionId: 'bundesliga' },
  { id: 'mai', name: 'Mainz 05', shortName: 'Mainz', competitionId: 'bundesliga' },
  { id: 'glb', name: 'Borussia Mönchengladbach', shortName: 'Gladbach', competitionId: 'bundesliga' },
  { id: 'hof', name: 'TSG Hoffenheim', shortName: 'Hoffenheim', competitionId: 'bundesliga' },
  { id: 'lei2', name: 'RB Leipzig', shortName: 'Leipzig', competitionId: 'bundesliga' },
  { id: 'uni', name: 'Union Berlin', shortName: 'Union', competitionId: 'bundesliga' },
  { id: 'boe', name: 'Bochum', shortName: 'Bochum', competitionId: 'bundesliga' },
  { id: 'brem', name: 'Werder Bremen', shortName: 'Bremen', competitionId: 'bundesliga' },
  { id: 'stu', name: 'VfB Stuttgart', shortName: 'Stuttgart', competitionId: 'bundesliga' },
  { id: 'aug', name: 'Augsburg', shortName: 'Augsburg', competitionId: 'bundesliga' },
  { id: 'her', name: 'Hertha Berlin', shortName: 'Hertha', competitionId: 'bundesliga' },
  { id: 'sch', name: 'Schalke 04', shortName: 'Schalke', competitionId: 'bundesliga' },
  { id: 'kol', name: 'FC Köln', shortName: 'Köln', competitionId: 'bundesliga' },
  { id: 'ham', name: 'Hamburger SV', shortName: 'Hamburg', competitionId: 'bundesliga' },
  { id: 'h96', name: 'Hannover 96', shortName: 'Hannover', competitionId: 'bundesliga' },
  { id: 'bie', name: 'Arminia Bielefeld', shortName: 'Bielefeld', competitionId: 'bundesliga' },
  { id: 'dus', name: 'Fortuna Düsseldorf', shortName: 'Düsseldorf', competitionId: 'bundesliga' },
  { id: 'fut', name: 'Greuther Fürth', shortName: 'Fürth', competitionId: 'bundesliga' },
  { id: 'pad', name: 'SC Paderborn', shortName: 'Paderborn', competitionId: 'bundesliga' },
  { id: 'stp', name: 'FC St. Pauli', shortName: 'St. Pauli', competitionId: 'bundesliga' },
  { id: 'nur', name: '1. FC Nürnberg', shortName: 'Nürnberg', competitionId: 'bundesliga' },
  { id: 'kai', name: '1. FC Kaiserslautern', shortName: 'Kaiserslautern', competitionId: 'bundesliga' },
];

const clubsByComp = {};
for (const club of CLUBS) {
  if (!clubsByComp[club.competitionId]) clubsByComp[club.competitionId] = [];
  clubsByComp[club.competitionId].push(club);
}

// ─── Fuzzy club matching ───
const CLUB_ALIASES = {
  'man utd': 'muni', 'man united': 'muni', 'manchester utd': 'muni', 'man ufc': 'muni',
  'man city': 'mci', 'manchester city': 'mci',
  'tottenham': 'tot', 'spurs': 'tot', 'tottenham hotspur': 'tot',
  'wolves': 'wlv', 'wolverhampton': 'wlv',
  'west ham': 'whu', 'west ham united': 'whu',
  'crystal palace': 'cry', 'palace': 'cry',
  'brighton': 'bri', 'brighton and hove albion': 'bri',
  'aston villa': 'ast', 'villa': 'ast',
  'newcastle': 'new', 'newcastle united': 'new',
  'leicester': 'lei', 'leicester city': 'lei',
  'sheff utd': 'shu', 'sheffield united': 'shu',
  "nott'm forest": 'nfo', 'nottingham forest': 'nfo', 'notts forest': 'nfo',
  'west brom': 'wba', 'west bromwich albion': 'wba',
  'swansea': 'swa', 'swansea city': 'swa',
  'sunderland': 'sun', 'hull': 'hul', 'hull city': 'hul',
  'cardiff': 'car', 'cardiff city': 'car',
  'huddersfield': 'hud', 'huddersfield town': 'hud',
  'qpr': 'qpr', 'middlesbrough': 'mbo',
  'burnley': 'bur', 'leeds': 'lee', 'leeds united': 'lee',
  'brentford': 'bre', 'bournemouth': 'bou', 'fulham': 'ful',
  'southampton': 'sou', 'norwich': 'nor', 'watford': 'wat',
  'everton': 'eve', 'blackburn': 'blc', 'blackburn rovers': 'blc',
  'barcelona': 'bar', 'fc barcelona': 'bar', 'barca': 'bar',
  'r. madrid': 'rma', 'real madrid': 'rma',
  'atletico': 'atm', 'atletico madrid': 'atm',
  'valencia': 'val', 'sevilla': 'sev',
  'athletic': 'ath', 'athletic bilbao': 'ath',
  'real sociedad': 'soc', 'sociedad': 'soc',
  'villarreal': 'vil', 'betis': 'bet', 'real betis': 'bet',
  'getafe': 'get', 'espanyol': 'esp',
  'osasuna': 'osa', 'cadiz': 'cad',
  'celta': 'cel', 'celta vigo': 'cel',
  'granada': 'gra', 'mallorca': 'mal',
  'rayo': 'ray', 'rayo vallecano': 'ray',
  'alaves': 'ala', 'valladolid': 'val2', 'real valladolid': 'val2',
  'malaga': 'mlg', 'girona': 'gir', 'elche': 'elc',
  'huesca': 'hsc', 'almeria': 'alm',
  'deportivo': 'dep', 'eibar': 'eib',
  'las palmas': 'lpa', 'leganes': 'leg',
  'juventus': 'juv', 'juve': 'juv',
  'milan': 'mil', 'ac milan': 'mil',
  'inter': 'int', 'internazionale': 'int',
  'napoli': 'nap', 'roma': 'rom', 'as roma': 'rom',
  'lazio': 'laz', 'atalanta': 'ata',
  'fiorentina': 'fio', 'torino': 'tor',
  'bologna': 'bol', 'sassuolo': 'sas',
  'udinese': 'udc', 'sampdoria': 'sam',
  'genoa': 'gen', 'verona': 'ver', 'hellas verona': 'ver',
  'cagliari': 'cag', 'empoli': 'emp', 'lecce': 'lec',
  'spezia': 'spe', 'salernitana': 'sal',
  'parma': 'par', 'monza': 'mnz', 'cremonese': 'crm',
  'chievo': 'chi', 'benevento': 'bnv', 'crotone': 'crt',
  'spal': 'spl', 'brescia': 'brc', 'venezia': 'vnz',
  'bayern': 'bay', 'fc bayern': 'bay',
  'dortmund': 'dor', 'borussia dortmund': 'dor', 'bvb': 'dor',
  'leverkusen': 'lev', 'bayer leverkusen': 'lev',
  'frankfurt': 'sge', 'eintracht frankfurt': 'sge',
  'wolfsburg': 'wol', 'freiburg': 'fre',
  'mainz': 'mai', 'mainz 05': 'mai',
  'gladbach': 'glb',
  'hoffenheim': 'hof', 'tsg hoffenheim': 'hof',
  'leipzig': 'lei2', 'rb leipzig': 'lei2',
  'union': 'uni', 'union berlin': 'uni',
  'bochum': 'boe', 'bremen': 'brem', 'werder bremen': 'brem',
  'stuttgart': 'stu', 'augsburg': 'aug',
  'hertha': 'her', 'hertha berlin': 'her',
  'schalke': 'sch', 'schalke 04': 'sch',
  'koln': 'kol',
  'hamburg': 'ham', 'hamburger sv': 'ham',
  'hannover': 'h96', 'hannover 96': 'h96',
  'bielefeld': 'bie', 'arminia bielefeld': 'bie',
  'dusseldorf': 'dus', 'fortuna dusseldorf': 'dus',
  'furth': 'fut', 'greuther furth': 'fut',
  'paderborn': 'pad', 'sc paderborn': 'pad',
  'st. pauli': 'stp', 'fc st. pauli': 'stp',
  'nurnberg': 'nur', 'kaiserslautern': 'kai',
};

const CLUB_ALIAS_BY_COMP = {
  'laliga|levante': 'lev', 'laliga|levante ud': 'lev',
  'bundesliga|leverkusen': 'lev', 'bundesliga|bayer leverkusen': 'lev', 'bundesliga|bayer 04 leverkusen': 'lev',
  'bundesliga|bayern münchen': 'bay', 'bundesliga|fc bayern': 'bay', 'bundesliga|bayern munchen': 'bay',
  'bundesliga|borussia mönchengladbach': 'glb', 'bundesliga|borussia monchengladbach': 'glb',
  'bundesliga|mönchengladbach': 'glb', 'bundesliga|monchengladbach': 'glb',
  'bundesliga|fc köln': 'kol', 'bundesliga|1. fc köln': 'kol', 'bundesliga|fc koln': 'kol', 'bundesliga|1. fc koln': 'kol',
  'bundesliga|vfl bochum': 'boe', 'bundesliga|vfl wolfsburg': 'wol',
  'bundesliga|sv werder bremen': 'brem', 'bundesliga|werder bremen': 'brem',
  'bundesliga|vfb stuttgart': 'stu',
  'bundesliga|fc augsburg': 'aug', 'bundesliga|hertha bsc': 'her',
  'bundesliga|fc schalke 04': 'sch', 'bundesliga|schalke 04': 'sch',
  'bundesliga|hamburger sv': 'ham', 'bundesliga|hannover 96': 'h96',
  'bundesliga|arminia bielefeld': 'bie', 'bundesliga|fortuna düsseldorf': 'dus', 'bundesliga|fortuna dusseldorf': 'dus',
  'bundesliga|greuther fürth': 'fut', 'bundesliga|greuther furth': 'fut',
  'bundesliga|sc paderborn': 'pad', 'bundesliga|fc st. pauli': 'stp',
  'bundesliga|1. fc nürnberg': 'nur', 'bundesliga|1. fc nurnberg': 'nur',
  'bundesliga|1. fc kaiserslautern': 'kai',
  'bundesliga|rb leipzig': 'lei2', 'bundesliga|fc union berlin': 'uni',
  'bundesliga|tsg hoffenheim': 'hof', 'bundesliga|1. fsv mainz 05': 'mai',
  'bundesliga|sc freiburg': 'fre', 'bundesliga|eintracht frankfurt': 'sge',
  'bundesliga|borussia dortmund': 'dor', 'bundesliga|bayer 04 leverkusen': 'lev',
  'bundesliga|fc bayern münchen': 'bay',
  'seriea|internazionale': 'int', 'seriea|inter milan': 'int',
  'seriea|ac milan': 'mil', 'seriea|as roma': 'rom',
  'seriea|ssc napoli': 'nap', 'seriea|ss lazio': 'laz',
  'seriea|atalanta bc': 'ata', 'seriea|acf fiorentina': 'fio',
  'seriea|bologna fc': 'bol', 'seriea|us sassuolo': 'sas',
  'seriea|udinese calcio': 'udc', 'seriea|uc sampdoria': 'sam',
  'seriea|genoa cfc': 'gen', 'seriea|hellas verona': 'ver',
  'seriea|cagliari calcio': 'cag', 'seriea|empoli fc': 'emp',
  'seriea|us lecce': 'lec', 'seriea|spezia calcio': 'spe',
  'seriea|us salernitana': 'sal', 'seriea|parma calcio': 'par',
  'seriea|ac monza': 'mnz', 'seriea|us cremonese': 'crm',
  'seriea|ac chievo': 'chi', 'seriea|benevento calcio': 'bnv',
  'seriea|fc crotone': 'crt', 'seriea|brescia calcio': 'brc',
  'seriea|venezia fc': 'vnz',
  'laliga|fc barcelona': 'bar', 'laliga|real madrid': 'rma',
  'laliga|atlético madrid': 'atm', 'laliga|atletico madrid': 'atm',
  'laliga|valencia cf': 'val', 'laliga|villarreal cf': 'vil',
  'laliga|real betis': 'bet', 'laliga|rcd espanyol': 'esp',
  'laliga|ca osasuna': 'osa', 'laliga|cádiz cf': 'cad',
  'laliga|celta vigo': 'cel', 'laliga|granada cf': 'gra',
  'laliga|rcd mallorca': 'mal', 'laliga|rayo vallecano': 'ray',
  'laliga|deportivo alavés': 'ala', 'laliga|levante ud': 'lev',
  'laliga|real valladolid': 'val2', 'laliga|málaga cf': 'mlg',
  'laliga|girona fc': 'gir', 'laliga|elche cf': 'elc',
  'laliga|sd huesca': 'hsc', 'laliga|ud almería': 'alm',
  'laliga|deportivo la coruña': 'dep', 'laliga|dépor': 'dep',
  'laliga|sd eibar': 'eib', 'laliga|ud las palmas': 'lpa',
  'laliga|cd leganés': 'leg', 'laliga|real sociedad': 'soc',
  'laliga|athletic bilbao': 'ath', 'laliga|ath club': 'ath',
  'epl|manchester united': 'muni', 'epl|manchester city': 'mci',
  'epl|tottenham hotspur': 'tot', 'epl|west ham united': 'whu',
  'epl|crystal palace': 'cry', 'epl|brighton and hove albion': 'bri',
  'epl|aston villa': 'ast', 'epl|newcastle united': 'new',
  'epl|leicester city': 'lei', 'epl|sheffield united': 'shu',
  'epl|nottingham forest': 'nfo', 'epl|west bromwich albion': 'wba',
  'epl|swansea city': 'swa', 'epl|hull city': 'hul',
  'epl|cardiff city': 'car', 'epl|huddersfield town': 'hud',
  'epl|queens park rangers': 'qpr', 'epl|blackburn rovers': 'blc',
  'epl|leeds united': 'lee', 'epl|norwich city': 'nor',
  'epl|wolverhampton': 'wlv', 'epl|bournemouth': 'bou',
};

function matchClub(fmClubName, competitionId) {
  const candidates = clubsByComp[competitionId] || [];
  const fmName = fmClubName.trim().toLowerCase();

  const compKey = `${competitionId}|${fmName}`;
  if (CLUB_ALIAS_BY_COMP[compKey]) return CLUB_ALIAS_BY_COMP[compKey];
  if (CLUB_ALIASES[fmName]) {
    const aliasId = CLUB_ALIASES[fmName];
    if (candidates.some(c => c.id === aliasId)) return aliasId;
  }

  for (const club of candidates) {
    if (club.shortName.toLowerCase() === fmName || club.name.toLowerCase() === fmName) return club.id;
  }

  for (const club of candidates) {
    const sn = club.shortName.toLowerCase();
    const cn = club.name.toLowerCase();
    if (fmName.includes(sn) || sn.includes(fmName) || fmName.includes(cn) || cn.includes(fmName)) return club.id;
  }

  const fmWords = fmName.split(/\s+/).filter(w => w.length > 2 && !['fc','cf','sc','sv','ac','vfl','tsg','rb','ssc','us','cd','ud','sd','rcd','bvb','hsv'].includes(w));
  for (const club of candidates) {
    const clubWords = (club.name + ' ' + club.shortName).toLowerCase().split(/\s+/);
    const overlap = fmWords.filter(w => clubWords.some(cw => cw.includes(w) || w.includes(cw)));
    if (overlap.length >= Math.ceil(fmWords.length * 0.5) && overlap.length >= 1) return club.id;
  }

  return null;
}

function cleanPosition(pos) {
  return pos.replace(/"/g, '').trim();
}

function mapPosition(fmPosition) {
  const cleaned = cleanPosition(fmPosition);
  if (POSITION_MAP[cleaned]) return POSITION_MAP[cleaned];

  const parts = cleaned.split(',').map(s => s.trim());
  for (const part of parts) {
    if (POSITION_MAP[part]) return POSITION_MAP[part];
  }

  const combinedMatch = cleaned.match(/^([A-Z/]+)\s*\(([^)]+)\)$/);
  if (combinedMatch) {
    const posTypes = combinedMatch[1].split('/');
    const side = combinedMatch[2];
    for (const pt of posTypes) {
      const expanded = `${pt} (${side})`;
      if (POSITION_MAP[expanded]) return POSITION_MAP[expanded];
    }
  }

  for (const key of Object.keys(POSITION_MAP)) {
    if (cleaned.startsWith(key) || cleaned.includes(key)) return POSITION_MAP[key];
  }
  return null;
}

function mapDivision(division) {
  const d = division.trim();
  if (DIVISION_MAP[d]) return DIVISION_MAP[d];
  if (d.includes('Premier League') || d.includes('Premier Division') || d.includes('English Premier Division')) return 'epl';
  if (d === 'Liga' || d === 'LaLiga' || d.includes('LaLiga') || d.includes('Spanish First Division')) return 'laliga';
  if (d.includes('Serie A') || d.includes('Serie A TIM')) return 'seriea';
  if (d.includes('Bundesliga')) return 'bundesliga';
  return null;
}

const NAT_MAP = {
  'ENG': 'England', 'SCO': 'Scotland', 'WAL': 'Wales', 'IRL': 'Ireland',
  'NIR': 'Northern Ireland', 'FRA': 'France', 'GER': 'Germany', 'ITA': 'Italy',
  'ESP': 'Spain', 'POR': 'Portugal', 'NED': 'Netherlands', 'BEL': 'Belgium',
  'BRA': 'Brazil', 'ARG': 'Argentina', 'URU': 'Uruguay', 'COL': 'Colombia',
  'CHI': 'Chile', 'MEX': 'Mexico', 'USA': 'United States', 'CAN': 'Canada',
  'JPN': 'Japan', 'KOR': 'South Korea', 'AUS': 'Australia', 'NGR': 'Nigeria',
  'CMR': 'Cameroon', 'SEN': 'Senegal', 'EGY': 'Egypt', 'MAR': 'Morocco',
  'TUN': 'Tunisia', 'ALG': 'Algeria', 'CRO': 'Croatia', 'SRB': 'Serbia',
  'POL': 'Poland', 'CZE': 'Czech Republic', 'SWE': 'Sweden', 'NOR': 'Norway',
  'DEN': 'Denmark', 'SUI': 'Switzerland', 'AUT': 'Austria', 'TUR': 'Turkey',
  'RUS': 'Russia', 'UKR': 'Ukraine', 'ROU': 'Romania', 'HUN': 'Hungary',
  'GRE': 'Greece', 'BIH': 'Bosnia and Herzegovina', 'MKD': 'North Macedonia',
  'ALB': 'Albania', 'BUL': 'Bulgaria', 'SVK': 'Slovakia', 'SVN': 'Slovenia',
  'GHA': 'Ghana', 'CIV': 'Ivory Coast', 'MLI': 'Mali', 'GUI': 'Guinea',
  'PAR': 'Paraguay', 'ECU': 'Ecuador', 'VEN': 'Venezuela', 'PER': 'Peru',
  'CRC': 'Costa Rica', 'HON': 'Honduras', 'JAM': 'Jamaica', 'PAN': 'Panama',
  'KSA': 'Saudi Arabia', 'IRN': 'Iran', 'CHN': 'China PR', 'THA': 'Thailand',
  'NZL': 'New Zealand', 'RSA': 'South Africa', 'GEO': 'Georgia',
  'FIN': 'Finland', 'ISL': 'Iceland', 'ISR': 'Israel',
  'KOS': 'Kosovo', 'MNE': 'Montenegro', 'COD': 'DR Congo', 'ZAM': 'Zambia',
  'TTO': 'Trinidad and Tobago', 'SUR': 'Suriname',
};

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
};

// ─── Robust CSV line parser ───
// The key insight: FM attribute columns are always the LAST columns in the CSV.
// We parse the header to identify attribute column names, then for each data line,
// we read attributes from the end. The front columns (UID, Name, etc.) are parsed
// by their known positions from the header.

function parseCSVFile(filePath, season) {
  if (!fs.existsSync(filePath)) {
    console.log(`  File not found: ${path.basename(filePath)}, skipping`);
    return { players: [], unmatchedClubs: new Set() };
  }

  console.log(`\n  Processing ${path.basename(filePath)} → season ${season}...`);

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(l => l.trim());

  if (lines.length < 2) return { players: [], unmatchedClubs: new Set() };

  // Parse header - split on comma
  const headerParts = lines[0].split(',').map(s => s.trim());

  // Find the index of the first attribute column
  // All known attribute column names (FM attribute columns are always these)
  const allAttrNames = new Set([
    'Acc','Aer','Agg','Agi','Ant','Bal','Bra','Cmd','Com','Cmp','Cnt','Cor',
    'Cro','Dec','Det','Dri','Ecc','Fin','Fir','Fla','Fre','Han','Hea','Jum',
    'Kic','Ldr','Lon','L Th','Mar','OtB','Pac','Pas','Pen',
    'Pos','Pun','Ref','TRO','Sta','Str','Tck','Tea','Tec','Thr','Vis','Wor','1v1',
    'Nat .1', // fm2023.csv uses this for the duplicate Nat column
  ]);

  // Find the first attribute column by scanning from left to right
  let attrStartIdx = -1;
  for (let i = 0; i < headerParts.length; i++) {
    if (allAttrNames.has(headerParts[i])) {
      attrStartIdx = i;
      break;
    }
  }

  if (attrStartIdx === -1) {
    console.log(`    ERROR: Could not find attribute start column`);
    return { players: [], unmatchedClubs: new Set() };
  }

  // The attribute column names from the header
  const headerAttrCols = headerParts.slice(attrStartIdx);
  const numAttrCols = headerAttrCols.length;
  console.log(`    Header: ${headerParts.length} cols, attributes start at col ${attrStartIdx}, ${numAttrCols} attr cols`);

  // Find key non-attribute column indices
  const nameIdx = headerParts.indexOf('Name');
  const natIdx = headerParts.indexOf('Nat');
  const divIdx = headerParts.indexOf('Division');
  const clubIdx = headerParts.indexOf('Club');
  const posIdx = headerParts.indexOf('Position');
  const bestPosIdx = headerParts.indexOf('Best Pos');

  const players = [];
  const unmatchedClubs = new Set();
  let rowCount = 0;
  let skippedNoDivision = 0;
  let skippedNoPosition = 0;
  let skippedNoClub = 0;

  for (let lineIdx = 1; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    if (!line.trim()) continue;

    rowCount++;

    // Split the line
    const parts = line.split(',');

    // Attributes are always the last numAttrCols columns
    const attrStart = parts.length - numAttrCols;
    if (attrStart < 0) continue; // malformed line

    // Build attribute lookup
    const attrMap = {};
    for (let i = 0; i < numAttrCols; i++) {
      attrMap[headerAttrCols[i]] = parseInt(parts[attrStart + i], 10) || 10;
    }

    // For non-attribute columns, we need to handle the Position field
    // which may contain commas and thus split into multiple parts.
    // The non-attribute part of the line is parts[0..attrStart-1]
    const nonAttrParts = parts.slice(0, attrStart);

    // The non-attribute header has attrStartIdx columns
    // If nonAttrParts.length > attrStartIdx, the Position field was split
    const extraParts = nonAttrParts.length - attrStartIdx;

    // Helper to get non-attribute field by header index
    const getField = (idx) => {
      if (idx < 0) return '';
      // Fields before Position are not affected
      // Position is typically around index 7-11 depending on the file
      // Fields after Position are shifted by extraParts
      if (idx < posIdx || posIdx === -1) {
        return (nonAttrParts[idx] || '').trim();
      }
      // For fields after Position, account for extra parts
      return (nonAttrParts[idx + extraParts] || '').trim();
    };

    // Get Position field - it may span multiple parts
    let fmPos;
    const useBestPos = bestPosIdx !== -1;
    const targetPosIdx = useBestPos ? bestPosIdx : posIdx;

    if (targetPosIdx === -1) {
      fmPos = '';
    } else if (extraParts > 0 && targetPosIdx >= posIdx && posIdx !== -1) {
      // Position field was split - rejoin
      const posEnd = targetPosIdx + extraParts + 1;
      const posParts = [];
      for (let i = targetPosIdx; i < Math.min(posEnd, nonAttrParts.length); i++) {
        posParts.push(nonAttrParts[i].trim());
      }
      fmPos = posParts.join(', ');
    } else {
      fmPos = (nonAttrParts[targetPosIdx] || '').trim();
    }

    // Get other fields
    const name = getField(nameIdx);
    const natCode = getField(natIdx);
    const division = getField(divIdx);
    const fmClub = getField(clubIdx);

    // Map division
    const competitionId = mapDivision(division);
    if (!competitionId) {
      skippedNoDivision++;
      continue;
    }

    // Map position
    const posMapping = mapPosition(fmPos);
    if (!posMapping) {
      skippedNoPosition++;
      continue;
    }

    // Map club
    const clubId = matchClub(fmClub, competitionId);
    if (!clubId) {
      if (fmClub) unmatchedClubs.add(`${competitionId}|${fmClub}`);
      skippedNoClub++;
      continue;
    }

    // Calculate attributes using FM's native 1-20 scale directly
    const isGK = posMapping.position === 'GK';

    const acc = attrMap['Acc'] || 10;
    const pac = attrMap['Pac'] || 10;
    const PAC = Math.round((acc + pac) / 2);

    let SHO, PAS, DEF, PHY;

    if (isGK) {
      // GK: SHO=Ref (shot-stopping), PAS=Kic, DEF=Han, PHY=(Str+Sta)/2
      const ref = attrMap['Ref'] || 10;
      const kic = attrMap['Kic'] || 10;
      const han = attrMap['Han'] || 10;
      const str = attrMap['Str'] || 10;
      const sta = attrMap['Sta'] || 10;
      SHO = ref;
      PAS = kic;
      DEF = han;
      PHY = Math.round((str + sta) / 2);
    } else {
      // Field players: direct FM attributes
      const fin = attrMap['Fin'] || 10;
      const pas = attrMap['Pas'] || 10;
      const dri = attrMap['Dri'] || 10;
      const tck = attrMap['Tck'] || 10;
      const str = attrMap['Str'] || 10;
      SHO = fin;
      PAS = pas;
      DRI = dri;
      DEF = tck;
      PHY = str;
    }

    // Calculate overall rating
    let rating;
    if (isGK) {
      rating = Math.round(SHO * 0.4 + DEF * 0.35 + PAS * 0.15 + PHY * 0.1);
    } else {
      rating = Math.round((PAC + SHO + PAS + DRI + DEF + PHY) / 6);
    }
    rating = Math.max(1, Math.min(20, rating));

    const nationality = NAT_MAP[natCode] || natCode;
    const nationalityZh = NAT_ZH_MAP[nationality] || nationality;

    players.push({
      name,
      nameZh: name,
      position: posMapping.position,
      positions: posMapping.positions,
      clubId,
      season,
      competitionId,
      rating,
      attr: { pace: PAC, shooting: SHO, passing: PAS, dribbling: DRI, defending: DEF, physical: PHY },
      nationality,
      nationalityZh,
    });
  }

  console.log(`    Read ${rowCount} rows`);
  console.log(`    Skipped: ${skippedNoDivision} (no division), ${skippedNoPosition} (no position), ${skippedNoClub} (no club match)`);
  console.log(`    Matched: ${players.length} players`);

  return { players, unmatchedClubs };
}

async function main() {
  console.log('=== FM Data Import Script ===\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allPlayers = {};
  const allUnmatchedClubs = new Set();

  for (const { file, season } of FM_FILES) {
    const filePath = path.join(CSV_DIR, file);
    const { players, unmatchedClubs } = parseCSVFile(filePath, season);

    for (const player of players) {
      const key = `${player.competitionId}|${player.season}`;
      if (!allPlayers[key]) allPlayers[key] = [];
      allPlayers[key].push(player);
    }

    for (const uc of unmatchedClubs) {
      allUnmatchedClubs.add(uc);
    }
  }

  // Output JSON files
  console.log('\n=== Output Files ===');
  for (const [key, players] of Object.entries(allPlayers)) {
    const [competitionId, season] = key.split('|');

    // Deduplicate by name + clubId: keep the one with the highest overall rating
    const dedupMap = new Map();
    for (const player of players) {
      const dedupKey = `${player.name}|${player.clubId}`;
      const existing = dedupMap.get(dedupKey);
      if (!existing || player.rating > existing.rating) {
        dedupMap.set(dedupKey, player);
      }
    }
    const deduped = [...dedupMap.values()];

    const fileName = `fm-${competitionId}-${season.replace(/-/g, '_')}.json`;
    const outputPath = path.join(OUTPUT_DIR, fileName);

    deduped.sort((a, b) => {
      if (a.clubId !== b.clubId) return a.clubId.localeCompare(b.clubId);
      return b.rating - a.rating;
    });

    const dupesRemoved = players.length - deduped.length;
    if (dupesRemoved > 0) {
      console.log(`  ${fileName}: ${players.length} → ${deduped.length} players (${dupesRemoved} duplicates removed)`);
    }

    fs.writeFileSync(outputPath, JSON.stringify(deduped, null, 2), 'utf-8');
    console.log(`  ${fileName}: ${deduped.length} players`);

    // Replace the array with deduped version for downstream use
    allPlayers[key] = deduped;
  }

  // Statistics
  console.log('\n=== Statistics ===');
  for (const [key, players] of Object.entries(allPlayers)) {
    const [competitionId, season] = key.split('|');
    const clubIds = new Set(players.map(p => p.clubId));
    console.log(`  ${competitionId} ${season}: ${players.length} players from ${clubIds.size} clubs`);
  }

  console.log(`\n  Unmatched clubs (top 30):`);
  const unmatchedArr = [...allUnmatchedClubs].sort();
  for (const uc of unmatchedArr.slice(0, 30)) {
    console.log(`    ${uc}`);
  }
  if (unmatchedArr.length > 30) {
    console.log(`    ... and ${unmatchedArr.length - 30} more`);
  }

  // Sample data
  console.log('\n=== Sample Data (top-rated players per league) ===');
  for (const [key, players] of Object.entries(allPlayers)) {
    const [competitionId, season] = key.split('|');
    const top5 = [...players].sort((a, b) => b.rating - a.rating).slice(0, 5);
    console.log(`\n  ${competitionId} ${season} - Top 5:`);
    for (const p of top5) {
      console.log(`    ${p.name} (${p.position}) [${p.clubId}] RAT:${p.rating} PAC:${p.attr.pace} SHO:${p.attr.shooting} PAS:${p.attr.passing} DRI:${p.attr.dribbling} DEF:${p.attr.defending} PHY:${p.attr.physical}`);
    }
  }

  // ─── FM vs FIFA Comparison ───
  console.log('\n\n=== FM vs FIFA Data Comparison ===\n');

  const existingPlayers = loadExistingPlayers();
  const allFmPlayers = Object.values(allPlayers).flat();

  const compareNames = ['Erling Haaland', 'Kevin De Bruyne', 'Mohamed Salah', 'Virgil van Dijk', 'Bukayo Saka'];

  for (const name of compareNames) {
    const fmPlayer = findPlayer(allFmPlayers, name);
    const existingPlayer = findPlayer(existingPlayers, name);

    console.log(`--- ${name} ---`);
    if (fmPlayer) {
      console.log(`  FM Import:  RAT:${fmPlayer.rating} PAC:${fmPlayer.attr.pace} SHO:${fmPlayer.attr.shooting} PAS:${fmPlayer.attr.passing} DRI:${fmPlayer.attr.dribbling} DEF:${fmPlayer.attr.defending} PHY:${fmPlayer.attr.physical}`);
    } else {
      console.log(`  FM Import: NOT FOUND`);
    }
    if (existingPlayer) {
      console.log(`  Project:    RAT:${existingPlayer.rating} PAC:${existingPlayer.attr.pace} SHO:${existingPlayer.attr.shooting} PAS:${existingPlayer.attr.passing} DRI:${existingPlayer.attr.dribbling} DEF:${existingPlayer.attr.defending} PHY:${existingPlayer.attr.physical}`);
    } else {
      console.log(`  Project: NOT FOUND`);
    }
    if (fmPlayer && existingPlayer) {
      const d = {
        r: fmPlayer.rating - existingPlayer.rating,
        p: fmPlayer.attr.pace - existingPlayer.attr.pace,
        s: fmPlayer.attr.shooting - existingPlayer.attr.shooting,
        pa: fmPlayer.attr.passing - existingPlayer.attr.passing,
        dr: fmPlayer.attr.dribbling - existingPlayer.attr.dribbling,
        de: fmPlayer.attr.defending - existingPlayer.attr.defending,
        ph: fmPlayer.attr.physical - existingPlayer.attr.physical,
      };
      console.log(`  Diff (FM-Proj): RAT:${d.r} PAC:${d.p} SHO:${d.s} PAS:${d.pa} DRI:${d.dr} DEF:${d.de} PHY:${d.ph}`);
    }
    console.log();
  }

  console.log('=== Analysis: FM 1-20 Scale ===');
  console.log('1. All attributes now use FM native 1-20 scale directly');
  console.log('2. Field player OVR = average of 6 attributes (PAC+SHO+PAS+DRI+DEF+PHY)/6');
  console.log('3. GK OVR = Ref*0.4 + Han*0.35 + Kic*0.15 + PHY*0.1');
  console.log('4. Ratings will be in 1-20 range (top players ~14-18)');
  console.log('5. No conversion to FIFA 1-99 scale — data stays true to FM source');
}

function findPlayer(players, name) {
  const lower = name.toLowerCase();
  return players.find(p => p.name.toLowerCase() === lower) ||
         players.find(p => p.name.toLowerCase().includes(lower));
}

function loadExistingPlayers() {
  const players = [];
  const dataFiles = ['epl.ts', 'laliga.ts', 'seriea.ts', 'bundesliga.ts', 'fifa-imported.ts', 'fm_extra.ts'];
  for (const file of dataFiles) {
    const filePath = path.join(ROOT, 'src', 'data', 'players', file);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf-8');
    const pCallRegex = /p\s*\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*\[([^\]]*)\]\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*(\d+)\s*,\s*\[([^\]]*)\]\s*,\s*'([^']*)'\s*,\s*'([^']*)'/g;
    let match;
    while ((match = pCallRegex.exec(content)) !== null) {
      const attrs = match[9].split(',').map(v => parseInt(v.trim(), 10));
      players.push({
        name: match[1], position: match[3], clubId: match[5], season: match[6],
        competitionId: match[7], rating: parseInt(match[8], 10),
        attr: { pace: attrs[0]||0, shooting: attrs[1]||0, passing: attrs[2]||0, dribbling: attrs[3]||0, defending: attrs[4]||0, physical: attrs[5]||0 },
      });
    }
  }
  return players;
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
