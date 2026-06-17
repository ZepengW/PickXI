import type { Club, Competition } from '../types';

export const COMPETITIONS: Competition[] = [
  {
    id: 'epl',
    name: 'Premier League',
    nameZh: '英超',
    type: 'league',
    matches: 38,
    teamCount: 20,
    seasons: [
      '1992-93', '1995-96', '1998-99', '2001-02', '2003-04',
      '2007-08', '2011-12', '2013-14', '2015-16', '2017-18',
      '2018-19', '2019-20', '2020-21', '2021-22', '2022-23',
      '2023-24', '2024-25',
    ],
    region: 'England',
    regionZh: '英格兰',
    accent: '#3d195b',
    blurb: 'The most-watched league on earth. 38 games, four eras of legends.',
    blurbZh: '全球最受关注的联赛。38 场鏖战，跨越四个时代的传奇。',
  },
  {
    id: 'laliga',
    name: 'La Liga',
    nameZh: '西甲',
    type: 'league',
    matches: 38,
    teamCount: 20,
    seasons: [
      '1996-97', '1998-99', '2002-03', '2004-05', '2008-09',
      '2010-11', '2011-12', '2013-14', '2015-16', '2016-17',
      '2017-18', '2019-20', '2020-21', '2021-22', '2022-23',
      '2023-24', '2024-25',
    ],
    region: 'Spain',
    regionZh: '西班牙',
    accent: '#e82127',
    blurb: 'Home of tiki-taka and the greatest Clásico sides.',
    blurbZh: 'tiki-taka 的故乡，最伟大的国家德比在此上演。',
  },
  {
    id: 'csl',
    name: 'Chinese Super League',
    nameZh: '中超',
    type: 'league',
    matches: 30,
    teamCount: 16,
    seasons: [
      '2013', '2015', '2017', '2018', '2019',
      '2020', '2022', '2023', '2024',
    ],
    region: 'China',
    regionZh: '中国',
    accent: '#d01013',
    blurb: 'The golden age of Chinese football, when the world came to play.',
    blurbZh: '中国足球的金元时代，群星云集的东方赛场。',
  },
  {
    id: 'ucl',
    name: 'Champions League',
    nameZh: '欧冠',
    type: 'cup',
    matches: 13,
    teamCount: 32,
    seasons: [
      '1998-99', '2001-02', '2004-05', '2007-08', '2009-10',
      '2011-12', '2012-13', '2013-14', '2015-16', '2016-17',
      '2017-18', '2018-19', '2019-20', '2020-21', '2021-22',
      '2022-23', '2023-24',
    ],
    region: 'Europe',
    regionZh: '欧洲',
    accent: '#0a1d4d',
    blurb: 'Thirteen nights to conquer Europe. The continent\'s elite.',
    blurbZh: '十三个夜晚征服欧洲。大陆之巅的王者之争。',
  },
  {
    id: 'wc',
    name: 'World Cup',
    nameZh: '世界杯',
    type: 'cup',
    matches: 7,
    teamCount: 32,
    seasons: [
      '1970', '1986', '1994', '1998', '2002', '2006', '2010',
      '2014', '2018', '2022',
    ],
    region: 'World',
    regionZh: '世界',
    accent: '#1a5e3a',
    blurb: 'Seven games to lift the trophy. Nations, not clubs.',
    blurbZh: '七场比赛举起大力神杯。国家荣誉，而非俱乐部。',
  },
  {
    id: 'seriea',
    name: 'Serie A',
    nameZh: '意甲',
    type: 'league',
    matches: 38,
    teamCount: 20,
    seasons: [
      '1988-89', '1991-92', '1995-96', '1998-99', '2001-02',
      '2002-03', '2003-04', '2006-07', '2010-11', '2015-16',
      '2016-17', '2018-19', '2019-20', '2020-21', '2022-23',
      '2023-24',
    ],
    region: 'Italy',
    regionZh: '意大利',
    accent: '#0066cc',
    blurb: 'The tactical capital of world football. Catenaccio to fantasy.',
    blurbZh: '世界足球的战术之都。从链式防守到十号位艺术。',
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    nameZh: '德甲',
    type: 'league',
    matches: 34,
    teamCount: 18,
    seasons: [
      '1998-99', '2000-01', '2001-02', '2008-09', '2010-11',
      '2011-12', '2012-13', '2013-14', '2015-16', '2018-19',
      '2019-20', '2020-21', '2022-23', '2023-24',
    ],
    region: 'Germany',
    regionZh: '德国',
    accent: '#d20515',
    blurb: 'Gegenpressing, yellow walls, and 34 games of pure intensity.',
    blurbZh: '高位压迫、黄色之墙，34 场纯粹激情的较量。',
  },
];

export const COMPETITION_MAP: Record<string, Competition> = Object.fromEntries(
  COMPETITIONS.map((c) => [c.id, c]),
);

