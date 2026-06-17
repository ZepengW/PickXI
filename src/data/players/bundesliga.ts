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

export const BUNDESLIGA_PLAYERS: Player[] = [
  // ===== Bayern München 2000-01 (Champions League winners) =====
  p('Oliver Kahn', '卡恩', 'GK', ['GK'], 'bay', '2000-01', 'bundesliga', 90, [55, 30, 60, 55, 89, 88], 'Germany', '德国', 1),
  p('Willy Sagnol', '萨尼奥尔', 'RB', ['RB', 'RWB'], 'bay', '2000-01', 'bundesliga', 84, [78, 50, 74, 72, 82, 80], 'France', '法国', 2),
  p('Samuel Kuffour', '库福尔', 'CB', ['CB'], 'bay', '2000-01', 'bundesliga', 84, [74, 45, 65, 68, 86, 84], 'Ghana', '加纳', 4),
  p('Patrik Andersson', '安德森', 'CB', ['CB', 'CDM'], 'bay', '2000-01', 'bundesliga', 83, [68, 45, 70, 66, 85, 82], 'Sweden', '瑞典', 5),
  p('Bixente Lizarazu', '利扎拉祖', 'LB', ['LB', 'LWB'], 'bay', '2000-01', 'bundesliga', 86, [88, 55, 78, 82, 82, 78], 'France', '法国', 3),
  p('Stefan Effenberg', '埃芬博格', 'CM', ['CM', 'CAM'], 'bay', '2000-01', 'bundesliga', 86, [68, 76, 84, 82, 76, 82], 'Germany', '德国', 10),
  p('Jens Jeremies', '耶雷梅斯', 'CDM', ['CDM', 'CB'], 'bay', '2000-01', 'bundesliga', 82, [72, 50, 72, 68, 82, 80], 'Germany', '德国', 6),
  p('Mehmet Scholl', '绍尔', 'CAM', ['CAM', 'RM', 'LM'], 'bay', '2000-01', 'bundesliga', 85, [78, 76, 84, 86, 56, 68], 'Germany', '德国', 7),
  p('Giovane Élber', '埃尔伯', 'ST', ['ST', 'CF'], 'bay', '2000-01', 'bundesliga', 86, [84, 84, 74, 82, 45, 76], 'Brazil', '巴西', 9),
  p('Carsten Jancker', '扬克尔', 'ST', ['ST', 'CF'], 'bay', '2000-01', 'bundesliga', 80, [72, 76, 64, 70, 45, 84], 'Germany', '德国', 19),
  p('Hasan Salihamidžić', '萨利哈米季奇', 'RM', ['RM', 'RW', 'RB'], 'bay', '2000-01', 'bundesliga', 82, [84, 68, 76, 78, 70, 76], 'Bosnia and Herzegovina', '波黑', 20),

  // ===== Bayern München 2012-13 (Treble under Heynckes) =====
  p('Manuel Neuer', '诺伊尔', 'GK', ['GK'], 'bay', '2012-13', 'bundesliga', 90, [55, 30, 65, 60, 89, 84], 'Germany', '德国', 1),
  p('Philipp Lahm', '拉姆', 'RB', ['RB', 'LB', 'CDM'], 'bay', '2012-13', 'bundesliga', 88, [80, 55, 82, 82, 84, 76], 'Germany', '德国', 21),
  p('Dante', '丹特', 'CB', ['CB'], 'bay', '2012-13', 'bundesliga', 84, [72, 45, 68, 68, 85, 84], 'Brazil', '巴西', 4),
  p('Jérôme Boateng', '博阿滕', 'CB', ['CB', 'RB'], 'bay', '2012-13', 'bundesliga', 85, [78, 50, 72, 72, 85, 84], 'Germany', '德国', 17),
  p('David Alaba', '阿拉巴', 'LB', ['LB', 'CM', 'CB'], 'bay', '2012-13', 'bundesliga', 85, [82, 65, 82, 82, 80, 78], 'Austria', '奥地利', 27),
  p('Javi Martínez', '哈维·马丁内斯', 'CDM', ['CDM', 'CB'], 'bay', '2012-13', 'bundesliga', 84, [70, 55, 76, 72, 84, 84], 'Spain', '西班牙', 8),
  p('Bastian Schweinsteiger', '施魏因斯泰格', 'CM', ['CM', 'CDM'], 'bay', '2012-13', 'bundesliga', 87, [70, 76, 84, 82, 80, 82], 'Germany', '德国', 31),
  p('Thomas Müller', '托马斯·穆勒', 'CF', ['CF', 'CAM', 'ST', 'RW'], 'bay', '2012-13', 'bundesliga', 87, [76, 82, 80, 82, 60, 76], 'Germany', '德国', 25),
  p('Franck Ribéry', '里贝里', 'LW', ['LW', 'CAM'], 'bay', '2012-13', 'bundesliga', 89, [88, 80, 84, 90, 50, 72], 'France', '法国', 7),
  p('Mario Mandžukić', '曼朱基奇', 'ST', ['ST', 'CF'], 'bay', '2012-13', 'bundesliga', 84, [76, 80, 70, 74, 50, 84], 'Croatia', '克罗地亚', 9),
  p('Arjen Robben', '罗本', 'RW', ['RW', 'LW', 'ST'], 'bay', '2012-13', 'bundesliga', 89, [88, 86, 80, 88, 50, 74], 'Netherlands', '荷兰', 10),

  // ===== Bayern München 2019-20 (Treble under Flick) =====
  p('Manuel Neuer', '诺伊尔', 'GK', ['GK'], 'bay', '2019-20', 'bundesliga', 90, [55, 30, 65, 60, 90, 84], 'Germany', '德国', 1),
  p('Joshua Kimmich', '基米希', 'RB', ['RB', 'CDM', 'CM'], 'bay', '2019-20', 'bundesliga', 89, [80, 70, 84, 80, 80, 78], 'Germany', '德国', 32),
  p('Jérôme Boateng', '博阿滕', 'CB', ['CB', 'RB'], 'bay', '2019-20', 'bundesliga', 83, [74, 45, 70, 70, 84, 82], 'Germany', '德国', 17),
  p('David Alaba', '阿拉巴', 'CB', ['CB', 'LB', 'CM'], 'bay', '2019-20', 'bundesliga', 86, [80, 65, 82, 80, 84, 80], 'Austria', '奥地利', 27),
  p('Alphonso Davies', '戴维斯', 'LB', ['LB', 'LWB', 'LM'], 'bay', '2019-20', 'bundesliga', 84, [96, 60, 74, 84, 76, 76], 'Canada', '加拿大', 19),
  p('Leon Goretzka', '戈雷茨卡', 'CM', ['CM', 'CDM'], 'bay', '2019-20', 'bundesliga', 85, [80, 76, 80, 80, 76, 82], 'Germany', '德国', 18),
  p('Thiago', '蒂亚戈', 'CM', ['CM', 'CAM', 'CDM'], 'bay', '2019-20', 'bundesliga', 88, [70, 72, 88, 90, 72, 72], 'Spain', '西班牙', 6),
  p('Thomas Müller', '托马斯·穆勒', 'CF', ['CF', 'CAM', 'ST', 'RW'], 'bay', '2019-20', 'bundesliga', 87, [74, 82, 82, 82, 60, 76], 'Germany', '德国', 25),
  p('Serge Gnabry', '格纳布里', 'RW', ['RW', 'LW', 'ST'], 'bay', '2019-20', 'bundesliga', 86, [88, 82, 78, 84, 50, 74], 'Germany', '德国', 22),
  p('Robert Lewandowski', '莱万多夫斯基', 'ST', ['ST', 'CF'], 'bay', '2019-20', 'bundesliga', 91, [78, 91, 80, 84, 50, 84], 'Poland', '波兰', 9),
  p('Kingsley Coman', '科曼', 'LW', ['LW', 'RW', 'ST'], 'bay', '2019-20', 'bundesliga', 85, [90, 76, 78, 86, 45, 72], 'France', '法国', 29),

  // ===== Bayern München 2022-23 (Bundesliga title) =====
  p('Yann Sommer', '索默', 'GK', ['GK'], 'bay', '2022-23', 'bundesliga', 84, [52, 28, 60, 56, 84, 80], 'Switzerland', '瑞士', 27),
  p('Benjamin Pavard', '帕瓦尔', 'CB', ['CB', 'RB'], 'bay', '2022-23', 'bundesliga', 83, [76, 55, 72, 70, 84, 82], 'France', '法国', 5),
  p('Matthijs de Ligt', '德利赫特', 'CB', ['CB'], 'bay', '2022-23', 'bundesliga', 85, [72, 50, 72, 70, 87, 86], 'Netherlands', '荷兰', 4),
  p('Dayot Upamecano', '于帕梅卡诺', 'CB', ['CB'], 'bay', '2022-23', 'bundesliga', 83, [80, 45, 70, 70, 85, 84], 'France', '法国', 2),
  p('Alphonso Davies', '戴维斯', 'LB', ['LB', 'LWB', 'LM'], 'bay', '2022-23', 'bundesliga', 85, [95, 60, 76, 84, 78, 76], 'Canada', '加拿大', 19),
  p('Joshua Kimmich', '基米希', 'CM', ['CM', 'CDM', 'RB'], 'bay', '2022-23', 'bundesliga', 88, [78, 72, 86, 80, 80, 78], 'Germany', '德国', 6),
  p('Leon Goretzka', '戈雷茨卡', 'CM', ['CM', 'CDM'], 'bay', '2022-23', 'bundesliga', 85, [78, 76, 80, 80, 78, 84], 'Germany', '德国', 18),
  p('Thomas Müller', '托马斯·穆勒', 'CF', ['CF', 'CAM', 'ST', 'RW'], 'bay', '2022-23', 'bundesliga', 85, [72, 80, 82, 80, 60, 76], 'Germany', '德国', 25),
  p('Leroy Sané', '萨内', 'RW', ['RW', 'LW', 'LM'], 'bay', '2022-23', 'bundesliga', 86, [90, 80, 80, 86, 45, 72], 'Germany', '德国', 10),
  p('Sadio Mané', '马内', 'ST', ['ST', 'LW', 'CF'], 'bay', '2022-23', 'bundesliga', 86, [89, 82, 78, 86, 50, 80], 'Senegal', '塞内加尔', 17),
  p('Kingsley Coman', '科曼', 'LW', ['LW', 'RW', 'ST'], 'bay', '2022-23', 'bundesliga', 85, [90, 76, 78, 86, 45, 72], 'France', '法国', 29),

  // ===== Borussia Dortmund 2001-02 (Bundesliga title) =====
  p('Jens Lehmann', '莱曼', 'GK', ['GK'], 'dor', '2001-02', 'bundesliga', 85, [55, 30, 58, 55, 85, 82], 'Germany', '德国', 1),
  p('Evanílson', '埃瓦尼尔森', 'RB', ['RB', 'RWB', 'RM'], 'dor', '2001-02', 'bundesliga', 80, [82, 55, 70, 72, 76, 76], 'Brazil', '巴西', 2),
  p('Christian Wörns', '沃恩斯', 'CB', ['CB'], 'dor', '2001-02', 'bundesliga', 83, [68, 40, 65, 66, 86, 82], 'Germany', '德国', 4),
  p('Jürgen Kohler', '科勒', 'CB', ['CB'], 'dor', '2001-02', 'bundesliga', 84, [66, 40, 64, 64, 87, 84], 'Germany', '德国', 5),
  p('Dédé', '德德', 'LB', ['LB', 'LWB', 'LM'], 'dor', '2001-02', 'bundesliga', 82, [84, 55, 74, 78, 76, 72], 'Brazil', '巴西', 3),
  p('Stefan Reuter', '罗伊特', 'CDM', ['CDM', 'RB'], 'dor', '2001-02', 'bundesliga', 80, [76, 50, 72, 70, 78, 76], 'Germany', '德国', 19),
  p('Sebastian Kehl', '凯尔', 'CM', ['CM', 'CDM'], 'dor', '2001-02', 'bundesliga', 82, [74, 60, 76, 74, 76, 78], 'Germany', '德国', 6),
  p('Tomáš Rosický', '罗西基', 'CAM', ['CAM', 'CM'], 'dor', '2001-02', 'bundesliga', 86, [80, 74, 86, 88, 56, 64], 'Czechia', '捷克', 10),
  p('Márcio Amoroso', '阿莫鲁索', 'ST', ['ST', 'CF'], 'dor', '2001-02', 'bundesliga', 86, [84, 86, 76, 84, 45, 74], 'Brazil', '巴西', 9),
  p('Jan Koller', '扬·科勒', 'ST', ['ST', 'CF'], 'dor', '2001-02', 'bundesliga', 84, [70, 80, 68, 70, 50, 86], 'Czechia', '捷克', 11),
  p('Ewerthon', '埃韦顿', 'RW', ['RW', 'RM', 'ST'], 'dor', '2001-02', 'bundesliga', 81, [90, 76, 70, 78, 45, 70], 'Brazil', '巴西', 7),

  // ===== Borussia Dortmund 2011-12 (Klopp's double) =====
  p('Roman Weidenfeller', '魏登费勒', 'GK', ['GK'], 'dor', '2011-12', 'bundesliga', 84, [50, 25, 58, 55, 84, 80], 'Germany', '德国', 1),
  p('Łukasz Piszczek', '皮什切克', 'RB', ['RB', 'RWB'], 'dor', '2011-12', 'bundesliga', 83, [78, 55, 74, 74, 80, 80], 'Poland', '波兰', 26),
  p('Neven Subotić', '苏博蒂奇', 'CB', ['CB'], 'dor', '2011-12', 'bundesliga', 84, [68, 45, 66, 66, 86, 84], 'Serbia', '塞尔维亚', 4),
  p('Mats Hummels', '胡梅尔斯', 'CB', ['CB', 'CDM'], 'dor', '2011-12', 'bundesliga', 85, [70, 50, 78, 72, 86, 84], 'Germany', '德国', 15),
  p('Marcel Schmelzer', '施梅尔策', 'LB', ['LB', 'LWB'], 'dor', '2011-12', 'bundesliga', 82, [78, 50, 74, 74, 78, 76], 'Germany', '德国', 29),
  p('Sven Bender', '斯文·本德', 'CDM', ['CDM', 'CB'], 'dor', '2011-12', 'bundesliga', 83, [74, 60, 76, 72, 82, 80], 'Germany', '德国', 6),
  p('İlkay Gündoğan', '京多安', 'CM', ['CM', 'CDM'], 'dor', '2011-12', 'bundesliga', 84, [72, 70, 84, 84, 72, 74], 'Germany', '德国', 8),
  p('Sebastian Kehl', '凯尔', 'CM', ['CM', 'CDM'], 'dor', '2011-12', 'bundesliga', 80, [68, 60, 74, 70, 76, 78], 'Germany', '德国', 5),
  p('Mario Götze', '格策', 'CAM', ['CAM', 'CM', 'LW'], 'dor', '2011-12', 'bundesliga', 85, [78, 76, 84, 88, 56, 68], 'Germany', '德国', 10),
  p('Robert Lewandowski', '莱万多夫斯基', 'ST', ['ST', 'CF'], 'dor', '2011-12', 'bundesliga', 86, [78, 86, 76, 80, 50, 82], 'Poland', '波兰', 9),
  p('Kevin Großkreutz', '格罗斯克罗伊茨', 'RM', ['RM', 'LM', 'RB'], 'dor', '2011-12', 'bundesliga', 79, [80, 65, 72, 74, 70, 76], 'Germany', '德国', 19),

  // ===== Borussia Dortmund 2012-13 (Champions League finalists) =====
  p('Roman Weidenfeller', '魏登费勒', 'GK', ['GK'], 'dor', '2012-13', 'bundesliga', 84, [50, 25, 58, 55, 84, 80], 'Germany', '德国', 1),
  p('Łukasz Piszczek', '皮什切克', 'RB', ['RB', 'RWB'], 'dor', '2012-13', 'bundesliga', 83, [78, 55, 74, 74, 80, 80], 'Poland', '波兰', 26),
  p('Neven Subotić', '苏博蒂奇', 'CB', ['CB'], 'dor', '2012-13', 'bundesliga', 84, [68, 45, 66, 66, 86, 84], 'Serbia', '塞尔维亚', 4),
  p('Mats Hummels', '胡梅尔斯', 'CB', ['CB', 'CDM'], 'dor', '2012-13', 'bundesliga', 86, [70, 50, 78, 72, 86, 84], 'Germany', '德国', 5),
  p('Marcel Schmelzer', '施梅尔策', 'LB', ['LB', 'LWB'], 'dor', '2012-13', 'bundesliga', 82, [78, 50, 74, 74, 78, 76], 'Germany', '德国', 29),
  p('Sven Bender', '斯文·本德', 'CDM', ['CDM', 'CB'], 'dor', '2012-13', 'bundesliga', 83, [74, 60, 76, 72, 82, 80], 'Germany', '德国', 6),
  p('İlkay Gündoğan', '京多安', 'CM', ['CM', 'CDM'], 'dor', '2012-13', 'bundesliga', 85, [72, 70, 84, 84, 72, 74], 'Germany', '德国', 8),
  p('Marco Reus', '罗伊斯', 'LW', ['LW', 'CAM', 'ST'], 'dor', '2012-13', 'bundesliga', 87, [86, 82, 82, 86, 56, 72], 'Germany', '德国', 11),
  p('Mario Götze', '格策', 'CAM', ['CAM', 'CM', 'LW'], 'dor', '2012-13', 'bundesliga', 86, [78, 76, 84, 88, 56, 68], 'Germany', '德国', 10),
  p('Robert Lewandowski', '莱万多夫斯基', 'ST', ['ST', 'CF'], 'dor', '2012-13', 'bundesliga', 88, [78, 88, 78, 82, 50, 84], 'Poland', '波兰', 9),
  p('Jakub Błaszczykowski', '布瓦什奇科夫斯基', 'RM', ['RM', 'RW'], 'dor', '2012-13', 'bundesliga', 82, [82, 74, 76, 76, 64, 74], 'Poland', '波兰', 16),

  // ===== Bayer Leverkusen 2001-02 (Champions League finalists) =====
  p('Hans-Jörg Butt', '布特', 'GK', ['GK'], 'lev', '2001-02', 'bundesliga', 83, [55, 30, 60, 55, 83, 80], 'Germany', '德国', 1),
  p('Boris Živković', '日夫科维奇', 'RB', ['RB', 'CB'], 'lev', '2001-02', 'bundesliga', 80, [76, 45, 68, 66, 80, 80], 'Croatia', '克罗地亚', 2),
  p('Jens Nowotny', '诺沃特尼', 'CB', ['CB', 'CDM'], 'lev', '2001-02', 'bundesliga', 85, [68, 45, 70, 68, 88, 82], 'Germany', '德国', 4),
  p('Lúcio', '卢西奥', 'CB', ['CB', 'CDM'], 'lev', '2001-02', 'bundesliga', 86, [80, 65, 74, 74, 84, 84], 'Brazil', '巴西', 5),
  p('Diego Placente', '普拉森特', 'LB', ['LB', 'LWB'], 'lev', '2001-02', 'bundesliga', 82, [80, 50, 72, 74, 80, 76], 'Argentina', '阿根廷', 3),
  p('Carsten Ramelow', '拉梅洛', 'CDM', ['CDM', 'CB'], 'lev', '2001-02', 'bundesliga', 82, [70, 55, 72, 70, 82, 82], 'Germany', '德国', 6),
  p('Michael Ballack', '巴拉克', 'CM', ['CM', 'CAM', 'CDM'], 'lev', '2001-02', 'bundesliga', 88, [78, 82, 84, 82, 76, 84], 'Germany', '德国', 13),
  p('Bernd Schneider', '施奈德', 'RM', ['RM', 'RW', 'CAM'], 'lev', '2001-02', 'bundesliga', 84, [80, 74, 82, 82, 64, 70], 'Germany', '德国', 7),
  p('Yıldıray Baştürk', '巴斯图尔克', 'CAM', ['CAM', 'CM'], 'lev', '2001-02', 'bundesliga', 83, [80, 70, 84, 86, 54, 62], 'Turkey', '土耳其', 10),
  p('Oliver Neuville', '诺伊维尔', 'ST', ['ST', 'CF', 'LW'], 'lev', '2001-02', 'bundesliga', 84, [84, 80, 74, 80, 45, 68], 'Germany', '德国', 11),
  p('Dimitar Berbatov', '贝尔巴托夫', 'ST', ['ST', 'CF'], 'lev', '2001-02', 'bundesliga', 81, [76, 80, 76, 82, 45, 76], 'Bulgaria', '保加利亚', 9),

  // ===== Bayer Leverkusen 2023-24 (Invincible double under Xabi Alonso) =====
  p('Lukáš Hrádecký', '赫拉德茨基', 'GK', ['GK'], 'lev', '2023-24', 'bundesliga', 84, [50, 25, 60, 55, 84, 80], 'Finland', '芬兰', 1),
  p('Jeremie Frimpong', '弗林蓬', 'RWB', ['RWB', 'RB', 'RM'], 'lev', '2023-24', 'bundesliga', 85, [94, 70, 76, 82, 70, 72], 'Netherlands', '荷兰', 38),
  p('Jonathan Tah', '塔赫', 'CB', ['CB'], 'lev', '2023-24', 'bundesliga', 85, [74, 45, 72, 70, 87, 86], 'Germany', '德国', 4),
  p('Piero Hincapié', '因卡皮耶', 'CB', ['CB', 'LB'], 'lev', '2023-24', 'bundesliga', 83, [76, 45, 70, 70, 84, 82], 'Ecuador', '厄瓜多尔', 3),
  p('Alejandro Grimaldo', '格里马尔多', 'LWB', ['LWB', 'LB', 'LM'], 'lev', '2023-24', 'bundesliga', 87, [88, 78, 84, 84, 70, 70], 'Spain', '西班牙', 20),
  p('Granit Xhaka', '扎卡', 'CDM', ['CDM', 'CM'], 'lev', '2023-24', 'bundesliga', 87, [70, 72, 86, 78, 82, 82], 'Switzerland', '瑞士', 34),
  p('Robert Andrich', '安德里希', 'CDM', ['CDM', 'CM'], 'lev', '2023-24', 'bundesliga', 82, [72, 65, 76, 72, 80, 82], 'Germany', '德国', 8),
  p('Florian Wirtz', '维尔茨', 'CAM', ['CAM', 'CM', 'LW'], 'lev', '2023-24', 'bundesliga', 88, [82, 78, 86, 90, 56, 70], 'Germany', '德国', 10),
  p('Victor Boniface', '博尼费斯', 'ST', ['ST', 'CF'], 'lev', '2023-24', 'bundesliga', 83, [82, 80, 70, 78, 45, 84], 'Nigeria', '尼日利亚', 22),
  p('Patrik Schick', '希克', 'ST', ['ST', 'CF'], 'lev', '2023-24', 'bundesliga', 82, [76, 80, 70, 74, 45, 82], 'Czechia', '捷克', 14),
  p('Jonas Hofmann', '霍夫曼', 'RM', ['RM', 'RW', 'CAM'], 'lev', '2023-24', 'bundesliga', 83, [80, 74, 80, 80, 64, 70], 'Germany', '德国', 7),
];
