import { motion } from 'framer-motion';
import type { ChemistryLink, Player, SquadSlot } from '../types';
import { getFormation } from '../data';
import { useLang } from '../i18n/useLang';
import { positionGroup, positionFit, positionPenalty } from '../engine/simulation';

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
  onMovePlayer?: (fromSlotId: string, toSlotId: string) => void;
  showRatings?: boolean;
  /** Show position recommendation highlights (primary/secondary/other). */
  showPosition?: boolean;
  /** Show chemistry lines between players. */
  showChemistry?: boolean;
  /** Chemistry links to draw. */
  chemistryLinks?: ChemistryLink[];
  compact?: boolean;
}

export default function Pitch({
  formationId,
  slots,
  pendingPlayer = null,
  selectedSlotId,
  onSelectSlot,
  onRemovePlayer,
  onMovePlayer,
  showRatings = true,
  showPosition = true,
  showChemistry = false,
  chemistryLinks = [],
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
        Pitch markings in screen coords (y=0 top, y=100 bottom).
        Formation coords: y=0 own goal (bottom), y=100 attacking goal (top).
        Slot screen position: top = (100 - fs.y)%.
        SVG and slots share the same screen space — no flip needed.
      */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5">
          {/* Outer boundary */}
          <rect x="4" y="4" width="92" height="92" />
          {/* Halfway line */}
          <line x1="4" y1="50" x2="96" y2="50" />
          {/* Centre circle + spot */}
          <circle cx="50" cy="50" r="9" />
          <circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.4)" />
          {/* Attacking (top) penalty area */}
          <rect x="20" y="4" width="60" height="16" />
          <rect x="37" y="4" width="26" height="4" />
          <path d="M 38 20 A 9 9 0 0 0 62 20" />
          {/* Own (bottom) penalty area */}
          <rect x="20" y="80" width="60" height="16" />
          <rect x="37" y="92" width="26" height="4" />
          <path d="M 38 80 A 9 9 0 0 1 62 80" />
        </g>
      </svg>

      {/* Chemistry lines */}
      {showChemistry && chemistryLinks.length > 0 && (
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {chemistryLinks.map((link) => {
            const fromSlot = formation.slots.find((s) => s.id === link.fromSlotId);
            const toSlot = formation.slots.find((s) => s.id === link.toSlotId);
            if (!fromSlot || !toSlot || link.type === 'none') return null;

            const x1 = fromSlot.x;
            const y1 = 100 - fromSlot.y;
            const x2 = toSlot.x;
            const y2 = 100 - toSlot.y;

            const color = link.type === 'club' ? '#22c55e' : '#facc15';
            const opacity = link.type === 'club' ? 0.7 : 0.5;

            return (
              <line
                key={`${link.fromSlotId}-${link.toSlotId}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={link.type === 'club' ? 0.8 : 0.5}
                strokeOpacity={opacity}
                strokeDasharray={link.type === 'nation' ? '2 1' : undefined}
              />
            );
          })}
        </svg>
      )}

      {/* Slots */}
      {formation.slots.map((fs, idx) => {
        const slot = slots.find((s) => s.slotId === fs.id);
        const player = slot?.player ?? null;
        const selected = selectedSlotId === fs.id;
        const group = positionGroup(fs.position);
        const color = GROUP_COLOR[group];
        const label = fs.position;

        // When a slot is selected (has a player), clicking another slot moves the player
        const isMoveTarget = !placing && selectedSlotId && selectedSlotId !== fs.id;

        const fit = placing && pendingPlayer
          ? positionFit(pendingPlayer, fs.position)
          : null;
        const fitPenalty = placing && pendingPlayer
          ? positionPenalty(pendingPlayer, fs.position)
          : 0;
        // When showPosition is off (divine difficulty), don't color-code slots.
        const isPrimary = showPosition && fit === 'primary';
        const isSecondary = showPosition && fit === 'secondary';
        const isOther = showPosition && fit === 'other';
        const isNeutral = placing && !showPosition; // all slots same neutral color
        const occupied = !!player;
        const clickable = placing ? !occupied : interactive;

        return (
          <motion.button
            key={fs.id}
            type="button"
            disabled={!clickable && !isMoveTarget}
            onClick={() => {
              if (isMoveTarget && onMovePlayer) {
                onMovePlayer(selectedSlotId, fs.id);
              } else if (clickable) {
                onSelectSlot?.(fs.id);
              }
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + idx * 0.04, type: 'spring', stiffness: 200 }}
            /*
             * CRITICAL: framer-motion sets `transform` for scale/opacity,
             * which OVERRIDES Tailwind's `-translate-x-1/2 -translate-y-1/2`.
             * Use framer-motion's `x`/`y` props instead so the centering
             * transform survives. Without this, slots align by their
             * top-left corner → whole formation appears shifted right-down.
             */
            style={{
              left: `${fs.x}%`,
              top: `${100 - fs.y}%`,
              x: '-50%',
              y: '-50%',
              background: occupied
                ? `linear-gradient(145deg, ${color}ee, ${color}99)`
                : isPrimary
                  ? 'rgba(34,197,94,0.3)'
                  : isSecondary
                    ? 'rgba(250,204,21,0.25)'
                    : isOther
                      ? 'rgba(249,115,22,0.2)'
                      : isNeutral
                        ? 'rgba(245,197,66,0.15)'
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
                        : isNeutral
                          ? 'rgba(245,197,66,0.5)'
                          : 'rgba(255,255,255,0.18)'
              }`,
              backdropFilter: 'blur(2px)',
            }}
            className={`absolute flex flex-col items-center justify-center rounded-full font-mono font-bold ${
              compact ? 'w-10 h-10 text-[10px]' : 'w-14 h-14 sm:w-16 sm:h-16 text-xs'
            } ${
              clickable || isMoveTarget ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } ${selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-pitch-700 scale-110 z-10' : ''} ${
              isPrimary ? 'ring-2 ring-green-400 animate-pulse z-10' : ''
            } ${isSecondary ? 'ring-2 ring-yellow-400 z-10' : ''} ${
              isOther ? 'ring-2 ring-orange-400/70 z-10' : ''
            } ${isMoveTarget ? 'ring-2 ring-sky-400 z-10' : ''}`}
            title={player ? `${player.name} (${label})` : label}
            aria-label={
              occupied
                ? `${player!.name} (${label})`
                : `${label} ${placing ? '— click to place' : ''}`
            }
          >
            {occupied ? (
              <PlayerToken
                player={player!}
                showRatings={showRatings}
                compact={compact}
                positionFit={slot?.positionFit ?? null}
                positionPenalty={slot?.positionPenalty ?? 0}
                positionLabel={label}
                lang={lang}
              />
            ) : placing ? (
              <div className="flex flex-col items-center justify-center leading-none text-white">
                <span className="text-white/70 font-mono font-bold tracking-tight leading-none">
                  {label}
                </span>
                {showPosition && fitPenalty > 0 && (
                  <span className={`text-[8px] font-mono mt-0.5 ${
                    fitPenalty <= 3 ? 'text-green-300' : fitPenalty <= 5 ? 'text-yellow-300' : fitPenalty <= 8 ? 'text-orange-300' : 'text-red-300'
                  }`}>
                    -{fitPenalty}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-white/70 font-mono font-bold tracking-tight leading-none">
                {label}
              </span>
            )}
          </motion.button>
        );
      })}

      {/* Remove button for selected filled slot */}
      {interactive && !placing && selectedSlotId && onRemovePlayer && (() => {
        const sel = slots.find((s) => s.slotId === selectedSlotId);
        if (!sel?.player) return null;
        return (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            <button
              onClick={() => onRemovePlayer(selectedSlotId)}
              className="px-3 py-1 text-xs font-medium bg-ink-900/90 text-ink-200 rounded-full border border-ink-600 hover:border-red-500 hover:text-red-400 transition-colors"
            >
              {lang === 'zh' ? '移除' : 'Remove'}
            </button>
            <button
              onClick={() => onSelectSlot?.('')}
              className="px-3 py-1 text-xs font-medium bg-ink-900/90 text-ink-200 rounded-full border border-ink-600 hover:border-ink-400 transition-colors"
            >
              {lang === 'zh' ? '取消选择' : 'Deselect'}
            </button>
          </div>
        );
      })()}
    </div>
  );
}

function PlayerToken({
  player,
  showRatings,
  compact,
  positionPenalty: penalty,
  positionLabel,
  lang,
}: {
  player: Player;
  showRatings: boolean;
  compact: boolean;
  positionFit: 'primary' | 'secondary' | 'other' | null;
  positionPenalty: number;
  positionLabel: string;
  lang: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center leading-none text-white">
      {showRatings && (
        <span className={compact ? 'text-xs' : 'text-base sm:text-lg'}>
          {player.rating}
          {penalty > 0 && (
            <span className={`text-[10px] ml-0.5 ${
              penalty <= 3 ? 'text-green-300' : penalty <= 5 ? 'text-yellow-300' : penalty <= 8 ? 'text-orange-300' : 'text-red-300'
            }`}>
              -{penalty}
            </span>
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
      {/* Position code the player is playing */}
      <span className={`font-mono font-bold text-white/80 ${compact ? 'text-[7px]' : 'text-[9px] sm:text-[10px]'}`}>
        {positionLabel}
      </span>
    </div>
  );
}
