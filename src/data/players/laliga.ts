import type { Player } from '../../types';
import { p } from './_helpers';

// La Liga — Barcelona, Real Madrid, Atlético across eras.
export const LALIGA_PLAYERS: Player[] = [
  // ===== Barcelona 2008-09 (Pep's first, treble) =====
  p('Víctor Valdés', '巴尔德斯', 'GK', ['GK'], 'bar', '2008-09', 'laliga', 85, [52, 28, 60, 58, 84, 78], 'Spain', '西班牙', 1),
  p('Dani Alves', '阿尔维斯', 'RB', ['RB', 'RWB', 'RM'], 'bar', '2008-09', 'laliga', 88, [90, 65, 82, 86, 76, 76], 'Brazil', '巴西', 2),
  p('Carles Puyol', '普约尔', 'CB', ['CB', 'RB'], 'bar', '2008-09', 'laliga', 88, [76, 50, 70, 72, 90, 86], 'Spain', '西班牙', 5),
  p('Gerard Piqué', '皮克', 'CB', ['CB'], 'bar', '2008-09', 'laliga', 86, [72, 50, 74, 72, 86, 84], 'Spain', '西班牙', 3),
  p('Eric Abidal', '阿比达尔', 'LB', ['LB', 'CB'], 'bar', '2008-09', 'laliga', 84, [80, 45, 74, 74, 84, 80], 'France', '法国', 22),
  p('Sergio Busquets', '布斯克茨', 'CDM', ['CDM', 'CM'], 'bar', '2008-09', 'laliga', 86, [60, 60, 84, 78, 82, 78], 'Spain', '西班牙', 28),
  p('Xavi', '哈维', 'CM', ['CM', 'CAM'], 'bar', '2008-09', 'laliga', 90, [66, 70, 92, 88, 70, 70], 'Spain', '西班牙', 6),
  p('Andrés Iniesta', '伊涅斯塔', 'CAM', ['CAM', 'CM', 'LW'], 'bar', '2008-09', 'laliga', 90, [78, 75, 90, 92, 64, 70], 'Spain', '西班牙', 8),
  p('Lionel Messi', '梅西', 'RW', ['RW', 'CF', 'ST', 'CAM'], 'bar', '2008-09', 'laliga', 93, [87, 90, 88, 94, 50, 70], 'Argentina', '阿根廷', 10),
  p('Thierry Henry', '亨利', 'LW', ['LW', 'ST', 'CF'], 'bar', '2008-09', 'laliga', 89, [90, 86, 82, 88, 50, 76], 'France', '法国', 14),
  p('Samuel Eto\'o', '埃托奥', 'ST', ['ST', 'CF'], 'bar', '2008-09', 'laliga', 89, [86, 88, 76, 84, 50, 80], 'Cameroon', '喀麦隆', 9),

  // ===== Barcelona 2010-11 =====
  p('Víctor Valdés', '巴尔德斯', 'GK', ['GK'], 'bar', '2010-11', 'laliga', 86, [52, 28, 62, 58, 85, 78], 'Spain', '西班牙', 1),
  p('Dani Alves', '阿尔维斯', 'RB', ['RB', 'RWB', 'RM'], 'bar', '2010-11', 'laliga', 89, [90, 65, 84, 86, 76, 76], 'Brazil', '巴西', 2),
  p('Carles Puyol', '普约尔', 'CB', ['CB', 'RB'], 'bar', '2010-11', 'laliga', 87, [76, 50, 70, 72, 89, 86], 'Spain', '西班牙', 5),
  p('Gerard Piqué', '皮克', 'CB', ['CB'], 'bar', '2010-11', 'laliga', 87, [72, 50, 76, 72, 87, 84], 'Spain', '西班牙', 3),
  p('Sergio Busquets', '布斯克茨', 'CDM', ['CDM', 'CM'], 'bar', '2010-11', 'laliga', 87, [60, 60, 86, 78, 84, 78], 'Spain', '西班牙', 28),
  p('Xavi', '哈维', 'CM', ['CM', 'CAM'], 'bar', '2010-11', 'laliga', 91, [66, 70, 93, 88, 70, 70], 'Spain', '西班牙', 6),
  p('Andrés Iniesta', '伊涅斯塔', 'CAM', ['CAM', 'CM', 'LW'], 'bar', '2010-11', 'laliga', 91, [78, 75, 91, 93, 64, 70], 'Spain', '西班牙', 8),
  p('Lionel Messi', '梅西', 'RW', ['RW', 'CF', 'ST', 'CAM'], 'bar', '2010-11', 'laliga', 94, [87, 91, 89, 95, 50, 70], 'Argentina', '阿根廷', 10),
  p('David Villa', '大卫·比利亚', 'ST', ['ST', 'LW'], 'bar', '2010-11', 'laliga', 88, [82, 88, 80, 84, 50, 74], 'Spain', '西班牙', 7),
  p('Pedro', '佩德罗', 'RW', ['RW', 'LW'], 'bar', '2010-11', 'laliga', 84, [84, 78, 78, 82, 60, 68], 'Spain', '西班牙', 17),

  // ===== Barcelona 2015-16 (MSN) =====
  p('Claudio Bravo', '布拉沃', 'GK', ['GK'], 'bar', '2015-16', 'laliga', 86, [50, 28, 62, 58, 85, 78], 'Chile', '智利', 1),
  p('Jordi Alba', '阿尔巴', 'LB', ['LB', 'LWB'], 'bar', '2015-16', 'laliga', 87, [90, 60, 82, 84, 76, 72], 'Spain', '西班牙', 18),
  p('Javier Mascherano', '马斯切拉诺', 'CB', ['CB', 'CDM'], 'bar', '2015-16', 'laliga', 86, [72, 55, 80, 76, 86, 80], 'Argentina', '阿根廷', 14),
  p('Gerard Piqué', '皮克', 'CB', ['CB'], 'bar', '2015-16', 'laliga', 87, [72, 50, 76, 72, 87, 84], 'Spain', '西班牙', 3),
  p('Sergio Busquets', '布斯克茨', 'CDM', ['CDM', 'CM'], 'bar', '2015-16', 'laliga', 88, [60, 60, 86, 78, 85, 78], 'Spain', '西班牙', 5),
  p('Ivan Rakitić', '拉基蒂奇', 'CM', ['CM', 'CAM'], 'bar', '2015-16', 'laliga', 86, [76, 74, 84, 82, 72, 76], 'Croatia', '克罗地亚', 4),
  p('Andrés Iniesta', '伊涅斯塔', 'CAM', ['CAM', 'CM', 'LW'], 'bar', '2015-16', 'laliga', 89, [76, 73, 90, 92, 64, 68], 'Spain', '西班牙', 8),
  p('Lionel Messi', '梅西', 'RW', ['RW', 'CF', 'ST', 'CAM'], 'bar', '2015-16', 'laliga', 94, [85, 92, 90, 95, 50, 72], 'Argentina', '阿根廷', 10),
  p('Luis Suárez', '苏亚雷斯', 'ST', ['ST', 'CF'], 'bar', '2015-16', 'laliga', 91, [80, 90, 84, 88, 55, 80], 'Uruguay', '乌拉圭', 9),
  p('Neymar', '内马尔', 'LW', ['LW', 'CAM', 'ST'], 'bar', '2015-16', 'laliga', 90, [90, 82, 86, 92, 45, 68], 'Brazil', '巴西', 11),

  // ===== Real Madrid 2011-12 (Mourinho, 100pts) =====
  p('Iker Casillas', '卡西利亚斯', 'GK', ['GK'], 'rma', '2011-12', 'laliga', 89, [55, 30, 62, 58, 88, 82], 'Spain', '西班牙', 1),
  p('Sergio Ramos', '拉莫斯', 'CB', ['CB', 'RB', 'CDM'], 'rma', '2011-12', 'laliga', 88, [78, 60, 76, 76, 88, 86], 'Spain', '西班牙', 4),
  p('Pepe', '佩佩', 'CB', ['CB', 'CDM'], 'rma', '2011-12', 'laliga', 86, [74, 50, 68, 70, 88, 86], 'Portugal', '葡萄牙', 3),
  p('Marcelo', '马塞洛', 'LB', ['LB', 'LWB', 'LM'], 'rma', '2011-12', 'laliga', 87, [90, 65, 82, 88, 72, 74], 'Brazil', '巴西', 12),
  p('Xabi Alonso', '哈维·阿隆索', 'CDM', ['CDM', 'CM'], 'rma', '2011-12', 'laliga', 87, [60, 70, 88, 76, 80, 78], 'Spain', '西班牙', 14),
  p('Mesut Özil', '厄齐尔', 'CAM', ['CAM', 'CM'], 'rma', '2011-12', 'laliga', 87, [78, 74, 88, 88, 52, 64], 'Germany', '德国', 23),
  p('Cristiano Ronaldo', 'C罗', 'LW', ['LW', 'ST', 'RW'], 'rma', '2011-12', 'laliga', 93, [90, 92, 84, 92, 60, 82], 'Portugal', '葡萄牙', 7),
  p('Karim Benzema', '本泽马', 'ST', ['ST', 'CF'], 'rma', '2011-12', 'laliga', 87, [80, 84, 82, 86, 50, 80], 'France', '法国', 9),
  p('Ángel Di María', '迪马利亚', 'RW', ['RW', 'LM', 'CM'], 'rma', '2011-12', 'laliga', 86, [88, 78, 82, 86, 60, 70], 'Argentina', '阿根廷', 22),
  p('Sami Khedira', '赫迪拉', 'CM', ['CM', 'CDM'], 'rma', '2011-12', 'laliga', 83, [76, 68, 78, 76, 76, 80], 'Germany', '德国', 24),

  // ===== Real Madrid 2016-17 (UCL defending champs) =====
  p('Keylor Navas', '纳瓦斯', 'GK', ['GK'], 'rma', '2016-17', 'laliga', 86, [52, 28, 60, 56, 85, 78], 'Costa Rica', '哥斯达黎加', 1),
  p('Sergio Ramos', '拉莫斯', 'CB', ['CB', 'RB', 'CDM'], 'rma', '2016-17', 'laliga', 89, [78, 62, 76, 76, 89, 86], 'Spain', '西班牙', 4),
  p('Raphaël Varane', '瓦拉内', 'CB', ['CB'], 'rma', '2016-17', 'laliga', 87, [82, 45, 72, 72, 88, 84], 'France', '法国', 5),
  p('Marcelo', '马塞洛', 'LB', ['LB', 'LWB', 'LM'], 'rma', '2016-17', 'laliga', 88, [90, 65, 84, 88, 72, 74], 'Brazil', '巴西', 12),
  p('Dani Carvajal', '卡瓦哈尔', 'RB', ['RB', 'RWB'], 'rma', '2016-17', 'laliga', 86, [86, 55, 80, 82, 82, 76], 'Spain', '西班牙', 2),
  p('Casemiro', '卡塞米罗', 'CDM', ['CDM', 'CM'], 'rma', '2016-17', 'laliga', 86, [70, 70, 78, 76, 87, 84], 'Brazil', '巴西', 14),
  p('Toni Kroos', '克罗斯', 'CM', ['CM', 'CDM'], 'rma', '2016-17', 'laliga', 89, [60, 76, 90, 82, 72, 74], 'Germany', '德国', 8),
  p('Luka Modrić', '莫德里奇', 'CM', ['CM', 'CAM'], 'rma', '2016-17', 'laliga', 90, [74, 74, 88, 88, 72, 70], 'Croatia', '克罗地亚', 10),
  p('Cristiano Ronaldo', 'C罗', 'LW', ['LW', 'ST', 'RW'], 'rma', '2016-17', 'laliga', 94, [88, 93, 84, 90, 60, 82], 'Portugal', '葡萄牙', 7),
  p('Karim Benzema', '本泽马', 'ST', ['ST', 'CF'], 'rma', '2016-17', 'laliga', 88, [80, 84, 82, 86, 50, 80], 'France', '法国', 9),
  p('Gareth Bale', '贝尔', 'RW', ['RW', 'LW', 'ST'], 'rma', '2016-17', 'laliga', 89, [92, 86, 80, 86, 56, 80], 'Wales', '威尔士', 11),
  p('Isco', '伊斯科', 'CAM', ['CAM', 'CM', 'LW'], 'rma', '2016-17', 'laliga', 86, [78, 76, 84, 88, 60, 68], 'Spain', '西班牙', 22),

  // ===== Real Madrid 2021-22 (UCL) =====
  p('Thibaut Courtois', '库尔图瓦', 'GK', ['GK'], 'rma', '2021-22', 'laliga', 90, [50, 25, 60, 55, 90, 84], 'Belgium', '比利时', 1),
  p('Éder Militão', '米利唐', 'CB', ['CB', 'RB'], 'rma', '2021-22', 'laliga', 85, [82, 45, 70, 72, 86, 84], 'Brazil', '巴西', 3),
  p('David Alaba', '阿拉巴', 'CB', ['CB', 'LB', 'CM'], 'rma', '2021-22', 'laliga', 87, [80, 65, 82, 82, 84, 80], 'Austria', '奥地利', 4),
  p('Ferland Mendy', '门迪', 'LB', ['LB', 'LWB'], 'rma', '2021-22', 'laliga', 84, [86, 50, 76, 78, 80, 80], 'France', '法国', 23),
  p('Casemiro', '卡塞米罗', 'CDM', ['CDM', 'CM'], 'rma', '2021-22', 'laliga', 87, [70, 70, 78, 76, 88, 84], 'Brazil', '巴西', 14),
  p('Luka Modrić', '莫德里奇', 'CM', ['CM', 'CAM'], 'rma', '2021-22', 'laliga', 88, [72, 72, 88, 88, 72, 68], 'Croatia', '克罗地亚', 10),
  p('Toni Kroos', '克罗斯', 'CM', ['CM', 'CDM'], 'rma', '2021-22', 'laliga', 88, [60, 76, 90, 82, 72, 74], 'Germany', '德国', 8),
  p('Vinícius Júnior', '维尼修斯', 'LW', ['LW', 'ST'], 'rma', '2021-22', 'laliga', 87, [92, 80, 78, 90, 40, 70], 'Brazil', '巴西', 20),
  p('Karim Benzema', '本泽马', 'ST', ['ST', 'CF'], 'rma', '2021-22', 'laliga', 91, [78, 90, 84, 88, 50, 82], 'France', '法国', 9),

  // ===== Real Madrid 2023-24 =====
  p('Vinícius Júnior', '维尼修斯', 'LW', ['LW', 'ST'], 'rma', '2023-24', 'laliga', 90, [92, 84, 80, 92, 40, 72], 'Brazil', '巴西', 7),
  p('Jude Bellingham', '贝林厄姆', 'CAM', ['CAM', 'CM', 'ST'], 'rma', '2023-24', 'laliga', 89, [80, 82, 84, 86, 72, 82], 'England', '英格兰', 5),
  p('Rodrygo', '罗德里戈', 'RW', ['RW', 'LW', 'ST'], 'rma', '2023-24', 'laliga', 86, [88, 80, 80, 86, 45, 70], 'Brazil', '巴西', 11),
  p('Federico Valverde', '巴尔韦德', 'CM', ['CM', 'RM', 'CDM'], 'rma', '2023-24', 'laliga', 88, [86, 80, 84, 82, 76, 82], 'Uruguay', '乌拉圭', 15),
  p('Antonio Rüdiger', '吕迪格', 'CB', ['CB'], 'rma', '2023-24', 'laliga', 86, [80, 45, 72, 72, 87, 86], 'Germany', '德国', 22),

  // ===== Atlético 2013-14 (La Liga title) =====
  p('Thibaut Courtois', '库尔图瓦', 'GK', ['GK'], 'atm', '2013-14', 'laliga', 87, [50, 25, 58, 55, 87, 82], 'Belgium', '比利时', 1),
  p('Diego Godín', '戈丁', 'CB', ['CB'], 'atm', '2013-14', 'laliga', 88, [70, 50, 72, 70, 90, 86], 'Uruguay', '乌拉圭', 2),
  p('Filipe Luís', '费利佩·路易斯', 'LB', ['LB', 'LWB'], 'atm', '2013-14', 'laliga', 85, [80, 55, 78, 78, 84, 78], 'Brazil', '巴西', 3),
  p('Juanfran', '胡安弗兰', 'RB', ['RB', 'RWB'], 'atm', '2013-14', 'laliga', 84, [80, 55, 78, 76, 82, 78], 'Spain', '西班牙', 20),
  p('Koke', '科克', 'CM', ['CM', 'RM', 'CAM'], 'atm', '2013-14', 'laliga', 85, [76, 72, 84, 82, 74, 76], 'Spain', '西班牙', 6),
  p('Gabriel', '加布里埃尔', 'CDM', ['CDM', 'CM'], 'atm', '2013-14', 'laliga', 82, [70, 60, 76, 74, 80, 78], 'Brazil', '巴西', 5),
  p('Arda Turan', '阿尔达·图兰', 'RM', ['RM', 'CAM', 'LM'], 'atm', '2013-14', 'laliga', 84, [78, 74, 82, 84, 64, 76], 'Turkey', '土耳其', 10),
  p('Diego Costa', '迭戈·科斯塔', 'ST', ['ST', 'CF'], 'atm', '2013-14', 'laliga', 87, [80, 86, 74, 80, 50, 86], 'Spain', '西班牙', 19),
  p('Raúl García', '劳尔·加西亚', 'CAM', ['CAM', 'CM', 'ST'], 'atm', '2013-14', 'laliga', 82, [70, 76, 78, 76, 70, 80], 'Spain', '西班牙', 8),
  p('Miranda', '米兰达', 'CB', ['CB'], 'atm', '2013-14', 'laliga', 85, [70, 45, 70, 70, 87, 84], 'Brazil', '巴西', 23),

  // ===== Atlético 2020-21 (La Liga title) =====
  p('Jan Oblak', '奥布拉克', 'GK', ['GK'], 'atm', '2020-21', 'laliga', 90, [50, 25, 60, 55, 91, 82], 'Slovenia', '斯洛文尼亚', 13),
  p('Stefan Savić', '萨维奇', 'CB', ['CB'], 'atm', '2020-21', 'laliga', 84, [68, 45, 68, 68, 86, 84], 'Montenegro', '黑山', 15),
  p('Kieran Trippier', '特里皮尔', 'RB', ['RB', 'RWB'], 'atm', '2020-21', 'laliga', 84, [76, 55, 82, 76, 78, 72], 'England', '英格兰', 23),
  p('Koke', '科克', 'CM', ['CM', 'RM', 'CAM'], 'atm', '2020-21', 'laliga', 85, [74, 70, 84, 80, 74, 76], 'Spain', '西班牙', 6),
  p('Marcos Llorente', '马科斯·略伦特', 'CM', ['CM', 'CDM', 'ST'], 'atm', '2020-21', 'laliga', 84, [84, 76, 78, 80, 72, 80], 'Spain', '西班牙', 14),
  p('Saul Ñíguez', '萨乌尔', 'CM', ['CM', 'CDM', 'LM'], 'atm', '2020-21', 'laliga', 84, [76, 72, 80, 80, 76, 80], 'Spain', '西班牙', 8),
  p('João Félix', '若昂·菲利克斯', 'CAM', ['CAM', 'LW', 'ST'], 'atm', '2020-21', 'laliga', 84, [80, 76, 80, 86, 50, 68], 'Portugal', '葡萄牙', 7),
  p('Luis Suárez', '苏亚雷斯', 'ST', ['ST', 'CF'], 'atm', '2020-21', 'laliga', 87, [76, 88, 80, 82, 50, 80], 'Uruguay', '乌拉圭', 9),
  p('Yannick Carrasco', '卡拉斯科', 'LM', ['LM', 'LW', 'LWB'], 'atm', '2020-21', 'laliga', 84, [88, 76, 78, 82, 64, 72], 'Belgium', '比利时', 21),

  // ===== Valencia 2001-02 (title) — using 2002-03 =====
  p('Santiago Cañizares', '卡尼萨雷斯', 'GK', ['GK'], 'val', '2002-03', 'laliga', 85, [50, 25, 58, 55, 85, 80], 'Spain', '西班牙', 1),
  p('Roberto Ayala', '阿亚拉', 'CB', ['CB'], 'val', '2002-03', 'laliga', 86, [70, 45, 70, 70, 88, 82], 'Argentina', '阿根廷', 4),
  p('Pablo Aimar', '艾马尔', 'CAM', ['CAM', 'CM'], 'val', '2002-03', 'laliga', 85, [78, 72, 86, 88, 56, 64], 'Argentina', '阿根廷', 21),
  p('Ruben Baraja', '巴拉哈', 'CM', ['CM', 'CDM'], 'val', '2002-03', 'laliga', 83, [72, 72, 80, 76, 76, 80], 'Spain', '西班牙', 8),
  p('John Carew', '卡鲁', 'ST', ['ST', 'CF'], 'val', '2002-03', 'laliga', 82, [78, 78, 68, 72, 50, 86], 'Norway', '挪威', 20),

  // ===== Sevilla 2022-23 =====
  p('Yassine Bounou', '布努', 'GK', ['GK'], 'sev', '2022-23', 'laliga', 84, [50, 25, 58, 55, 84, 80], 'Morocco', '摩洛哥', 13),
  p('Jules Koundé', '孔德', 'CB', ['CB', 'RB'], 'sev', '2022-23', 'laliga', 84, [80, 45, 72, 72, 85, 82], 'France', '法国', 23),
  p('Ivan Rakitić', '拉基蒂奇', 'CM', ['CM', 'CAM'], 'sev', '2022-23', 'laliga', 84, [72, 70, 84, 80, 70, 74], 'Croatia', '克罗地亚', 10),
  p('Lucas Ocampos', '奥坎波斯', 'RM', ['RM', 'RW', 'LM'], 'sev', '2022-23', 'laliga', 82, [82, 72, 76, 78, 64, 80], 'Argentina', '阿根廷', 5),
];
