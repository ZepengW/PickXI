import { motion } from 'framer-motion';
import type { Player, Position, SquadSlot } from '../types';
import { getFormation } from '../data';
import { useLang } from '../i18n/useLang';
import { positionGroup } from '../engine/simulation';

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
  selectedSlotId?: string | null;
  onSelectSlot?: (slotId: string) => void;
  onRemovePlayer?: (slotId: string) => void;
  showRatings?: boolean;
  compact?: boolean;
}

export default function Pitch({
  formationId,
  slots,
  selectedSlotId,
  onSelectSlot,
  onRemovePlayer,
  showRatings = true,
  compact = false,
}: PitchProps) {
  const { lang } = useLang();
  const formation = getFormation(formationId);
  const interactive = !!onSelectSlot;

  return (
    <div
      className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden pitch-grass noise shadow-2xl ring-1 ring-black/40 ${
        compact ? 'max-w-[280px]' : 'max-w-[440px]'
      }`}
    >
      {/* Pitch markings */}
      <svg
        viewBox="0 0 100 133"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <g fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4">
          <rect x="3" y="3" width="94" height="127" />
          <line x1="3" y1="66.5" x2="97" y2="66.5" />
          <circle cx="50" cy="66.5" r="12" />
          <circle cx="50" cy="66.5" r="1.2" fill="rgba(255,255,255,0.5)" />
          {/* top box (attacking) */}
          <rect x="28" y="3" width="44" height="20" />
          <rect x="38" y="3" width="24" height="8" />
          {/* bottom box (own) */}
          <rect x="28" y="110" width="44" height="20" />
          <rect x="38" y="122" width="24" height="8" />
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

        return (
          <motion.button
            key={fs.id}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onSelectSlot?.(fs.id)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + idx * 0.04, type: 'spring', stiffness: 200 }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-full font-mono font-bold transition-all ${
              compact ? 'w-9 h-9 text-[9px]' : 'w-12 h-12 sm:w-14 sm:h-14 text-[10px]'
            } ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } ${selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-pitch-700 scale-110 z-10' : ''}`}
            style={{
              left: `${fs.x}%`,
              top: `${100 - fs.y}%`,
              background: player
                ? `linear-gradient(145deg, ${color}ee, ${color}99)`
                : 'rgba(10,12,18,0.7)',
              border: `1.5px solid ${player ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)'}`,
              backdropFilter: 'blur(2px)',
            }}
            title={player ? player.name : label}
          >
            {player ? (
              <PlayerToken player={player} showRatings={showRatings} compact={compact} />
            ) : (
              <span className="text-white/70 leading-none">{label}</span>
            )}
          </motion.button>
        );
      })}

      {/* Remove hint on selected filled slot */}
      {interactive && selectedSlotId && onRemovePlayer && (() => {
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
}: {
  player: Player;
  showRatings: boolean;
  compact: boolean;
}) {
  const { lang } = useLang();
  return (
    <div className="flex flex-col items-center justify-center leading-none text-white">
      {showRatings && (
        <span className={compact ? 'text-[11px]' : 'text-sm sm:text-base'}>
          {player.rating}
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
