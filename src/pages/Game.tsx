import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../components/Nav';
import Pitch from '../components/Pitch';
import Wheel from '../components/Wheel';
import SquadPicker from '../components/SquadPicker';
import ResultsView from '../components/ResultsView';
import { useLang } from '../i18n/useLang';
import { useGame, filledCount, isComplete } from '../store/game';
import {
  COMPETITIONS,
  FORMATIONS,
  availableSeasons,
  clubSeasonsFor,
  getCompetition,
  playersForClubSeason,
} from '../data';
import { teamStrength } from '../engine/simulation';

export default function Game() {
  const game = useGame();
  const { phase } = game;

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      <Nav />
      <div className="pt-16">
        <AnimatePresence mode="wait">
          {phase === 'setup' && <SetupView key="setup" />}
          {phase === 'draft' && <DraftView key="draft" />}
          {phase === 'results' && game.result && (
            <ResultsView
              key="results"
              result={game.result}
              competitionId={game.competitionId}
              onPlayAgain={() => game.startDraft()}
              onChangeSetup={() => game.backToSetup()}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------------------

function SetupView() {
  const { lang, t } = useLang();
  const game = useGame();
  const { competitionId, formationId, seasonFrom, seasonTo, showRatings } = game;
  const comp = getCompetition(competitionId)!;
  const seasons = availableSeasons(competitionId);

  const safeFrom = seasons.includes(seasonFrom) ? seasonFrom : seasons[0] ?? '';
  const safeTo = seasons.includes(seasonTo) ? seasonTo : seasons[seasons.length - 1] ?? '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-5xl px-5 sm:px-8 py-10"
    >
      <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tightest text-white mb-2">
        {t('setupTitle')}
      </h1>
      <p className="text-ink-400 mb-10">
        {comp ? (lang === 'zh' ? comp.nameZh : comp.name) : ''}
      </p>

      {/* Competition */}
      <Section label={t('compsTitle')}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {COMPETITIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => game.setCompetition(c.id)}
              className={`rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                competitionId === c.id
                  ? 'border-accent bg-accent/10'
                  : 'border-ink-700 hover:border-ink-500 bg-ink-900/40'
              }`}
            >
              <div className="text-[10px] font-mono text-ink-400 mb-0.5">
                {lang === 'zh' ? c.regionZh : c.region}
              </div>
              <div className="font-display font-bold text-sm text-white leading-tight">
                {lang === 'zh' ? c.nameZh : c.name}
              </div>
              <div className="text-[10px] font-mono text-ink-500 mt-1">
                {c.matches} {lang === 'zh' ? '场' : 'games'} · {c.teamCount} {lang === 'zh' ? '队' : 'teams'}
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Formation */}
      <Section label={t('formation')}>
        <div className="flex flex-wrap gap-2">
          {FORMATIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => game.setFormation(f.id)}
              className={`px-5 py-2.5 rounded-full font-mono font-bold text-sm border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                formationId === f.id
                  ? 'border-accent bg-accent text-ink-950'
                  : 'border-ink-700 text-ink-200 hover:border-ink-500'
              }`}
            >
              {lang === 'zh' ? f.nameZh : f.name}
            </button>
          ))}
        </div>
      </Section>

      {/* Era */}
      <Section label={t('era')} hint={t('eraHint')}>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={safeFrom}
            onChange={(e) => game.setSeasonRange(e.target.value, safeTo)}
            aria-label={t('eraFrom')}
            className="bg-ink-900 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
          >
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-ink-500 font-mono text-sm" aria-hidden="true">—</span>
          <select
            value={safeTo}
            onChange={(e) => game.setSeasonRange(safeFrom, e.target.value)}
            aria-label={t('eraTo')}
            className="bg-ink-900 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
          >
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-xs text-ink-400 font-mono">
            {seasons.filter((s) => s >= safeFrom && s <= safeTo).length} {t('season')}
          </span>
        </div>
      </Section>

      {/* Ratings toggle */}
      <Section label={t('draftMode')}>
        <div className="flex gap-2">
          <button
            onClick={() => game.setShowRatings(true)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              showRatings
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-ink-700 text-ink-300 hover:border-ink-500'
            }`}
          >
            {t('showRatings')}
          </button>
          <button
            onClick={() => game.setShowRatings(false)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              !showRatings
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-ink-700 text-ink-300 hover:border-ink-500'
            }`}
          >
            {t('hideRatings')}
          </button>
        </div>
      </Section>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => game.startDraft()}
          className="px-10 py-4 bg-accent text-ink-950 font-bold rounded-full hover:bg-accent-dark transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
        >
          {t('startDraft')} →
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// DRAFT
// ---------------------------------------------------------------------------

