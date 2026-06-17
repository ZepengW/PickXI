import { motion } from 'framer-motion';
import type { Player, Position, SquadSlot } from '../types';
import { getFormation } from '../data';
import { useLang } from '../i18n/useLang';
import { positionGroup, positionFit } from '../engine/simulation';

const POS_LABEL: Record<Position, { zh: string; en: string }> = {
  GK: { zh: '门将', en: 'GK' },
  CB: { zh: '中卫', en: 'CB' },
  LB: { zh: '左后卫', en: 'LB' },
  RB: { zh: '右后卫', en: 'RB' },
  LWB: { zh: '左翼卫', en: 'LWB' },
  RWB: { zh: '右翼卫', en: 'RWB' },
  CDM: { zh: '后腰', en: 'CDM' },
  CM: { zh: '中前卫', en: 'CM' },
  CAM: { zh: '前腰', en: 'CAM' },
  LM: { zh: '左前卫', en: 'LM' },
  RM: { zh: '右前卫', en: 'RM' },
  LW: { zh: '左边锋', en: 'LW' },
  RW: { zh: '右边锋', en: 'RW' },
  ST: { zh: '前锋', en: 'ST' },
  CF: { zh: '影锋', en: 'CF' },
};

const GROUP_COLOR: Record<string, string> = {
  GK: '#f5c542',
  DEF: '#3b82f6',
  MID: '#22c55e',
  ATT: '#ef4444',
};

interface PitchProps {
  formationId: string;
  slots: SquadSlot[];
  /** Player waiting to be placed — slots they can play will be highlighted. */
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
        compact ? 'max-w-[280px]' : 'max-w-[440px]'
      }`}
    >
      {/* Pitch markings — viewBox matches aspect-[3/4] exactly (100×133.33) */}
      <svg
        viewBox="0 0 100 133.33"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <g fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4">
          {/* Outer boundary */}
          <rect x="3" y="3" width="94" height="127.33" />
          {/* Halfway line */}
          <line x1="3" y1="66.67" x2="97" y2="66.67" />
          {/* Centre circle */}
          <circle cx="50" cy="66.67" r="11" />
          <circle cx="50" cy="66.67" r="1" fill="rgba(255,255,255,0.4)" />
          {/* Top penalty box (attacking goal) */}
          <rect x="22" y="3" width="56" height="20" />
          {/* Top 6-yard box */}
          <rect x="37" y="3" width="26" height="8" />
          {/* Top penalty arc */}
          <path d="M 38 23 A 11 11 0 0 0 62 23" />
          {/* Bottom penalty box (own goal) */}
          <rect x="22" y="110.33" width="56" height="20" />
          {/* Bottom 6-yard box */}
          <rect x="37" y="122.33" width="26" height="8" />
          {/* Bottom penalty arc */}
          <path d="M 38 110.33 A 11 11 0 0 1 62 110.33" />
        </g>
      </svg>

      {/* Slots */}
      {formation.slots.map((fs, idx) => {
        const slot = slots.find((s) => s.slotId === fs.id);
        const player = slot?.player ?? null;
        const selected = selectedSlotId === fs.id;
        const group = positionGroup(fs.position);
        const color = GROUP_COLOR[group];
        const label = POS_LABEL[fs.position][lang];

        // Placement mode: highlight valid slots
        const canPlace = placing && pendingPlayer
          ? positionFit(pendingPlayer, fs.position) !== null
          : false;
        const isPrimary = placing && pendingPlayer
          ? positionFit(pendingPlayer, fs.position) === 'primary'
          : false;
        const isSecondary = placing && pendingPlayer
          ? positionFit(pendingPlayer, fs.position) === 'secondary'
          : false;

        // In placement mode, only valid slots are clickable
        const clickable = placing ? canPlace : interactive;

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
              compact ? 'w-9 h-9 text-[9px]' : 'w-12 h-12 sm:w-14 sm:h-14 text-[10px]'
            } ${
              clickable ? 'cursor-pointer hover:scale-110' : placing ? 'cursor-not-allowed opacity-40' : 'cursor-default'
            } ${selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-pitch-700 scale-110 z-10' : ''} ${
              isPrimary ? 'ring-2 ring-green-400 animate-pulse z-10' : ''
            } ${isSecondary ? 'ring-2 ring-yellow-400 z-10' : ''}`}
            style={{
              left: `${fs.x}%`,
              top: `${100 - fs.y}%`,
              background: player
                ? `linear-gradient(145deg, ${color}ee, ${color}99)`
                : canPlace
                  ? isPrimary
                    ? 'rgba(34,197,94,0.25)'
                    : 'rgba(250,204,21,0.2)'
                  : 'rgba(10,12,18,0.7)',
              border: `1.5px solid ${
                player
                  ? 'rgba(255,255,255,0.5)'
                  : isPrimary
                    ? 'rgba(74,222,128,0.9)'
                    : isSecondary
                      ? 'rgba(250,204,21,0.8)'
                      : 'rgba(255,255,255,0.18)'
              }`,
              backdropFilter: 'blur(2px)',
            }}
            title={player ? player.name : label}
          >
            {player ? (
              <PlayerToken
                player={player}
                showRatings={showRatings}
                compact={compact}
                positionFit={slot?.positionFit ?? null}
              />
            ) : (
              <span className="text-white/70 leading-none">{label}</span>
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
}: {
  player: Player;
  showRatings: boolean;
  compact: boolean;
  positionFit: 'primary' | 'secondary' | null;
}) {
  const { lang } = useLang();
  return (
    <div className="flex flex-col items-center justify-center leading-none text-white">
      {showRatings && (
        <span className={compact ? 'text-[11px]' : 'text-sm sm:text-base'}>
          {player.rating}
          {fit === 'secondary' && (
            <span className="text-yellow-300 text-[8px] ml-0.5">-5</span>
          )}
        </span>
      )}
      <span
        className={`font-sans font-semibold text-center px-0.5 truncate max-w-[3.2rem] ${
          compact ? 'text-[7px]' : 'text-[8px] sm:text-[9px]'
        }`}
      >
        {lang === 'zh' ? player.nameZh : player.name}
      </span>
    </div>
  );
}
