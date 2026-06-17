import { motion } from 'framer-motion';
import type { SimResult } from '../types';
import { useLang } from '../i18n/useLang';
import { outcomeOf } from '../engine/simulation';
import { getCompetition } from '../data';

interface ResultsViewProps {
  result: SimResult;
  competitionId: string;
  onPlayAgain: () => void;
  onChangeSetup: () => void;
  onRestartAll: () => void;
}

const OUTCOME_STYLE: Record<string, string> = {
  W: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  D: 'bg-ink-600/40 text-ink-200 border-ink-500',
  L: 'bg-red-500/20 text-red-300 border-red-500/40',
};

const GRADE_COLOR: Record<string, string> = {
  S: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10',
  A: 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10',
  B: 'text-sky-400 border-sky-400/50 bg-sky-400/10',
  C: 'text-ink-200 border-ink-500 bg-ink-700/30',
  D: 'text-orange-400 border-orange-400/50 bg-orange-400/10',
  F: 'text-red-400 border-red-400/50 bg-red-400/10',
};

export default function ResultsView({
  result,
  competitionId,
  onPlayAgain,
  onChangeSetup,
  onRestartAll,
}: ResultsViewProps) {
  const { lang, t } = useLang();
  const comp = getCompetition(competitionId);
  const isCup = comp?.type === 'cup';

  const champ = result.position === 1;
  const played = result.matches.length;
  const zh = lang === 'zh';

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Headline with grade */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {result.perfect && (
              <div className="inline-block px-4 py-1.5 bg-accent/20 text-accent font-bold text-sm rounded-full border border-accent/40">
                {t('perfect')}
              </div>
            )}
            {!result.perfect && result.unbeaten && (
              <div className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-300 font-bold text-sm rounded-full border border-emerald-500/40">
                {t('unbeaten')}
              </div>
            )}
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border-2 font-display font-black text-2xl ${GRADE_COLOR[result.grade]}`}>
              {result.grade}
            </div>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tightest text-white mb-3">
            {champ
              ? zh ? '冠军！' : 'Champions!'
              : `${zh ? '第' : '#'}${result.position}${zh ? '名' : ''}`}
          </h1>
          <p className="text-ink-400 text-sm font-mono">
            {comp ? (zh ? comp.nameZh : comp.name) : ''} ·{' '}
            {zh ? `${played} 场 · ${result.teams} 队` : `${played} games · ${result.teams} teams`}
          </p>
        </div>

        {/* Form guide */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-xs text-ink-500 font-mono mr-2">
            {zh ? '近5场' : 'Last 5'}
          </span>
          {result.formGuide.map((o, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-bold text-xs ${OUTCOME_STYLE[o]}`}
            >
              {o}
            </div>
          ))}
        </div>

        {/* Big stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatBox
            label={t('finalPosition')}
            value={`${result.position}`}
            sub={`${t('of')} ${result.teams} ${t('teams')}`}
            highlight={champ}
            delay={0.1}
          />
          <StatBox
            label={t('points')}
            value={`${result.points}`}
            sub={isCup ? (zh ? '晋级轮次' : 'rounds') : `${result.pointsPerGame.toFixed(2)} ${zh ? '场均' : 'PPG'}`}
            delay={0.18}
          />
          <StatBox
            label={t('record')}
            value={`${result.wins}-${result.draws}-${result.losses}`}
            sub={zh ? '胜-平-负' : 'W-D-L'}
            delay={0.26}
          />
          <StatBox
            label={t('goals')}
            value={`${result.goalsFor}:${result.goalsAgainst}`}
            sub={`${result.goalDifference >= 0 ? '+' : ''}${result.goalDifference} ${zh ? '净胜球' : 'GD'}`}
            delay={0.34}
          />
        </div>

        {/* Secondary stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <MiniStat
            label={zh ? '场均进球' : 'Goals/Game'}
            value={result.goalsPerGame.toFixed(2)}
            delay={0.4}
          />
          <MiniStat
            label={zh ? '场均失球' : 'Conceded/Game'}
            value={result.concededPerGame.toFixed(2)}
            delay={0.45}
          />
          <MiniStat
            label={zh ? '零封' : 'Clean Sheets'}
            value={`${result.cleanSheets}`}
            delay={0.5}
          />
          <MiniStat
            label={zh ? '未进球' : 'Failed to Score'}
            value={`${result.failedToScore}`}
            delay={0.55}
          />
        </div>

        {/* Highlights: biggest win / loss + streaks */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {result.biggestWin && (
            <HighlightCard
              label={zh ? '最大胜利' : 'Biggest Win'}
              score={result.biggestWin.score}
              opponent={zh ? result.biggestWin.opponentNameZh : result.biggestWin.opponentName}
              color="emerald"
              delay={0.6}
            />
          )}
          {result.biggestLoss && (
            <HighlightCard
              label={zh ? '最惨失利' : 'Worst Loss'}
              score={result.biggestLoss.score}
              opponent={zh ? result.biggestLoss.opponentNameZh : result.biggestLoss.opponentName}
              color="red"
              delay={0.65}
            />
          )}
          <HighlightCard
            label={zh ? '最长连胜' : 'Longest Win Streak'}
            value={`${result.longestWinStreak} ${zh ? '场' : 'games'}`}
            color="sky"
            delay={0.7}
          />
          <HighlightCard
            label={zh ? '最长不败' : 'Longest Unbeaten'}
            value={`${result.longestUnbeatenRun} ${zh ? '场' : 'games'}`}
            color="violet"
            delay={0.75}
          />
        </div>

        {/* Match-by-match */}
        <div className="rounded-2xl border border-ink-800 overflow-hidden">
          <div className="px-5 py-3 border-b border-ink-800 flex items-center justify-between">
            <span className="font-display font-bold text-sm text-white">
              {zh ? '逐场战报' : 'Match by Match'}
            </span>
            <span className="text-xs font-mono text-ink-400">
              {result.wins}W {result.draws}D {result.losses}L
            </span>
          </div>
          <div className="divide-y divide-ink-800/60 max-h-[400px] overflow-y-auto overscroll-contain">
            {result.matches.map((m, i) => {
              const o = outcomeOf(m);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.02 }}
                  className="flex items-center gap-3 px-5 py-2.5 hover:bg-ink-900/50 transition-colors"
                >
                  <span className="font-mono text-xs text-ink-400 w-8">
                    {t('matchday')}{m.round}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold w-5 text-center ${
                      m.home ? 'text-sky-400' : 'text-ink-400'
                    }`}
                  >
                    {m.home ? t('home') : t('away')}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border w-6 text-center ${OUTCOME_STYLE[o]}`}
                  >
                    {o}
                  </span>
                  <span className="flex-1 text-sm text-ink-200 truncate">
                    {zh ? m.opponentNameZh : m.opponentName}
                  </span>
                  <span className="font-mono font-bold text-sm text-white tabular-nums">
                    {m.goalsFor}-{m.goalsAgainst}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-10 justify-center">
          <button
            onClick={onPlayAgain}
            className="px-7 py-3.5 bg-accent text-ink-950 font-bold rounded-full hover:bg-accent-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          >
            {t('playAgain')}
          </button>
          <button
            onClick={onChangeSetup}
            className="px-7 py-3.5 border border-ink-600 text-ink-200 font-medium rounded-full hover:border-ink-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {t('changeSetup')}
          </button>
          <button
            onClick={onRestartAll}
            className="px-7 py-3.5 border border-red-900/50 text-red-400/70 font-medium rounded-full hover:border-red-500 hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {t('restartAll')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StatBox({
  label,
  value,
  sub,
  highlight,
  delay,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`rounded-xl border p-4 text-center ${
        highlight
          ? 'border-accent bg-accent/10'
          : 'border-ink-800 bg-ink-900/40'
      }`}
    >
      <div className="text-[11px] text-ink-400 font-mono uppercase tracking-wide mb-1">
        {label}
      </div>
      <div
        className={`font-display font-black text-3xl sm:text-4xl tabular-nums ${
          highlight ? 'text-accent' : 'text-white'
        }`}
      >
        {value}
      </div>
      {sub && <div className="text-[10px] text-ink-500 mt-0.5">{sub}</div>}
    </motion.div>
  );
}

