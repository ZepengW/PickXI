import { motion } from 'framer-motion';
import type { SimResult, SquadSlot } from '../types';
import { useLang } from '../i18n/useLang';
import { outcomeOf, teamStrength, positionGroup, calculateChemistry } from '../engine/simulation';
import { getCompetition } from '../data';
import Pitch from './Pitch';

interface ResultsViewProps {
  result: SimResult;
  competitionId: string;
  slots: SquadSlot[];
  formationId: string;
  onPlayAgain: () => void;
  onChangeSetup: () => void;
  onRestartAll: () => void;
}

export default function ResultsView({
  result,
  competitionId,
  slots,
  formationId,
  onPlayAgain,
  onChangeSetup,
  onRestartAll,
}: ResultsViewProps) {
  const { lang, t } = useLang();
  const comp = getCompetition(competitionId);
  const strength = teamStrength(slots);
  const chemistry = calculateChemistry(slots);

  const champ = result.position === 1;
  const zh = lang === 'zh';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-7xl px-4 sm:px-8 py-6 w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tightest text-ink-100">
            {zh ? '赛季结束' : 'Season Complete'}
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            {comp && (zh ? comp.nameZh : comp.name)} · {comp?.matches ?? 38} {zh ? '场比赛' : 'games'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-display font-black text-5xl ${
            champ ? 'text-accent' : result.grade === 'A' ? 'text-green-400' : 'text-ink-300'
          }`}>
            {result.grade}
          </span>
          <span className="text-sm text-ink-400 font-mono">
            #{result.position}
          </span>
        </div>
      </div>

      {/* Two-column layout: left = pitch + table, right = squad detail */}
      <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Pitch + key stats */}
          <div className="rounded-2xl border border-ink-800 overflow-hidden bg-ink-900/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-bold text-sm text-ink-100">
                {zh ? '你的阵型' : 'Your XI'}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-accent">
                  {zh ? '总评' : 'OVR'} <b className="text-base">{Math.round(strength.overall)}</b>
                </span>
                <span className="text-red-400">
                  {zh ? '进攻' : 'ATT'} <b className="text-base">{Math.round(strength.attack)}</b>
                </span>
                <span className="text-green-400">
                  {zh ? '中场' : 'MID'} <b className="text-base">{Math.round(strength.midfield)}</b>
                </span>
                <span className="text-blue-400">
                  {zh ? '防守' : 'DEF'} <b className="text-base">{Math.round(strength.defence)}</b>
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-[360px]">
                <Pitch
                  formationId={formationId}
                  slots={slots}
                  showRatings={true}
                  showChemistry={true}
                  chemistryLinks={chemistry.links}
                  compact={true}
                />
              </div>
            </div>
          </div>

          {/* League table */}
          <div className="rounded-2xl border border-ink-800 overflow-hidden bg-ink-900/40">
            <div className="px-4 py-3 border-b border-ink-800 flex items-center justify-between">
              <span className="font-display font-bold text-sm text-ink-100">
                {zh ? '积分榜' : 'League Table'}
              </span>
              <span className="text-xs text-ink-400 font-mono">
                {result.teams} {zh ? '支球队' : 'teams'}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-ink-400 border-b border-ink-800/60">
                    <th className="px-3 py-2 text-left w-8">#</th>
                    <th className="px-3 py-2 text-left">{zh ? '球队' : 'Club'}</th>
                    <th className="px-3 py-2 text-center w-8">{zh ? '场' : 'P'}</th>
                    <th className="px-3 py-2 text-center w-8">{zh ? '胜' : 'W'}</th>
                    <th className="px-3 py-2 text-center w-8">{zh ? '平' : 'D'}</th>
                    <th className="px-3 py-2 text-center w-8">{zh ? '负' : 'L'}</th>
                    <th className="px-3 py-2 text-center w-10">{zh ? '进' : 'GF'}</th>
                    <th className="px-3 py-2 text-center w-10">{zh ? '失' : 'GA'}</th>
                    <th className="px-3 py-2 text-center w-10">{zh ? '净' : 'GD'}</th>
                    <th className="px-3 py-2 text-center w-10 font-bold text-accent">{zh ? '分' : 'Pts'}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.table.map((entry) => (
                    <tr
                      key={entry.clubId}
                      className={`border-b border-ink-800/40 ${
                        entry.isUser
                          ? 'bg-accent/10 border-l-2 border-l-accent'
                          : entry.position <= 4
                            ? 'bg-green-500/5'
                            : entry.position >= result.teams - 3
                              ? 'bg-red-500/5'
                              : ''
                      }`}
                    >
                      <td className={`px-3 py-2 font-bold ${
                        entry.position <= 4 ? 'text-green-400' : entry.position >= result.teams - 3 ? 'text-red-400' : 'text-ink-300'
                      }`}>
                        {entry.position}
                      </td>
                      <td className={`px-3 py-2 truncate ${entry.isUser ? 'text-accent font-bold' : 'text-ink-100'}`}>
                        {zh ? entry.clubNameZh : entry.clubName}
                      </td>
                      <td className="px-3 py-2 text-center text-ink-300">{entry.played}</td>
                      <td className="px-3 py-2 text-center text-ink-100">{entry.won}</td>
                      <td className="px-3 py-2 text-center text-ink-300">{entry.drawn}</td>
                      <td className="px-3 py-2 text-center text-ink-300">{entry.lost}</td>
                      <td className="px-3 py-2 text-center text-ink-100">{entry.goalsFor}</td>
                      <td className="px-3 py-2 text-center text-ink-300">{entry.goalsAgainst}</td>
                      <td className={`px-3 py-2 text-center ${
                        entry.goalDifference > 0 ? 'text-green-400' : entry.goalDifference < 0 ? 'text-red-400' : 'text-ink-300'
                      }`}>
                        {entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}
                      </td>
                      <td className={`px-3 py-2 text-center font-bold ${entry.isUser ? 'text-accent' : 'text-ink-100'}`}>
                        {entry.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 text-xs text-ink-400 border-t border-ink-800/60">
              {zh
                ? '前4名进入欧冠区，后3名降级区（红色）。你的队伍用金色高亮。'
                : 'Top 4 = Champions League zone (green). Bottom 3 = relegation (red). Your XI highlighted in gold.'}
            </div>
          </div>
        </div>

        {/* Right column: squad detail */}
        <div className="space-y-6">
          {/* Squad detail */}
          <div className="rounded-2xl border border-ink-800 overflow-hidden bg-ink-900/40">
            <div className="px-4 py-3 border-b border-ink-800 flex items-center justify-between">
              <span className="font-display font-bold text-sm text-ink-100">
                {zh ? '球员详情' : 'Squad Details'}
              </span>
              <span className="text-xs text-ink-400 font-mono">
                {slots.filter((s) => s.player).length} {zh ? '人' : 'players'}
              </span>
            </div>
            <div className="divide-y divide-ink-800/60 max-h-[420px] overflow-y-auto">
              {slots.filter((s) => s.player).map((slot) => {
                const p = slot.player!;
                const group = positionGroup(slot.position);
                const groupColor = group === 'GK' ? 'text-yellow-400' : group === 'DEF' ? 'text-blue-400' : group === 'MID' ? 'text-green-400' : 'text-red-400';
                const fitLabel = slot.positionPenalty > 0 ? ` (-${slot.positionPenalty})` : '';
                return (
                  <div key={slot.slotId} className="flex items-center gap-3 px-4 py-2.5">
                    {/* Position code */}
                    <span className={`font-mono font-bold text-sm w-10 text-center ${groupColor}`}>
                      {slot.position}
                    </span>
                    {/* Rating */}
                    <span className="font-mono font-black text-lg text-ink-100 w-10 text-center">
                      {p.rating}
                    </span>
                    {/* Name + nationality */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-ink-100 truncate">
                        {zh ? p.nameZh : p.name}
                        <span className="text-ink-500 text-xs ml-1.5">{fitLabel}</span>
                      </div>
                      <div className="text-xs text-ink-400 truncate">
                        {zh ? p.nationalityZh : p.nationality}
                        {p.number ? ` · #${p.number}` : ''}
                        {` · ${p.position}`}
                      </div>
                    </div>
                    {/* Attributes */}
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
                      {([
                        ['PAC', p.attr.pace],
                        ['SHO', p.attr.shooting],
                        ['PAS', p.attr.passing],
                        ['DRI', p.attr.dribbling],
                        ['DEF', p.attr.defending],
                        ['PHY', p.attr.physical],
                      ] as const).map(([key, val]) => (
                        <div key={key} className="text-center w-7">
                          <div className="text-[8px] text-ink-500">{key}</div>
                          <div className={`font-bold ${val >= 85 ? 'text-accent' : val >= 75 ? 'text-ink-100' : 'text-ink-400'}`}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label={zh ? '积分' : 'Points'} value={result.points} accent />
            <StatCard label={zh ? '胜/平/负' : 'W/D/L'} value={`${result.wins}/${result.draws}/${result.losses}`} />
            <StatCard label={zh ? '进球' : 'Goals'} value={result.goalsFor} />
            <StatCard label={zh ? '失球' : 'Conceded'} value={result.goalsAgainst} />
          </div>

          {/* Extended stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2">
              <span className="text-ink-400">{zh ? '场均进球' : 'Goals/game'}</span>
              <span className="ml-2 font-mono font-bold text-ink-100">{result.goalsPerGame.toFixed(2)}</span>
            </div>
            <div className="rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2">
              <span className="text-ink-400">{zh ? '场均失球' : 'Conceded/game'}</span>
              <span className="ml-2 font-mono font-bold text-ink-100">{result.concededPerGame.toFixed(2)}</span>
            </div>
            <div className="rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2">
              <span className="text-ink-400">{zh ? '零封' : 'Clean sheets'}</span>
              <span className="ml-2 font-mono font-bold text-ink-100">{result.cleanSheets}</span>
            </div>
            <div className="rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2">
              <span className="text-ink-400">{zh ? '最长连胜' : 'Longest win streak'}</span>
              <span className="ml-2 font-mono font-bold text-ink-100">{result.longestWinStreak}</span>
            </div>
            <div className="rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2">
              <span className="text-ink-400">{zh ? '最长不败' : 'Longest unbeaten'}</span>
              <span className="ml-2 font-mono font-bold text-ink-100">{result.longestUnbeatenRun}</span>
            </div>
            <div className="rounded-lg border border-ink-800 bg-ink-900/40 px-3 py-2">
              <span className="text-ink-400">{zh ? '净胜球' : 'Goal diff'}</span>
              <span className={`ml-2 font-mono font-bold ${
                result.goalDifference > 0 ? 'text-green-400' : result.goalDifference < 0 ? 'text-red-400' : 'text-ink-100'
              }`}>
                {result.goalDifference > 0 ? '+' : ''}{result.goalDifference}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={onPlayAgain}
              className="px-7 py-3.5 bg-accent text-ink-950 font-bold rounded-full hover:bg-accent-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {t('playAgain')}
            </button>
            <button
              onClick={onChangeSetup}
              className="px-7 py-3.5 border border-ink-600 text-ink-200 font-medium rounded-full hover:border-ink-400 hover:text-ink-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {t('changeSetup')}
            </button>
            <button
              onClick={onRestartAll}
              className="px-5 py-3 border border-red-600/40 text-red-400 font-medium rounded-full hover:border-red-500 hover:text-red-300 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              {t('restartAll')}
            </button>
          </div>
        </div>
      </div>

      {/* Match-by-match log (collapsible) */}
      <div className="mt-6 rounded-2xl border border-ink-800 overflow-hidden">
        <details className="group">
          <summary className="px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-ink-800/40 transition-colors">
            <span className="font-display font-bold text-sm text-ink-100">
              {zh ? '逐场战报' : 'Match-by-match log'}
            </span>
            <span className="text-xs text-ink-400 font-mono group-open:hidden">
              {zh ? '点击展开' : 'Click to expand'}
            </span>
            <span className="text-xs text-ink-400 font-mono hidden group-open:inline">
              {zh ? '点击收起' : 'Click to collapse'}
            </span>
          </summary>
          <div className="px-4 py-3 border-t border-ink-800/60 max-h-[320px] overflow-y-auto">
            <div className="grid gap-1.5">
              {result.matches.map((m, idx) => {
                const outcome = outcomeOf(m);
                const outcomeColor =
                  outcome === 'W'
                    ? 'bg-green-500/20 text-green-400 border-green-500/40'
                    : outcome === 'L'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-ink-700/40 text-ink-300 border-ink-600';
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-mono py-1.5 border-b border-ink-800/30 last:border-0"
                  >
                    <span className="w-6 text-ink-500">{m.round}</span>
                    <span className={`w-7 text-center font-bold rounded px-1 border ${outcomeColor}`}>
                      {outcome}
                    </span>
                    <span className="flex-1 truncate text-ink-100">
                      {m.home
                        ? zh
                          ? `主场 vs ${m.opponentNameZh}`
                          : `Home vs ${m.opponentName}`
                        : zh
                          ? `客场 @ ${m.opponentNameZh}`
                          : `Away @ ${m.opponentName}`}
                    </span>
                    <span className="font-bold text-ink-100 tabular-nums">
                      {m.goalsFor}-{m.goalsAgainst}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </details>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-3 text-center">
      <div className="text-xs text-ink-400 font-mono uppercase mb-1">{label}</div>
      <div className={`font-display font-black text-2xl tabular-nums ${accent ? 'text-accent' : 'text-ink-100'}`}>
        {value}
      </div>
    </div>
  );
}