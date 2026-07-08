import { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MatchResult, SimResult } from '../types';
import { useLang } from '../i18n/useLang';
import type { StringKey } from '../i18n/strings';
import { useGame } from '../store/game';
import { outcomeOf } from '../engine/simulation';

interface SimProgressViewProps {
  result: SimResult;
}

/** Per-round delay in ms. */
const ROUND_DELAY = 420;
/** Delay after the last round before auto-advancing to the full report. */
const FINISH_DELAY = 900;

export default function SimProgressView({ result }: SimProgressViewProps) {
  const { lang, t } = useLang();
  const game = useGame();
  const { simProgress, simMatches, isSimAnimating } = game;
  const zh = lang === 'zh';
  const totalRounds = result.matches.length;

  // Auto-scroll the match list to the bottom as new rounds appear.
  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [simProgress]);

  // Drive the round-by-round reveal.
  useEffect(() => {
    if (!isSimAnimating) return;
    if (simProgress >= totalRounds) {
      const finishTimer = setTimeout(() => {
        game.skipSimAnimation();
      }, FINISH_DELAY);
      return () => clearTimeout(finishTimer);
    }
    const timer = setTimeout(() => {
      game.advanceSimRound();
    }, ROUND_DELAY);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimAnimating, simProgress, totalRounds]);

  // Accumulated stats from revealed matches.
  const stats = useMemo(() => accumulate(simMatches), [simMatches]);
  const finished = simProgress >= totalRounds;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-3xl px-4 sm:px-8 py-6 w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tightest text-ink-100">
            {t('simProgressTitle')}
          </h1>
          <p className="text-sm text-ink-400 mt-1 font-mono">
            {zh ? (
              <>第 <span className="text-accent font-bold">{simProgress}</span> / {totalRounds} 轮</>
            ) : (
              <>Round <span className="text-accent font-bold">{simProgress}</span> / {totalRounds}</>
            )}
          </p>
        </div>
        {/* Progress bar */}
        <div className="flex-1 min-w-[160px] max-w-md">
          <div className="h-2 rounded-full bg-ink-800 overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              animate={{ width: `${(simProgress / totalRounds) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        {/* Skip / View results button */}
        <button
          onClick={() => game.skipSimAnimation()}
          className="px-5 py-2.5 rounded-full font-bold text-sm border border-ink-700 text-ink-200 hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {finished ? t('simViewResults') : t('simSkip')}
        </button>
      </div>

      {/* Live stat row */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-5">
        <LiveStat label={t('points')} value={stats.points} accent />
        <LiveStat
          label={t('record')}
          value={`${stats.wins}/${stats.draws}/${stats.losses}`}
        />
        <LiveStat label={t('goals')} value={stats.goalsFor} />
        <LiveStat
          label={zh ? '失球' : 'Conceded'}
          value={stats.goalsAgainst}
        />
      </div>

      {/* Match list */}
      <div
        ref={listRef}
        className="rounded-2xl border border-ink-800 bg-ink-900/40 overflow-hidden"
      >
        <div className="max-h-[52vh] overflow-y-auto px-3 py-2">
          <AnimatePresence initial={false}>
            {simMatches.map((m) => (
              <MatchRow key={m.round} match={m} zh={zh} t={t} />
            ))}
          </AnimatePresence>
          {simMatches.length === 0 && (
            <div className="text-center text-ink-500 text-sm py-8 font-mono">
              {zh ? '准备开赛…' : 'Kick-off…'}
            </div>
          )}
        </div>
      </div>

      {/* Footer status */}
      <div className="mt-4 text-center">
        {finished ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-display font-bold text-accent"
          >
            {t('simFinished')}
          </motion.p>
        ) : (
          <p className="text-xs text-ink-500 font-mono">
            {zh
              ? `正在模拟第 ${simProgress + 1} 场…`
              : `Simulating match ${simProgress + 1}…`}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Match row — slides in from the top when a new round is revealed
// ---------------------------------------------------------------------------

function MatchRow({
  match,
  zh,
  t,
}: {
  match: MatchResult;
  zh: boolean;
  t: (key: StringKey) => string;
}) {
  const outcome = outcomeOf(match);
  const outcomeColor =
    outcome === 'W'
      ? 'bg-green-500/20 text-green-400 border-green-500/40'
      : outcome === 'L'
        ? 'bg-red-500/20 text-red-400 border-red-500/40'
        : 'bg-ink-700/40 text-ink-300 border-ink-600';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono py-2 border-b border-ink-800/40 last:border-0"
    >
      <span className="w-7 sm:w-8 text-ink-500 shrink-0">
        {t('matchday')}{match.round}
      </span>
      <span
        className={`w-7 sm:w-8 text-center font-bold rounded px-1 border shrink-0 ${outcomeColor}`}
      >
        {outcome}
      </span>
      <span
        className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
          match.home
            ? 'bg-accent/15 text-accent border border-accent/30'
            : 'bg-ink-700/50 text-ink-300 border border-ink-600'
        }`}
      >
        {match.home ? t('home') : t('away')}
      </span>
      <span className="flex-1 min-w-0 truncate text-ink-100">
        {zh ? match.opponentNameZh : match.opponentName}
      </span>
      <span className="font-bold text-ink-100 tabular-nums shrink-0">
        {match.goalsFor}-{match.goalsAgainst}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Live stat tile
// ---------------------------------------------------------------------------

function LiveStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 px-2 py-2 text-center">
      <div className="text-[10px] text-ink-400 font-mono uppercase mb-0.5 truncate">
        {label}
      </div>
      <motion.div
        key={String(value)}
        initial={{ opacity: 0.4, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`font-display font-black text-lg sm:text-2xl tabular-nums ${
          accent ? 'text-accent' : 'text-ink-100'
        }`}
      >
        {value}
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface AccStats {
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

function accumulate(matches: MatchResult[]): AccStats {
  const s: AccStats = {
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  };
  for (const m of matches) {
    if (m.goalsFor > m.goalsAgainst) {
      s.wins += 1;
      s.points += 3;
    } else if (m.goalsFor < m.goalsAgainst) {
      s.losses += 1;
    } else {
      s.draws += 1;
      s.points += 1;
    }
    s.goalsFor += m.goalsFor;
    s.goalsAgainst += m.goalsAgainst;
  }
  return s;
}