function MiniStat({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="rounded-lg border border-ink-800/60 bg-ink-900/30 px-3 py-2.5 text-center"
    >
      <div className="text-[10px] text-ink-500 font-mono uppercase tracking-wide mb-0.5">
        {label}
      </div>
      <div className="font-mono font-bold text-lg text-ink-100 tabular-nums">
        {value}
      </div>
    </motion.div>
  );
}

function HighlightCard({
  label,
  value,
  score,
  opponent,
  color,
  delay,
}: {
  label: string;
  value?: string;
  score?: string;
  opponent?: string;
  color: 'emerald' | 'red' | 'sky' | 'violet';
  delay: number;
}) {
  const colorMap = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
    red: 'border-red-500/30 bg-red-500/5 text-red-300',
    sky: 'border-sky-500/30 bg-sky-500/5 text-sky-300',
    violet: 'border-violet-500/30 bg-violet-500/5 text-violet-300',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`rounded-xl border p-4 ${colorMap[color]}`}
    >
      <div className="text-[11px] font-mono uppercase tracking-wide mb-1 opacity-80">
        {label}
      </div>
      {score ? (
        <div className="flex items-baseline gap-2">
          <span className="font-display font-black text-2xl tabular-nums">{score}</span>
          <span className="text-xs opacity-70">vs {opponent}</span>
        </div>
      ) : (
        <div className="font-display font-black text-2xl tabular-nums">{value}</div>
      )}
    </motion.div>
  );
}
