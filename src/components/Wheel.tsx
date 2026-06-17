import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { ClubSeason } from '../data';
import { getClub } from '../data';
import { useLang } from '../i18n/useLang';

interface WheelProps {
  options: ClubSeason[];
  onLanded: (clubId: string, season: string) => void;
  disabled?: boolean;
}

const TILE_W = 132; // px, includes the 8px gap that follows each tile
const GAP = 8; // px, gap-2
const TILE_CONTENT_W = TILE_W - GAP; // 124px, actual tile width
const COPIES = 5; // repeat the list so the strip is long enough to spin within

export default function Wheel({ options, onLanded, disabled }: WheelProps) {
  const { lang, t } = useLang();
  const [spinning, setSpinning] = useState(false);
  const [offset, setOffset] = useState(0);
  const [snapping, setSnapping] = useState(false);
  const targetRef = useRef<number | null>(null);
  const offsetRef = useRef(0); // tracks the live animated offset
  const viewportRef = useRef<HTMLDivElement>(null);

  const period = options.length * TILE_W;

  // Build a repeated strip so the spin can travel a long distance.
  const strip = useMemo(() => {
    if (options.length === 0) return [];
    return Array.from({ length: COPIES }, (_, c) =>
      options.map((o, i) => ({ ...o, key: `${c}-${i}` })),
    ).flat();
  }, [options]);

  function spin() {
    if (spinning || strip.length === 0 || disabled || period === 0) return;
    setSpinning(true);
    setSnapping(false);

    // Measure the actual viewport width so we can align the target tile's
    // centre with the marker (which sits at the viewport's horizontal centre).
    const viewportWidth = viewportRef.current?.offsetWidth ?? TILE_W;
    const viewportCentre = viewportWidth / 2;

    // Pick a random target tile index within the strip.
    const targetIdx = Math.floor(Math.random() * options.length) + options.length * 2;
    targetRef.current = targetIdx;

    // Tile i's left edge in strip coords = i * TILE_W (each tile occupies
    // TILE_CONTENT_W px plus GAP px of gap after it).
    // Tile i's centre = i * TILE_W + TILE_CONTENT_W / 2.
    const targetTileCentre = targetIdx * TILE_W + TILE_CONTENT_W / 2;

    // We want: targetTileCentre + offset = viewportCentre
    // (because the strip is translated by `offset` px, and the marker is at
    // viewportCentre). Solve for offset:
    //   offset = viewportCentre - targetTileCentre
    const baseTarget = viewportCentre - targetTileCentre;

    // Always move forward (more negative) than the current offset: add full loops.
    const current = offsetRef.current;
    let target = baseTarget;
    while (target > current - period) {
      target -= period;
    }
    offsetRef.current = target;
    setOffset(target);
  }

  function handleRest() {
    if (spinning) {
      setSpinning(false);
      const idx = targetRef.current;
      if (idx != null) {
        const landed = strip[idx];
        if (landed) onLanded(landed.clubId, landed.season);
      }
      // Snap the offset back into the first period range so future spins stay
      // within the strip. This is instant (snapping=true → duration 0) and
      // visually identical because the strip repeats.
      const snapped = ((offsetRef.current % period) + period) % period - period;
      offsetRef.current = snapped;
      setSnapping(true);
      setOffset(snapped);
      return;
    }
    if (snapping) setSnapping(false);
  }

  if (options.length === 0) {
    return (
      <div className="text-center py-12 text-ink-400 text-sm">
        {lang === 'zh' ? '当前筛选下没有可选俱乐部-赛季。' : 'No club-seasons match the current filter.'}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Marker — sits at the viewport's horizontal centre */}
      <div className="relative mx-auto" style={{ maxWidth: TILE_W }}>
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 z-20 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-accent" />
      </div>

      {/* Strip viewport */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden rounded-xl border border-ink-700 bg-ink-900/60 py-4"
      >
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-900 to-transparent z-10 pointer-events-none" />
        {/* Centre line — matches the marker position exactly */}
        <div className="absolute left-1/2 -translate-x-1/2 inset-y-2 w-px bg-accent/40 z-10 pointer-events-none" />

        <motion.div
          className="flex"
          style={{ gap: `${GAP}px` }}
          animate={{ x: offset }}
          transition={
            snapping
              ? { duration: 0 }
              : { duration: 4.4, ease: [0.12, 0.8, 0.16, 1] }
          }
          onAnimationComplete={handleRest}
        >
          {strip.map((item) => {
            const club = getClub(item.clubId);
            if (!club) return null;
            return (
              <div
                key={item.key}
                className="flex-shrink-0 rounded-lg border border-ink-700 flex flex-col items-center justify-center text-center px-3 py-3"
                style={{
                  width: TILE_CONTENT_W,
                  background: `linear-gradient(160deg, ${club.color}22, var(--color-ink-800) 70%)`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full mb-2 flex items-center justify-center font-display font-black text-xs text-white"
                  style={{ background: club.color }}
                >
                  {lang === 'zh' ? club.shortNameZh.slice(0, 2) : club.shortName.slice(0, 3)}
                </div>
                <div className="text-xs font-semibold text-ink-100 leading-tight">
                  {lang === 'zh' ? club.nameZh : club.name}
                </div>
                <div className="text-[10px] font-mono text-ink-400 mt-1">{item.season}</div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={spinning || disabled}
        className="mt-5 w-full sm:w-auto mx-auto block px-8 py-3.5 bg-accent text-ink-950 font-bold rounded-full hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {spinning ? t('spinning') : t('spin')}
      </button>
    </div>
  );
}
