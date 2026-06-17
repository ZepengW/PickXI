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

export const SERIEA_PLAYERS: Player[] = [
  // ===== Juventus 1995-96 (Champions League winners) =====
  p('Angelo Peruzzi', '佩鲁齐', 'GK', ['GK'], 'juv', '1995-96', 'seriea', 87, [50, 25, 55, 50, 88, 84], 'Italy', '意大利', 1),
  p('Moreno Torricelli', '托里切利', 'RB', ['RB', 'RWB'], 'juv', '1995-96', 'seriea', 83, [82, 45, 70, 72, 80, 78], 'Italy', '意大利', 2),
  p('Pietro Vierchowod', '维尔乔沃德', 'CB', ['CB'], 'juv', '1995-96', 'seriea', 84, [68, 40, 65, 66, 87, 86], 'Italy', '意大利', 4),
  p('Ciro Ferrara', '费拉拉', 'CB', ['CB'], 'juv', '1995-96', 'seriea', 85, [70, 40, 68, 68, 88, 84], 'Italy', '意大利', 5),
  p('Gianluca Pessotto', '佩索托', 'LB', ['LB', 'RB'], 'juv', '1995-96', 'seriea', 82, [76, 50, 74, 74, 80, 76], 'Italy', '意大利', 3),
  p('Didier Deschamps', '德尚', 'CDM', ['CDM', 'CM'], 'juv', '1995-96', 'seriea', 85, [72, 55, 82, 76, 84, 80], 'France', '法国', 6),
  p('Antonio Conte', '孔蒂', 'CM', ['CM', 'CDM'], 'juv', '1995-96', 'seriea', 83, [70, 65, 78, 76, 78, 82], 'Italy', '意大利', 8),
  p('Vladimir Jugović', '尤戈维奇', 'CM', ['CM', 'CAM'], 'juv', '1995-96', 'seriea', 84, [74, 72, 82, 80, 72, 76], 'Serbia', '塞尔维亚', 7),
  p('Alessandro Del Piero', '德尔·皮耶罗', 'CF', ['CF', 'ST', 'CAM'], 'juv', '1995-96', 'seriea', 89, [82, 86, 84, 90, 50, 72], 'Italy', '意大利', 10),
  p('Fabrizio Ravanelli', '拉瓦内利', 'ST', ['ST', 'CF'], 'juv', '1995-96', 'seriea', 84, [78, 82, 72, 78, 50, 80], 'Italy', '意大利', 11),
  p('Gianluca Vialli', '维亚利', 'ST', ['ST', 'CF'], 'juv', '1995-96', 'seriea', 86, [80, 84, 78, 82, 50, 80], 'Italy', '意大利', 9),

  // ===== Juventus 2002-03 (Serie A champions) =====
  p('Gianluigi Buffon', '布冯', 'GK', ['GK'], 'juv', '2002-03', 'seriea', 90, [55, 30, 60, 58, 90, 84], 'Italy', '意大利', 1),
  p('Lilian Thuram', '图拉姆', 'RB', ['RB', 'CB'], 'juv', '2002-03', 'seriea', 88, [82, 55, 76, 76, 88, 84], 'France', '法国', 2),
  p('Paolo Montero', '蒙特罗', 'CB', ['CB'], 'juv', '2002-03', 'seriea', 85, [72, 45, 70, 70, 88, 84], 'Uruguay', '乌拉圭', 4),
  p('Ciro Ferrara', '费拉拉', 'CB', ['CB'], 'juv', '2002-03', 'seriea', 84, [68, 40, 68, 68, 87, 84], 'Italy', '意大利', 5),
  p('Edgar Davids', '戴维斯', 'CM', ['CM', 'CDM', 'LM'], 'juv', '2002-03', 'seriea', 87, [80, 70, 80, 84, 80, 80], 'Netherlands', '荷兰', 26),
  p('Alessio Tacchinardi', '塔奇纳迪', 'CM', ['CM', 'CDM'], 'juv', '2002-03', 'seriea', 82, [72, 60, 76, 74, 80, 80], 'Italy', '意大利', 8),
  p('Mauro Camoranesi', '卡莫拉内西', 'RM', ['RM', 'RW', 'CM'], 'juv', '2002-03', 'seriea', 84, [82, 70, 80, 82, 70, 72], 'Italy', '意大利', 16),
  p('Pavel Nedvěd', '内德维德', 'CAM', ['CAM', 'LM', 'CM'], 'juv', '2002-03', 'seriea', 89, [80, 82, 84, 84, 70, 78], 'Czech Republic', '捷克', 11),
  p('Alessandro Del Piero', '德尔·皮耶罗', 'CF', ['CF', 'ST', 'CAM'], 'juv', '2002-03', 'seriea', 90, [80, 86, 86, 90, 50, 72], 'Italy', '意大利', 10),
  p('David Trezeguet', '特雷泽盖', 'ST', ['ST', 'CF'], 'juv', '2002-03', 'seriea', 88, [78, 88, 72, 78, 45, 80], 'France', '法国', 17),
  p('Marco Di Vaio', '迪瓦约', 'ST', ['ST', 'CF'], 'juv', '2002-03', 'seriea', 82, [80, 80, 72, 78, 45, 76], 'Italy', '意大利', 21),

  // ===== Juventus 2011-12 (undefeated season) =====
  p('Gianluigi Buffon', '布冯', 'GK', ['GK'], 'juv', '2011-12', 'seriea', 88, [55, 30, 60, 58, 88, 84], 'Italy', '意大利', 1),
  p('Stephan Lichtsteiner', '利希施泰纳', 'RB', ['RB', 'RWB'], 'juv', '2011-12', 'seriea', 84, [84, 55, 76, 76, 80, 80], 'Switzerland', '瑞士', 26),
  p('Andrea Barzagli', '巴尔扎利', 'CB', ['CB'], 'juv', '2011-12', 'seriea', 85, [70, 40, 70, 68, 88, 84], 'Italy', '意大利', 15),
  p('Giorgio Chiellini', '基耶利尼', 'CB', ['CB', 'LB'], 'juv', '2011-12', 'seriea', 87, [76, 45, 70, 70, 90, 88], 'Italy', '意大利', 3),
  p('Leonardo Bonucci', '博努奇', 'CB', ['CB', 'CDM'], 'juv', '2011-12', 'seriea', 83, [68, 45, 74, 68, 84, 82], 'Italy', '意大利', 19),
  p('Andrea Pirlo', '皮尔洛', 'CM', ['CM', 'CDM', 'CAM'], 'juv', '2011-12', 'seriea', 87, [50, 70, 90, 84, 70, 64], 'Italy', '意大利', 21),
  p('Claudio Marchisio', '马尔基西奥', 'CM', ['CM', 'CAM', 'CDM'], 'juv', '2011-12', 'seriea', 84, [76, 72, 80, 80, 76, 76], 'Italy', '意大利', 8),
  p('Arturo Vidal', '比达尔', 'CM', ['CM', 'CDM', 'CAM'], 'juv', '2011-12', 'seriea', 86, [78, 76, 80, 80, 82, 82], 'Chile', '智利', 22),
  p('Simone Pepe', '佩佩', 'RM', ['RM', 'RW', 'LM'], 'juv', '2011-12', 'seriea', 80, [84, 68, 72, 76, 70, 72], 'Italy', '意大利', 7),
  p('Alessandro Matri', '马特里', 'ST', ['ST', 'CF'], 'juv', '2011-12', 'seriea', 81, [78, 80, 68, 74, 45, 78], 'Italy', '意大利', 9),
  p('Mirko Vucinic', '武齐尼奇', 'ST', ['ST', 'CF', 'LW'], 'juv', '2011-12', 'seriea', 83, [78, 78, 76, 80, 50, 76], 'Montenegro', '黑山', 14),

  // ===== Juventus 2016-17 (6th consecutive title) =====
  p('Gianluigi Buffon', '布冯', 'GK', ['GK'], 'juv', '2016-17', 'seriea', 88, [55, 30, 60, 58, 88, 84], 'Italy', '意大利', 1),
  p('Dani Alves', '阿尔维斯', 'RB', ['RB', 'RWB', 'RM'], 'juv', '2016-17', 'seriea', 86, [86, 65, 82, 84, 76, 76], 'Brazil', '巴西', 23),
  p('Andrea Barzagli', '巴尔扎利', 'CB', ['CB', 'RB'], 'juv', '2016-17', 'seriea', 84, [66, 40, 70, 68, 87, 84], 'Italy', '意大利', 15),
  p('Leonardo Bonucci', '博努奇', 'CB', ['CB', 'CDM'], 'juv', '2016-17', 'seriea', 86, [70, 45, 78, 70, 87, 84], 'Italy', '意大利', 19),
  p('Giorgio Chiellini', '基耶利尼', 'CB', ['CB', 'LB'], 'juv', '2016-17', 'seriea', 87, [74, 45, 70, 70, 90, 88], 'Italy', '意大利', 3),
  p('Sami Khedira', '赫迪拉', 'CM', ['CM', 'CDM'], 'juv', '2016-17', 'seriea', 83, [72, 68, 80, 76, 76, 80], 'Germany', '德国', 6),
  p('Miralem Pjanić', '皮亚尼奇', 'CM', ['CM', 'CAM', 'CDM'], 'juv', '2016-17', 'seriea', 86, [66, 72, 86, 82, 70, 70], 'Bosnia and Herzegovina', '波黑', 5),
  p('Claudio Marchisio', '马尔基西奥', 'CM', ['CM', 'CDM', 'CAM'], 'juv', '2016-17', 'seriea', 83, [72, 68, 80, 78, 76, 74], 'Italy', '意大利', 8),
  p('Juan Cuadrado', '夸德拉多', 'RM', ['RM', 'RW', 'RWB'], 'juv', '2016-17', 'seriea', 84, [90, 72, 76, 84, 64, 72], 'Colombia', '哥伦比亚', 7),
  p('Gonzalo Higuaín', '伊瓜因', 'ST', ['ST', 'CF'], 'juv', '2016-17', 'seriea', 89, [76, 88, 76, 82, 45, 82], 'Argentina', '阿根廷', 9),
  p('Paulo Dybala', '迪巴拉', 'CF', ['CF', 'CAM', 'ST'], 'juv', '2016-17', 'seriea', 88, [80, 84, 82, 90, 45, 68], 'Argentina', '阿根廷', 21),

  // ===== AC Milan 1988-89 (Sacchi's European champions) =====
  p('Giovanni Galli', '加利', 'GK', ['GK'], 'mil', '1988-89', 'seriea', 83, [50, 25, 55, 52, 83, 80], 'Italy', '意大利', 1),
  p('Mauro Tassotti', '塔索蒂', 'RB', ['RB', 'CB'], 'mil', '1988-89', 'seriea', 84, [76, 50, 74, 74, 84, 80], 'Italy', '意大利', 2),
  p('Franco Baresi', '巴雷西', 'CB', ['CB', 'CDM'], 'mil', '1988-89', 'seriea', 89, [70, 45, 76, 74, 92, 84], 'Italy', '意大利', 6),
  p('Alessandro Costacurta', '科斯塔库塔', 'CB', ['CB', 'RB'], 'mil', '1988-89', 'seriea', 86, [74, 45, 70, 70, 88, 84], 'Italy', '意大利', 5),
  p('Paolo Maldini', '马尔蒂尼', 'LB', ['LB', 'CB'], 'mil', '1988-89', 'seriea', 88, [82, 55, 76, 78, 88, 84], 'Italy', '意大利', 3),
  p('Carlo Ancelotti', '安切洛蒂', 'CM', ['CM', 'CDM'], 'mil', '1988-89', 'seriea', 84, [70, 70, 82, 78, 78, 78], 'Italy', '意大利', 4),
  p('Frank Rijkaard', '里杰卡尔德', 'CDM', ['CDM', 'CM', 'CB'], 'mil', '1988-89', 'seriea', 88, [76, 70, 82, 80, 88, 86], 'Netherlands', '荷兰', 8),
  p('Roberto Donadoni', '多纳多尼', 'LM', ['LM', 'LW', 'RM'], 'mil', '1988-89', 'seriea', 85, [82, 70, 80, 84, 64, 72], 'Italy', '意大利', 7),
  p('Ruud Gullit', '古利特', 'CAM', ['CAM', 'ST', 'CF'], 'mil', '1988-89', 'seriea', 89, [82, 82, 84, 86, 70, 84], 'Netherlands', '荷兰', 10),
  p('Marco van Basten', '范巴斯滕', 'ST', ['ST', 'CF'], 'mil', '1988-89', 'seriea', 91, [78, 88, 80, 86, 50, 80], 'Netherlands', '荷兰', 9),
  p('Angelo Colombo', '科伦坡', 'RM', ['RM', 'CM'], 'mil', '1988-89', 'seriea', 80, [78, 65, 74, 76, 68, 70], 'Italy', '意大利', 14),

  // ===== AC Milan 2003-04 (Serie A champions) =====
  p('Dida', '迪达', 'GK', ['GK'], 'mil', '2003-04', 'seriea', 87, [52, 28, 58, 56, 87, 82], 'Brazil', '巴西', 1),
  p('Cafu', '卡福', 'RB', ['RB', 'RWB'], 'mil', '2003-04', 'seriea', 86, [86, 60, 80, 80, 78, 76], 'Brazil', '巴西', 2),
  p('Alessandro Nesta', '内斯塔', 'CB', ['CB'], 'mil', '2003-04', 'seriea', 88, [72, 45, 70, 70, 90, 84], 'Italy', '意大利', 13),
  p('Paolo Maldini', '马尔蒂尼', 'CB', ['CB', 'LB'], 'mil', '2003-04', 'seriea', 88, [76, 50, 76, 76, 89, 84], 'Italy', '意大利', 3),
  p('Giuseppe Pancaro', '潘卡罗', 'LB', ['LB', 'LWB'], 'mil', '2003-04', 'seriea', 81, [76, 50, 74, 74, 80, 78], 'Italy', '意大利', 19),
  p('Gennaro Gattuso', '加图索', 'CDM', ['CDM', 'CM'], 'mil', '2003-04', 'seriea', 84, [74, 55, 76, 74, 86, 82], 'Italy', '意大利', 8),
  p('Andrea Pirlo', '皮尔洛', 'CM', ['CM', 'CDM', 'CAM'], 'mil', '2003-04', 'seriea', 87, [55, 70, 88, 82, 72, 66], 'Italy', '意大利', 21),
  p('Clarence Seedorf', '西多夫', 'CM', ['CM', 'CAM', 'LM'], 'mil', '2003-04', 'seriea', 87, [76, 78, 84, 86, 72, 80], 'Netherlands', '荷兰', 20),
  p('Kaká', '卡卡', 'CAM', ['CAM', 'CM', 'CF'], 'mil', '2003-04', 'seriea', 90, [84, 80, 84, 90, 56, 74], 'Brazil', '巴西', 22),
  p('Andriy Shevchenko', '舍甫琴科', 'ST', ['ST', 'CF', 'LW'], 'mil', '2003-04', 'seriea', 90, [84, 88, 78, 84, 50, 80], 'Ukraine', '乌克兰', 7),
  p('Filippo Inzaghi', '因扎吉', 'ST', ['ST', 'CF'], 'mil', '2003-04', 'seriea', 86, [78, 84, 70, 76, 45, 74], 'Italy', '意大利', 9),

  // ===== AC Milan 2010-11 (Allegri's title) =====
  p('Christian Abbiati', '阿比亚蒂', 'GK', ['GK'], 'mil', '2010-11', 'seriea', 83, [50, 25, 58, 55, 83, 80], 'Italy', '意大利', 12),
  p('Ignazio Abate', '阿巴特', 'RB', ['RB', 'RM'], 'mil', '2010-11', 'seriea', 82, [88, 50, 72, 74, 80, 78], 'Italy', '意大利', 20),
  p('Alessandro Nesta', '内斯塔', 'CB', ['CB'], 'mil', '2010-11', 'seriea', 85, [66, 45, 70, 70, 88, 84], 'Italy', '意大利', 13),
  p('Thiago Silva', '蒂亚戈·席尔瓦', 'CB', ['CB', 'CDM'], 'mil', '2010-11', 'seriea', 87, [76, 50, 74, 74, 88, 84], 'Brazil', '巴西', 33),
  p('Gianluca Zambrotta', '赞布罗塔', 'LB', ['LB', 'RB'], 'mil', '2010-11', 'seriea', 82, [76, 55, 76, 76, 80, 80], 'Italy', '意大利', 15),
  p('Gennaro Gattuso', '加图索', 'CDM', ['CDM', 'CM'], 'mil', '2010-11', 'seriea', 82, [70, 55, 74, 72, 84, 82], 'Italy', '意大利', 8),
  p('Mark van Bommel', '范博梅尔', 'CDM', ['CDM', 'CM'], 'mil', '2010-11', 'seriea', 83, [66, 65, 78, 74, 82, 84], 'Netherlands', '荷兰', 4),
  p('Clarence Seedorf', '西多夫', 'CM', ['CM', 'CAM', 'LM'], 'mil', '2010-11', 'seriea', 85, [72, 76, 82, 84, 70, 78], 'Netherlands', '荷兰', 10),
  p('Kevin-Prince Boateng', '博阿滕', 'CAM', ['CAM', 'CM', 'ST'], 'mil', '2010-11', 'seriea', 83, [80, 76, 76, 80, 70, 82], 'Ghana', '加纳', 27),
  p('Zlatan Ibrahimović', '伊布拉希莫维奇', 'ST', ['ST', 'CF', 'CAM'], 'mil', '2010-11', 'seriea', 89, [76, 86, 80, 86, 50, 86], 'Sweden', '瑞典', 11),
  p('Robinho', '罗比尼奥', 'ST', ['ST', 'LW', 'CF'], 'mil', '2010-11', 'seriea', 84, [84, 76, 76, 86, 45, 68], 'Brazil', '巴西', 70),

  // ===== Inter Milan 2009-10 (Mourinho's treble) =====
  p('Júlio César', '胡利奥·塞萨尔', 'GK', ['GK'], 'int', '2009-10', 'seriea', 88, [55, 30, 60, 58, 88, 82], 'Brazil', '巴西', 1),
  p('Maicon', '麦孔', 'RB', ['RB', 'RWB', 'RM'], 'int', '2009-10', 'seriea', 88, [88, 65, 82, 82, 80, 82], 'Brazil', '巴西', 13),
  p('Lúcio', '卢西奥', 'CB', ['CB'], 'int', '2009-10', 'seriea', 86, [76, 50, 72, 72, 88, 86], 'Brazil', '巴西', 6),
  p('Walter Samuel', '萨穆埃尔', 'CB', ['CB'], 'int', '2009-10', 'seriea', 86, [68, 45, 70, 70, 89, 86], 'Argentina', '阿根廷', 25),
  p('Cristian Chivu', '基伏', 'LB', ['LB', 'CB'], 'int', '2009-10', 'seriea', 83, [70, 50, 74, 72, 84, 80], 'Romania', '罗马尼亚', 26),
  p('Javier Zanetti', '萨内蒂', 'RM', ['RM', 'CM', 'RB', 'LB'], 'int', '2009-10', 'seriea', 87, [82, 65, 80, 82, 80, 80], 'Argentina', '阿根廷', 4),
  p('Esteban Cambiasso', '坎比亚索', 'CDM', ['CDM', 'CM'], 'int', '2009-10', 'seriea', 86, [68, 65, 80, 76, 86, 80], 'Argentina', '阿根廷', 19),
  p('Wesley Sneijder', '斯内德', 'CAM', ['CAM', 'CM'], 'int', '2009-10', 'seriea', 88, [72, 80, 88, 86, 56, 64], 'Netherlands', '荷兰', 10),
  p('Samuel Eto\'o', '埃托奥', 'LW', ['LW', 'ST', 'RW'], 'int', '2009-10', 'seriea', 88, [86, 84, 78, 84, 50, 76], 'Cameroon', '喀麦隆', 9),
  p('Diego Milito', '米利托', 'ST', ['ST', 'CF'], 'int', '2009-10', 'seriea', 88, [78, 86, 78, 80, 50, 78], 'Argentina', '阿根廷', 22),
  p('Goran Pandev', '潘德夫', 'LW', ['LW', 'ST', 'CF'], 'int', '2009-10', 'seriea', 82, [78, 74, 76, 78, 56, 72], 'North Macedonia', '北马其顿', 27),

  // ===== Inter Milan 2020-21 (Conte's title) =====
  p('Samir Handanović', '汉达诺维奇', 'GK', ['GK'], 'int', '2020-21', 'seriea', 86, [50, 25, 60, 55, 86, 80], 'Slovenia', '斯洛文尼亚', 1),
  p('Achraf Hakimi', '阿什拉夫', 'RB', ['RB', 'RWB', 'RM'], 'int', '2020-21', 'seriea', 85, [92, 65, 78, 82, 76, 76], 'Morocco', '摩洛哥', 2),
  p('Stefan de Vrij', '德弗里', 'CB', ['CB'], 'int', '2020-21', 'seriea', 85, [70, 45, 74, 70, 87, 82], 'Netherlands', '荷兰', 6),
  p('Milan Škriniar', '什克里尼亚尔', 'CB', ['CB', 'CDM'], 'int', '2020-21', 'seriea', 86, [72, 45, 70, 70, 88, 86], 'Slovakia', '斯洛伐克', 37),
  p('Alessandro Bastoni', '巴斯托尼', 'CB', ['CB', 'LB'], 'int', '2020-21', 'seriea', 83, [76, 45, 74, 72, 82, 80], 'Italy', '意大利', 95),
  p('Nicolò Barella', '巴雷拉', 'CM', ['CM', 'CAM', 'CDM'], 'int', '2020-21', 'seriea', 86, [80, 76, 82, 82, 76, 78], 'Italy', '意大利', 23),
  p('Marcelo Brozović', '布罗佐维奇', 'CDM', ['CDM', 'CM'], 'int', '2020-21', 'seriea', 85, [70, 65, 84, 78, 80, 76], 'Croatia', '克罗地亚', 77),
  p('Arturo Vidal', '比达尔', 'CM', ['CM', 'CDM'], 'int', '2020-21', 'seriea', 83, [74, 72, 76, 76, 78, 82], 'Chile', '智利', 22),
  p('Ivan Perišić', '佩里西奇', 'LWB', ['LWB', 'LM', 'LW'], 'int', '2020-21', 'seriea', 84, [84, 78, 80, 82, 70, 78], 'Croatia', '克罗地亚', 14),
  p('Romelu Lukaku', '卢卡库', 'ST', ['ST', 'CF'], 'int', '2020-21', 'seriea', 87, [86, 84, 72, 80, 45, 86], 'Belgium', '比利时', 9),
  p('Lautaro Martínez', '劳塔罗·马丁内斯', 'ST', ['ST', 'CF'], 'int', '2020-21', 'seriea', 86, [82, 84, 76, 84, 50, 78], 'Argentina', '阿根廷', 10),

  // ===== Napoli 1986-87 (Maradona's first title) =====
  p('Claudio Garella', '加雷拉', 'GK', ['GK'], 'nap', '1986-87', 'seriea', 83, [50, 25, 55, 52, 83, 80], 'Italy', '意大利', 1),
  p('Giuseppe Bruscolotti', '布鲁斯科洛蒂', 'CB', ['CB', 'RB'], 'nap', '1986-87', 'seriea', 80, [66, 40, 62, 62, 82, 80], 'Italy', '意大利', 2),
  p('Moreno Ferrario', '费拉里奥', 'CB', ['CB'], 'nap', '1986-87', 'seriea', 81, [68, 45, 64, 64, 82, 82], 'Italy', '意大利', 5),
  p('Andrea Renica', '雷尼卡', 'CB', ['CB', 'LB'], 'nap', '1986-87', 'seriea', 80, [66, 45, 64, 64, 81, 80], 'Italy', '意大利', 6),
  p('Salvatore Bagni', '巴尼', 'CDM', ['CDM', 'CM'], 'nap', '1986-87', 'seriea', 82, [68, 60, 74, 72, 78, 80], 'Italy', '意大利', 4),
  p('Fernando De Napoli', '德那波利', 'RM', ['RM', 'CM', 'RB'], 'nap', '1986-87', 'seriea', 82, [80, 60, 74, 76, 72, 72], 'Italy', '意大利', 7),
  p('Francesco Romano', '罗马诺', 'CM', ['CM', 'CAM'], 'nap', '1986-87', 'seriea', 80, [70, 65, 76, 74, 70, 72], 'Italy', '意大利', 8),
  p('Francesco Vignola', '维尼奥拉', 'LM', ['LM', 'LW'], 'nap', '1986-87', 'seriea', 80, [80, 65, 72, 78, 56, 66], 'Italy', '意大利', 11),
  p('Diego Maradona', '马拉多纳', 'CAM', ['CAM', 'CF', 'ST'], 'nap', '1986-87', 'seriea', 95, [82, 88, 91, 96, 45, 72], 'Argentina', '阿根廷', 10),
  p('Bruno Giordano', '乔尔达诺', 'ST', ['ST', 'CF'], 'nap', '1986-87', 'seriea', 84, [78, 80, 74, 78, 50, 76], 'Italy', '意大利', 9),
  p('Andrea Carnevale', '卡尔内瓦莱', 'ST', ['ST', 'CF'], 'nap', '1986-87', 'seriea', 81, [78, 76, 70, 76, 50, 72], 'Italy', '意大利', 14),

  // ===== Napoli 2022-23 (first title in 33 years) =====
  p('Alex Meret', '梅雷特', 'GK', ['GK'], 'nap', '2022-23', 'seriea', 83, [50, 25, 58, 55, 83, 78], 'Italy', '意大利', 1),
  p('Giovanni Di Lorenzo', '迪洛伦佐', 'RB', ['RB', 'RWB'], 'nap', '2022-23', 'seriea', 85, [80, 60, 80, 78, 84, 80], 'Italy', '意大利', 22),
  p('Kim Min-jae', '金玟哉', 'CB', ['CB'], 'nap', '2022-23', 'seriea', 85, [78, 45, 72, 72, 87, 86], 'South Korea', '韩国', 3),
  p('Amir Rrahmani', '拉赫马尼', 'CB', ['CB'], 'nap', '2022-23', 'seriea', 83, [72, 45, 70, 70, 85, 84], 'Kosovo', '科索沃', 13),
  p('Mario Rui', '马里奥·鲁伊', 'LB', ['LB', 'LWB'], 'nap', '2022-23', 'seriea', 81, [78, 55, 76, 76, 78, 74], 'Portugal', '葡萄牙', 6),
  p('André-Frank Zambo Anguissa', '安圭萨', 'CDM', ['CDM', 'CM'], 'nap', '2022-23', 'seriea', 84, [80, 65, 78, 78, 82, 84], 'Cameroon', '喀麦隆', 99),
  p('Stanislav Lobotka', '洛博特卡', 'CDM', ['CDM', 'CM'], 'nap', '2022-23', 'seriea', 85, [70, 55, 84, 82, 80, 72], 'Slovakia', '斯洛伐克', 68),
  p('Piotr Zieliński', '泽林斯基', 'CM', ['CM', 'CAM', 'LM'], 'nap', '2022-23', 'seriea', 84, [76, 76, 82, 82, 64, 70], 'Poland', '波兰', 20),
  p('Khvicha Kvaratskhelia', '克瓦拉茨赫利亚', 'LW', ['LW', 'LM', 'CAM'], 'nap', '2022-23', 'seriea', 87, [88, 78, 80, 90, 50, 72], 'Georgia', '格鲁吉亚', 77),
  p('Victor Osimhen', '奥斯梅恩', 'ST', ['ST', 'CF'], 'nap', '2022-23', 'seriea', 88, [88, 84, 70, 78, 45, 84], 'Nigeria', '尼日利亚', 9),
  p('Matteo Politano', '波利塔诺', 'RW', ['RW', 'RM'], 'nap', '2022-23', 'seriea', 82, [84, 76, 76, 80, 56, 68], 'Italy', '意大利', 21),

  // ===== AS Roma 2000-01 (Serie A champions) =====
  p('Francesco Antonioli', '安东尼奥利', 'GK', ['GK'], 'rom', '2000-01', 'seriea', 82, [50, 25, 58, 55, 82, 80], 'Italy', '意大利', 1),
  p('Cafu', '卡福', 'RB', ['RB', 'RWB', 'RM'], 'rom', '2000-01', 'seriea', 87, [88, 62, 80, 80, 78, 76], 'Brazil', '巴西', 2),
  p('Aldair', '阿尔代尔', 'CB', ['CB'], 'rom', '2000-01', 'seriea', 84, [68, 45, 70, 70, 86, 84], 'Brazil', '巴西', 6),
  p('Walter Samuel', '萨穆埃尔', 'CB', ['CB'], 'rom', '2000-01', 'seriea', 86, [70, 45, 70, 70, 88, 86], 'Argentina', '阿根廷', 25),
  p('Vincent Candela', '坎德拉', 'LB', ['LB', 'LWB', 'RB'], 'rom', '2000-01', 'seriea', 84, [80, 60, 78, 78, 80, 78], 'France', '法国', 3),
  p('Damiano Tommasi', '托马西', 'CM', ['CM', 'CDM'], 'rom', '2000-01', 'seriea', 82, [72, 65, 78, 74, 78, 78], 'Italy', '意大利', 17),
  p('Emerson', '埃默森', 'CM', ['CM', 'CDM', 'CAM'], 'rom', '2000-01', 'seriea', 85, [74, 70, 82, 80, 78, 80], 'Brazil', '巴西', 8),
  p('Hidetoshi Nakata', '中田英寿', 'CM', ['CM', 'CAM'], 'rom', '2000-01', 'seriea', 83, [76, 72, 82, 80, 68, 70], 'Japan', '日本', 7),
  p('Francesco Totti', '托蒂', 'CAM', ['CAM', 'CF', 'ST'], 'rom', '2000-01', 'seriea', 89, [76, 84, 88, 88, 60, 76], 'Italy', '意大利', 10),
  p('Gabriel Batistuta', '巴蒂斯图塔', 'ST', ['ST', 'CF'], 'rom', '2000-01', 'seriea', 89, [78, 88, 74, 78, 50, 84], 'Argentina', '阿根廷', 18),
  p('Marco Delvecchio', '德尔维奇奥', 'ST', ['ST', 'CF', 'LW'], 'rom', '2000-01', 'seriea', 82, [76, 76, 72, 74, 50, 80], 'Italy', '意大利', 24),

  // ===== Lazio 1999-00 (Serie A champions) =====
  p('Luca Marchegiani', '马尔凯贾尼', 'GK', ['GK'], 'laz', '1999-00', 'seriea', 83, [50, 25, 58, 55, 83, 80], 'Italy', '意大利', 1),
  p('Giuseppe Pancaro', '潘卡罗', 'LB', ['LB', 'LWB'], 'laz', '1999-00', 'seriea', 83, [78, 55, 76, 76, 80, 78], 'Italy', '意大利', 3),
  p('Alessandro Nesta', '内斯塔', 'CB', ['CB'], 'laz', '1999-00', 'seriea', 88, [72, 45, 72, 72, 90, 84], 'Italy', '意大利', 13),
  p('Siniša Mihajlović', '米哈伊洛维奇', 'CB', ['CB', 'CDM'], 'laz', '1999-00', 'seriea', 85, [66, 50, 76, 70, 86, 84], 'Serbia', '塞尔维亚', 11),
  p('Giuseppe Favalli', '法瓦利', 'LB', ['LB', 'CB'], 'laz', '1999-00', 'seriea', 82, [72, 45, 72, 72, 82, 82], 'Italy', '意大利', 5),
  p('Diego Simeone', '西蒙尼', 'CDM', ['CDM', 'CM'], 'laz', '1999-00', 'seriea', 84, [70, 65, 78, 74, 82, 82], 'Argentina', '阿根廷', 8),
  p('Matías Almeyda', '阿尔梅达', 'CDM', ['CDM', 'CM'], 'laz', '1999-00', 'seriea', 83, [72, 60, 76, 74, 82, 82], 'Argentina', '阿根廷', 14),
  p('Pavel Nedvěd', '内德维德', 'LM', ['LM', 'CAM', 'CM'], 'laz', '1999-00', 'seriea', 88, [80, 80, 84, 84, 70, 76], 'Czech Republic', '捷克', 18),
  p('Juan Sebastián Verón', '贝隆', 'CM', ['CM', 'CAM', 'CDM'], 'laz', '1999-00', 'seriea', 87, [70, 72, 88, 82, 72, 76], 'Argentina', '阿根廷', 6),
  p('Marcelo Salas', '萨拉斯', 'ST', ['ST', 'CF'], 'laz', '1999-00', 'seriea', 86, [76, 84, 72, 78, 50, 78], 'Chile', '智利', 9),
  p('Simone Inzaghi', '小因扎吉', 'ST', ['ST', 'CF'], 'laz', '1999-00', 'seriea', 82, [80, 78, 68, 74, 45, 74], 'Italy', '意大利', 21),
  p('Roberto Mancini', '曼奇尼', 'CF', ['CF', 'CAM', 'ST'], 'laz', '1999-00', 'seriea', 84, [70, 76, 80, 80, 56, 72], 'Italy', '意大利', 10),
];