export const CLUBS: Club[] = [
  // --- EPL ---
  { id: 'muni', name: 'Manchester United', nameZh: '曼联', shortName: 'Man Utd', shortNameZh: '曼联', color: '#da291c', color2: '#fbe122', competitionId: 'epl', strength: 86 },
  { id: 'ars', name: 'Arsenal', nameZh: '阿森纳', shortName: 'Arsenal', shortNameZh: '阿森纳', color: '#ef0107', color2: '#ffffff', competitionId: 'epl', strength: 84 },
  { id: 'che', name: 'Chelsea', nameZh: '切尔西', shortName: 'Chelsea', shortNameZh: '切尔西', color: '#034694', color2: '#dba111', competitionId: 'epl', strength: 83 },
  { id: 'liv', name: 'Liverpool', nameZh: '利物浦', shortName: 'Liverpool', shortNameZh: '利物浦', color: '#c8102e', color2: '#00b2a9', competitionId: 'epl', strength: 86 },
  { id: 'mci', name: 'Manchester City', nameZh: '曼城', shortName: 'Man City', shortNameZh: '曼城', color: '#6cabdd', color2: '#1c2c5b', competitionId: 'epl', strength: 89 },
  { id: 'tot', name: 'Tottenham Hotspur', nameZh: '热刺', shortName: 'Spurs', shortNameZh: '热刺', color: '#132257', color2: '#ffffff', competitionId: 'epl', strength: 80 },
  { id: 'blc', name: 'Blackburn Rovers', nameZh: '布莱克本', shortName: 'Blackburn', shortNameZh: '布莱克本', color: '#009ee0', color2: '#ffffff', competitionId: 'epl', strength: 76 },
  { id: 'lei', name: 'Leicester City', nameZh: '莱斯特城', shortName: 'Leicester', shortNameZh: '莱斯特城', color: '#003090', color2: '#fdbb30', competitionId: 'epl', strength: 79 },

  // --- La Liga ---
  { id: 'bar', name: 'FC Barcelona', nameZh: '巴塞罗那', shortName: 'Barça', shortNameZh: '巴萨', color: '#a50044', color2: '#004d98', competitionId: 'laliga', strength: 88 },
  { id: 'rma', name: 'Real Madrid', nameZh: '皇家马德里', shortName: 'Real Madrid', shortNameZh: '皇马', color: '#febe10', color2: '#00529f', competitionId: 'laliga', strength: 89 },
  { id: 'atm', name: 'Atlético Madrid', nameZh: '马德里竞技', shortName: 'Atlético', shortNameZh: '马竞', color: '#cb3524', color2: '#262e62', competitionId: 'laliga', strength: 84 },
  { id: 'val', name: 'Valencia', nameZh: '瓦伦西亚', shortName: 'Valencia', shortNameZh: '瓦伦', color: '#ee3524', color2: '#000000', competitionId: 'laliga', strength: 80 },
  { id: 'sev', name: 'Sevilla', nameZh: '塞维利亚', shortName: 'Sevilla', shortNameZh: '塞维利亚', color: '#d5122e', color2: '#ffffff', competitionId: 'laliga', strength: 79 },

  // --- CSL ---
  { id: 'gzg', name: 'Guangzhou Evergrande', nameZh: '广州恒大', shortName: 'Guangzhou', shortNameZh: '恒大', color: '#e60012', color2: '#ffffff', competitionId: 'csl', strength: 75 },
  { id: 'shp', name: 'Shanghai SIPG', nameZh: '上海上港', shortName: 'SIPG', shortNameZh: '上港', color: '#d4001a', color2: '#000000', competitionId: 'csl', strength: 74 },
  { id: 'bgu', name: 'Beijing Guoan', nameZh: '北京国安', shortName: 'Guoan', shortNameZh: '国安', color: '#005a28', color2: '#ffffff', competitionId: 'csl', strength: 72 },
  { id: 'srg', name: 'Shandong Taishan', nameZh: '山东泰山', shortName: 'Taishan', shortNameZh: '泰山', color: '#f36633', color2: '#000000', competitionId: 'csl', strength: 72 },

  // --- UCL (reuses some clubs above plus European elite) ---
  { id: 'bay', name: 'Bayern München', nameZh: '拜仁慕尼黑', shortName: 'Bayern', shortNameZh: '拜仁', color: '#dc052d', color2: '#0066b2', competitionId: 'ucl', strength: 88 },
  { id: 'mil', name: 'AC Milan', nameZh: 'AC米兰', shortName: 'Milan', shortNameZh: '米兰', color: '#fb090b', color2: '#000000', competitionId: 'ucl', strength: 83 },
  { id: 'juv', name: 'Juventus', nameZh: '尤文图斯', shortName: 'Juve', shortNameZh: '尤文', color: '#000000', color2: '#ffffff', competitionId: 'ucl', strength: 84 },
  { id: 'int', name: 'Inter Milan', nameZh: '国际米兰', shortName: 'Inter', shortNameZh: '国米', color: '#0068a8', color2: '#000000', competitionId: 'ucl', strength: 84 },
  { id: 'psg', name: 'Paris Saint-Germain', nameZh: '巴黎圣日耳曼', shortName: 'PSG', shortNameZh: '巴黎', color: '#004170', color2: '#da291c', competitionId: 'ucl', strength: 86 },
  { id: 'dor', name: 'Borussia Dortmund', nameZh: '多特蒙德', shortName: 'Dortmund', shortNameZh: '多特', color: '#fde100', color2: '#000000', competitionId: 'ucl', strength: 83 },

  // --- World Cup (national teams) ---
  { id: 'bra', name: 'Brazil', nameZh: '巴西', shortName: 'Brazil', shortNameZh: '巴西', color: '#fcc419', color2: '#009c3b', competitionId: 'wc', strength: 89 },
  { id: 'arg', name: 'Argentina', nameZh: '阿根廷', shortName: 'Argentina', shortNameZh: '阿根廷', color: '#75aadb', color2: '#ffffff', competitionId: 'wc', strength: 88 },
  { id: 'fra', name: 'France', nameZh: '法国', shortName: 'France', shortNameZh: '法国', color: '#0055a4', color2: '#ef4135', competitionId: 'wc', strength: 88 },
  { id: 'ger', name: 'Germany', nameZh: '德国', shortName: 'Germany', shortNameZh: '德国', color: '#000000', color2: '#dd0000', competitionId: 'wc', strength: 86 },
  { id: 'esp', name: 'Spain', nameZh: '西班牙', shortName: 'Spain', shortNameZh: '西班牙', color: '#c60b1e', color2: '#ffc400', competitionId: 'wc', strength: 87 },
  { id: 'ita', name: 'Italy', nameZh: '意大利', shortName: 'Italy', shortNameZh: '意大利', color: '#0066cc', color2: '#ffffff', competitionId: 'wc', strength: 85 },
  { id: 'ned', name: 'Netherlands', nameZh: '荷兰', shortName: 'Netherlands', shortNameZh: '荷兰', color: '#ff6600', color2: '#000000', competitionId: 'wc', strength: 85 },
  { id: 'por', name: 'Portugal', nameZh: '葡萄牙', shortName: 'Portugal', shortNameZh: '葡萄牙', color: '#006600', color2: '#da291c', competitionId: 'wc', strength: 85 },

  // --- Serie A ---
  { id: 'juv', name: 'Juventus', nameZh: '尤文图斯', shortName: 'Juve', shortNameZh: '尤文', color: '#000000', color2: '#ffffff', competitionId: 'seriea', strength: 84 },
  { id: 'mil', name: 'AC Milan', nameZh: 'AC米兰', shortName: 'Milan', shortNameZh: '米兰', color: '#fb090b', color2: '#000000', competitionId: 'seriea', strength: 83 },
  { id: 'int', name: 'Inter Milan', nameZh: '国际米兰', shortName: 'Inter', shortNameZh: '国米', color: '#0068a8', color2: '#000000', competitionId: 'seriea', strength: 84 },
  { id: 'nap', name: 'Napoli', nameZh: '那不勒斯', shortName: 'Napoli', shortNameZh: '那不勒斯', color: '#12a0d7', color2: '#ffffff', competitionId: 'seriea', strength: 83 },
  { id: 'rom', name: 'AS Roma', nameZh: '罗马', shortName: 'Roma', shortNameZh: '罗马', color: '#8e1f2f', color2: '#f0bc42', competitionId: 'seriea', strength: 81 },
  { id: 'laz', name: 'Lazio', nameZh: '拉齐奥', shortName: 'Lazio', shortNameZh: '拉齐奥', color: '#87d8f7', color2: '#ffffff', competitionId: 'seriea', strength: 80 },

  // --- Bundesliga ---
  { id: 'bay', name: 'Bayern München', nameZh: '拜仁慕尼黑', shortName: 'Bayern', shortNameZh: '拜仁', color: '#dc052d', color2: '#0066b2', competitionId: 'bundesliga', strength: 88 },
  { id: 'dor', name: 'Borussia Dortmund', nameZh: '多特蒙德', shortName: 'Dortmund', shortNameZh: '多特', color: '#fde100', color2: '#000000', competitionId: 'bundesliga', strength: 83 },
  { id: 'lev', name: 'Bayer Leverkusen', nameZh: '勒沃库森', shortName: 'Leverkusen', shortNameZh: '药厂', color: '#e32221', color2: '#000000', competitionId: 'bundesliga', strength: 82 },
  { id: 'sge', name: 'Eintracht Frankfurt', nameZh: '法兰克福', shortName: 'Frankfurt', shortNameZh: '法兰', color: '#e1000f', color2: '#000000', competitionId: 'bundesliga', strength: 79 },
];

export const CLUB_MAP: Record<string, Club> = Object.fromEntries(
  CLUBS.map((c) => [c.id, c]),
);

export function clubsForCompetition(competitionId: string): Club[] {
  return CLUBS.filter((c) => c.competitionId === competitionId);
}