function DraftView() {
  const { lang, t } = useLang();
  const game = useGame();
  const {
    competitionId,
    formationId,
    seasonFrom,
    seasonTo,
    showRatings,
    slots,
    draftedIds,
    spin,
    pendingPlayer,
  } = game;

  const [simulating, setSimulating] = useState(false);
  const [showFormationPicker, setShowFormationPicker] = useState(false);
  const filled = filledCount(slots);
  const complete = isComplete(slots);

  const options = useMemo(
    () => clubSeasonsFor(competitionId, [seasonFrom, seasonTo]),
    [competitionId, seasonFrom, seasonTo],
  );

  const draftedSet = useMemo(() => new Set(draftedIds), [draftedIds]);

  const squadPlayers = useMemo(() => {
    if (!spin) return [];
    return playersForClubSeason(spin.clubId, spin.season, draftedSet);
  }, [spin, draftedSet]);

  const strength = teamStrength(slots);

  function handleSimulate() {
    if (!complete) return;
    setSimulating(true);
    setTimeout(() => {
      game.runSim();
      setSimulating(false);
    }, 600);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 py-6"
    >
      {/* Top bar: progress + strength + simulate */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="font-mono text-sm">
            <span className="text-accent font-bold text-lg">{filled}</span>
            <span className="text-ink-500">/11</span>
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {slots.map((s) => (
              <div
                key={s.slotId}
                className={`w-2 h-2 rounded-full ${s.player ? 'bg-accent' : 'bg-ink-700'}`}
              />
            ))}
          </div>
          <div className="text-xs text-ink-400 font-mono">
            OVR <span className="text-white font-bold">{Math.round(strength.overall)}</span>
          </div>
          {/* Formation quick-switch */}
          <button
            onClick={() => setShowFormationPicker((v) => !v)}
            className="px-3 py-1 text-xs font-mono border border-ink-700 rounded-full text-ink-300 hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {formationId.toUpperCase()} ▾
          </button>
        </div>
        <button
          onClick={handleSimulate}
          disabled={!complete || simulating}
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            complete
              ? 'bg-accent text-ink-950 hover:bg-accent-dark'
              : 'bg-ink-800 text-ink-500 cursor-not-allowed'
          }`}
        >
          {simulating ? t('simulating') : t('simulate')}
        </button>
      </div>

      {/* Formation picker dropdown */}
      <AnimatePresence>
        {showFormationPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-ink-800 bg-ink-900/60">
              {FORMATIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    game.setFormation(f.id);
                    setShowFormationPicker(false);
                  }}
                  className={`px-4 py-2 rounded-full font-mono font-bold text-sm border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    formationId === f.id
                      ? 'border-accent bg-accent text-ink-950'
                      : 'border-ink-700 text-ink-200 hover:border-ink-500'
                  }`}
                >
                  {lang === 'zh' ? f.nameZh : f.name}
                </button>
              ))}
              <p className="w-full text-xs text-ink-500 mt-1">
                {lang === 'zh' ? '切换阵型会清空已选球员。' : 'Switching formation clears your draft.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6">
        {/* Pitch */}
        <div className="flex flex-col items-center">
          <Pitch
            formationId={formationId}
            slots={slots}
            pendingPlayer={pendingPlayer}
            onSelectSlot={(id) => {
              if (pendingPlayer) {
                game.placePlayer(id);
              }
            }}
            onRemovePlayer={(id) => game.removePlayer(id)}
            showRatings={showRatings}
          />
          <p className="text-xs text-ink-500 mt-3 text-center max-w-xs">
            {pendingPlayer
              ? lang === 'zh'
                ? `将 ${pendingPlayer.nameZh} 放到高亮位置。绿色=最佳位置，黄色=可踢但有 -5 惩罚。`
                : `Place ${pendingPlayer.name} on a highlighted slot. Green = primary, Yellow = secondary (-5).`
              : lang === 'zh'
                ? '转动转盘选球队 → 选球员 → 放到可踢位置。点击已放球员可移除。'
                : 'Spin → pick a player → place them on a valid slot. Tap a placed player to remove.'}
          </p>
        </div>

        {/* Right panel: wheel or squad picker */}
        <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5">
          <AnimatePresence mode="wait">
            {/* Placement mode: show pending player card + cancel */}
            {pendingPlayer ? (
              <motion.div
                key="placing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <h2 className="font-display font-bold text-lg text-white mb-2">
                  {lang === 'zh' ? '放置球员' : 'Place Player'}
                </h2>
                <div className="inline-flex flex-col items-center gap-2 p-4 rounded-xl border border-accent/40 bg-accent/5">
                  <div className="text-3xl font-display font-black text-accent">
                    {pendingPlayer.rating}
                  </div>
                  <div className="font-bold text-white">
                    {lang === 'zh' ? pendingPlayer.nameZh : pendingPlayer.name}
                  </div>
                  <div className="text-xs text-ink-400 font-mono">
                    {pendingPlayer.position} · {lang === 'zh' ? pendingPlayer.nationalityZh : pendingPlayer.nationality}
                  </div>
                </div>
                <p className="text-xs text-ink-400 mt-3">
                  {lang === 'zh'
                    ? '在球场上点击高亮的位置来放置。'
                    : 'Click a highlighted slot on the pitch to place.'}
                </p>
                <button
                  onClick={() => game.cancelPlacement()}
                  className="mt-4 px-6 py-2 rounded-full border border-ink-700 text-ink-300 text-sm font-medium hover:border-ink-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {lang === 'zh' ? '取消' : 'Cancel'}
                </button>
              </motion.div>
            ) : !spin ? (
              <motion.div
                key="wheel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-4">
                  <h2 className="font-display font-bold text-lg text-white">
                    {t('spin')}
                  </h2>
                  <p className="text-xs text-ink-400">
                    {lang === 'zh'
                      ? '转动转盘，随机获得一支球队和一个赛季。'
                      : 'Spin to land on a random club and season.'}
                  </p>
                </div>
                <Wheel
                  options={options}
                  disabled={false}
                  onLanded={(clubId, season) => game.doSpin(clubId, season)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="picker"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SquadPicker
                  players={squadPlayers}
                  onPick={(player) => game.pickPlayer(player)}
                  draftedIds={draftedSet}
                  showRatings={showRatings}
                  clubId={spin.clubId}
                  season={spin.season}
                />
                <button
                  onClick={() => game.clearSpin()}
                  className="mt-4 w-full py-2.5 rounded-full border border-ink-700 text-ink-300 text-sm font-medium hover:border-ink-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {t('reroll')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Shared section wrapper
// ---------------------------------------------------------------------------

function Section({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3 mb-3">
        <h2 className="font-display font-bold text-sm text-ink-200 uppercase tracking-wide">
          {label}
        </h2>
        {hint && <span className="text-xs text-ink-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
