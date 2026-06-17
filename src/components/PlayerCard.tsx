import { motion } from 'framer-motion';
import type { Player, Position } from '../types';
import { useLang } from '../i18n/useLang';

const POS_SHORT: Record<Position, { zh: string; en: string }> = {
  GK: { zh: 'GK', en: 'GK' },
  CB: { zh: 'CB', en: 'CB' },
  LB: { zh: 'LB', en: 'LB' },
  RB: { zh: 'RB', en: 'RB' },
  LWB: { zh: 'LWB', en: 'LWB' },
  RWB: { zh: 'RWB', en: 'RWB' },
  CDM: { zh: 'CDM', en: 'CDM' },
  CM: { zh: 'CM', en: 'CM' },
  CAM: { zh: 'CAM', en: 'CAM' },
  LM: { zh: 'LM', en: 'LM' },
  RM: { zh: 'RM', en: 'RM' },
  LW: { zh: 'LW', en: 'LW' },
  RW: { zh: 'RW', en: 'RW' },
  ST: { zh: 'ST', en: 'ST' },
  CF: { zh: 'CF', en: 'CF' },
};

function ratingTier(r: number): { bg: string; text: string } {
  if (r >= 90) return { bg: 'from-amber-500 to-yellow-600', text: 'text-amber-100' };
  if (r >= 85) return { bg: 'from-purple-600 to-fuchsia-700', text: 'text-fuchsia-100' };
  if (r >= 80) return { bg: 'from-sky-600 to-blue-700', text: 'text-sky-100' };
  if (r >= 75) return { bg: 'from-emerald-600 to-green-700', text: 'text-emerald-100' };
  return { bg: 'from-ink-600 to-ink-700', text: 'text-ink-100' };
}

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  showRatings?: boolean;
  hideTier?: boolean;
  showNationality?: boolean;
  compact?: boolean;
}

export default function PlayerCard({
  player,
  onClick,
  selected,
  disabled,
  showRatings = true,
  hideTier = false,
  showNationality = true,
  compact = false,
}: PlayerCardProps) {
  const { lang, t } = useLang();
  const tier = ratingTier(player.rating);
  // When hideTier is on, use a neutral background regardless of rating.
  const headerBg = hideTier ? 'from-ink-600 to-ink-700' : tier.bg;
  const headerText = hideTier ? 'text-ink-100' : tier.text;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -3 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      aria-label={`${player.name} ${player.position} ${player.rating}`}
      className={`relative w-full text-left rounded-xl overflow-hidden border transition-colors ${
        selected
          ? 'border-accent ring-2 ring-accent/40'
          : 'border-ink-700 hover:border-ink-500'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* Rating header */}
      <div className={`bg-gradient-to-r ${headerBg} px-3 py-2.5 flex items-center justify-between`}>
        {showRatings ? (
          <span className={`font-mono font-black text-xl ${headerText}`}>{player.rating}</span>
        ) : (
          <span className="font-mono font-black text-xl text-ink-100/70">??</span>
        )}
        <span className="font-mono text-xs font-bold text-white/80 bg-black/30 px-2 py-1 rounded">
          {POS_SHORT[player.position][lang]}
        </span>
      </div>

      {/* Body */}
      <div className="bg-ink-800 px-3 py-3">
        <div className="font-semibold text-base text-ink-100 leading-tight truncate">
          {lang === 'zh' ? player.nameZh : player.name}
        </div>
        <div className="text-xs text-ink-400 truncate mt-1">
          {showNationality && (lang === 'zh' ? player.nationalityZh : player.nationality)}
          {showNationality && player.number ? ` · #${player.number}` : ''}
        </div>

        {/* Attributes */}
        {showRatings && !compact && (
          <div className="grid grid-cols-6 gap-1 mt-3">
            {(
              [
                ['attrPace', player.attr.pace],
                ['attrShooting', player.attr.shooting],
                ['attrPassing', player.attr.passing],
                ['attrDribbling', player.attr.dribbling],
                ['attrDefending', player.attr.defending],
                ['attrPhysical', player.attr.physical],
              ] as const
            ).map(([key, val]) => (
              <div key={key} className="text-center">
                <div className="text-[10px] text-ink-400 font-mono uppercase">{t(key)}</div>
                <div className="text-sm font-mono font-bold text-ink-100">{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}
