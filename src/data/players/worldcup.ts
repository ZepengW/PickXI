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

// World Cup — iconic national sides.
export const WC_PLAYERS: Player[] = [
  // ===== Brazil 2002 (Champions) =====
  p('Marcos', '马科斯', 'GK', ['GK'], 'bra', '2002', 'wc', 84, [50, 25, 58, 55, 84, 80], 'Brazil', '巴西', 1),
  p('Cafu', '卡福', 'RB', ['RB', 'RWB'], 'bra', '2002', 'wc', 87, [88, 60, 80, 80, 80, 78], 'Brazil', '巴西', 2),
  p('Lúcio', '卢西奥', 'CB', ['CB'], 'bra', '2002', 'wc', 87, [78, 55, 72, 72, 87, 84], 'Brazil', '巴西', 3),
  p('Roque Júnior', '罗克·儒尼奥尔', 'CB', ['CB'], 'bra', '2002', 'wc', 82, [72, 45, 68, 68, 84, 82], 'Brazil', '巴西', 4),
  p('Roberto Carlos', '罗伯特·卡洛斯', 'LB', ['LB', 'LWB'], 'bra', '2002', 'wc', 88, [92, 78, 82, 84, 78, 82], 'Brazil', '巴西', 6),
  p('Gilberto Silva', '吉尔伯托·席尔瓦', 'CDM', ['CDM', 'CM'], 'bra', '2002', 'wc', 84, [72, 60, 78, 74, 84, 82], 'Brazil', '巴西', 8),
  p('Kleberson', '克莱伯森', 'CM', ['CM', 'RM'], 'bra', '2002', 'wc', 82, [78, 70, 78, 76, 74, 76], 'Brazil', '巴西', 15),
  p('Ronaldinho', '罗纳尔迪尼奥', 'CAM', ['CAM', 'LW', 'CF'], 'bra', '2002', 'wc', 91, [86, 82, 88, 92, 56, 74], 'Brazil', '巴西', 11),
  p('Rivaldo', '里瓦尔多', 'LW', ['LW', 'CAM', 'CF'], 'bra', '2002', 'wc', 90, [78, 88, 86, 88, 60, 80], 'Brazil', '巴西', 10),
  p('Ronaldo', '罗纳尔多', 'ST', ['ST', 'CF'], 'bra', '2002', 'wc', 94, [90, 92, 80, 90, 45, 82], 'Brazil', '巴西', 9),
  p('Edmílson', '埃德米尔森', 'CDM', ['CDM', 'CB'], 'bra', '2002', 'wc', 83, [72, 55, 74, 72, 84, 82], 'Brazil', '巴西', 5),

  // ===== Argentina 2022 (Champions) =====
  p('Emiliano Martínez', '埃米利亚诺·马丁内斯', 'GK', ['GK'], 'arg', '2022', 'wc', 86, [52, 28, 58, 55, 86, 82], 'Argentina', '阿根廷', 23),
  p('Nahuel Molina', '莫利纳', 'RB', ['RB', 'RWB'], 'arg', '2022', 'wc', 83, [82, 55, 76, 76, 80, 76], 'Argentina', '阿根廷', 26),
  p('Cristian Romero', '罗梅罗', 'CB', ['CB'], 'arg', '2022', 'wc', 86, [78, 50, 70, 70, 88, 86], 'Argentina', '阿根廷', 13),
  p('Nicolás Otamendi', '奥塔门迪', 'CB', ['CB'], 'arg', '2022', 'wc', 83, [70, 45, 68, 68, 85, 82], 'Argentina', '阿根廷', 19),
  p('Nicolás Tagliafico', '塔利亚菲科', 'LB', ['LB', 'LWB'], 'arg', '2022', 'wc', 82, [80, 55, 76, 76, 80, 78], 'Argentina', '阿根廷', 3),
  p('Rodrigo De Paul', '德保罗', 'CM', ['CM', 'CDM', 'RM'], 'arg', '2022', 'wc', 85, [78, 74, 84, 82, 74, 78], 'Argentina', '阿根廷', 7),
  p('Enzo Fernández', '恩佐·费尔南德斯', 'CM', ['CM', 'CDM'], 'arg', '2022', 'wc', 84, [72, 70, 84, 80, 76, 76], 'Argentina', '阿根廷', 24),
  p('Alexis Mac Allister', '麦卡利斯特', 'CM', ['CM', 'CAM', 'LM'], 'arg', '2022', 'wc', 84, [74, 74, 84, 84, 70, 72], 'Argentina', '阿根廷', 20),
  p('Lionel Messi', '梅西', 'RW', ['RW', 'CF', 'ST', 'CAM'], 'arg', '2022', 'wc', 93, [80, 88, 90, 92, 50, 72], 'Argentina', '阿根廷', 10),
  p('Julián Álvarez', '阿尔瓦雷斯', 'ST', ['ST', 'CF', 'LW'], 'arg', '2022', 'wc', 85, [84, 82, 78, 82, 50, 74], 'Argentina', '阿根廷', 9),
  p('Ángel Di María', '迪马利亚', 'RW', ['RW', 'LW', 'CAM'], 'arg', '2022', 'wc', 85, [86, 80, 84, 86, 56, 70], 'Argentina', '阿根廷', 11),

  // ===== France 2018 (Champions) =====
  p('Hugo Lloris', '洛里', 'GK', ['GK'], 'fra', '2018', 'wc', 87, [50, 25, 60, 55, 87, 80], 'France', '法国', 1),
  p('Benjamin Pavard', '帕瓦尔', 'RB', ['RB', 'CB'], 'fra', '2018', 'wc', 83, [78, 60, 76, 72, 82, 80], 'France', '法国', 2),
  p('Raphaël Varane', '瓦拉内', 'CB', ['CB'], 'fra', '2018', 'wc', 87, [82, 45, 72, 72, 88, 84], 'France', '法国', 4),
  p('Samuel Umtiti', '乌姆蒂蒂', 'CB', ['CB'], 'fra', '2018', 'wc', 84, [74, 45, 70, 70, 86, 82], 'France', '法国', 5),
  p('Lucas Hernández', '卢卡斯·埃尔南德斯', 'LB', ['LB', 'CB'], 'fra', '2018', 'wc', 83, [80, 50, 74, 74, 82, 82], 'France', '法国', 21),
  p('N\'Golo Kanté', '坎特', 'CDM', ['CDM', 'CM'], 'fra', '2018', 'wc', 88, [86, 60, 80, 78, 88, 82], 'France', '法国', 13),
  p('Paul Pogba', '博格巴', 'CM', ['CM', 'CAM', 'CDM'], 'fra', '2018', 'wc', 87, [80, 78, 84, 86, 74, 84], 'France', '法国', 6),
  p('Kylian Mbappé', '姆巴佩', 'RW', ['RW', 'ST', 'LW'], 'fra', '2018', 'wc', 89, [96, 86, 78, 88, 45, 76], 'France', '法国', 10),
  p('Antoine Griezmann', '格列兹曼', 'CF', ['CF', 'ST', 'CAM'], 'fra', '2018', 'wc', 88, [80, 84, 84, 86, 56, 72], 'France', '法国', 7),
  p('Olivier Giroud', '吉鲁', 'ST', ['ST', 'CF'], 'fra', '2018', 'wc', 83, [70, 80, 70, 72, 45, 86], 'France', '法国', 9),
  p('Blaise Matuidi', '马图伊迪', 'LM', ['LM', 'CM', 'LW'], 'fra', '2018', 'wc', 83, [80, 68, 78, 78, 76, 78], 'France', '法国', 14),

  // ===== Germany 2014 (Champions) =====
  p('Manuel Neuer', '诺伊尔', 'GK', ['GK'], 'ger', '2014', 'wc', 91, [55, 30, 65, 60, 90, 84], 'Germany', '德国', 1),
  p('Philipp Lahm', '拉姆', 'RB', ['RB', 'LB', 'CDM'], 'ger', '2014', 'wc', 88, [80, 55, 82, 82, 84, 76], 'Germany', '德国', 16),
  p('Jérôme Boateng', '博阿滕', 'CB', ['CB', 'RB'], 'ger', '2014', 'wc', 86, [78, 50, 74, 74, 86, 84], 'Germany', '德国', 20),
  p('Mats Hummels', '胡梅尔斯', 'CB', ['CB', 'CDM'], 'ger', '2014', 'wc', 87, [70, 50, 78, 72, 87, 84], 'Germany', '德国', 5),
  p('Benedikt Höwedes', '赫韦德斯', 'LB', ['LB', 'CB'], 'ger', '2014', 'wc', 82, [70, 45, 68, 66, 84, 84], 'Germany', '德国', 4),
  p('Bastian Schweinsteiger', '施魏因斯泰格', 'CM', ['CM', 'CDM'], 'ger', '2014', 'wc', 86, [68, 74, 84, 80, 80, 82], 'Germany', '德国', 7),
  p('Toni Kroos', '克罗斯', 'CM', ['CM', 'CDM'], 'ger', '2014', 'wc', 88, [60, 76, 90, 82, 72, 74], 'Germany', '德国', 18),
  p('Mesut Özil', '厄齐尔', 'CAM', ['CAM', 'CM', 'LW'], 'ger', '2014', 'wc', 87, [78, 74, 88, 88, 52, 64], 'Germany', '德国', 8),
  p('Thomas Müller', '托马斯·穆勒', 'CF', ['CF', 'CAM', 'ST', 'RW'], 'ger', '2014', 'wc', 87, [76, 82, 80, 82, 60, 76], 'Germany', '德国', 13),
  p('Miroslav Klose', '克洛泽', 'ST', ['ST', 'CF'], 'ger', '2014', 'wc', 84, [74, 80, 70, 74, 45, 78], 'Germany', '德国', 11),
  p('Sami Khedira', '赫迪拉', 'CM', ['CM', 'CDM'], 'ger', '2014', 'wc', 84, [76, 68, 78, 76, 76, 80], 'Germany', '德国', 6),

  // ===== Spain 2010 (Champions) =====
  p('Iker Casillas', '卡西利亚斯', 'GK', ['GK'], 'esp', '2010', 'wc', 90, [55, 30, 62, 58, 89, 82], 'Spain', '西班牙', 1),
  p('Sergio Ramos', '拉莫斯', 'RB', ['RB', 'CB', 'CDM'], 'esp', '2010', 'wc', 87, [80, 62, 76, 76, 87, 86], 'Spain', '西班牙', 15),
  p('Gerard Piqué', '皮克', 'CB', ['CB'], 'esp', '2010', 'wc', 86, [72, 50, 74, 72, 86, 84], 'Spain', '西班牙', 3),
  p('Carles Puyol', '普约尔', 'CB', ['CB', 'RB'], 'esp', '2010', 'wc', 87, [76, 50, 70, 72, 90, 86], 'Spain', '西班牙', 5),
  p('Joan Capdevila', '卡普德维拉', 'LB', ['LB', 'LWB'], 'esp', '2010', 'wc', 82, [78, 55, 76, 74, 80, 76], 'Spain', '西班牙', 11),
  p('Sergio Busquets', '布斯克茨', 'CDM', ['CDM', 'CM'], 'esp', '2010', 'wc', 86, [60, 60, 84, 78, 84, 78], 'Spain', '西班牙', 16),
  p('Xabi Alonso', '哈维·阿隆索', 'CDM', ['CDM', 'CM'], 'esp', '2010', 'wc', 86, [60, 70, 88, 76, 80, 78], 'Spain', '西班牙', 14),
  p('Xavi', '哈维', 'CM', ['CM', 'CAM'], 'esp', '2010', 'wc', 90, [66, 70, 92, 88, 70, 70], 'Spain', '西班牙', 8),
  p('Andrés Iniesta', '伊涅斯塔', 'CAM', ['CAM', 'CM', 'LW'], 'esp', '2010', 'wc', 90, [78, 75, 90, 92, 64, 70], 'Spain', '西班牙', 6),
  p('David Villa', '大卫·比利亚', 'ST', ['ST', 'LW'], 'esp', '2010', 'wc', 88, [82, 88, 80, 84, 50, 74], 'Spain', '西班牙', 7),
  p('Fernando Torres', '托雷斯', 'ST', ['ST', 'CF'], 'esp', '2010', 'wc', 86, [86, 84, 76, 80, 50, 78], 'Spain', '西班牙', 9),

  // ===== Italy 2006 (Champions) =====
  p('Gianluigi Buffon', '布冯', 'GK', ['GK'], 'ita', '2006', 'wc', 92, [50, 25, 60, 55, 92, 84], 'Italy', '意大利', 1),
  p('Gianluca Zambrotta', '赞布罗塔', 'RB', ['RB', 'LB', 'RWB'], 'ita', '2006', 'wc', 85, [82, 60, 78, 78, 84, 80], 'Italy', '意大利', 19),
  p('Fabio Cannavaro', '卡纳瓦罗', 'CB', ['CB'], 'ita', '2006', 'wc', 89, [78, 50, 70, 70, 91, 82], 'Italy', '意大利', 5),
  p('Marco Materazzi', '马特拉齐', 'CB', ['CB'], 'ita', '2006', 'wc', 84, [68, 50, 66, 66, 86, 86], 'Italy', '意大利', 23),
  p('Fabio Grosso', '格罗索', 'LB', ['LB', 'LWB'], 'ita', '2006', 'wc', 82, [78, 55, 74, 74, 80, 78], 'Italy', '意大利', 3),
  p('Gennaro Gattuso', '加图索', 'CDM', ['CDM', 'CM'], 'ita', '2006', 'wc', 85, [76, 60, 76, 74, 86, 84], 'Italy', '意大利', 8),
  p('Andrea Pirlo', '皮尔洛', 'CM', ['CM', 'CDM', 'CAM'], 'ita', '2006', 'wc', 89, [60, 72, 92, 84, 70, 68], 'Italy', '意大利', 21),
  p('Simone Perrotta', '佩罗塔', 'CM', ['CM', 'RM'], 'ita', '2006', 'wc', 82, [78, 66, 76, 74, 74, 76], 'Italy', '意大利', 16),
  p('Francesco Totti', '托蒂', 'CAM', ['CAM', 'CF', 'ST'], 'ita', '2006', 'wc', 88, [72, 82, 90, 88, 60, 78], 'Italy', '意大利', 10),
  p('Luca Toni', '托尼', 'ST', ['ST', 'CF'], 'ita', '2006', 'wc', 85, [70, 84, 70, 72, 45, 88], 'Italy', '意大利', 9),
  p('Alessandro Del Piero', '德尔·皮耶罗', 'CF', ['CF', 'CAM', 'LW', 'ST'], 'ita', '2006', 'wc', 87, [76, 82, 86, 88, 56, 72], 'Italy', '意大利', 7),

  // ===== Netherlands 2010 (finalists) =====
  p('Maarten Stekelenburg', '斯特克伦堡', 'GK', ['GK'], 'ned', '2010', 'wc', 84, [50, 25, 58, 55, 84, 80], 'Netherlands', '荷兰', 1),
  p('Gregory van der Wiel', '范德维尔', 'RB', ['RB', 'RWB'], 'ned', '2010', 'wc', 82, [82, 55, 74, 74, 78, 74], 'Netherlands', '荷兰', 2),
  p('Joris Mathijsen', '马泰森', 'CB', ['CB'], 'ned', '2010', 'wc', 82, [68, 45, 68, 66, 84, 82], 'Netherlands', '荷兰', 4),
  p('John Heitinga', '海廷加', 'CB', ['CB', 'RB', 'CDM'], 'ned', '2010', 'wc', 83, [74, 50, 70, 70, 84, 82], 'Netherlands', '荷兰', 3),
  p('Giovanni van Bronckhorst', '范布隆克霍斯特', 'LB', ['LB', 'LWB'], 'ned', '2010', 'wc', 83, [78, 60, 78, 76, 80, 78], 'Netherlands', '荷兰', 5),
  p('Mark van Bommel', '范博梅尔', 'CDM', ['CDM', 'CM'], 'ned', '2010', 'wc', 84, [68, 65, 80, 74, 84, 82], 'Netherlands', '荷兰', 6),
  p('Wesley Sneijder', '斯内德', 'CAM', ['CAM', 'CM'], 'ned', '2010', 'wc', 88, [72, 82, 90, 86, 56, 68], 'Netherlands', '荷兰', 10),
  p('Dirk Kuyt', '库伊特', 'RM', ['RM', 'RW', 'ST'], 'ned', '2010', 'wc', 83, [78, 74, 76, 74, 70, 80], 'Netherlands', '荷兰', 7),
  p('Arjen Robben', '罗本', 'RW', ['RW', 'LW', 'ST'], 'ned', '2010', 'wc', 89, [88, 86, 80, 88, 50, 74], 'Netherlands', '荷兰', 11),
  p('Robin van Persie', '范佩西', 'ST', ['ST', 'CF'], 'ned', '2010', 'wc', 87, [78, 88, 82, 85, 45, 76], 'Netherlands', '荷兰', 9),
  p('Rafael van der Vaart', '范德法特', 'CAM', ['CAM', 'CM', 'LM'], 'ned', '2010', 'wc', 85, [74, 76, 86, 84, 60, 70], 'Netherlands', '荷兰', 23),

  // ===== Portugal 2018 =====
  p('Rui Patrício', '帕特里西奥', 'GK', ['GK'], 'por', '2018', 'wc', 85, [50, 25, 58, 55, 85, 80], 'Portugal', '葡萄牙', 1),
  p('Cédric Soares', '塞德里克', 'RB', ['RB', 'RWB'], 'por', '2018', 'wc', 81, [78, 50, 74, 74, 78, 74], 'Portugal', '葡萄牙', 21),
  p('Pepe', '佩佩', 'CB', ['CB', 'CDM'], 'por', '2018', 'wc', 85, [72, 50, 68, 70, 88, 86], 'Portugal', '葡萄牙', 3),
  p('José Fonte', '丰特', 'CB', ['CB'], 'por', '2018', 'wc', 81, [66, 40, 66, 64, 84, 82], 'Portugal', '葡萄牙', 6),
  p('Raphaël Guerreiro', '格雷罗', 'LB', ['LB', 'LWB', 'LM'], 'por', '2018', 'wc', 83, [82, 60, 80, 80, 78, 72], 'Portugal', '葡萄牙', 5),
  p('William Carvalho', '威廉·卡瓦略', 'CDM', ['CDM', 'CM'], 'por', '2018', 'wc', 83, [70, 60, 78, 76, 84, 84], 'Portugal', '葡萄牙', 14),
  p('João Moutinho', '穆蒂尼奥', 'CM', ['CM', 'CAM'], 'por', '2018', 'wc', 84, [66, 68, 86, 82, 72, 68], 'Portugal', '葡萄牙', 8),
  p('Bernardo Silva', '贝尔纳多·席尔瓦', 'RM', ['RM', 'CAM', 'CM'], 'por', '2018', 'wc', 86, [80, 76, 84, 88, 60, 70], 'Portugal', '葡萄牙', 10),
  p('Cristiano Ronaldo', 'C罗', 'ST', ['ST', 'LW', 'RW'], 'por', '2018', 'wc', 94, [85, 93, 82, 88, 60, 82], 'Portugal', '葡萄牙', 7),
  p('Gonçalo Guedes', '格德斯', 'LW', ['LW', 'ST'], 'por', '2018', 'wc', 82, [88, 76, 74, 80, 45, 70], 'Portugal', '葡萄牙', 17),
  p('André Silva', '安德烈·席尔瓦', 'ST', ['ST', 'CF'], 'por', '2018', 'wc', 81, [78, 80, 70, 74, 45, 78], 'Portugal', '葡萄牙', 9),

  // ===== Brazil 1970 (Champions — the greatest side ever) =====
  p('Félix', '费利克斯', 'GK', ['GK'], 'bra', '1970', 'wc', 82, [45, 20, 50, 45, 82, 78], 'Brazil', '巴西', 1),
  p('Carlos Alberto', '卡洛斯·阿尔贝托', 'RB', ['RB', 'RWB'], 'bra', '1970', 'wc', 86, [82, 60, 78, 76, 80, 78], 'Brazil', '巴西', 4),
  p('Britto', '布里托', 'CB', ['CB'], 'bra', '1970', 'wc', 82, [68, 40, 65, 66, 85, 82], 'Brazil', '巴西', 5),
  p('Wilson Piazza', '皮亚扎', 'CB', ['CB', 'CDM'], 'bra', '1970', 'wc', 83, [72, 50, 72, 70, 84, 82], 'Brazil', '巴西', 6),
  p('Everaldo', '埃韦拉尔多', 'LB', ['LB', 'LWB'], 'bra', '1970', 'wc', 82, [80, 55, 72, 74, 78, 76], 'Brazil', '巴西', 2),
  p('Clodoaldo', '克洛多阿尔多', 'CDM', ['CDM', 'CM'], 'bra', '1970', 'wc', 84, [76, 65, 82, 82, 76, 74], 'Brazil', '巴西', 3),
  p('Gérson', '热尔松', 'CM', ['CM', 'CAM'], 'bra', '1970', 'wc', 85, [72, 78, 88, 82, 68, 72], 'Brazil', '巴西', 7),
  p('Jairzinho', '雅伊尔津霍', 'RW', ['RW', 'LW', 'ST'], 'bra', '1970', 'wc', 87, [88, 82, 78, 84, 56, 76], 'Brazil', '巴西', 9),
  p('Tostão', '托斯唐', 'CF', ['CF', 'ST'], 'bra', '1970', 'wc', 86, [78, 82, 82, 84, 52, 72], 'Brazil', '巴西', 8),
  p('Pelé', '贝利', 'ST', ['ST', 'CF', 'CAM'], 'bra', '1970', 'wc', 95, [84, 88, 90, 92, 70, 80], 'Brazil', '巴西', 10),
  p('Rivellino', '里维利诺', 'LW', ['LW', 'CAM', 'CF'], 'bra', '1970', 'wc', 88, [80, 84, 86, 88, 60, 74], 'Brazil', '巴西', 11),

  // ===== Argentina 1986 (Champions — Maradona's tournament) =====
  p('Nery Pumpido', '蓬皮多', 'GK', ['GK'], 'arg', '1986', 'wc', 82, [48, 22, 52, 48, 82, 80], 'Argentina', '阿根廷', 1),
  p('Oscar Ruggeri', '鲁杰里', 'CB', ['CB'], 'arg', '1986', 'wc', 85, [72, 50, 70, 70, 88, 86], 'Argentina', '阿根廷', 2),
  p('José Luis Brown', '布朗', 'CB', ['CB'], 'arg', '1986', 'wc', 82, [68, 45, 66, 66, 85, 84], 'Argentina', '阿根廷', 3),
  p('Héctor Enrique', '恩里克', 'RB', ['RB', 'RM'], 'arg', '1986', 'wc', 81, [78, 55, 74, 76, 76, 72], 'Argentina', '阿根廷', 4),
  p('Julio Olarticoechea', '奥拉蒂科切亚', 'LB', ['LB', 'LWB'], 'arg', '1986', 'wc', 82, [78, 50, 72, 74, 80, 78], 'Argentina', '阿根廷', 5),
  p('Ricardo Giusti', '朱斯蒂', 'CM', ['CM', 'CDM'], 'arg', '1986', 'wc', 82, [70, 62, 78, 74, 78, 76], 'Argentina', '阿根廷', 6),
  p('Sergio Batista', '巴蒂斯塔', 'CDM', ['CDM', 'CM'], 'arg', '1986', 'wc', 83, [68, 55, 80, 74, 82, 78], 'Argentina', '阿根廷', 7),
  p('Jorge Burruchaga', '布鲁查加', 'RW', ['RW', 'CAM', 'ST'], 'arg', '1986', 'wc', 85, [82, 78, 82, 84, 56, 72], 'Argentina', '阿根廷', 8),
  p('Diego Maradona', '马拉多纳', 'CAM', ['CAM', 'CF', 'ST'], 'arg', '1986', 'wc', 95, [82, 88, 92, 96, 50, 74], 'Argentina', '阿根廷', 10),
  p('Jorge Valdano', '巴尔达诺', 'ST', ['ST', 'CF'], 'arg', '1986', 'wc', 85, [78, 84, 80, 80, 52, 76], 'Argentina', '阿根廷', 9),
  p('Oscar Garré', '加雷', 'CB', ['CB', 'RB'], 'arg', '1986', 'wc', 81, [70, 42, 66, 66, 84, 82], 'Argentina', '阿根廷', 11),

  // ===== Netherlands 1974 (Total Football — Cruyff) =====
  p('Jan Jongbloed', '容布洛德', 'GK', ['GK'], 'ned', '1974', 'wc', 81, [45, 20, 50, 45, 82, 78], 'Netherlands', '荷兰', 8),
  p('Wim Suurbier', '苏尔比尔', 'RB', ['RB', 'RWB'], 'ned', '1974', 'wc', 83, [80, 55, 74, 76, 80, 76], 'Netherlands', '荷兰', 2),
  p('Arie Haan', '阿里·汉', 'CB', ['CB', 'CM'], 'ned', '1974', 'wc', 84, [76, 70, 82, 78, 80, 78], 'Netherlands', '荷兰', 3),
  p('Ruud Krol', '克洛尔', 'CB', ['CB', 'LB'], 'ned', '1974', 'wc', 87, [78, 65, 82, 78, 88, 84], 'Netherlands', '荷兰', 4),
  p('Wim Jansen', '扬森', 'CDM', ['CDM', 'CM'], 'ned', '1974', 'wc', 84, [74, 65, 82, 78, 82, 80], 'Netherlands', '荷兰', 6),
  p('Johan Neeskens', '内斯肯斯', 'CM', ['CM', 'CAM', 'CDM'], 'ned', '1974', 'wc', 89, [78, 80, 88, 84, 72, 76], 'Netherlands', '荷兰', 13),
  p('Willem van Hanegem', '范哈内亨', 'CM', ['CM', 'CAM'], 'ned', '1974', 'wc', 86, [72, 78, 88, 82, 70, 74], 'Netherlands', '荷兰', 10),
  p('Johnny Rep', '雷普', 'RW', ['RW', 'LW', 'ST'], 'ned', '1974', 'wc', 85, [84, 80, 78, 80, 56, 72], 'Netherlands', '荷兰', 7),
  p('Rob Rensenbrink', '伦森布林克', 'LW', ['LW', 'ST', 'CF'], 'ned', '1974', 'wc', 86, [84, 82, 80, 84, 54, 72], 'Netherlands', '荷兰', 5),
  p('Johan Cruyff', '克鲁伊夫', 'ST', ['ST', 'CF', 'CAM'], 'ned', '1974', 'wc', 94, [88, 85, 90, 94, 60, 76], 'Netherlands', '荷兰', 14),
  p('Piet Keizer', '凯泽尔', 'LW', ['LW', 'LM', 'CF'], 'ned', '1974', 'wc', 84, [80, 76, 82, 84, 56, 70], 'Netherlands', '荷兰', 9),
];
