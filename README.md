# Pick XI · 梦幻十一人

> 从足球历史中选秀组队，模拟整赛季。Build your dream XI from football history and simulate the season.

**[在线体验 / Play Now](https://zepengw.github.io/PickXI/)**

---

## 游戏简介

Pick XI 是一款足球模拟选秀游戏，灵感来自 FIFA Ultimate Team 的征召模式。你将从各大联赛和世界杯的历史阵容中，通过转盘随机抽取球队，挑选球员组建你的梦幻十一人，然后模拟完整赛季，看看你的队伍能走多远。

## 玩法说明

### 1. 选择赛事与阵型
- **赛事**：英超、西甲、意甲、德甲、世界杯、欧冠等
- **时代**：选择球员池的年代范围（如 1992-2025）
- **对手赛季**：选择对手球队所属赛季，反映升降级
- **阵型**：4-3-3、4-4-2、3-5-2 等 10 种经典阵型

### 2. 转盘选秀
- 转动转盘，随机获得一支球队和一个赛季
- 从该球队的阵容中挑选一名球员
- 重复操作直到 11 个位置全部填满

### 3. 排兵布阵
- 将球员放到阵型中的任意位置
- 不同位置有不同的加成/减分：
  - **绿色**：最佳位置（无减分）
  - **黄色**：可踢位置（轻微减分）
  - **橙色/红色**：客串位置（较大减分）
- 点击已放置的球员可移动到其他位置
- 同队/同国球员之间会产生**化学反应**连线加成

### 4. 模拟赛季
- 联赛模式：38 轮比赛，完整积分榜
- 杯赛模式：淘汰赛制，输即出局
- 最终获得 S/A/B/C/D/F 评级

### 化学反应系统

参考 FIFA 征召模式的化学反应机制：

| 连线类型 | 条件 | 加成 | 视觉 |
|---------|------|------|------|
| 同队 | 相邻球员来自同一俱乐部 | +3 | 绿色实线 |
| 同国 | 相邻球员同国籍 | +1 | 黄色虚线 |

化学反应加成会直接影响球队实力评分和模拟结果。

### 难度等级

| 难度 | 可见信息 | 说明 |
|------|---------|------|
| 简单 | 全部可见 | 显示评分、位置、化学反应、再转一次 |
| 普通 | 部分隐藏 | 隐藏球队强度，保留化学反应 |
| 困难 | 大量隐藏 | 隐藏评分、化学反应，仅显示位置 |
| 神话 | 极度困难 | 几乎所有信息隐藏，纯靠直觉 |

## 技术栈

- **前端**：React 19 + TypeScript + Vite
- **样式**：Tailwind CSS 3
- **动画**：Framer Motion
- **状态管理**：Zustand (persist)
- **模拟引擎**：基于 Poisson 分布的进球模型

## 数据来源与声明

### 球员数据

本游戏中的球员数据为粉丝整理，基于公开可获取的信息，综合参考以下来源：

- **SoFIFA.com** — EA FC / FIFA 系列球员属性历史快照
- **FM Inside / Sortitoutsi** — Football Manager 球员数据导出
- **Transfermarkt** — 球员档案、国籍、号码
- **Wikipedia** — 历史阵容名单

**所有球员评分均为独立解读，仅供娱乐用途，不代表任何数据提供商的官方评定，亦不隶属于任何数据提供商。**

### 数据使用条款

- 本项目中的球员数据仅用于非商业性的粉丝娱乐目的
- 球员姓名、国籍等个人信息属于公开事实信息
- 评分和属性值为项目独立创作，不复制自任何单一来源
- 如有任何数据相关问题，请通过 Issue 联系

### 免责声明

- 本项目与 EA Sports、Sports Interactive、FIFA、UEFA 或任何足球俱乐部/联赛无任何关联
- 所有球队名称、联赛名称和赛事名称为其各自所有者的商标/知识产权
- 本项目不收集任何用户个人数据

## 开源许可

本项目代码采用 **MIT License** 开源（见下方）。

球员数据及俱乐部信息基于公开事实，其汇编和评分属于项目创作内容。使用本项目数据时请保留来源声明。

---

### MIT License

Copyright (c) 2026 Pick XI Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
