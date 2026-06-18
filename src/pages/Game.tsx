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
  playersForClubSeason,
} from '../data';
import { teamStrength } from '../engine/simulation';
import { DIFFICULTY_CONFIGS } from '../types';
import type { Difficulty, Player, SquadSlot } from '../types';
import type { StringKey } from '../i18n/strings';

export default function Game() {
  const game = useGame();
  const { phase } = game;

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 flex flex-col">
      <Nav />
      <div className="pt-14 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {phase === 'setup' && <SetupView key="setup" />}
          {phase === 'draft' && <DraftView key="draft" />}
          {phase === 'results' && game.result && (
            <ResultsView
              key="results"
              result={game.result}
              competitionId={game.competitionId}
              slots={game.slots}
              formationId={game.formationId}
              onPlayAgain={() => game.startDraft()}
              onChangeSetup={() => game.backToSetup()}
              onRestartAll={() => game.restartAll()}
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

const DIFFICULTIES: { id: Difficulty; labelKey: StringKey; ruleKey: StringKey }[] = [
  { id: 'easy', labelKey: 'diffEasy', ruleKey: 'diffEasyRule' },
  { id: 'normal', labelKey: 'diffNormal', ruleKey: 'diffNormalRule' },
  { id: 'hard', labelKey: 'diffHard', ruleKey: 'diffHardRule' },
  { id: 'divine', labelKey: 'diffDivine', ruleKey: 'diffDivineRule' },
];

function SetupView() {
  const { lang, t } = useLang();
  const game = useGame();
  const { competitionId, formationId, seasonFrom, seasonTo, difficulty, opponentSeason, teamName } = game;
  const seasons = availableSeasons(competitionId);

  const safeFrom = seasons.includes(seasonFrom) ? seasonFrom : seasons[0] ?? '';
  const safeTo = seasons.includes(seasonTo) ? seasonTo : seasons[seasons.length - 1] ?? '';
  const safeOppSeason = seasons.includes(opponentSeason) ? opponentSeason : safeTo;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-5xl px-5 sm:px-8 py-8 w-full"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tightest text-ink-100">
          {t('setupTitle')}
        </h1>
        <button
          onClick={() => game.restartAll()}
          className="px-4 py-2 text-xs font-medium border border-ink-700 text-ink-400 rounded-full hover:border-red-500 hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {t('restartAll')}
        </button>
      </div>

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
              <div className="font-display font-bold text-sm text-ink-100 leading-tight">
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
            className="bg-ink-900 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-ink-100 font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
          >
            {seasons.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="text-ink-500 font-mono text-sm" aria-hidden="true">—</span>
          <select
            value={safeTo}
            onChange={(e) => game.setSeasonRange(safeFrom, e.target.value)}
            aria-label={t('eraTo')}
            className="bg-ink-900 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-ink-100 font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
          >
            {seasons.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="text-xs text-ink-400 font-mono">
            {seasons.filter((s) => s >= safeFrom && s <= safeTo).length} {t('season')}
          </span>
        </div>
      </Section>

      {/* Opponent season */}
      <Section label={t('opponentSeason')} hint={t('opponentSeasonHint')}>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={safeOppSeason}
            onChange={(e) => game.setOpponentSeason(e.target.value)}
            aria-label={t('opponentSeason')}
            className="bg-ink-900 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-ink-100 font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
          >
            {seasons.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </Section>

      {/* Team Name */}
      <Section label={t('teamName')} hint={t('teamNameHint')}>
        <input
          type="text"
          value={teamName}
          onChange={(e) => game.setTeamName(e.target.value)}
          placeholder={t('teamNamePlaceholder')}
          maxLength={24}
          className="bg-ink-900 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-ink-100 font-mono w-full max-w-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent placeholder:text-ink-600"
        />
      </Section>

      {/* Difficulty */}
      <Section label={t('difficulty')}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DIFFICULTIES.map((d) => {
            const isSel = difficulty === d.id;
            return (
              <button
                key={d.id}
                onClick={() => game.setDifficulty(d.id)}
                title={t(d.ruleKey)}
                className={`relative px-4 py-3 rounded-xl text-sm font-bold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent text-center ${
                  isSel
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-ink-700 text-ink-300 hover:border-ink-500'
                }`}
              >
                {t(d.labelKey)}
                {/* Tooltip on hover showing the rule */}
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 px-3 py-2 rounded-lg bg-ink-800 border border-ink-600 text-xs font-normal text-ink-200 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  {t(d.ruleKey)}
                </span>
              </button>
            );
          })}
        </div>
        {/* Always-visible rule description for the selected difficulty */}
        <p className="mt-3 text-xs text-ink-400 leading-relaxed">
          {t(DIFFICULTIES.find((d) => d.id === difficulty)!.ruleKey)}
        </p>
      </Section>

      <div className="mt-8 flex justify-center">
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
// DRAFT — full viewport layout
// ---------------------------------------------------------------------------

function DraftView() {
  const { lang, t } = useLang();
  const game = useGame();
  const {
    competitionId,
    formationId,
    seasonFrom,
    seasonTo,
    difficulty,
    slots,
    draftedIds,
    spin,
    pendingPlayer,
    bench,
  } = game;

  const diffCfg = DIFFICULTY_CONFIGS[difficulty];

  const [simulating, setSimulating] = useState(false);
  const [showFormationPicker, setShowFormationPicker] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
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

  function handleSelectSlot(slotId: string) {
    if (pendingPlayer) {
      game.placePlayer(slotId);
      return;
    }
    // Toggle selection for position swapping
    if (selectedSlotId === slotId) {
      setSelectedSlotId(null);
    } else if (slotId === '') {
      // Deselect
      setSelectedSlotId(null);
    } else {
      const slot = slots.find((s) => s.slotId === slotId);
      if (slot?.player) {
        setSelectedSlotId(slotId);
      }
    }
  }

  function handleMovePlayer(fromSlotId: string, toSlotId: string) {
    game.movePlayer(fromSlotId, toSlotId);
    setSelectedSlotId(null);
  }

  // Only allow reroll in easy mode
  const canReroll = difficulty === 'easy';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col w-full"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-ink-800/60 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="font-mono text-base">
            <span className="text-accent font-bold text-xl">{filled}</span>
            <span className="text-ink-500">/11</span>
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {slots.map((s) => (
              <div
                key={s.slotId}
                className={`w-2.5 h-2.5 rounded-full ${s.player ? 'bg-accent' : 'bg-ink-700'}`}
              />
            ))}
          </div>
          {/* Formation quick-switch */}
          <button
            onClick={() => setShowFormationPicker((v) => !v)}
            className="px-4 py-1.5 text-sm font-mono border border-ink-700 rounded-full text-ink-300 hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {formationId.toUpperCase()} ▾
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* Restart button in draft */}
          <button
            onClick={() => {
              if (confirm(lang === 'zh' ? '确定要完全重新开始吗？所有已选球员将被清空。' : 'Restart completely? All drafted players will be cleared.')) {
                game.restartAll();
              }
            }}
            className="px-4 py-2 text-xs font-medium border border-ink-700 text-ink-400 rounded-full hover:border-red-500 hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {t('restartAll')}
          </button>
          <button
            onClick={handleSimulate}
            disabled={!complete || simulating}
            className={`px-7 py-3 rounded-full font-bold text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              complete
                ? 'bg-accent text-ink-950 hover:bg-accent-dark'
                : 'bg-ink-800 text-ink-500 cursor-not-allowed'
            }`}
          >
            {simulating ? t('simulating') : t('simulate')}
          </button>
        </div>
      </div>

      {/* Formation picker dropdown */}
      <AnimatePresence>
        {showFormationPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-ink-800/60"
          >
            <div className="flex flex-wrap gap-2 p-3">
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
                {lang === 'zh'
                  ? '切换阵型会自动重新分配已选球员，无法放入新阵型的球员将进入替补席。'
                  : 'Switching formation auto-reassigns drafted players. Those that don\'t fit go to the bench.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content — full height grid. On mobile, single column with pitch
          on top and wheel/picker below. On lg+, two columns side by side. */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(360px,1fr)_minmax(0,1.2fr)] gap-4 p-4 sm:p-6 min-h-0">
        {/* Left: Pitch + strength bars + bench */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* Strength bars — hidden in divine difficulty */}
          {diffCfg.showTeamScore && <StrengthBars strength={strength} t={t} />}

          {/* Pitch — takes available space, but on mobile limit height */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="w-full max-w-[420px] sm:max-w-[480px]">
              <Pitch
                formationId={formationId}
                slots={slots}
                pendingPlayer={pendingPlayer}
                selectedSlotId={selectedSlotId}
                onSelectSlot={handleSelectSlot}
                onRemovePlayer={(id) => game.removePlayer(id)}
                onMovePlayer={handleMovePlayer}
                showRatings={diffCfg.showRatings}
                showPosition={diffCfg.showPosition}
              />
            </div>
          </div>

          <p className="text-sm text-ink-500 text-center">
            {pendingPlayer
              ? lang === 'zh'
                ? diffCfg.showPosition
                  ? `将 ${pendingPlayer.nameZh} 放到任意位置。绿色=最佳，黄色=可踢，橙色=客串，数字为减分`
                  : `将 ${pendingPlayer.nameZh} 放到任意位置。不同位置有不同分数加成。`
                : `Place ${pendingPlayer.name} anywhere. Different positions give different score bonuses.`
              : selectedSlotId
                ? lang === 'zh'
                  ? '点击其他位置来移动球员，或点击"取消选择"。'
                  : 'Click another position to move the player, or click "Deselect".'
                : lang === 'zh'
                  ? '转盘→选球员→放到任意位置。点击已放球员可选中并移动。'
                  : 'Spin → pick → place anywhere. Tap a placed player to select and move.'}
          </p>

          {/* Bench */}
          {bench.length > 0 && (
            <Bench
              bench={bench}
              showRatings={diffCfg.showRatings}
              showPosition={diffCfg.showPosition}
              onPlace={(player, slotId) => game.placeBenchPlayer(player, slotId)}
              slots={slots}
              lang={lang}
              t={t}
            />
          )}
        </div>

        {/* Right: wheel or squad picker — hidden when XI is complete */}
        {!complete && (
        <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-4 sm:p-5 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {pendingPlayer ? (
              <motion.div
                key="placing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center flex-1"
              >
                <h2 className="font-display font-bold text-lg text-ink-100 mb-3">
                  {lang === 'zh' ? '放置球员' : 'Place Player'}
                </h2>
                <div className="inline-flex flex-col items-center gap-2 p-5 rounded-xl border border-accent/40 bg-accent/5">
                  {diffCfg.showRatings && (
                    <div className="text-4xl font-display font-black text-accent">
                      {pendingPlayer.rating}
                    </div>
                  )}
                  <div className="font-bold text-ink-100 text-lg">
                    {lang === 'zh' ? pendingPlayer.nameZh : pendingPlayer.name}
                  </div>
                  <div className="text-xs text-ink-400 font-mono">
                    {pendingPlayer.position}
                    {diffCfg.showNationality && ` · ${lang === 'zh' ? pendingPlayer.nationalityZh : pendingPlayer.nationality}`}
                  </div>
                  {diffCfg.showRatings && (
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {([
                        ['PAC', pendingPlayer.attr.pace],
                        ['SHO', pendingPlayer.attr.shooting],
                        ['PAS', pendingPlayer.attr.passing],
                        ['DRI', pendingPlayer.attr.dribbling],
                        ['DEF', pendingPlayer.attr.defending],
                        ['PHY', pendingPlayer.attr.physical],
                      ] as const).map(([key, val]) => (
                        <div key={key} className="text-center">
                          <div className="text-[8px] text-ink-400 font-mono">{key}</div>
                          <div className="text-xs font-mono font-bold text-ink-100">{val}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-ink-400 mt-4 text-center max-w-xs">
                  {lang === 'zh'
                    ? '在球场上点击高亮的位置来放置。'
                    : 'Click a highlighted slot on the pitch to place.'}
                </p>
                <button
                  onClick={() => game.cancelPlacement()}
                  className="mt-4 px-6 py-2 rounded-full border border-ink-700 text-ink-300 text-sm font-medium hover:border-ink-500 hover:text-ink-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                className="flex flex-col flex-1"
              >
                <div className="mb-3">
                  <h2 className="font-display font-bold text-lg text-ink-100">{t('spin')}</h2>
                  <p className="text-xs text-ink-400">
                    {lang === 'zh'
                      ? '转动转盘，随机获得一支球队和一个赛季。'
                      : 'Spin to land on a random club and season.'}
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <Wheel
                    options={options}
                    disabled={false}
                    onLanded={(clubId, season) => game.doSpin(clubId, season)}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="picker"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col flex-1 min-h-0"
              >
                <SquadPicker
                  players={squadPlayers}
                  onPick={(player) => game.pickPlayer(player)}
                  draftedIds={draftedSet}
                  showRatings={diffCfg.showRatings}
                  hideTier={!diffCfg.showTier}
                  showPosition={diffCfg.showPosition}
                  showNationality={diffCfg.showNationality}
                  clubId={spin.clubId}
                  season={spin.season}
                />
                {canReroll && (
                  <button
                    onClick={() => game.clearSpin()}
                    className="mt-3 w-full py-2.5 rounded-full border border-ink-700 text-ink-300 text-sm font-medium hover:border-ink-500 hover:text-ink-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {t('reroll')}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Strength bars — multi-dimensional team score
// ---------------------------------------------------------------------------

function StrengthBars({
  strength,
  t,
}: {
  strength: { overall: number; attack: number; midfield: number; defence: number };
  t: (key: StringKey) => string;
}) {
  const bars = [
    { label: t('overall'), value: strength.overall, color: 'bg-accent' },
    { label: t('attack'), value: strength.attack, color: 'bg-red-500' },
    { label: t('midfield'), value: strength.midfield, color: 'bg-green-500' },
    { label: t('defence'), value: strength.defence, color: 'bg-blue-500' },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {bars.map((b) => (
        <div key={b.label} className="rounded-lg border border-ink-800 bg-ink-900/40 p-3">
          <div className="text-xs text-ink-400 font-mono uppercase mb-1">{b.label}</div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-black text-2xl text-ink-100 tabular-nums">
              {Math.round(b.value)}
            </span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-ink-800 overflow-hidden">
            <div
              className={`h-full ${b.color} rounded-full transition-all duration-500`}
              style={{ width: `${b.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bench — drafted but unplaced players
// ---------------------------------------------------------------------------

function Bench({
  bench,
  showRatings,
  showPosition,
  onPlace,
  slots,
  lang,
  t,
}: {
  bench: Player[];
  showRatings: boolean;
  showPosition: boolean;
  onPlace: (player: Player, slotId: string) => void;
  slots: SquadSlot[];
  lang: string;
  t: (key: StringKey) => string;
}) {
  const [selected, setSelected] = useState<Player | null>(null);

  const emptySlots = selected
    ? slots.filter((s) => !s.player)
    : [];

  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-3">
      <div className="text-xs font-mono text-ink-400 mb-2">
        {t('bench')} ({bench.length})
      </div>
      <div className="flex flex-wrap gap-2">
        {bench.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(selected?.id === p.id ? null : p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              selected?.id === p.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-ink-700 text-ink-300 hover:border-ink-500'
            }`}
          >
            {showRatings && <span className="font-mono font-bold mr-1">{p.rating}</span>}
            {lang === 'zh' ? p.nameZh : p.name}
            {showPosition && <span className="text-ink-500 ml-1">{p.position}</span>}
          </button>
        ))}
      </div>
      {selected && emptySlots.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-xs text-ink-500 self-center">
            {lang === 'zh' ? '放入：' : 'Place at:'}
          </span>
          {emptySlots.map((s) => (
            <button
              key={s.slotId}
              onClick={() => {
                onPlace(selected, s.slotId);
                setSelected(null);
              }}
              className="px-2.5 py-1 rounded-md text-xs font-mono border border-sky-600/40 text-sky-300 bg-sky-600/10 hover:bg-sky-600/20 transition-colors"
            >
              {s.position}
            </button>
          ))}
        </div>
      )}
    </div>
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
    <div className="mb-6">
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
