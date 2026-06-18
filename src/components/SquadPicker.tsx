import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player } from '../types';
import { getClub } from '../data';
import { useLang } from '../i18n/useLang';
import PlayerCard from './PlayerCard';

interface SquadPickerProps {
  players: Player[];
  onPick: (player: Player) => void;
  draftedIds: Set<string>;
  showRatings: boolean;
  hideTier: boolean;
  showPosition?: boolean;
  showNationality?: boolean;
  clubId: string;
  season: string;
}

export default function SquadPicker({
  players,
  onPick,
  draftedIds,
  showRatings,
  hideTier,
  showPosition = true,
  showNationality = true,
  clubId,
  season,
}: SquadPickerProps) {
  const { lang, t } = useLang();
  const club = getClub(clubId);

  const sorted = useMemo(
    () => [...players].sort((a, b) => b.rating - a.rating),
    [players],
  );

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
          <div className="font-display font-bold text-lg text-ink-100">
            {club ? (lang === 'zh' ? club.nameZh : club.name) : ''}
          </div>
          <div className="text-xs font-mono text-ink-400">{season}</div>
        </div>
      </div>

      <div className="mb-3 text-xs text-ink-300">
        {lang === 'zh'
          ? '选择一名球员，然后将他放到球场上任意位置（不同位置有不同分数加成）。'
          : 'Pick a player, then place them anywhere on the pitch (different positions give different score bonuses).'}
      </div>

      {sorted.length === 0 ? (
        <div className="py-8 text-center text-sm text-ink-400">{t('noPlayers')}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[420px] overflow-y-auto overscroll-contain pr-1">
          <AnimatePresence mode="popLayout">
            {sorted.map((player) => {
              const drafted = draftedIds.has(player.id);
              return (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <PlayerCard
                    player={player}
                    showRatings={showRatings}
                    hideTier={hideTier}
                    showPosition={showPosition}
                    showNationality={showNationality}
                    disabled={drafted}
                    onClick={() => !drafted && onPick(player)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
