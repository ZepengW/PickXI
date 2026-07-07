import type { Player } from '../../types';
import { p } from './_helpers';

// Data sources (fan-curated, based on publicly available information):
// - SoFIFA.com (EA FC / FIFA player attributes, historical snapshots)
// - FM Inside / Sortitoutsi (Football Manager player data exports)
// - Transfermarkt (player profiles, nationalities, squad numbers)
// - Wikipedia (historical squad rosters)
// Ratings are an independent interpretation for a fan-made game, not affiliated
// with any data provider. Attributes follow the six-axis model:
// PAC (pace), SHO (shooting), PAS (passing), DRI (dribbling), DEF (defending), PHY (physical).

// Chinese Super League — golden era squads.
export const CSL_PLAYERS: Player[] = [
  // ===== Guangzhou Evergrande 2013 (ACL champions) =====
  p('Zeng Cheng', '曾诚', 'GK', ['GK'], 'gzg', '2013', 'csl', 15, [10, 5, 11, 10, 15, 15], 'China', '中国', 19),
  p('Sun Xiang', '孙祥', 'LB', ['LB', 'LWB'], 'gzg', '2013', 'csl', 15, [15, 10, 14, 14, 14, 15], 'China', '中国', 32),
  p('Feng Xiaoting', '冯潇霆', 'CB', ['CB'], 'gzg', '2013', 'csl', 15, [14, 8, 13, 13, 16, 16], 'China', '中国', 6),
  p('Kim Young-gwon', '金英权', 'CB', ['CB'], 'gzg', '2013', 'csl', 15, [14, 8, 13, 13, 16, 16], 'South Korea', '韩国', 28),
  p('Zhang Linpeng', '张琳芃', 'RB', ['RB', 'CB'], 'gzg', '2013', 'csl', 15, [16, 10, 14, 14, 15, 16], 'China', '中国', 5),
  p('Zheng Zhi', '郑智', 'CM', ['CM', 'CDM', 'CB'], 'gzg', '2013', 'csl', 16, [13, 12, 15, 14, 15, 15], 'China', '中国', 10),
  p('Huang Bowen', '黄博文', 'CM', ['CM', 'RM'], 'gzg', '2013', 'csl', 15, [13, 13, 15, 14, 13, 14], 'China', '中国', 16),
  p('Conca', '孔卡', 'CAM', ['CAM', 'CM'], 'gzg', '2013', 'csl', 16, [14, 15, 17, 17, 11, 13], 'Argentina', '阿根廷', 15),
  p('Muriqui', '穆里奇', 'LW', ['LW', 'ST'], 'gzg', '2013', 'csl', 16, [18, 15, 14, 16, 9, 14], 'Brazil', '巴西', 11),
  p('Elkeson', '埃尔克森', 'ST', ['ST', 'CF'], 'gzg', '2013', 'csl', 16, [16, 16, 14, 15, 9, 16], 'Brazil', '巴西', 9),
  p('Gao Lin', '郜林', 'ST', ['ST', 'LW', 'CF'], 'gzg', '2013', 'csl', 15, [15, 14, 14, 14, 10, 15], 'China', '中国', 29),

  // ===== Guangzhou 2015 (ACL champions) =====
  p('Zeng Cheng', '曾诚', 'GK', ['GK'], 'gzg', '2015', 'csl', 15, [10, 5, 11, 10, 15, 15], 'China', '中国', 19),
  p('Zhang Linpeng', '张琳芃', 'RB', ['RB', 'CB'], 'gzg', '2015', 'csl', 15, [16, 10, 14, 14, 15, 16], 'China', '中国', 5),
  p('Feng Xiaoting', '冯潇霆', 'CB', ['CB'], 'gzg', '2015', 'csl', 15, [14, 8, 13, 13, 16, 16], 'China', '中国', 6),
  p('Paulinho', '保利尼奥', 'CM', ['CM', 'CDM'], 'gzg', '2015', 'csl', 17, [16, 15, 16, 16, 16, 16], 'Brazil', '巴西', 48),
  p('Zheng Zhi', '郑智', 'CM', ['CM', 'CDM', 'CB'], 'gzg', '2015', 'csl', 15, [13, 12, 15, 14, 15, 15], 'China', '中国', 10),
  p('Ricardo Goulart', '高拉特', 'CAM', ['CAM', 'ST'], 'gzg', '2015', 'csl', 16, [16, 16, 16, 16, 10, 15], 'Brazil', '巴西', 11),
  p('Elkeson', '埃尔克森', 'ST', ['ST', 'CF'], 'gzg', '2015', 'csl', 16, [16, 16, 14, 15, 9, 16], 'Brazil', '巴西', 9),
  p('Alan', '阿兰', 'ST', ['ST', 'LW'], 'gzg', '2015', 'csl', 16, [16, 16, 14, 16, 9, 14], 'Brazil', '巴西', 7),

  // ===== Guangzhou 2019 (last title) =====
  p('Paulinho', '保利尼奥', 'CM', ['CM', 'CDM'], 'gzg', '2019', 'csl', 17, [16, 15, 16, 16, 16, 17], 'Brazil', '巴西', 48),
  p('Ricardo Goulart', '高拉特', 'CAM', ['CAM', 'ST'], 'gzg', '2019', 'csl', 16, [15, 16, 16, 16, 10, 15], 'Brazil', '巴西', 11),
  p('Wei Shihao', '韦世豪', 'LW', ['LW', 'ST'], 'gzg', '2019', 'csl', 15, [16, 14, 13, 15, 9, 14], 'China', '中国', 17),
  p('Yang Liyu', '杨立瑜', 'RW', ['RW', 'ST'], 'gzg', '2019', 'csl', 15, [15, 14, 13, 14, 9, 14], 'China', '中国', 27),
  p('Park Ji-soo', '朴志洙', 'CB', ['CB'], 'gzg', '2019', 'csl', 15, [14, 8, 13, 13, 16, 16], 'South Korea', '韩国', 23),

  // ===== Shanghai SIPG 2018 (champions) =====
  p('Yan Junling', '颜骏凌', 'GK', ['GK'], 'shp', '2018', 'csl', 15, [10, 5, 11, 10, 15, 15], 'China', '中国', 1),
  p('Wang Shenchao', '王燊超', 'RB', ['RB', 'CB', 'LB'], 'shp', '2018', 'csl', 15, [15, 10, 14, 14, 15, 15], 'China', '中国', 4),
  p('Fu Huan', '傅欢', 'RB', ['RB', 'RWB'], 'shp', '2018', 'csl', 14, [16, 9, 13, 13, 14, 14], 'China', '中国', 23),
  p('Shi Ke', '石柯', 'CB', ['CB'], 'shp', '2018', 'csl', 15, [14, 8, 13, 13, 15, 15], 'China', '中国', 5),
  p('Oscar', '奥斯卡', 'CAM', ['CAM', 'CM'], 'shp', '2018', 'csl', 17, [16, 16, 18, 17, 12, 14], 'Brazil', '巴西', 8),
  p('Hulk', '胡尔克', 'RW', ['RW', 'ST', 'CAM'], 'shp', '2018', 'csl', 17, [17, 17, 16, 16, 11, 17], 'Brazil', '巴西', 10),
  p('Wu Lei', '武磊', 'ST', ['ST', 'RW', 'LW'], 'shp', '2018', 'csl', 16, [17, 16, 14, 15, 9, 14], 'China', '中国', 7),
  p('Elkeson', '埃尔克森', 'ST', ['ST', 'CF'], 'shp', '2018', 'csl', 16, [16, 16, 14, 15, 9, 16], 'Brazil', '巴西', 9),
  p('Cai Huikang', '蔡慧康', 'CDM', ['CDM', 'CM'], 'shp', '2018', 'csl', 15, [13, 11, 14, 13, 15, 16], 'China', '中国', 6),
  p('Lu Wenjun', '吕文君', 'LM', ['LM', 'LW'], 'shp', '2018', 'csl', 14, [15, 13, 13, 14, 11, 14], 'China', '中国', 11),

  // ===== Beijing Guoan 2019 =====
  p('Hou Sen', '侯森', 'GK', ['GK'], 'bgu', '2019', 'csl', 15, [10, 5, 11, 10, 15, 15], 'China', '中国', 1),
  p('Kim Min-jae', '金玟哉', 'CB', ['CB'], 'bgu', '2019', 'csl', 16, [15, 9, 13, 13, 16, 16], 'South Korea', '韩国', 27),
  p('Li Ke', '李可', 'CM', ['CM', 'CDM'], 'bgu', '2019', 'csl', 15, [14, 12, 15, 14, 14, 15], 'England', '英格兰(归化)', 23),
  p('Renato Augusto', '奥古斯托', 'CAM', ['CAM', 'CM'], 'bgu', '2019', 'csl', 17, [15, 15, 17, 17, 13, 16], 'Brazil', '巴西', 5),
  p('Cédric Bakambu', '巴坎布', 'ST', ['ST', 'CF'], 'bgu', '2019', 'csl', 16, [17, 16, 14, 16, 9, 15], 'DR Congo', '刚果(金)', 17),
  p('Wang Ziming', '王梓铭', 'ST', ['ST', 'CAM'], 'bgu', '2019', 'csl', 14, [14, 13, 13, 14, 9, 14], 'China', '中国', 10),
  p('Zhang Xizhe', '张稀哲', 'LM', ['LM', 'CAM'], 'bgu', '2019', 'csl', 15, [14, 13, 15, 15, 11, 13], 'China', '中国', 10),

  // ===== Shandong Taishan 2021 (double) — using 2022 =====
  p('Wang Dalei', '王大雷', 'GK', ['GK'], 'srg', '2022', 'csl', 15, [10, 6, 11, 11, 15, 15], 'China', '中国', 14),
  p('Jadson', '贾德松', 'CB', ['CB', 'CDM'], 'srg', '2022', 'csl', 15, [14, 9, 13, 13, 16, 16], 'Brazil', '巴西', 4),
  p('Marouane Fellaini', '费莱尼', 'CM', ['CM', 'ST', 'CDM'], 'srg', '2022', 'csl', 16, [13, 15, 15, 15, 15, 17], 'Belgium', '比利时', 25),
  p('Moisés', '莫伊塞斯', 'CM', ['CM', 'CDM'], 'srg', '2022', 'csl', 15, [13, 13, 16, 15, 14, 15], 'Brazil', '巴西', 10),
  p('Cryzan', '克雷桑', 'ST', ['ST', 'LW'], 'srg', '2022', 'csl', 16, [16, 16, 14, 15, 9, 16], 'Brazil', '巴西', 9),
  p('Chen Pu', '陈蒲', 'LW', ['LW', 'ST'], 'srg', '2022', 'csl', 15, [16, 13, 13, 14, 9, 14], 'China', '中国', 29),
];
