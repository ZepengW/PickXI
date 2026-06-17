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
  competitionId: string;
  formationId: string;
  seasonFrom: string;
  seasonTo: string;
  showRatings: boolean;

  // run state (not persisted)
  phase: Phase;
  slots: SquadSlot[];
  draftedIds: string[];
  spin: SpinResult | null;
  spinning: boolean;
  /** Player picked from the squad but not yet placed on the pitch. */
  pendingPlayer: Player | null;
  result: SimResult | null;

  // actions
  setLang: (lang: Lang) => void;
  setCompetition: (id: string) => void;
  setFormation: (id: string) => void;
  setSeasonRange: (from: string, to: string) => void;
  setShowRatings: (show: boolean) => void;

  startDraft: () => void;
  doSpin: (clubId: string, season: string) => void;
  clearSpin: () => void;
  /** Pick a player from the spun squad — enters "placement" mode. */
  pickPlayer: (player: Player) => void;
  /** Place the pending player into a slot. */
  placePlayer: (slotId: string) => void;
  /** Cancel placement (return player to the squad list). */
  cancelPlacement: () => void;
  removePlayer: (slotId: string) => void;

  runSim: () => void;
  reset: () => void;
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

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      lang: 'zh',
      competitionId: 'epl',
      formationId: '433',
      seasonFrom: '1992-93',
      seasonTo: '2024-25',
      showRatings: true,

      phase: 'setup',
      slots: emptySlots('433'),
      draftedIds: [],
      spin: null,
      spinning: false,
      pendingPlayer: null,
      result: null,

      setLang: (lang) => set({ lang }),
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
          spin: null,
          pendingPlayer: null,
        });
      },
      setFormation: (id) =>
        set({
          formationId: id,
          slots: emptySlots(id),
          draftedIds: [],
          spin: null,
          pendingPlayer: null,
        }),
      setSeasonRange: (from, to) => set({ seasonFrom: from, seasonTo: to }),
      setShowRatings: (show) => set({ showRatings: show }),

      startDraft: () =>
        set({
          phase: 'draft',
          slots: emptySlots(get().formationId),
          draftedIds: [],
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

        // Check position fit
        const fit = positionFit(pendingPlayer, slot.position);
        if (!fit) return; // can't place here

        // If player already placed elsewhere, remove from old slot first.
        const newSlots = slots.map((s) => {
          if (s.player?.id === pendingPlayer.id) return { ...s, player: null, positionFit: null };
          if (s.slotId === slotId) return { ...s, player: pendingPlayer, positionFit: fit };
          return s;
        });
        set({
          slots: newSlots,
          draftedIds: [...draftedIds, pendingPlayer.id],
          spin: null,
          pendingPlayer: null,
        });
      },

      cancelPlacement: () => set({ pendingPlayer: null }),

      removePlayer: (slotId) => {
        const { slots, draftedIds } = get();
        const slot = slots.find((s) => s.slotId === slotId);
        if (!slot?.player) return;
        set({
          slots: slots.map((s) =>
            s.slotId === slotId ? { ...s, player: null, positionFit: null } : s,
          ),
          draftedIds: draftedIds.filter((id) => id !== slot.player!.id),
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
          spin: null,
          spinning: false,
          pendingPlayer: null,
          result: null,
        }),

      backToSetup: () => set({ phase: 'setup', result: null }),
    }),
    {
      name: 'dreamxi-store',
      partialize: (s) => ({
        lang: s.lang,
        competitionId: s.competitionId,
        formationId: s.formationId,
        seasonFrom: s.seasonFrom,
        seasonTo: s.seasonTo,
        showRatings: s.showRatings,
      }),
      // Fix hydration: recompute slots to match persisted formationId.
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
