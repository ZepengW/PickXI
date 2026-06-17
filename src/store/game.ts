import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang, Player, SimResult, SquadSlot } from '../types';
import { getFormation, availableSeasons, getCompetition } from '../data';
import { simulateSeason } from '../engine/simulation';

export type Phase = 'setup' | 'draft' | 'sim' | 'results';
export type Difficulty = 'normal' | 'hard';

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
  selectedSlotId: string | null;
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
  selectSlot: (slotId: string | null) => void;
  assignPlayer: (slotId: string, player: Player) => void;
  removePlayer: (slotId: string) => void;

  runSim: () => void;
  reset: () => void;
  backToSetup: () => void;
}

function emptySlots(formationId: string): SquadSlot[] {
  const f = getFormation(formationId);
  return f.slots.map((s) => ({ slotId: s.id, position: s.position, player: null }));
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
      selectedSlotId: null,
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
        });
      },
      setFormation: (id) =>
        set({ formationId: id, slots: emptySlots(id), draftedIds: [], spin: null }),
      setSeasonRange: (from, to) => set({ seasonFrom: from, seasonTo: to }),
      setShowRatings: (show) => set({ showRatings: show }),

      startDraft: () =>
        set({
          phase: 'draft',
          slots: emptySlots(get().formationId),
          draftedIds: [],
          spin: null,
          selectedSlotId: null,
          result: null,
        }),

      doSpin: (clubId, season) =>
        set({ spin: { clubId, season }, spinning: false, selectedSlotId: null }),

      clearSpin: () => set({ spin: null, selectedSlotId: null }),

      selectSlot: (slotId) => set({ selectedSlotId: slotId }),

      assignPlayer: (slotId, player) => {
        const { slots, draftedIds } = get();
        // If player already placed elsewhere, remove from old slot first.
        const newSlots = slots.map((s) => {
          if (s.player?.id === player.id) return { ...s, player: null };
          if (s.slotId === slotId) return { ...s, player };
          return s;
        });
        set({
          slots: newSlots,
          draftedIds: [...draftedIds, player.id],
          spin: null,
          selectedSlotId: null,
        });
      },

      removePlayer: (slotId) => {
        const { slots, draftedIds } = get();
        const slot = slots.find((s) => s.slotId === slotId);
        if (!slot?.player) return;
        set({
          slots: slots.map((s) =>
            s.slotId === slotId ? { ...s, player: null } : s,
          ),
          draftedIds: draftedIds.filter((id) => id !== slot.player!.id),
        });
      },

      runSim: () => {
        const { competitionId, slots } = get();
        const players = slots.map((s) => s.player);
        const result = simulateSeason(competitionId, players);
        set({ phase: 'results', result });
      },

      reset: () =>
        set({
          phase: 'setup',
          slots: emptySlots(get().formationId),
          draftedIds: [],
          spin: null,
          spinning: false,
          selectedSlotId: null,
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
