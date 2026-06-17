import { motion } from 'framer-motion';
import type { Player, SquadSlot } from '../types';
import { getFormation } from '../data';
import { useLang } from '../i18n/useLang';
import { positionGroup, positionFit } from '../engine/simulation';

const GROUP_COLOR: Record<string, string> = {
  GK: '#f5c542',
  DEF: '#3b82f6',
  MID: '#22c55e',
  ATT: '#ef4444',
};

interface PitchProps {
  formationId: string;
  slots: SquadSlot[];
  pendingPlayer?: Player | null;
  selectedSlotId?: string | null;
  onSelectSlot?: (slotId: string) => void;
  onRemovePlayer?: (slotId: string) => void;
  showRatings?: boolean;
  compact?: boolean;
}

export default function Pitch({
  formationId,
  slots,
  pendingPlayer = null,
  selectedSlotId,
  onSelectSlot,
  onRemovePlayer,
  showRatings = true,
  compact = false,
}: PitchProps) {
  const { lang } = useLang();
  const formation = getFormation(formationId);
  const interactive = !!onSelectSlot;
  const placing = !!pendingPlayer;

  return (
    <div
      className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden pitch-grass noise shadow-2xl ring-1 ring-black/40 ${
        compact ? 'max-w-[280px]' : 'max-w-none'
      }`}
    >
      {/*
        Pitch markings drawn in screen coordinates (y=0 at top, y=100 at bottom).
        Formation coords have y=0 at own goal (bottom) and y=100 at attacking goal (top),
        so slots use top = (100 - fs.y)% to convert to screen coordinates.
        No flip transform needed — markings and slots use the same screen space.
      */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5">
          {/* Outer boundary */}
          <rect x="4" y="4" width="92" height="92" />
          {/* Halfway line (screen y=50) */}
          <line x1="4" y1="50" x2="96" y2="50" />
          {/* Centre circle */}
          <circle cx="50" cy="50" r="9" />
          {/* Centre spot */}
          <circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.4)" />

          {/* Attacking goal area (top of screen, y=4-20) */}
          <rect x="20" y="4" width="60" height="16" />
          {/* Attacking 6-yard box */}
          <rect x="37" y="4" width="26" height="4" />
          {/* Attacking penalty arc */}
          <path d="M 38 20 A 9 9 0 0 0 62 20" />

          {/* Own goal area (bottom of screen, y=80-96) */}
          <rect x="20" y="80" width="60" height="16" />
          {/* Own 6-yard box */}
          <rect x="37" y="92" width="26" height="4" />
          {/* Own penalty arc */}
          <path d="M 38 80 A 9 9 0 0 1 62 80" />
        </g>
      </svg>

      {/* Slots — positioned using formation coords converted to screen coords */}
      {formation.slots.map((fs, idx) => {
        const slot = slots.find((s) => s.slotId === fs.id);
        const player = slot?.player ?? null;
        const selected = selectedSlotId === fs.id;
        const group = positionGroup(fs.position);
        const color = GROUP_COLOR[group];
        // Always show the position code (ST, CB, etc.)
        const label = fs.position;

        // Since any player can play any position, always allow placement.
        const fit = placing && pendingPlayer
          ? positionFit(pendingPlayer, fs.position)
          : null;
        const isPrimary = fit === 'primary';
        const isSecondary = fit === 'secondary';
        const isOther = fit === 'other';
        const occupied = !!player;

        // When placing, all empty slots are clickable (any position allowed).
        const clickable = placing ? !occupied : interactive;

        return (
          <motion.button
            key={fs.id}
            type="button"
            disabled={!clickable}
            onClick={() => clickable && onSelectSlot?.(fs.id)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + idx * 0.04, type: 'spring', stiffness: 200 }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-full font-mono font-bold transition-all ${
              compact ? 'w-10 h-10 text-[10px]' : 'w-14 h-14 sm:w-16 sm:h-16 text-xs'
            } ${
              clickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } ${selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-pitch-700 scale-110 z-10' : ''} ${
              isPrimary ? 'ring-2 ring-green-400 animate-pulse z-10' : ''
            } ${isSecondary ? 'ring-2 ring-yellow-400 z-10' : ''} ${
              isOther ? 'ring-2 ring-orange-400/70 z-10' : ''
            }`}
            style={{
              left: `${fs.x}%`,
              top: `${100 - fs.y}%`,
              background: occupied
                ? `linear-gradient(145deg, ${color}ee, ${color}99)`
                : isPrimary
                  ? 'rgba(34,197,94,0.3)'
                  : isSecondary
                    ? 'rgba(250,204,21,0.25)'
                    : isOther
                      ? 'rgba(249,115,22,0.2)'
                      : 'rgba(10,12,18,0.7)',
              border: `1.5px solid ${
                occupied
                  ? 'rgba(255,255,255,0.5)'
                  : isPrimary
                    ? 'rgba(74,222,128,0.9)'
                    : isSecondary
                      ? 'rgba(250,204,21,0.8)'
                      : isOther
                        ? 'rgba(249,115,22,0.7)'
                        : 'rgba(255,255,255,0.18)'
              }`,
              backdropFilter: 'blur(2px)',
            }}
            title={player ? `${player.name} (${label})` : label}
          >
            {occupied ? (
              <PlayerToken
                player={player!}
                showRatings={showRatings}
                compact={compact}
                positionFit={slot?.positionFit ?? null}
                positionLabel={label}
                lang={lang}
              />
            ) : (
              <span className="text-white/70 font-mono font-bold tracking-tight leading-none">
                {label}
              </span>
            )}
          </motion.button>
        );
      })}

      {/* Remove hint on selected filled slot */}
      {interactive && !placing && selectedSlotId && onRemovePlayer && (() => {
        const sel = slots.find((s) => s.slotId === selectedSlotId);
        if (!sel?.player) return null;
        return (
          <button
            onClick={() => onRemovePlayer(selectedSlotId)}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium bg-ink-900/90 text-ink-200 rounded-full border border-ink-600 hover:border-red-500 hover:text-red-400 transition-colors z-20"
          >
            {lang === 'zh' ? '移除' : 'Remove'}
          </button>
        );
      })()}
    </div>
  );
}

function PlayerToken({
  player,
  showRatings,
  compact,
  positionFit: fit,
  positionLabel,
  lang,
}: {
  player: Player;
  showRatings: boolean;
  compact: boolean;
  positionFit: 'primary' | 'secondary' | 'other' | null;
  positionLabel: string;
  lang: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center leading-none text-white">
      {showRatings && (
        <span className={compact ? 'text-xs' : 'text-base sm:text-lg'}>
          {player.rating}
          {fit === 'secondary' && (
            <span className="text-yellow-300 text-[10px] ml-0.5">-5</span>
          )}
          {fit === 'other' && (
            <span className="text-orange-300 text-[10px] ml-0.5">-15</span>
          )}
        </span>
      )}
      <span
        className={`font-sans font-semibold text-center px-0.5 truncate max-w-[4.5rem] ${
          compact ? 'text-[8px]' : 'text-[10px] sm:text-xs'
        }`}
      >
        {lang === 'zh' ? player.nameZh : player.name}
      </span>
      {/* Always show the position code the player is playing */}
      <span className={`font-mono font-bold text-white/80 ${compact ? 'text-[7px]' : 'text-[9px] sm:text-[10px]'}`}>
        {positionLabel}
      </span>
    </div>
  );
}
