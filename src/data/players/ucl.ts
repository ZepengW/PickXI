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

// Champions League — European elite sides (EPL/La Liga clubs already have data).
export const UCL_PLAYERS: Player[] = [
  // ===== Bayern München 2012-13 (treble) =====
  p('Manuel Neuer', '诺伊尔', 'GK', ['GK'], 'bay', '2012-13', 'ucl', 90, [55, 30, 65, 60, 89, 84], 'Germany', '德国', 1),
  p('Philipp Lahm', '拉姆', 'RB', ['RB', 'LB', 'CDM'], 'bay', '2012-13', 'ucl', 88, [80, 55, 82, 82, 84, 76], 'Germany', '德国', 21),
  p('Dante', '丹特', 'CB', ['CB'], 'bay', '2012-13', 'ucl', 84, [72, 45, 68, 68, 85, 84], 'Brazil', '巴西', 4),
  p('Jérôme Boateng', '博阿滕', 'CB', ['CB', 'RB'], 'bay', '2012-13', 'ucl', 85, [78, 50, 72, 72, 85, 84], 'Germany', '德国', 17),
  p('David Alaba', '阿拉巴', 'LB', ['LB', 'CM', 'CB'], 'bay', '2012-13', 'ucl', 85, [82, 65, 82, 82, 80, 78], 'Austria', '奥地利', 27),
  p('Bastian Schweinsteiger', '施魏因斯泰格', 'CM', ['CM', 'CDM'], 'bay', '2012-13', 'ucl', 87, [70, 76, 84, 82, 80, 82], 'Germany', '德国', 31),
  p('Javi Martínez', '哈维·马丁内斯', 'CDM', ['CDM', 'CB'], 'bay', '2012-13', 'ucl', 84, [70, 55, 76, 72, 84, 84], 'Spain', '西班牙', 8),
  p('Thomas Müller', '托马斯·穆勒', 'CF', ['CF', 'CAM', 'ST', 'RW'], 'bay', '2012-13', 'ucl', 87, [76, 82, 80, 82, 60, 76], 'Germany', '德国', 25),
  p('Franck Ribéry', '里贝里', 'LW', ['LW', 'CAM'], 'bay', '2012-13', 'ucl', 89, [88, 80, 84, 90, 50, 72], 'France', '法国', 7),
  p('Arjen Robben', '罗本', 'RW', ['RW', 'LW', 'ST'], 'bay', '2012-13', 'ucl', 89, [88, 86, 80, 88, 50, 74], 'Netherlands', '荷兰', 10),
  p('Mario Mandžukić', '曼朱基奇', 'ST', ['ST', 'CF'], 'bay', '2012-13', 'ucl', 84, [76, 80, 70, 74, 50, 84], 'Croatia', '克罗地亚', 9),
  p('Toni Kroos', '克罗斯', 'CM', ['CM', 'CDM'], 'bay', '2012-13', 'ucl', 86, [60, 74, 88, 82, 70, 72], 'Germany', '德国', 39),

  // ===== AC Milan 2006-07 (UCL winners) =====
  p('Dida', '迪达', 'GK', ['GK'], 'mil', '2006-07', 'ucl', 86, [50, 25, 58, 55, 86, 82], 'Brazil', '巴西', 1),
  p('Cafu', '卡福', 'RB', ['RB', 'RWB'], 'mil', '2006-07', 'ucl', 84, [86, 55, 78, 78, 78, 76], 'Brazil', '巴西', 2),
  p('Paolo Maldini', '马尔蒂尼', 'CB', ['CB', 'LB'], 'mil', '2006-07', 'ucl', 88, [74, 45, 76, 74, 90, 84], 'Italy', '意大利', 3),
  p('Alessandro Nesta', '内斯塔', 'CB', ['CB'], 'mil', '2006-07', 'ucl', 89, [74, 45, 72, 72, 91, 84], 'Italy', '意大利', 13),
  p('Marek Jankulovski', '扬库洛夫斯基', 'LB', ['LB', 'LWB'], 'mil', '2006-07', 'ucl', 83, [80, 60, 76, 76, 78, 78], 'Czechia', '捷克', 18),
  p('Gennaro Gattuso', '加图索', 'CDM', ['CDM', 'CM'], 'mil', '2006-07', 'ucl', 85, [76, 60, 76, 74, 86, 84], 'Italy', '意大利', 8),
  p('Andrea Pirlo', '皮尔洛', 'CM', ['CM', 'CDM', 'CAM'], 'mil', '2006-07', 'ucl', 89, [60, 72, 92, 84, 70, 68], 'Italy', '意大利', 21),
  p('Clarence Seedorf', '西多夫', 'CM', ['CM', 'CAM', 'LM'], 'mil', '2006-07', 'ucl', 87, [74, 76, 86, 86, 72, 78], 'Netherlands', '荷兰', 10),
  p('Kaká', '卡卡', 'CAM', ['CAM', 'CF', 'ST'], 'mil', '2006-07', 'ucl', 92, [88, 86, 88, 92, 56, 78], 'Brazil', '巴西', 22),
  p('Filippo Inzaghi', '因扎吉', 'ST', ['ST', 'CF'], 'mil', '2006-07', 'ucl', 86, [78, 86, 70, 76, 40, 72], 'Italy', '意大利', 9),
  p('Alberto Gilardino', '吉拉迪诺', 'ST', ['ST', 'CF'], 'mil', '2006-07', 'ucl', 83, [76, 80, 70, 74, 45, 78], 'Italy', '意大利', 11),

  // ===== Inter Milan 2009-10 (treble) =====
  p('Júlio César', '胡利奥·塞萨尔', 'GK', ['GK'], 'int', '2009-10', 'ucl', 87, [52, 28, 58, 55, 87, 82], 'Brazil', '巴西', 1),
  p('Maicon', '麦孔', 'RB', ['RB', 'RWB'], 'int', '2009-10', 'ucl', 87, [86, 65, 80, 82, 82, 82], 'Brazil', '巴西', 13),
  p('Lúcio', '卢西奥', 'CB', ['CB'], 'int', '2009-10', 'ucl', 86, [76, 55, 72, 72, 86, 84], 'Brazil', '巴西', 6),
  p('Walter Samuel', '萨穆埃尔', 'CB', ['CB'], 'int', '2009-10', 'ucl', 85, [68, 45, 70, 68, 88, 84], 'Argentina', '阿根廷', 25),
  p('Javier Zanetti', '萨内蒂', 'LB', ['LB', 'RB', 'CM'], 'int', '2009-10', 'ucl', 86, [82, 60, 80, 82, 82, 82], 'Argentina', '阿根廷', 4),
  p('Esteban Cambiasso', '坎比亚索', 'CDM', ['CDM', 'CM'], 'int', '2009-10', 'ucl', 85, [68, 65, 82, 78, 82, 80], 'Argentina', '阿根廷', 19),
  p('Wesley Sneijder', '斯内德', 'CAM', ['CAM', 'CM'], 'int', '2009-10', 'ucl', 88, [72, 82, 90, 86, 56, 68], 'Netherlands', '荷兰', 10),
  p('Samuel Eto\'o', '埃托奥', 'ST', ['ST', 'LW', 'CF'], 'int', '2009-10', 'ucl', 88, [86, 87, 76, 84, 50, 80], 'Cameroon', '喀麦隆', 9),
  p('Diego Milito', '迭戈·米利托', 'ST', ['ST', 'CF'], 'int', '2009-10', 'ucl', 86, [76, 86, 76, 80, 50, 78], 'Argentina', '阿根廷', 22),
  p('Goran Pandev', '潘德夫', 'LW', ['LW', 'CF', 'CAM'], 'int', '2009-10', 'ucl', 82, [74, 72, 80, 80, 56, 70], 'North Macedonia', '北马其顿', 27),

  // ===== Juventus 2014-15 =====
  p('Gianluigi Buffon', '布冯', 'GK', ['GK'], 'juv', '2014-15', 'ucl', 88, [50, 25, 60, 55, 88, 82], 'Italy', '意大利', 1),
  p('Andrea Barzagli', '巴尔扎利', 'CB', ['CB'], 'juv', '2014-15', 'ucl', 84, [68, 40, 68, 66, 86, 82], 'Italy', '意大利', 15),
  p('Leonardo Bonucci', '博努奇', 'CB', ['CB', 'CDM'], 'juv', '2014-15', 'ucl', 85, [70, 50, 78, 70, 86, 82], 'Italy', '意大利', 19),
  p('Giorgio Chiellini', '基耶利尼', 'CB', ['CB', 'LB'], 'juv', '2014-15', 'ucl', 87, [72, 50, 70, 68, 90, 86], 'Italy', '意大利', 3),
  p('Patrice Evra', '埃弗拉', 'LB', ['LB', 'LWB'], 'juv', '2014-15', 'ucl', 83, [84, 55, 76, 78, 80, 80], 'France', '法国', 33),
  p('Arturo Vidal', '比达尔', 'CM', ['CM', 'CDM'], 'juv', '2014-15', 'ucl', 86, [78, 76, 80, 80, 80, 84], 'Chile', '智利', 23),
  p('Paul Pogba', '博格巴', 'CM', ['CM', 'CAM', 'CDM'], 'juv', '2014-15', 'ucl', 87, [80, 78, 84, 86, 74, 84], 'France', '法国', 6),
  p('Claudio Marchisio', '马尔基西奥', 'CM', ['CM', 'CDM'], 'juv', '2014-15', 'ucl', 84, [74, 70, 82, 78, 76, 76], 'Italy', '意大利', 8),
  p('Carlos Tevez', '特维斯', 'ST', ['ST', 'CF'], 'juv', '2014-15', 'ucl', 86, [84, 84, 78, 84, 50, 80], 'Argentina', '阿根廷', 10),
  p('Álvaro Morata', '莫拉塔', 'ST', ['ST', 'LW'], 'juv', '2014-15', 'ucl', 83, [82, 80, 72, 78, 50, 80], 'Spain', '西班牙', 9),

  // ===== PSG 2019-20 (UCL final) =====
  p('Keylor Navas', '纳瓦斯', 'GK', ['GK'], 'psg', '2019-20', 'ucl', 87, [52, 28, 60, 56, 86, 78], 'Costa Rica', '哥斯达黎加', 1),
  p('Thiago Silva', '蒂亚戈·席尔瓦', 'CB', ['CB'], 'psg', '2019-20', 'ucl', 87, [70, 45, 74, 72, 89, 84], 'Brazil', '巴西', 2),
  p('Marquinhos', '马尔基尼奥斯', 'CB', ['CB', 'CDM', 'RB'], 'psg', '2019-20', 'ucl', 86, [76, 50, 76, 74, 87, 82], 'Brazil', '巴西', 5),
  p('Juan Bernat', '贝尔纳特', 'LB', ['LB', 'LWB'], 'psg', '2019-20', 'ucl', 82, [82, 55, 76, 76, 76, 74], 'Spain', '西班牙', 14),
  p('Marco Verratti', '维拉蒂', 'CM', ['CM', 'CDM', 'CAM'], 'psg', '2019-20', 'ucl', 87, [70, 65, 88, 88, 70, 70], 'Italy', '意大利', 6),
  p('Ander Herrera', '埃雷拉', 'CM', ['CM', 'CDM'], 'psg', '2019-20', 'ucl', 83, [72, 68, 80, 78, 74, 76], 'Spain', '西班牙', 21),
  p('Ángel Di María', '迪马利亚', 'RW', ['RW', 'CAM', 'LM'], 'psg', '2019-20', 'ucl', 86, [86, 80, 84, 86, 60, 70], 'Argentina', '阿根廷', 11),
  p('Neymar', '内马尔', 'LW', ['LW', 'CAM', 'ST'], 'psg', '2019-20', 'ucl', 91, [88, 84, 88, 92, 45, 68], 'Brazil', '巴西', 10),
  p('Kylian Mbappé', '姆巴佩', 'ST', ['ST', 'LW', 'RW'], 'psg', '2019-20', 'ucl', 90, [96, 88, 80, 88, 45, 78], 'France', '法国', 7),
  p('Mauro Icardi', '伊卡尔迪', 'ST', ['ST', 'CF'], 'psg', '2019-20', 'ucl', 84, [76, 86, 70, 76, 45, 80], 'Argentina', '阿根廷', 18),

  // ===== Borussia Dortmund 2012-13 (UCL final) =====
  p('Roman Weidenfeller', '魏登费勒', 'GK', ['GK'], 'dor', '2012-13', 'ucl', 84, [50, 25, 58, 55, 84, 80], 'Germany', '德国', 1),
  p('Łukasz Piszczek', '皮什切克', 'RB', ['RB', 'RWB'], 'dor', '2012-13', 'ucl', 83, [78, 55, 74, 74, 80, 80], 'Poland', '波兰', 26),
  p('Mats Hummels', '胡梅尔斯', 'CB', ['CB', 'CDM'], 'dor', '2012-13', 'ucl', 86, [70, 50, 78, 72, 86, 84], 'Germany', '德国', 5),
  p('Neven Subotić', '苏博蒂奇', 'CB', ['CB'], 'dor', '2012-13', 'ucl', 84, [68, 45, 66, 66, 86, 84], 'Serbia', '塞尔维亚', 4),
  p('Marcel Schmelzer', '施梅尔策', 'LB', ['LB', 'LWB'], 'dor', '2012-13', 'ucl', 82, [78, 50, 74, 74, 78, 76], 'Germany', '德国', 29),
  p('Sven Bender', '斯文·本德', 'CDM', ['CDM', 'CB'], 'dor', '2012-13', 'ucl', 83, [74, 60, 76, 72, 82, 80], 'Germany', '德国', 6),
  p('İlkay Gündoğan', '京多安', 'CM', ['CM', 'CDM'], 'dor', '2012-13', 'ucl', 85, [72, 70, 84, 84, 72, 74], 'Germany', '德国', 8),
  p('Marco Reus', '罗伊斯', 'LW', ['LW', 'CAM', 'ST'], 'dor', '2012-13', 'ucl', 87, [86, 82, 82, 86, 56, 72], 'Germany', '德国', 11),
  p('Mario Götze', '格策', 'CAM', ['CAM', 'CM', 'LW'], 'dor', '2012-13', 'ucl', 86, [78, 76, 84, 88, 56, 68], 'Germany', '德国', 10),
  p('Robert Lewandowski', '莱万多夫斯基', 'ST', ['ST', 'CF'], 'dor', '2012-13', 'ucl', 88, [78, 88, 78, 82, 50, 84], 'Poland', '波兰', 9),
  p('Jakub Błaszczykowski', '布瓦什奇科夫斯基', 'RM', ['RM', 'RW'], 'dor', '2012-13', 'ucl', 82, [82, 74, 76, 76, 64, 74], 'Poland', '波兰', 16),
];
