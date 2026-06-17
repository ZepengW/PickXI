import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player, Position } from '../types';
import { getClub } from '../data';
import { useLang } from '../i18n/useLang';
import PlayerCard from './PlayerCard';

interface SquadPickerProps {
  players: Player[];
  selectedSlotPosition: Position | null;
  onPick: (player: Player) => void;
  draftedIds: Set<string>;
  showRatings: boolean;
  clubId: string;
  season: string;
}

export default function SquadPicker({
  players,
  selectedSlotPosition,
  onPick,
  draftedIds,
  showRatings,
  clubId,
  season,
}: SquadPickerProps) {
  const { lang, t } = useLang();
  const club = getClub(clubId);

  const sorted = useMemo(() => {
    const list = [...players].sort((a, b) => b.rating - a.rating);
    if (!selectedSlotPosition) return list.map((p) => ({ player: p, fit: true }));
    return list.map((p) => ({
      player: p,
      fit: p.positions.includes(selectedSlotPosition),
    }));
  }, [players, selectedSlotPosition]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-xs text-white"
          style={{ background: club?.color ?? '#333' }}
        >
          {club ? (lang === 'zh' ? club.shortNameZh.slice(0, 2) : club.shortName.slice(0, 3)) : ''}
        </div>
        <div>
          <div className="font-display font-bold text-lg text-white">
            {club ? (lang === 'zh' ? club.nameZh : club.name) : ''}
          </div>
          <div className="text-xs font-mono text-ink-400">{season}</div>
        </div>
      </div>

      {selectedSlotPosition && (
        <div className="mb-3 text-xs text-ink-300">
          {t('pickPlayer')}{' '}
          <span className="font-mono font-bold text-accent">{selectedSlotPosition}</span>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="py-8 text-center text-sm text-ink-400">{t('noPlayers')}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto overscroll-contain pr-1">
          <AnimatePresence mode="popLayout">
            {sorted.map(({ player, fit }) => {
              const drafted = draftedIds.has(player.id);
              return (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={fit ? '' : 'opacity-60'}
                >
                  <PlayerCard
                    player={player}
                    showRatings={showRatings}
                    disabled={drafted}
                    onClick={() => !drafted && onPick(player)}
                  />
                  {!fit && (
                    <div className="text-[9px] text-amber-400/70 font-mono text-center mt-1">
                      {lang === 'zh' ? '位置不符' : 'out of position'}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
