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
}

const OUTCOME_STYLE: Record<string, string> = {
  W: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  D: 'bg-ink-600/40 text-ink-200 border-ink-500',
  L: 'bg-red-500/20 text-red-300 border-red-500/40',
};

export default function ResultsView({
  result,
  competitionId,
  onPlayAgain,
  onChangeSetup,
}: ResultsViewProps) {
  const { lang, t } = useLang();
  const comp = getCompetition(competitionId);
  const isCup = comp?.type === 'cup';

  const champ = result.position === 1;
  const played = result.matches.length;

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Headline */}
        <div className="text-center mb-10">
          {result.perfect && (
            <div className="inline-block px-4 py-1.5 bg-accent/20 text-accent font-bold text-sm rounded-full border border-accent/40 mb-4">
              {t('perfect')}
            </div>
          )}
          {!result.perfect && result.unbeaten && (
            <div className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-300 font-bold text-sm rounded-full border border-emerald-500/40 mb-4">
              {t('unbeaten')}
            </div>
          )}
          <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tightest text-white mb-3">
            {t('resultsTitle')}
          </h1>
          <p className="text-ink-400 text-sm font-mono">
            {comp ? (lang === 'zh' ? comp.nameZh : comp.name) : ''} ·{' '}
            {lang === 'zh' ? `${played} 场` : `${played} games`}
          </p>
        </div>

        {/* Big stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
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
            sub={isCup ? (lang === 'zh' ? '晋级' : 'advanced') : ''}
            delay={0.18}
          />
          <StatBox
            label={t('record')}
            value={`${result.wins}-${result.draws}-${result.losses}`}
            sub={lang === 'zh' ? '胜-平-负' : 'W-D-L'}
            delay={0.26}
          />
          <StatBox
            label={t('goals')}
            value={`${result.goalsFor}:${result.goalsAgainst}`}
            sub={lang === 'zh' ? '进:失' : 'for:against'}
            delay={0.34}
          />
        </div>

        {/* Match-by-match */}
        <div className="rounded-2xl border border-ink-800 overflow-hidden">
          <div className="px-5 py-3 border-b border-ink-800 flex items-center justify-between">
            <span className="font-display font-bold text-sm text-white">
              {lang === 'zh' ? '逐场战报' : 'Match by match'}
            </span>
            <span className="text-xs font-mono text-ink-400">
              {result.wins}W {result.draws}D {result.losses}L
            </span>
          </div>
          <div className="divide-y divide-ink-800/60">
            {result.matches.map((m, i) => {
              const o = outcomeOf(m);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.025 }}
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
                    {lang === 'zh' ? m.opponentNameZh : m.opponentName}
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
            className="px-7 py-3.5 bg-accent text-ink-950 font-bold rounded-full hover:bg-accent-dark transition-colors"
          >
            {t('playAgain')}
          </button>
          <button
            onClick={onChangeSetup}
            className="px-7 py-3.5 border border-ink-600 text-ink-200 font-medium rounded-full hover:border-ink-400 hover:text-white transition-colors"
          >
            {t('changeSetup')}
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
