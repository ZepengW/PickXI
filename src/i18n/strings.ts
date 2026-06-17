import type { Lang } from '../types';

export const STRINGS = {
  // Brand & nav
  brandTagline: { zh: '梦幻十一人', en: 'Your dream XI' },
  navPlay: { zh: '开始游戏', en: 'Play' },
  navHome: { zh: '首页', en: 'Home' },
  navLeaderboard: { zh: '战绩', en: 'Results' },

  // Hero
  heroEyebrow: { zh: '从足球历史中选秀组队', en: 'Draft from football history' },
  heroTitle: { zh: '组建你的梦幻十一人', en: 'Build your dream XI' },
  heroSub: {
    zh: '转动转盘，落在真实的俱乐部与赛季；从那支阵容中选秀，凑齐十一人，模拟整赛季。你能赢下多少场？',
    en: 'Spin the wheel to land on a real club and season. Draft a player, fill your XI, then simulate a full campaign. How many can you win?',
  },
  heroCta: { zh: '开始选秀', en: 'Start drafting' },
  heroCtaAlt: { zh: '了解玩法', en: 'How to play' },

  // How to play
  howTitle: { zh: '怎么玩', en: 'How to play' },
  step1Title: { zh: '转动转盘', en: 'Spin the wheel' },
  step1Body: {
    zh: '每次转动，落在某个真实俱乐部与某个赛季。',
    en: 'Each spin lands on a real club from a specific season.',
  },
  step2Title: { zh: '选秀一名球员', en: 'Draft a player' },
  step2Body: {
    zh: '从那支阵容中挑一名球员，放入你的阵型。',
    en: 'Pick a player from that squad and slot them into your formation.',
  },
  step3Title: { zh: '凑齐十一人', en: 'Build your XI' },
  step3Body: {
    zh: '重复选秀，直到 11 个位置全部填满。',
    en: 'Repeat until all 11 positions are filled.',
  },
  step4Title: { zh: '模拟赛季', en: 'Simulate the season' },
  step4Body: {
    zh: '打完整个赛程，看看你的球队能走多远。',
    en: 'Play out the full campaign and see how far your squad can go.',
  },

  // Challenges
  challengesTitle: { zh: '热门挑战', en: 'Popular challenges' },
  challengeUnbeaten: { zh: '整赛季不败', en: 'Go a full season unbeaten' },
  challengePerfect: { zh: '追求全胜', en: 'Chase a perfect record' },
  challengeTitle: { zh: '赢下冠军', en: 'Win the title' },
  challengeModern: { zh: '组建现代阵容（2016 起）', en: 'Build a modern-era XI (2016+)' },
  challengeAllTime: { zh: '跨时代全明星十一人', en: 'Draft an all-time XI from every era' },
  challengeHard: { zh: '困难模式：隐藏评分', en: 'Hard mode with ratings hidden' },

  // Competitions
  compsTitle: { zh: '选择赛事', en: 'Choose your competition' },
  compsSub: {
    zh: '从联赛到世界杯，跨越时代与大陆。',
    en: 'From leagues to the World Cup, across eras and continents.',
  },

  // Game setup
  setupTitle: { zh: '赛前设置', en: 'Match setup' },
  formation: { zh: '阵型', en: 'Formation' },
  difficulty: { zh: '难度', en: 'Difficulty' },
  showRatings: { zh: '显示评分', en: 'Show ratings' },
  hideRatings: { zh: '隐藏评分（困难）', en: 'Hide ratings (hard)' },
  draftMode: { zh: '选秀模式', en: 'Draft mode' },
  era: { zh: '时代范围', en: 'Era' },
  eraHint: {
    zh: '转盘只会落在该范围内的俱乐部-赛季。',
    en: 'Only club-seasons in this range can be spun.',
  },
  eraFrom: { zh: '起始赛季', en: 'From season' },
  eraTo: { zh: '结束赛季', en: 'To season' },
  season: { zh: '赛季', en: 'seasons' },
  startDraft: { zh: '开始选秀', en: 'Start draft' },

  // Draft
  spin: { zh: '转动转盘', en: 'Spin' },
  spinning: { zh: '转动中…', en: 'Spinning…' },
  landed: { zh: '落在', en: 'Landed on' },
  pickPlayer: { zh: '选择一名球员放入此位置', en: 'Pick a player for this slot' },
  squad: { zh: '阵容', en: 'Squad' },
  noPlayers: { zh: '该阵容没有可选球员', en: 'No draftable players in this squad' },
  reroll: { zh: '再转一次', en: 'Spin again' },
  position: { zh: '位置', en: 'Position' },
  rating: { zh: '评分', en: 'OVR' },
  filled: { zh: '已填', en: 'filled' },
  simulate: { zh: '模拟赛季', en: 'Simulate season' },
  simulating: { zh: '模拟中…', en: 'Simulating…' },

  // Positions
  posGK: { zh: '门将', en: 'Keeper' },
  posDEF: { zh: '后卫', en: 'Defence' },
  posMID: { zh: '中场', en: 'Midfield' },
  posATT: { zh: '前锋', en: 'Attack' },

  // Attributes
  attrPace: { zh: '速度', en: 'PAC' },
  attrShooting: { zh: '射门', en: 'SHO' },
  attrPassing: { zh: '传球', en: 'PAS' },
  attrDribbling: { zh: '盘带', en: 'DRI' },
  attrDefending: { zh: '防守', en: 'DEF' },
  attrPhysical: { zh: '身体', en: 'PHY' },

  // Results
  resultsTitle: { zh: '赛季战报', en: 'Season report' },
  finalPosition: { zh: '最终排名', en: 'Final position' },
  record: { zh: '战绩', en: 'Record' },
  goals: { zh: '进球', en: 'Goals' },
  points: { zh: '积分', en: 'Points' },
  unbeaten: { zh: '不败赛季！', en: 'Unbeaten season!' },
  perfect: { zh: '全胜！传奇！', en: 'Perfect season! Legendary!' },
  champion: { zh: '冠军', en: 'Champions' },
  of: { zh: '共', en: 'of' },
  teams: { zh: '队', en: 'teams' },
  playAgain: { zh: '再来一局', en: 'Play again' },
  changeSetup: { zh: '修改设置', en: 'Change setup' },
  matchday: { zh: '第', en: 'MD' },
  home: { zh: '主', en: 'H' },
  away: { zh: '客', en: 'A' },
  vs: { zh: 'vs', en: 'vs' },

  // Misc
  back: { zh: '返回', en: 'Back' },
  next: { zh: '下一步', en: 'Next' },
  langToggle: { zh: 'EN', en: '中' },
  restartAll: { zh: '完全重新开始', en: 'Restart all' },
  bench: { zh: '替补席', en: 'Bench' },
  teamStrength: { zh: '球队实力', en: 'Team strength' },
  attack: { zh: '进攻', en: 'Attack' },
  midfield: { zh: '中场', en: 'Midfield' },
  defence: { zh: '防守', en: 'Defence' },
  overall: { zh: '总评', en: 'Overall' },
  footerNote: {
    zh: 'DreamXI 是独立粉丝作品，与任何俱乐部、联赛、赛事或数据提供商无关。球员评分基于公开数据的独立解读，仅供参考。',
    en: 'DreamXI is an independent fan-made game, not affiliated with any club, league, competition, or ratings provider. Ratings are an independent interpretation for descriptive purposes only.',
  },
  inspiredBy: {
    zh: '灵感来自 82-0.com 与 38-0.app，致以谢意。',
    en: 'Inspired by and with thanks to 82-0.com and 38-0.app.',
  },
  dataNote: {
    zh: '球员数据为精选样本，覆盖英超、西甲、中超、欧冠与世界杯的标志性阵容。',
    en: 'Player data is a curated sample covering iconic squads from the EPL, La Liga, CSL, Champions League and World Cup.',
  },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, lang: Lang): string {
  return STRINGS[key][lang];
}
