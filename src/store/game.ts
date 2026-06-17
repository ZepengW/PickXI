import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang, Player, SimResult, SquadSlot } from '../types';
import { getFormation, availableSeasons, getCompetition } from '../data';
import { simulateSeason, positionFit } from '../engine/simulation';

export type Phase = 'setup' | 'draft' | 'sim' | 'results';

interface SpinResult {
  clubId: string;
  season: string;
}

interface GameState {
  // settings (persisted)
  lang: Lang;
  theme: 'light' | 'dark';
  competitionId: string;
  formationId: string;
  seasonFrom: string;
  seasonTo: string;
  showRatings: boolean;
  hideTier: boolean;

  // run state (not persisted)
  phase: Phase;
  slots: SquadSlot[];
  draftedIds: string[];
  /** Drafted players not currently placed in any slot (bench). */
  bench: Player[];
  spin: SpinResult | null;
  spinning: boolean;
  pendingPlayer: Player | null;
  result: SimResult | null;

  // actions
  setLang: (lang: Lang) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCompetition: (id: string) => void;
  setFormation: (id: string) => void;
  setSeasonRange: (from: string, to: string) => void;
  setShowRatings: (show: boolean) => void;
  setHideTier: (hide: boolean) => void;

  startDraft: () => void;
  doSpin: (clubId: string, season: string) => void;
  clearSpin: () => void;
  pickPlayer: (player: Player) => void;
  placePlayer: (slotId: string) => void;
  cancelPlacement: () => void;
  removePlayer: (slotId: string) => void;
  /** Move a placed player back to the bench. */
  unplacePlayer: (slotId: string) => void;
  /** Place a bench player onto a slot. */
  placeBenchPlayer: (player: Player, slotId: string) => void;

  runSim: () => void;
  reset: () => void;
  restartAll: () => void;
  backToSetup: () => void;
}

function emptySlots(formationId: string): SquadSlot[] {
  const f = getFormation(formationId);
  return f.slots.map((s) => ({
    slotId: s.id,
    position: s.position,
    player: null,
    positionFit: null,
  }));
}

/**
 * Try to auto-place drafted players into a new formation's slots.
 * Returns the new slots and any players that couldn't be placed (bench).
 * Now any player can play any position — players without a primary/secondary slot
 * will be placed in remaining empty slots as 'other'.
 */
