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

// English Premier League — iconic squads from 1992 to today.
export const EPL_PLAYERS: Player[] = [
  // ===== Manchester United 1998-99 (Treble) =====
  p('Peter Schmeichel', '舒梅切尔', 'GK', ['GK'], 'muni', '1998-99', 'epl', 89, [58, 31, 55, 50, 88, 86], 'Denmark', '丹麦', 1),
  p('Gary Neville', '加里·内维尔', 'RB', ['RB', 'CB'], 'muni', '1998-99', 'epl', 85, [78, 45, 72, 70, 84, 80], 'England', '英格兰', 2),
  p('Jaap Stam', '斯塔姆', 'CB', ['CB'], 'muni', '1998-99', 'epl', 88, [70, 40, 65, 68, 90, 88], 'Netherlands', '荷兰', 6),
  p('Denis Irwin', '埃尔文', 'LB', ['LB', 'RB'], 'muni', '1998-99', 'epl', 84, [72, 55, 78, 74, 84, 80], 'Ireland', '爱尔兰', 3),
  p('Roy Keane', '罗伊·基恩', 'CDM', ['CDM', 'CM'], 'muni', '1998-99', 'epl', 89, [75, 70, 82, 80, 86, 85], 'Ireland', '爱尔兰', 16),
  p('Paul Scholes', '斯科尔斯', 'CM', ['CM', 'CAM'], 'muni', '1998-99', 'epl', 88, [70, 82, 90, 86, 70, 72], 'England', '英格兰', 18),
  p('David Beckham', '贝克汉姆', 'RM', ['RM', 'RW', 'CM'], 'muni', '1998-99', 'epl', 87, [75, 80, 88, 80, 70, 74], 'England', '英格兰', 7),
  p('Ryan Giggs', '吉格斯', 'LM', ['LM', 'LW'], 'muni', '1998-99', 'epl', 89, [90, 75, 82, 90, 60, 72], 'Wales', '威尔士', 11),
  p('Andy Cole', '安迪·科尔', 'ST', ['ST', 'CF'], 'muni', '1998-99', 'epl', 85, [88, 84, 72, 82, 40, 76], 'England', '英格兰', 9),
  p('Dwight Yorke', '约克', 'ST', ['ST', 'CF'], 'muni', '1998-99', 'epl', 85, [85, 83, 76, 84, 42, 78], 'Trinidad', '特立尼达', 19),
  p('Teddy Sheringham', '谢林汉姆', 'CF', ['CF', 'ST', 'CAM'], 'muni', '1998-99', 'epl', 83, [62, 80, 80, 78, 50, 74], 'England', '英格兰', 10),

  // ===== Manchester United 2007-08 =====
  p('Edwin van der Sar', '范德萨', 'GK', ['GK'], 'muni', '2007-08', 'epl', 88, [55, 30, 60, 55, 87, 84], 'Netherlands', '荷兰', 1),
  p('Rio Ferdinand', '费迪南德', 'CB', ['CB'], 'muni', '2007-08', 'epl', 88, [78, 45, 72, 74, 89, 84], 'England', '英格兰', 5),
  p('Nemanja Vidić', '维迪奇', 'CB', ['CB'], 'muni', '2007-08', 'epl', 88, [68, 42, 65, 66, 91, 88], 'Serbia', '塞尔维亚', 15),
  p('Patrice Evra', '埃弗拉', 'LB', ['LB', 'LWB'], 'muni', '2007-08', 'epl', 86, [88, 55, 76, 82, 80, 80], 'France', '法国', 3),
  p('Wes Brown', '韦斯·布朗', 'RB', ['RB', 'CB'], 'muni', '2007-08', 'epl', 81, [76, 40, 65, 68, 82, 82], 'England', '英格兰', 6),
  p('Michael Carrick', '卡里克', 'CDM', ['CDM', 'CM'], 'muni', '2007-08', 'epl', 85, [62, 65, 85, 78, 76, 74], 'England', '英格兰', 16),
  p('Owen Hargreaves', '哈格里夫斯', 'CM', ['CM', 'CDM', 'RM'], 'muni', '2007-08', 'epl', 83, [76, 68, 78, 76, 78, 78], 'England', '英格兰', 4),
  p('Cristiano Ronaldo', 'C罗', 'RW', ['RW', 'LW', 'ST'], 'muni', '2007-08', 'epl', 93, [89, 92, 82, 92, 60, 80], 'Portugal', '葡萄牙', 7),
  p('Wayne Rooney', '鲁尼', 'ST', ['ST', 'CAM', 'CF'], 'muni', '2007-08', 'epl', 89, [82, 86, 80, 85, 60, 82], 'England', '英格兰', 10),
  p('Carlos Tevez', '特维斯', 'ST', ['ST', 'CF'], 'muni', '2007-08', 'epl', 87, [85, 84, 78, 86, 50, 80], 'Argentina', '阿根廷', 32),
  p('Park Ji-sung', '朴智星', 'LM', ['LM', 'CM', 'RM'], 'muni', '2007-08', 'epl', 83, [82, 65, 76, 80, 72, 78], 'South Korea', '韩国', 13),

  // ===== Manchester United 2012-13 (Fergie's last) =====
  p('David de Gea', '德赫亚', 'GK', ['GK'], 'muni', '2012-13', 'epl', 86, [50, 25, 55, 52, 85, 78], 'Spain', '西班牙', 1),
  p('Robin van Persie', '范佩西', 'ST', ['ST', 'CF'], 'muni', '2012-13', 'epl', 89, [78, 90, 82, 85, 45, 76], 'Netherlands', '荷兰', 20),
  p('Shinji Kagawa', '香川真司', 'CAM', ['CAM', 'LM'], 'muni', '2012-13', 'epl', 83, [74, 72, 82, 84, 50, 64], 'Japan', '日本', 26),
  p('Michael Carrick', '卡里克', 'CDM', ['CDM', 'CM'], 'muni', '2012-13', 'epl', 84, [60, 62, 86, 78, 76, 74], 'England', '英格兰', 16),

  // ===== Arsenal 2003-04 (Invincibles) =====
  p('Jens Lehmann', '莱曼', 'GK', ['GK'], 'ars', '2003-04', 'epl', 86, [55, 30, 58, 55, 85, 82], 'Germany', '德国', 1),
  p('Ashley Cole', '阿什利·科尔', 'LB', ['LB', 'LWB'], 'ars', '2003-04', 'epl', 87, [90, 55, 78, 82, 82, 78], 'England', '英格兰', 3),
  p('Sol Campbell', '坎贝尔', 'CB', ['CB'], 'ars', '2003-04', 'epl', 87, [72, 45, 68, 70, 90, 88], 'England', '英格兰', 23),
  p('Kolo Touré', '科洛·图雷', 'CB', ['CB', 'RB'], 'ars', '2003-04', 'epl', 84, [80, 45, 68, 72, 84, 82], 'Ivory Coast', '科特迪瓦', 28),
  p('Lauren', '劳伦', 'RB', ['RB', 'RM'], 'ars', '2003-04', 'epl', 82, [80, 60, 74, 76, 80, 78], 'Cameroon', '喀麦隆', 12),
  p('Patrick Vieira', '维埃拉', 'CDM', ['CDM', 'CM'], 'ars', '2003-04', 'epl', 89, [78, 72, 82, 82, 86, 88], 'France', '法国', 4),
  p('Robert Pires', '皮雷', 'LM', ['LM', 'LW', 'CAM'], 'ars', '2003-04', 'epl', 87, [82, 80, 84, 86, 60, 72], 'France', '法国', 7),
  p('Freddie Ljungberg', '永贝里', 'RM', ['RM', 'RW'], 'ars', '2003-04', 'epl', 84, [85, 74, 76, 80, 60, 72], 'Sweden', '瑞典', 8),
  p('Dennis Bergkamp', '博格坎普', 'CAM', ['CAM', 'CF', 'ST'], 'ars', '2003-04', 'epl', 89, [72, 82, 90, 90, 60, 72], 'Netherlands', '荷兰', 10),
  p('Thierry Henry', '亨利', 'ST', ['ST', 'LW', 'CF'], 'ars', '2003-04', 'epl', 93, [92, 90, 84, 92, 50, 78], 'France', '法国', 14),
  p('Gilberto Silva', '吉尔伯托·席尔瓦', 'CDM', ['CDM', 'CM'], 'ars', '2003-04', 'epl', 84, [70, 60, 78, 74, 84, 82], 'Brazil', '巴西', 19),

  // ===== Arsenal 2022-23 (title charge) =====
  p('Aaron Ramsdale', '拉姆斯代尔', 'GK', ['GK'], 'ars', '2022-23', 'epl', 83, [50, 25, 55, 52, 82, 76], 'England', '英格兰', 1),
  p('William Saliba', '萨利巴', 'CB', ['CB'], 'ars', '2022-23', 'epl', 84, [82, 40, 70, 72, 85, 84], 'France', '法国', 12),
  p('Gabriel Magalhães', '加布里埃尔', 'CB', ['CB'], 'ars', '2022-23', 'epl', 83, [76, 45, 68, 70, 85, 85], 'Brazil', '巴西', 6),
  p('Bukayo Saka', '萨卡', 'RW', ['RW', 'LW', 'RM'], 'ars', '2022-23', 'epl', 86, [85, 80, 82, 86, 60, 72], 'England', '英格兰', 7),
  p('Martin Ødegaard', '厄德高', 'CAM', ['CAM', 'CM'], 'ars', '2022-23', 'epl', 87, [76, 78, 88, 88, 60, 68], 'Norway', '挪威', 8),
  p('Gabriel Martinelli', '马丁内利', 'LW', ['LW', 'ST'], 'ars', '2022-23', 'epl', 84, [90, 78, 76, 86, 50, 72], 'Brazil', '巴西', 11),
  p('Declan Rice', '德克兰·赖斯', 'CDM', ['CDM', 'CM'], 'ars', '2023-24', 'epl', 87, [76, 65, 82, 80, 85, 84], 'England', '英格兰', 41),

  // ===== Chelsea 2004-05 (Mourinho) =====
  p('Petr Čech', '切赫', 'GK', ['GK'], 'che', '2004-05', 'epl', 89, [50, 25, 58, 55, 89, 84], 'Czechia', '捷克', 1),
  p('John Terry', '特里', 'CB', ['CB'], 'che', '2004-05', 'epl', 89, [68, 45, 70, 68, 91, 88], 'England', '英格兰', 26),
  p('Ricardo Carvalho', '卡瓦略', 'CB', ['CB'], 'che', '2004-05', 'epl', 87, [72, 45, 70, 72, 88, 80], 'Portugal', '葡萄牙', 6),
  p('Ashley Cole', '阿什利·科尔', 'LB', ['LB', 'LWB'], 'che', '2004-05', 'epl', 86, [90, 55, 78, 82, 82, 78], 'England', '英格兰', 3),
  p('Claude Makélélé', '马克莱莱', 'CDM', ['CDM'], 'che', '2004-05', 'epl', 86, [72, 50, 78, 76, 88, 80], 'France', '法国', 4),
  p('Frank Lampard', '兰帕德', 'CM', ['CM', 'CAM'], 'che', '2004-05', 'epl', 89, [74, 85, 86, 82, 72, 82], 'England', '英格兰', 8),
  p('Joe Cole', '乔·科尔', 'LM', ['LM', 'CAM', 'LW'], 'che', '2004-05', 'epl', 84, [84, 74, 80, 86, 56, 70], 'England', '英格兰', 10),
  p('Arjen Robben', '罗本', 'RW', ['RW', 'LW'], 'che', '2004-05', 'epl', 88, [90, 82, 78, 88, 50, 74], 'Netherlands', '荷兰', 16),
  p('Didier Drogba', '德罗巴', 'ST', ['ST', 'CF'], 'che', '2004-05', 'epl', 88, [82, 86, 72, 80, 50, 86], 'Ivory Coast', '科特迪瓦', 11),
  p('Eidur Gudjohnsen', '古德约翰森', 'CF', ['CF', 'ST', 'CAM'], 'che', '2004-05', 'epl', 83, [74, 78, 80, 80, 56, 78], 'Iceland', '冰岛', 22),

  // ===== Chelsea 2016-17 =====
  p('Thibaut Courtois', '库尔图瓦', 'GK', ['GK'], 'che', '2016-17', 'epl', 88, [50, 25, 58, 55, 88, 84], 'Belgium', '比利时', 13),
  p('David Luiz', '大卫·路易斯', 'CB', ['CB', 'CDM'], 'che', '2016-17', 'epl', 84, [72, 60, 76, 74, 82, 82], 'Brazil', '巴西', 30),
  p('César Azpilicueta', '阿斯皮利奎塔', 'RB', ['RB', 'CB', 'LB'], 'che', '2016-17', 'epl', 85, [78, 50, 76, 74, 86, 80], 'Spain', '西班牙', 28),
  p('N\'Golo Kanté', '坎特', 'CDM', ['CDM', 'CM'], 'che', '2016-17', 'epl', 88, [86, 60, 80, 78, 88, 82], 'France', '法国', 7),
  p('Eden Hazard', '阿扎尔', 'LW', ['LW', 'CAM', 'ST'], 'che', '2016-17', 'epl', 90, [88, 82, 84, 92, 50, 74], 'Belgium', '比利时', 10),
  p('Diego Costa', '迭戈·科斯塔', 'ST', ['ST', 'CF'], 'che', '2016-17', 'epl', 87, [78, 86, 74, 80, 50, 86], 'Spain', '西班牙', 19),
  p('Marcos Alonso', '马科斯·阿隆索', 'LWB', ['LWB', 'LB'], 'che', '2016-17', 'epl', 82, [76, 72, 76, 74, 78, 80], 'Spain', '西班牙', 3),

  // ===== Liverpool 2018-19 (CL winners) =====
  p('Alisson', '阿利松', 'GK', ['GK'], 'liv', '2018-19', 'epl', 89, [55, 30, 60, 58, 88, 80], 'Brazil', '巴西', 1),
  p('Virgil van Dijk', '范戴克', 'CB', ['CB'], 'liv', '2018-19', 'epl', 90, [76, 50, 74, 74, 91, 88], 'Netherlands', '荷兰', 4),
  p('Andrew Robertson', '罗伯逊', 'LB', ['LB', 'LWB'], 'liv', '2018-19', 'epl', 86, [88, 60, 80, 80, 80, 80], 'Scotland', '苏格兰', 26),
  p('Trent Alexander-Arnold', '阿诺德', 'RB', ['RB', 'RWB', 'CM'], 'liv', '2018-19', 'epl', 86, [80, 60, 88, 80, 76, 72], 'England', '英格兰', 66),
  p('Fabinho', '法比尼奥', 'CDM', ['CDM', 'CB', 'RB'], 'liv', '2018-19', 'epl', 85, [72, 65, 80, 76, 85, 82], 'Brazil', '巴西', 3),
  p('Georginio Wijnaldum', '维纳尔杜姆', 'CM', ['CM', 'CAM'], 'liv', '2018-19', 'epl', 84, [80, 72, 80, 80, 70, 78], 'Netherlands', '荷兰', 5),
  p('Sadio Mané', '马内', 'LW', ['LW', 'ST'], 'liv', '2018-19', 'epl', 89, [90, 84, 78, 88, 50, 76], 'Senegal', '塞内加尔', 10),
  p('Mohamed Salah', '萨拉赫', 'RW', ['RW', 'ST'], 'liv', '2018-19', 'epl', 90, [90, 87, 82, 88, 50, 74], 'Egypt', '埃及', 11),
  p('Roberto Firmino', '菲尔米诺', 'CF', ['CF', 'ST', 'CAM'], 'liv', '2018-19', 'epl', 86, [78, 80, 82, 86, 56, 76], 'Brazil', '巴西', 9),

  // ===== Liverpool 2019-20 (Champions) =====
  p('Alisson', '阿利松', 'GK', ['GK'], 'liv', '2019-20', 'epl', 90, [55, 30, 62, 58, 89, 80], 'Brazil', '巴西', 1),
  p('Virgil van Dijk', '范戴克', 'CB', ['CB'], 'liv', '2019-20', 'epl', 91, [76, 50, 76, 74, 92, 88], 'Netherlands', '荷兰', 4),
  p('Jordan Henderson', '亨德森', 'CM', ['CM', 'CDM'], 'liv', '2019-20', 'epl', 85, [72, 68, 82, 76, 78, 80], 'England', '英格兰', 14),
  p('Sadio Mané', '马内', 'LW', ['LW', 'ST'], 'liv', '2019-20', 'epl', 90, [90, 85, 80, 88, 50, 76], 'Senegal', '塞内加尔', 10),
  p('Mohamed Salah', '萨拉赫', 'RW', ['RW', 'ST'], 'liv', '2019-20', 'epl', 90, [90, 87, 82, 88, 50, 74], 'Egypt', '埃及', 11),

  // ===== Manchester City 2017-18 (100 points) =====
  p('Ederson', '埃德森', 'GK', ['GK'], 'mci', '2017-18', 'epl', 86, [55, 35, 75, 60, 84, 78], 'Brazil', '巴西', 31),
  p('Kyle Walker', '凯尔·沃克', 'RB', ['RB', 'RWB'], 'mci', '2017-18', 'epl', 85, [92, 60, 74, 76, 80, 82], 'England', '英格兰', 2),
  p('Aymeric Laporte', '拉波尔特', 'CB', ['CB', 'LB'], 'mci', '2017-18', 'epl', 85, [74, 45, 74, 74, 86, 84], 'France', '法国', 14),
  p('Nicolas Otamendi', '奥塔门迪', 'CB', ['CB'], 'mci', '2017-18', 'epl', 83, [70, 45, 68, 68, 85, 82], 'Argentina', '阿根廷', 30),
  p('Benjamin Mendy', '门迪', 'LB', ['LB', 'LWB'], 'mci', '2017-18', 'epl', 82, [86, 55, 76, 76, 76, 80], 'France', '法国', 22),
  p('Fernandinho', '费尔南迪尼奥', 'CDM', ['CDM', 'CB'], 'mci', '2017-18', 'epl', 85, [78, 65, 80, 78, 84, 82], 'Brazil', '巴西', 25),
  p('Kevin De Bruyne', '德布劳内', 'CM', ['CM', 'CAM', 'RM'], 'mci', '2017-18', 'epl', 91, [76, 86, 93, 86, 70, 78], 'Belgium', '比利时', 17),
  p('David Silva', '大卫·席尔瓦', 'CAM', ['CAM', 'LM', 'CM'], 'mci', '2017-18', 'epl', 89, [72, 78, 90, 90, 60, 68], 'Spain', '西班牙', 21),
  p('Raheem Sterling', '斯特林', 'LW', ['LW', 'RW', 'ST'], 'mci', '2017-18', 'epl', 87, [90, 80, 80, 86, 50, 70], 'England', '英格兰', 7),
  p('Sergio Agüero', '阿圭罗', 'ST', ['ST', 'CF'], 'mci', '2017-18', 'epl', 89, [86, 89, 78, 86, 45, 76], 'Argentina', '阿根廷', 10),
  p('Leroy Sané', '萨内', 'LW', ['LW', 'RW'], 'mci', '2017-18', 'epl', 85, [92, 78, 78, 86, 45, 70], 'Germany', '德国', 19),

  // ===== Manchester City 2022-23 (Treble) =====
  p('Ederson', '埃德森', 'GK', ['GK'], 'mci', '2022-23', 'epl', 88, [55, 35, 78, 60, 86, 78], 'Brazil', '巴西', 31),
  p('Rúben Dias', '鲁本·迪亚斯', 'CB', ['CB'], 'mci', '2022-23', 'epl', 88, [70, 45, 74, 72, 89, 86], 'Portugal', '葡萄牙', 3),
  p('John Stones', '斯通斯', 'CB', ['CB', 'CDM'], 'mci', '2022-23', 'epl', 85, [72, 50, 74, 74, 85, 82], 'England', '英格兰', 5),
  p('Kyle Walker', '凯尔·沃克', 'RB', ['RB', 'RWB'], 'mci', '2022-23', 'epl', 85, [92, 60, 74, 76, 80, 82], 'England', '英格兰', 2),
  p('Rodri', '罗德里', 'CDM', ['CDM', 'CM'], 'mci', '2022-23', 'epl', 89, [70, 72, 86, 80, 86, 84], 'Spain', '西班牙', 16),
  p('Kevin De Bruyne', '德布劳内', 'CM', ['CM', 'CAM', 'RM'], 'mci', '2022-23', 'epl', 91, [74, 86, 93, 86, 70, 80], 'Belgium', '比利时', 17),
  p('Bernardo Silva', '贝尔纳多·席尔瓦', 'RM', ['RM', 'CM', 'CAM'], 'mci', '2022-23', 'epl', 88, [80, 78, 86, 90, 64, 72], 'Portugal', '葡萄牙', 20),
  p('Phil Foden', '福登', 'LW', ['LW', 'CAM', 'CM'], 'mci', '2022-23', 'epl', 86, [82, 80, 82, 86, 56, 70], 'England', '英格兰', 47),
  p('Erling Haaland', '哈兰德', 'ST', ['ST', 'CF'], 'mci', '2022-23', 'epl', 91, [88, 91, 70, 80, 50, 88], 'Norway', '挪威', 9),
  p('Jack Grealish', '格拉利什', 'LW', ['LW', 'LM'], 'mci', '2022-23', 'epl', 85, [80, 74, 82, 88, 50, 76], 'England', '英格兰', 10),

  // ===== Manchester City 2023-24 =====
  p('Phil Foden', '福登', 'CAM', ['CAM', 'LW', 'CM'], 'mci', '2023-24', 'epl', 88, [82, 84, 84, 88, 56, 72], 'England', '英格兰', 47),
  p('Erling Haaland', '哈兰德', 'ST', ['ST', 'CF'], 'mci', '2023-24', 'epl', 91, [88, 91, 70, 80, 50, 88], 'Norway', '挪威', 9),
  p('Rodri', '罗德里', 'CDM', ['CDM', 'CM'], 'mci', '2023-24', 'epl', 90, [70, 72, 87, 80, 87, 84], 'Spain', '西班牙', 16),
  p('Jérémy Doku', '多库', 'LW', ['LW', 'RW'], 'mci', '2023-24', 'epl', 84, [92, 74, 76, 88, 45, 70], 'Belgium', '比利时', 11),

  // ===== Tottenham 2017-18 =====
  p('Hugo Lloris', '洛里', 'GK', ['GK'], 'tot', '2017-18', 'epl', 86, [50, 25, 60, 55, 86, 78], 'France', '法国', 1),
  p('Toby Alderweireld', '阿尔德韦雷尔德', 'CB', ['CB'], 'tot', '2017-18', 'epl', 85, [70, 45, 74, 70, 86, 84], 'Belgium', '比利时', 4),
  p('Jan Vertonghen', '维尔通亨', 'CB', ['CB', 'LB'], 'tot', '2017-18', 'epl', 85, [72, 55, 76, 74, 84, 82], 'Belgium', '比利时', 5),
  p('Kieran Trippier', '特里皮尔', 'RB', ['RB', 'RWB'], 'tot', '2017-18', 'epl', 82, [76, 55, 80, 76, 76, 72], 'England', '英格兰', 2),
  p('Christian Eriksen', '埃里克森', 'CAM', ['CAM', 'CM'], 'tot', '2017-18', 'epl', 87, [72, 80, 90, 84, 56, 68], 'Denmark', '丹麦', 23),
  p('Dele Alli', '阿里', 'CM', ['CM', 'CAM', 'ST'], 'tot', '2017-18', 'epl', 84, [78, 78, 78, 80, 58, 78], 'England', '英格兰', 20),
  p('Son Heung-min', '孙兴慜', 'LW', ['LW', 'ST', 'RW'], 'tot', '2017-18', 'epl', 87, [88, 84, 80, 86, 50, 72], 'South Korea', '韩国', 7),
  p('Harry Kane', '哈里·凯恩', 'ST', ['ST', 'CF'], 'tot', '2017-18', 'epl', 89, [70, 90, 82, 80, 50, 82], 'England', '英格兰', 10),
  p('Mousa Dembélé', '登贝莱', 'CM', ['CM', 'CDM'], 'tot', '2017-18', 'epl', 85, [76, 70, 82, 88, 76, 82], 'Belgium', '比利时', 19),

  // ===== Blackburn 1995-96 (Shearer era) =====
  p('Tim Flowers', '弗劳尔斯', 'GK', ['GK'], 'blc', '1995-96', 'epl', 82, [50, 25, 55, 52, 82, 78], 'England', '英格兰', 1),
  p('Alan Shearer', '阿兰·希勒', 'ST', ['ST', 'CF'], 'blc', '1995-96', 'epl', 90, [78, 91, 72, 78, 50, 84], 'England', '英格兰', 9),
  p('Chris Sutton', '萨顿', 'ST', ['ST', 'CF'], 'blc', '1995-96', 'epl', 84, [74, 82, 70, 76, 50, 82], 'England', '英格兰', 8),
  p('Tim Sherwood', '舍伍德', 'CM', ['CM', 'CDM'], 'blc', '1995-96', 'epl', 80, [68, 65, 76, 72, 72, 76], 'England', '英格兰', 4),

  // ===== Leicester 2015-16 (5000-1 miracle) =====
  p('Kasper Schmeichel', '卡斯帕·舒梅切尔', 'GK', ['GK'], 'lei', '2015-16', 'epl', 84, [52, 28, 58, 55, 83, 80], 'Denmark', '丹麦', 1),
  p('Wes Morgan', '韦斯·摩根', 'CB', ['CB'], 'lei', '2015-16', 'epl', 81, [66, 40, 60, 62, 84, 86], 'Jamaica', '牙买加', 5),
  p('Robert Huth', '胡特', 'CB', ['CB'], 'lei', '2015-16', 'epl', 80, [64, 40, 58, 60, 83, 86], 'Germany', '德国', 6),
  p('Christian Fuchs', '富克斯', 'LB', ['LB', 'LWB'], 'lei', '2015-16', 'epl', 81, [74, 55, 76, 72, 78, 78], 'Austria', '奥地利', 28),
  p('Danny Drinkwater', '德林克沃特', 'CM', ['CM', 'CDM'], 'lei', '2015-16', 'epl', 81, [70, 65, 78, 74, 74, 74], 'England', '英格兰', 4),
  p('N\'Golo Kanté', '坎特', 'CDM', ['CDM', 'CM'], 'lei', '2015-16', 'epl', 85, [88, 60, 78, 76, 86, 80], 'France', '法国', 14),
  p('Riyad Mahrez', '马赫雷斯', 'RW', ['RW', 'RM'], 'lei', '2015-16', 'epl', 85, [84, 80, 80, 86, 50, 68], 'Algeria', '阿尔及利亚', 26),
  p('Marc Albrighton', '奥尔布赖顿', 'LM', ['LM', 'LW'], 'lei', '2015-16', 'epl', 78, [78, 65, 74, 74, 64, 70], 'England', '英格兰', 11),
  p('Jamie Vardy', '瓦尔迪', 'ST', ['ST', 'CF'], 'lei', '2015-16', 'epl', 84, [92, 82, 70, 78, 45, 76], 'England', '英格兰', 9),
  p('Shinji Okazaki', '冈崎慎司', 'ST', ['ST', 'CF'], 'lei', '2015-16', 'epl', 80, [80, 74, 68, 72, 50, 74], 'Japan', '日本', 20),
];
