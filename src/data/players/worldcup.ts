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
  p('Marcos', '马科斯', 'GK', ['GK'], 'bra', '2002', 'wc', 17, [10, 5, 12, 11, 17, 16], 'Brazil', '巴西', 1),
  p('Cafu', '卡福', 'RB', ['RB', 'RWB'], 'bra', '2002', 'wc', 17, [18, 12, 16, 16, 16, 16], 'Brazil', '巴西', 2),
  p('Lúcio', '卢西奥', 'CB', ['CB'], 'bra', '2002', 'wc', 17, [16, 11, 14, 14, 17, 17], 'Brazil', '巴西', 3),
  p('Roque Júnior', '罗克·儒尼奥尔', 'CB', ['CB'], 'bra', '2002', 'wc', 16, [14, 9, 14, 14, 17, 16], 'Brazil', '巴西', 4),
  p('Roberto Carlos', '罗伯特·卡洛斯', 'LB', ['LB', 'LWB'], 'bra', '2002', 'wc', 18, [18, 16, 16, 17, 16, 16], 'Brazil', '巴西', 6),
  p('Gilberto Silva', '吉尔伯托·席尔瓦', 'CDM', ['CDM', 'CM'], 'bra', '2002', 'wc', 17, [14, 12, 16, 15, 17, 16], 'Brazil', '巴西', 8),
  p('Kleberson', '克莱伯森', 'CM', ['CM', 'RM'], 'bra', '2002', 'wc', 16, [16, 14, 16, 15, 15, 15], 'Brazil', '巴西', 15),
  p('Ronaldinho', '罗纳尔迪尼奥', 'CAM', ['CAM', 'LW', 'CF'], 'bra', '2002', 'wc', 18, [17, 16, 18, 18, 11, 15], 'Brazil', '巴西', 11),
  p('Rivaldo', '里瓦尔多', 'LW', ['LW', 'CAM', 'CF'], 'bra', '2002', 'wc', 18, [16, 18, 17, 18, 12, 16], 'Brazil', '巴西', 10),
  p('Ronaldo', '罗纳尔多', 'ST', ['ST', 'CF'], 'bra', '2002', 'wc', 19, [18, 18, 16, 18, 9, 16], 'Brazil', '巴西', 9),
  p('Edmílson', '埃德米尔森', 'CDM', ['CDM', 'CB'], 'bra', '2002', 'wc', 17, [14, 11, 15, 14, 17, 16], 'Brazil', '巴西', 5),

  // ===== Argentina 2022 (Champions) =====
  p('Emiliano Martínez', '埃米利亚诺·马丁内斯', 'GK', ['GK'], 'arg', '2022', 'wc', 17, [10, 6, 12, 11, 17, 16], 'Argentina', '阿根廷', 23),
  p('Nahuel Molina', '莫利纳', 'RB', ['RB', 'RWB'], 'arg', '2022', 'wc', 17, [16, 11, 15, 15, 16, 15], 'Argentina', '阿根廷', 26),
  p('Cristian Romero', '罗梅罗', 'CB', ['CB'], 'arg', '2022', 'wc', 17, [16, 10, 14, 14, 18, 17], 'Argentina', '阿根廷', 13),
  p('Nicolás Otamendi', '奥塔门迪', 'CB', ['CB'], 'arg', '2022', 'wc', 17, [14, 9, 14, 14, 17, 16], 'Argentina', '阿根廷', 19),
  p('Nicolás Tagliafico', '塔利亚菲科', 'LB', ['LB', 'LWB'], 'arg', '2022', 'wc', 16, [16, 11, 15, 15, 16, 16], 'Argentina', '阿根廷', 3),
  p('Rodrigo De Paul', '德保罗', 'CM', ['CM', 'CDM', 'RM'], 'arg', '2022', 'wc', 17, [16, 15, 17, 16, 15, 16], 'Argentina', '阿根廷', 7),
  p('Enzo Fernández', '恩佐·费尔南德斯', 'CM', ['CM', 'CDM'], 'arg', '2022', 'wc', 17, [14, 14, 17, 16, 15, 15], 'Argentina', '阿根廷', 24),
  p('Alexis Mac Allister', '麦卡利斯特', 'CM', ['CM', 'CAM', 'LM'], 'arg', '2022', 'wc', 17, [15, 15, 17, 17, 14, 14], 'Argentina', '阿根廷', 20),
  p('Lionel Messi', '梅西', 'RW', ['RW', 'CF', 'ST', 'CAM'], 'arg', '2022', 'wc', 19, [16, 18, 18, 18, 10, 14], 'Argentina', '阿根廷', 10),
  p('Julián Álvarez', '阿尔瓦雷斯', 'ST', ['ST', 'CF', 'LW'], 'arg', '2022', 'wc', 17, [17, 16, 16, 16, 10, 15], 'Argentina', '阿根廷', 9),
  p('Ángel Di María', '迪马利亚', 'RW', ['RW', 'LW', 'CAM'], 'arg', '2022', 'wc', 17, [17, 16, 17, 17, 11, 14], 'Argentina', '阿根廷', 11),

  // ===== France 2018 (Champions) =====
  p('Hugo Lloris', '洛里', 'GK', ['GK'], 'fra', '2018', 'wc', 17, [10, 5, 12, 11, 17, 16], 'France', '法国', 1),
  p('Benjamin Pavard', '帕瓦尔', 'RB', ['RB', 'CB'], 'fra', '2018', 'wc', 17, [16, 12, 15, 14, 16, 16], 'France', '法国', 2),
  p('Raphaël Varane', '瓦拉内', 'CB', ['CB'], 'fra', '2018', 'wc', 17, [16, 9, 14, 14, 18, 17], 'France', '法国', 4),
  p('Samuel Umtiti', '乌姆蒂蒂', 'CB', ['CB'], 'fra', '2018', 'wc', 17, [15, 9, 14, 14, 17, 16], 'France', '法国', 5),
  p('Lucas Hernández', '卢卡斯·埃尔南德斯', 'LB', ['LB', 'CB'], 'fra', '2018', 'wc', 17, [16, 10, 15, 15, 16, 16], 'France', '法国', 21),
  p("N'Golo Kanté", '坎特', 'CDM', ['CDM', 'CM'], 'fra', '2018', 'wc', 18, [17, 12, 16, 16, 18, 16], 'France', '法国', 13),
  p('Paul Pogba', '博格巴', 'CM', ['CM', 'CAM', 'CDM'], 'fra', '2018', 'wc', 17, [16, 16, 17, 17, 15, 17], 'France', '法国', 6),
  p('Kylian Mbappé', '姆巴佩', 'RW', ['RW', 'ST', 'LW'], 'fra', '2018', 'wc', 18, [19, 17, 16, 18, 9, 15], 'France', '法国', 10),
  p('Antoine Griezmann', '格列兹曼', 'CF', ['CF', 'ST', 'CAM'], 'fra', '2018', 'wc', 18, [16, 17, 17, 17, 11, 14], 'France', '法国', 7),
  p('Olivier Giroud', '吉鲁', 'ST', ['ST', 'CF'], 'fra', '2018', 'wc', 17, [14, 16, 14, 14, 9, 17], 'France', '法国', 9),
  p('Blaise Matuidi', '马图伊迪', 'LM', ['LM', 'CM', 'LW'], 'fra', '2018', 'wc', 17, [16, 14, 16, 16, 15, 16], 'France', '法国', 14),

  // ===== Germany 2014 (Champions) =====
  p('Manuel Neuer', '诺伊尔', 'GK', ['GK'], 'ger', '2014', 'wc', 18, [11, 6, 13, 12, 18, 17], 'Germany', '德国', 1),
  p('Philipp Lahm', '拉姆', 'RB', ['RB', 'LB', 'CDM'], 'ger', '2014', 'wc', 18, [16, 11, 16, 16, 17, 15], 'Germany', '德国', 16),
  p('Jérôme Boateng', '博阿滕', 'CB', ['CB', 'RB'], 'ger', '2014', 'wc', 17, [16, 10, 15, 15, 17, 17], 'Germany', '德国', 20),
  p('Mats Hummels', '胡梅尔斯', 'CB', ['CB', 'CDM'], 'ger', '2014', 'wc', 17, [14, 10, 16, 14, 17, 17], 'Germany', '德国', 5),
  p('Benedikt Höwedes', '赫韦德斯', 'LB', ['LB', 'CB'], 'ger', '2014', 'wc', 16, [14, 9, 14, 13, 17, 17], 'Germany', '德国', 4),
  p('Bastian Schweinsteiger', '施魏因斯泰格', 'CM', ['CM', 'CDM'], 'ger', '2014', 'wc', 17, [14, 15, 17, 16, 16, 16], 'Germany', '德国', 7),
  p('Toni Kroos', '克罗斯', 'CM', ['CM', 'CDM'], 'ger', '2014', 'wc', 18, [12, 15, 18, 16, 14, 15], 'Germany', '德国', 18),
  p('Mesut Özil', '厄齐尔', 'CAM', ['CAM', 'CM', 'LW'], 'ger', '2014', 'wc', 17, [16, 15, 18, 18, 10, 13], 'Germany', '德国', 8),
  p('Thomas Müller', '托马斯·穆勒', 'CF', ['CF', 'CAM', 'ST', 'RW'], 'ger', '2014', 'wc', 17, [15, 16, 16, 16, 12, 15], 'Germany', '德国', 13),
  p('Miroslav Klose', '克洛泽', 'ST', ['ST', 'CF'], 'ger', '2014', 'wc', 17, [15, 16, 14, 15, 9, 16], 'Germany', '德国', 11),
  p('Sami Khedira', '赫迪拉', 'CM', ['CM', 'CDM'], 'ger', '2014', 'wc', 17, [15, 14, 16, 15, 15, 16], 'Germany', '德国', 6),

  // ===== Spain 2010 (Champions) =====
  p('Iker Casillas', '卡西利亚斯', 'GK', ['GK'], 'esp', '2010', 'wc', 18, [11, 6, 12, 12, 18, 16], 'Spain', '西班牙', 1),
  p('Sergio Ramos', '拉莫斯', 'RB', ['RB', 'CB', 'CDM'], 'esp', '2010', 'wc', 17, [16, 12, 15, 15, 17, 17], 'Spain', '西班牙', 15),
  p('Gerard Piqué', '皮克', 'CB', ['CB'], 'esp', '2010', 'wc', 17, [14, 10, 15, 14, 17, 17], 'Spain', '西班牙', 3),
  p('Carles Puyol', '普约尔', 'CB', ['CB', 'RB'], 'esp', '2010', 'wc', 17, [15, 10, 14, 14, 18, 17], 'Spain', '西班牙', 5),
  p('Joan Capdevila', '卡普德维拉', 'LB', ['LB', 'LWB'], 'esp', '2010', 'wc', 16, [16, 11, 15, 15, 16, 15], 'Spain', '西班牙', 11),
  p('Sergio Busquets', '布斯克茨', 'CDM', ['CDM', 'CM'], 'esp', '2010', 'wc', 17, [12, 12, 17, 16, 17, 16], 'Spain', '西班牙', 16),
  p('Xabi Alonso', '哈维·阿隆索', 'CDM', ['CDM', 'CM'], 'esp', '2010', 'wc', 17, [12, 14, 18, 15, 16, 16], 'Spain', '西班牙', 14),
  p('Xavi', '哈维', 'CM', ['CM', 'CAM'], 'esp', '2010', 'wc', 18, [13, 14, 18, 18, 14, 14], 'Spain', '西班牙', 8),
  p('Andrés Iniesta', '伊涅斯塔', 'CAM', ['CAM', 'CM', 'LW'], 'esp', '2010', 'wc', 18, [16, 15, 18, 18, 13, 14], 'Spain', '西班牙', 6),
  p('David Villa', '大卫·比利亚', 'ST', ['ST', 'LW'], 'esp', '2010', 'wc', 18, [16, 18, 16, 17, 10, 15], 'Spain', '西班牙', 7),
  p('Fernando Torres', '托雷斯', 'ST', ['ST', 'CF'], 'esp', '2010', 'wc', 17, [17, 17, 15, 16, 10, 16], 'Spain', '西班牙', 9),

  // ===== Italy 2006 (Champions) =====
  p('Gianluigi Buffon', '布冯', 'GK', ['GK'], 'ita', '2006', 'wc', 18, [10, 5, 12, 11, 18, 17], 'Italy', '意大利', 1),
  p('Gianluca Zambrotta', '赞布罗塔', 'RB', ['RB', 'LB', 'RWB'], 'ita', '2006', 'wc', 17, [16, 12, 16, 16, 17, 16], 'Italy', '意大利', 19),
  p('Fabio Cannavaro', '卡纳瓦罗', 'CB', ['CB'], 'ita', '2006', 'wc', 18, [16, 10, 14, 14, 18, 16], 'Italy', '意大利', 5),
  p('Marco Materazzi', '马特拉齐', 'CB', ['CB'], 'ita', '2006', 'wc', 17, [14, 10, 13, 13, 17, 17], 'Italy', '意大利', 23),
  p('Fabio Grosso', '格罗索', 'LB', ['LB', 'LWB'], 'ita', '2006', 'wc', 16, [16, 11, 15, 15, 16, 16], 'Italy', '意大利', 3),
  p('Gennaro Gattuso', '加图索', 'CDM', ['CDM', 'CM'], 'ita', '2006', 'wc', 17, [15, 12, 15, 15, 17, 17], 'Italy', '意大利', 8),
  p('Andrea Pirlo', '皮尔洛', 'CM', ['CM', 'CDM', 'CAM'], 'ita', '2006', 'wc', 18, [12, 14, 18, 17, 14, 14], 'Italy', '意大利', 21),
  p('Simone Perrotta', '佩罗塔', 'CM', ['CM', 'RM'], 'ita', '2006', 'wc', 16, [16, 13, 15, 15, 15, 15], 'Italy', '意大利', 16),
  p('Francesco Totti', '托蒂', 'CAM', ['CAM', 'CF', 'ST'], 'ita', '2006', 'wc', 18, [14, 16, 18, 18, 12, 16], 'Italy', '意大利', 10),
  p('Luca Toni', '托尼', 'ST', ['ST', 'CF'], 'ita', '2006', 'wc', 17, [14, 17, 14, 14, 9, 18], 'Italy', '意大利', 9),
  p('Alessandro Del Piero', '德尔·皮耶罗', 'CF', ['CF', 'CAM', 'LW', 'ST'], 'ita', '2006', 'wc', 17, [15, 16, 17, 18, 11, 14], 'Italy', '意大利', 7),

  // ===== Netherlands 2010 (finalists) =====
  p('Maarten Stekelenburg', '斯特克伦堡', 'GK', ['GK'], 'ned', '2010', 'wc', 17, [10, 5, 12, 11, 17, 16], 'Netherlands', '荷兰', 1),
  p('Gregory van der Wiel', '范德维尔', 'RB', ['RB', 'RWB'], 'ned', '2010', 'wc', 16, [16, 11, 15, 15, 16, 15], 'Netherlands', '荷兰', 2),
  p('Joris Mathijsen', '马泰森', 'CB', ['CB'], 'ned', '2010', 'wc', 16, [14, 9, 14, 13, 17, 16], 'Netherlands', '荷兰', 4),
  p('John Heitinga', '海廷加', 'CB', ['CB', 'RB', 'CDM'], 'ned', '2010', 'wc', 17, [15, 10, 14, 14, 17, 16], 'Netherlands', '荷兰', 3),
  p('Giovanni van Bronckhorst', '范布隆克霍斯特', 'LB', ['LB', 'LWB'], 'ned', '2010', 'wc', 17, [16, 12, 16, 15, 16, 16], 'Netherlands', '荷兰', 5),
  p('Mark van Bommel', '范博梅尔', 'CDM', ['CDM', 'CM'], 'ned', '2010', 'wc', 17, [14, 13, 16, 15, 17, 16], 'Netherlands', '荷兰', 6),
  p('Wesley Sneijder', '斯内德', 'CAM', ['CAM', 'CM'], 'ned', '2010', 'wc', 18, [14, 16, 18, 17, 11, 14], 'Netherlands', '荷兰', 10),
  p('Dirk Kuyt', '库伊特', 'RM', ['RM', 'RW', 'ST'], 'ned', '2010', 'wc', 17, [16, 15, 15, 15, 14, 16], 'Netherlands', '荷兰', 7),
  p('Arjen Robben', '罗本', 'RW', ['RW', 'LW', 'ST'], 'ned', '2010', 'wc', 18, [18, 17, 16, 18, 10, 15], 'Netherlands', '荷兰', 11),
  p('Robin van Persie', '范佩西', 'ST', ['ST', 'CF'], 'ned', '2010', 'wc', 17, [16, 18, 16, 17, 9, 15], 'Netherlands', '荷兰', 9),
  p('Rafael van der Vaart', '范德法特', 'CAM', ['CAM', 'CM', 'LM'], 'ned', '2010', 'wc', 17, [15, 15, 17, 17, 12, 14], 'Netherlands', '荷兰', 23),

  // ===== Portugal 2018 =====
  p('Rui Patrício', '帕特里西奥', 'GK', ['GK'], 'por', '2018', 'wc', 17, [10, 5, 12, 11, 17, 16], 'Portugal', '葡萄牙', 1),
  p('Cédric Soares', '塞德里克', 'RB', ['RB', 'RWB'], 'por', '2018', 'wc', 16, [16, 10, 15, 15, 16, 15], 'Portugal', '葡萄牙', 21),
  p('Pepe', '佩佩', 'CB', ['CB', 'CDM'], 'por', '2018', 'wc', 17, [14, 10, 14, 14, 18, 17], 'Portugal', '葡萄牙', 3),
  p('José Fonte', '丰特', 'CB', ['CB'], 'por', '2018', 'wc', 16, [13, 8, 13, 13, 17, 16], 'Portugal', '葡萄牙', 6),
  p('Raphaël Guerreiro', '格雷罗', 'LB', ['LB', 'LWB', 'LM'], 'por', '2018', 'wc', 17, [16, 12, 16, 16, 16, 14], 'Portugal', '葡萄牙', 5),
  p('William Carvalho', '威廉·卡瓦略', 'CDM', ['CDM', 'CM'], 'por', '2018', 'wc', 17, [14, 12, 16, 15, 17, 17], 'Portugal', '葡萄牙', 14),
  p('João Moutinho', '穆蒂尼奥', 'CM', ['CM', 'CAM'], 'por', '2018', 'wc', 17, [13, 14, 17, 16, 14, 14], 'Portugal', '葡萄牙', 8),
  p('Bernardo Silva', '贝尔纳多·席尔瓦', 'RM', ['RM', 'CAM', 'CM'], 'por', '2018', 'wc', 17, [16, 15, 17, 18, 12, 14], 'Portugal', '葡萄牙', 10),
  p('Cristiano Ronaldo', 'C罗', 'ST', ['ST', 'LW', 'RW'], 'por', '2018', 'wc', 19, [17, 19, 16, 18, 12, 16], 'Portugal', '葡萄牙', 7),
  p('Gonçalo Guedes', '格德斯', 'LW', ['LW', 'ST'], 'por', '2018', 'wc', 16, [18, 15, 15, 16, 9, 14], 'Portugal', '葡萄牙', 17),
  p('André Silva', '安德烈·席尔瓦', 'ST', ['ST', 'CF'], 'por', '2018', 'wc', 16, [16, 16, 14, 15, 9, 16], 'Portugal', '葡萄牙', 9),

  // ===== Brazil 1970 (Champions — the greatest side ever) =====
  p('Félix', '费利克斯', 'GK', ['GK'], 'bra', '1970', 'wc', 16, [9, 4, 10, 9, 16, 16], 'Brazil', '巴西', 1),
  p('Carlos Alberto', '卡洛斯·阿尔贝托', 'RB', ['RB', 'RWB'], 'bra', '1970', 'wc', 17, [16, 12, 16, 15, 16, 16], 'Brazil', '巴西', 4),
  p('Britto', '布里托', 'CB', ['CB'], 'bra', '1970', 'wc', 16, [14, 8, 13, 13, 17, 16], 'Brazil', '巴西', 5),
  p('Wilson Piazza', '皮亚扎', 'CB', ['CB', 'CDM'], 'bra', '1970', 'wc', 17, [14, 10, 14, 14, 17, 16], 'Brazil', '巴西', 6),
  p('Everaldo', '埃韦拉尔多', 'LB', ['LB', 'LWB'], 'bra', '1970', 'wc', 16, [16, 11, 14, 15, 16, 15], 'Brazil', '巴西', 2),
  p('Clodoaldo', '克洛多阿尔多', 'CDM', ['CDM', 'CM'], 'bra', '1970', 'wc', 17, [15, 13, 16, 16, 15, 15], 'Brazil', '巴西', 3),
  p('Gérson', '热尔松', 'CM', ['CM', 'CAM'], 'bra', '1970', 'wc', 17, [14, 16, 18, 16, 14, 14], 'Brazil', '巴西', 7),
  p('Jairzinho', '雅伊尔津霍', 'RW', ['RW', 'LW', 'ST'], 'bra', '1970', 'wc', 17, [18, 16, 16, 17, 11, 15], 'Brazil', '巴西', 9),
  p('Tostão', '托斯唐', 'CF', ['CF', 'ST'], 'bra', '1970', 'wc', 17, [16, 16, 16, 17, 10, 14], 'Brazil', '巴西', 8),
  p('Pelé', '贝利', 'ST', ['ST', 'CF', 'CAM'], 'bra', '1970', 'wc', 19, [17, 18, 18, 18, 14, 16], 'Brazil', '巴西', 10),
  p('Rivellino', '里维利诺', 'LW', ['LW', 'CAM', 'CF'], 'bra', '1970', 'wc', 18, [16, 17, 17, 18, 12, 15], 'Brazil', '巴西', 11),

  // ===== Argentina 1986 (Champions — Maradona's tournament) =====
  p('Nery Pumpido', '蓬皮多', 'GK', ['GK'], 'arg', '1986', 'wc', 16, [10, 4, 10, 10, 16, 16], 'Argentina', '阿根廷', 1),
  p('Oscar Ruggeri', '鲁杰里', 'CB', ['CB'], 'arg', '1986', 'wc', 17, [14, 10, 14, 14, 18, 17], 'Argentina', '阿根廷', 2),
  p('José Luis Brown', '布朗', 'CB', ['CB'], 'arg', '1986', 'wc', 16, [14, 9, 13, 13, 17, 17], 'Argentina', '阿根廷', 3),
  p('Héctor Enrique', '恩里克', 'RB', ['RB', 'RM'], 'arg', '1986', 'wc', 16, [16, 11, 15, 15, 15, 14], 'Argentina', '阿根廷', 4),
  p('Julio Olarticoechea', '奥拉蒂科切亚', 'LB', ['LB', 'LWB'], 'arg', '1986', 'wc', 16, [16, 10, 14, 15, 16, 16], 'Argentina', '阿根廷', 5),
  p('Ricardo Giusti', '朱斯蒂', 'CM', ['CM', 'CDM'], 'arg', '1986', 'wc', 16, [14, 12, 16, 15, 16, 15], 'Argentina', '阿根廷', 6),
  p('Sergio Batista', '巴蒂斯塔', 'CDM', ['CDM', 'CM'], 'arg', '1986', 'wc', 17, [14, 11, 16, 15, 16, 16], 'Argentina', '阿根廷', 7),
  p('Jorge Burruchaga', '布鲁查加', 'RW', ['RW', 'CAM', 'ST'], 'arg', '1986', 'wc', 17, [16, 16, 16, 17, 11, 14], 'Argentina', '阿根廷', 8),
  p('Diego Maradona', '马拉多纳', 'CAM', ['CAM', 'CF', 'ST'], 'arg', '1986', 'wc', 19, [16, 18, 18, 19, 10, 15], 'Argentina', '阿根廷', 10),
  p('Jorge Valdano', '巴尔达诺', 'ST', ['ST', 'CF'], 'arg', '1986', 'wc', 17, [16, 17, 16, 16, 10, 15], 'Argentina', '阿根廷', 9),
  p('Oscar Garré', '加雷', 'CB', ['CB', 'RB'], 'arg', '1986', 'wc', 16, [14, 8, 13, 13, 17, 16], 'Argentina', '阿根廷', 11),

  // ===== Netherlands 1974 (Total Football — Cruyff) =====
  p('Jan Jongbloed', '容布洛德', 'GK', ['GK'], 'ned', '1974', 'wc', 16, [9, 4, 10, 9, 16, 16], 'Netherlands', '荷兰', 8),
  p('Wim Suurbier', '苏尔比尔', 'RB', ['RB', 'RWB'], 'ned', '1974', 'wc', 17, [16, 11, 15, 15, 16, 15], 'Netherlands', '荷兰', 2),
  p('Arie Haan', '阿里·汉', 'CB', ['CB', 'CM'], 'ned', '1974', 'wc', 17, [15, 14, 16, 16, 16, 16], 'Netherlands', '荷兰', 3),
  p('Ruud Krol', '克洛尔', 'CB', ['CB', 'LB'], 'ned', '1974', 'wc', 17, [16, 13, 16, 16, 18, 17], 'Netherlands', '荷兰', 4),
  p('Wim Jansen', '扬森', 'CDM', ['CDM', 'CM'], 'ned', '1974', 'wc', 17, [15, 13, 16, 16, 16, 16], 'Netherlands', '荷兰', 6),
  p('Johan Neeskens', '内斯肯斯', 'CM', ['CM', 'CAM', 'CDM'], 'ned', '1974', 'wc', 18, [16, 16, 18, 17, 14, 15], 'Netherlands', '荷兰', 13),
  p('Willem van Hanegem', '范哈内亨', 'CM', ['CM', 'CAM'], 'ned', '1974', 'wc', 17, [14, 16, 18, 16, 14, 15], 'Netherlands', '荷兰', 10),
  p('Johnny Rep', '雷普', 'RW', ['RW', 'LW', 'ST'], 'ned', '1974', 'wc', 17, [17, 16, 16, 16, 11, 14], 'Netherlands', '荷兰', 7),
  p('Rob Rensenbrink', '伦森布林克', 'LW', ['LW', 'ST', 'CF'], 'ned', '1974', 'wc', 17, [17, 16, 16, 17, 11, 14], 'Netherlands', '荷兰', 5),
  p('Johan Cruyff', '克鲁伊夫', 'ST', ['ST', 'CF', 'CAM'], 'ned', '1974', 'wc', 19, [18, 17, 18, 19, 12, 15], 'Netherlands', '荷兰', 14),
  p('Piet Keizer', '凯泽尔', 'LW', ['LW', 'LM', 'CF'], 'ned', '1974', 'wc', 17, [16, 15, 16, 17, 11, 14], 'Netherlands', '荷兰', 9),
];