function autoPlace(
  formationId: string,
  players: Player[],
): { slots: SquadSlot[]; bench: Player[] } {
  const f = getFormation(formationId);
  const slots: SquadSlot[] = f.slots.map((s) => ({
    slotId: s.id,
    position: s.position,
    player: null,
    positionFit: null,
  }));
  const bench: Player[] = [];

  // Sort players by rating descending — try to place best players first.
  const sorted = [...players].sort((a, b) => b.rating - a.rating);

  for (const player of sorted) {
    // Try primary position first.
    let placed = false;
    for (const slot of slots) {
      if (slot.player) continue;
      if (positionFit(player, slot.position) === 'primary') {
        slot.player = player;
        slot.positionFit = 'primary';
        placed = true;
        break;
      }
    }
    if (placed) continue;

    // Try secondary position.
    for (const slot of slots) {
      if (slot.player) continue;
      if (positionFit(player, slot.position) === 'secondary') {
        slot.player = player;
        slot.positionFit = 'secondary';
        placed = true;
        break;
      }
    }
    if (placed) continue;

    // Fall back to any empty slot — any player can play any position.
    for (const slot of slots) {
      if (slot.player) continue;
      slot.player = player;
      slot.positionFit = 'other';
      placed = true;
      break;
    }
    if (!placed) bench.push(player);
  }

  return { slots, bench };
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      lang: 'zh',
      theme: 'dark',
      competitionId: 'epl',
      formationId: '433',
      seasonFrom: '1992-93',
      seasonTo: '2024-25',
      showRatings: true,
      hideTier: false,

      phase: 'setup',
      slots: emptySlots('433'),
      draftedIds: [],
      bench: [],
      spin: null,
      spinning: false,
      pendingPlayer: null,
      result: null,

      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      setCompetition: (id) => {
        const seasons = availableSeasons(id);
        const comp = getCompetition(id);
        const from = seasons[0] ?? comp?.seasons[0] ?? '1992-93';
        const to = seasons[seasons.length - 1] ?? comp?.seasons[comp.seasons.length - 1] ?? '2024-25';
        set({
          competitionId: id,
          seasonFrom: from,
          seasonTo: to,
          slots: emptySlots(get().formationId),
          draftedIds: [],
          bench: [],
          spin: null,
          pendingPlayer: null,
        });
      },
      setFormation: (id) => {
        const state = get();
        // Collect all currently placed players.
        const placedPlayers = state.slots
          .filter((s) => s.player !== null)
          .map((s) => s.player!) as Player[];
        // Combine with bench players.
        const allPlayers = [...placedPlayers, ...state.bench];

        if (allPlayers.length === 0) {
          // No players drafted — just switch formation.
          set({ formationId: id, slots: emptySlots(id) });
          return;
        }

        // Auto-place players into the new formation.
        const { slots, bench } = autoPlace(id, allPlayers);
        set({
          formationId: id,
          slots,
          bench,
          pendingPlayer: null,
        });
      },
      setSeasonRange: (from, to) => set({ seasonFrom: from, seasonTo: to }),
      setShowRatings: (show) => set({ showRatings: show }),
      setHideTier: (hide) => set({ hideTier: hide }),

      startDraft: () =>
        set({
          phase: 'draft',
          slots: emptySlots(get().formationId),
          draftedIds: [],
          bench: [],
          spin: null,
          pendingPlayer: null,
          result: null,
        }),

      doSpin: (clubId, season) =>
        set({ spin: { clubId, season }, spinning: false, pendingPlayer: null }),

      clearSpin: () => set({ spin: null, pendingPlayer: null }),

      pickPlayer: (player) => set({ pendingPlayer: player }),

      placePlayer: (slotId) => {
        const { slots, draftedIds, pendingPlayer } = get();
        if (!pendingPlayer) return;

        const slot = slots.find((s) => s.slotId === slotId);
        if (!slot) return;

        // Any player can play any position — only the score differs.
        const fit = positionFit(pendingPlayer, slot.position);

        // If player already placed elsewhere, remove from old slot first.
        const newSlots = slots.map((s) => {
          if (s.player?.id === pendingPlayer.id) return { ...s, player: null, positionFit: null };
          if (s.slotId === slotId) return { ...s, player: pendingPlayer, positionFit: fit };
          return s;
        });

        // If the target slot had a player, they go to the bench.
        const displaced = slot.player;
        const newBench = displaced ? [...get().bench, displaced] : get().bench;

        set({
          slots: newSlots,
          draftedIds: [...draftedIds, pendingPlayer.id],
          bench: newBench,
          spin: null,
          pendingPlayer: null,
        });
      },

      cancelPlacement: () => set({ pendingPlayer: null }),

      removePlayer: (slotId) => {
        const { slots, draftedIds, bench } = get();
        const slot = slots.find((s) => s.slotId === slotId);
        if (!slot?.player) return;
        const removed = slot.player;
        set({
          slots: slots.map((s) =>
            s.slotId === slotId ? { ...s, player: null, positionFit: null } : s,
          ),
          draftedIds: draftedIds.filter((id) => id !== removed!.id),
          bench,
        });
      },

      unplacePlayer: (slotId) => {
        const { slots, bench } = get();
        const slot = slots.find((s) => s.slotId === slotId);
        if (!slot?.player) return;
        const player = slot.player;
        set({
          slots: slots.map((s) =>
            s.slotId === slotId ? { ...s, player: null, positionFit: null } : s,
          ),
          bench: [...bench, player],
        });
      },

      placeBenchPlayer: (player, slotId) => {
        const { slots, bench } = get();
        const slot = slots.find((s) => s.slotId === slotId);
        if (!slot) return;

        // Any player can play any position — only the score differs.
        const fit = positionFit(player, slot.position);

        // If target slot had a player, they go to bench.
        const displaced = slot.player;
        const newBench = [
          ...bench.filter((p) => p.id !== player.id),
          ...(displaced ? [displaced] : [])
        ];

        set({
          slots: slots.map((s) =>
            s.slotId === slotId ? { ...s, player, positionFit: fit } : s,
          ),
          bench: newBench,
        });
      },

      runSim: () => {
        const { competitionId, slots } = get();
        const result = simulateSeason(competitionId, slots);
        set({ phase: 'results', result });
      },

      reset: () =>
        set({
          phase: 'setup',
          slots: emptySlots(get().formationId),
          draftedIds: [],
          bench: [],
          spin: null,
          spinning: false,
          pendingPlayer: null,
          result: null,
        }),

      restartAll: () => {
        // Clear persisted state and reset to defaults.
        localStorage.removeItem('dreamxi-store');
        set({
          lang: 'zh',
          theme: 'dark',
          competitionId: 'epl',
          formationId: '433',
          seasonFrom: '1992-93',
          seasonTo: '2024-25',
          showRatings: true,
          hideTier: false,
          phase: 'setup',
          slots: emptySlots('433'),
          draftedIds: [],
          bench: [],
          spin: null,
          spinning: false,
          pendingPlayer: null,
          result: null,
        });
      },

      backToSetup: () => set({ phase: 'setup', result: null }),
    }),
    {
      name: 'dreamxi-store',
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
        competitionId: s.competitionId,
        formationId: s.formationId,
        seasonFrom: s.seasonFrom,
        seasonTo: s.seasonTo,
        showRatings: s.showRatings,
        hideTier: s.hideTier,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.slots = emptySlots(state.formationId);
        }
      },
    },
  ),
);

// Selector helpers
export function filledCount(slots: SquadSlot[]): number {
  return slots.filter((s) => s.player !== null).length;
}

export function isComplete(slots: SquadSlot[]): boolean {
  return filledCount(slots) === 11;
}
