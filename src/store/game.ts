import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty, Lang, Player, SimResult, SquadSlot } from '../types';
import { DIFFICULTY_CONFIGS } from '../types';
import { getFormation, availableSeasons, getCompetition } from '../data';
import { simulateSeason, positionFit, positionPenalty } from '../engine/simulation';

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
  difficulty: Difficulty;
  /** Opponent season — if set, sim uses all clubs from this season as opponents. */
  opponentSeason: string;
  /** User's team name. */
  teamName: string;

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
  setDifficulty: (d: Difficulty) => void;
  setOpponentSeason: (s: string) => void;
  setTeamName: (name: string) => void;

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
  /** Move a player from one slot to another (swap if target occupied). */
  movePlayer: (fromSlotId: string, toSlotId: string) => void;

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
    positionPenalty: 0,
  }));
}

/**
 * Try to auto-place drafted players into a new formation's slots.
 * Any player can play any position — players without a primary/secondary slot
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
    positionPenalty: 0,
  }));
  const bench: Player[] = [];

  const sorted = [...players].sort((a, b) => b.rating - a.rating);

  for (const player of sorted) {
    let placed = false;
    for (const slot of slots) {
      if (slot.player) continue;
      if (positionFit(player, slot.position) === 'primary') {
        slot.player = player;
        slot.positionFit = 'primary';
        slot.positionPenalty = 0;
        placed = true;
        break;
      }
    }
    if (placed) continue;

    for (const slot of slots) {
      if (slot.player) continue;
      if (positionFit(player, slot.position) === 'secondary') {
        slot.player = player;
        slot.positionFit = 'secondary';
        slot.positionPenalty = positionPenalty(player, slot.position);
        placed = true;
        break;
      }
    }
    if (placed) continue;

    for (const slot of slots) {
      if (slot.player) continue;
      slot.player = player;
      slot.positionFit = 'other';
      slot.positionPenalty = positionPenalty(player, slot.position);
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
      difficulty: 'easy',
      opponentSeason: '',
      teamName: '',

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
          opponentSeason: to,
          slots: emptySlots(get().formationId),
          draftedIds: [],
          bench: [],
          spin: null,
          pendingPlayer: null,
        });
      },
      setFormation: (id) => {
        const state = get();
        const placedPlayers = state.slots
          .filter((s) => s.player !== null)
          .map((s) => s.player!) as Player[];
        const allPlayers = [...placedPlayers, ...state.bench];

        if (allPlayers.length === 0) {
          set({ formationId: id, slots: emptySlots(id) });
          return;
        }

        const { slots, bench } = autoPlace(id, allPlayers);
        set({
          formationId: id,
          slots,
          bench,
          pendingPlayer: null,
        });
      },
      setSeasonRange: (from, to) => set({ seasonFrom: from, seasonTo: to }),
      setDifficulty: (d) => set({ difficulty: d }),
      setOpponentSeason: (s) => set({ opponentSeason: s }),
      setTeamName: (name) => set({ teamName: name }),

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

        const fit = positionFit(pendingPlayer, slot.position);
        const penalty = positionPenalty(pendingPlayer, slot.position);

        const newSlots = slots.map((s) => {
          if (s.player?.id === pendingPlayer.id) return { ...s, player: null, positionFit: null, positionPenalty: 0 };
          if (s.slotId === slotId) return { ...s, player: pendingPlayer, positionFit: fit, positionPenalty: penalty };
          return s;
        });

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
            s.slotId === slotId ? { ...s, player: null, positionFit: null, positionPenalty: 0 } : s,
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
            s.slotId === slotId ? { ...s, player: null, positionFit: null, positionPenalty: 0 } : s,
          ),
          bench: [...bench, player],
        });
      },

      placeBenchPlayer: (player, slotId) => {
        const { slots, bench } = get();
        const slot = slots.find((s) => s.slotId === slotId);
        if (!slot) return;

        const fit = positionFit(player, slot.position);
        const penalty = positionPenalty(player, slot.position);

        const displaced = slot.player;
        const newBench = [
          ...bench.filter((p) => p.id !== player.id),
          ...(displaced ? [displaced] : [])
        ];

        set({
          slots: slots.map((s) =>
            s.slotId === slotId ? { ...s, player, positionFit: fit, positionPenalty: penalty } : s,
          ),
          bench: newBench,
        });
      },

      movePlayer: (fromSlotId, toSlotId) => {
        const { slots } = get();
        const fromSlot = slots.find((s) => s.slotId === fromSlotId);
        const toSlot = slots.find((s) => s.slotId === toSlotId);
        if (!fromSlot?.player || !toSlot) return;

        const movingPlayer = fromSlot.player;
        const displacedPlayer = toSlot.player;

        // Calculate new fits and penalties
        const movingFit = positionFit(movingPlayer, toSlot.position);
        const movingPenalty = positionPenalty(movingPlayer, toSlot.position);

        const newSlots = slots.map((s) => {
          if (s.slotId === fromSlotId) {
            if (displacedPlayer) {
              const dispFit = positionFit(displacedPlayer, fromSlot.position);
              const dispPenalty = positionPenalty(displacedPlayer, fromSlot.position);
              return { ...s, player: displacedPlayer, positionFit: dispFit, positionPenalty: dispPenalty };
            }
            return { ...s, player: null, positionFit: null, positionPenalty: 0 };
          }
          if (s.slotId === toSlotId) {
            return { ...s, player: movingPlayer, positionFit: movingFit, positionPenalty: movingPenalty };
          }
          return s;
        });

        set({ slots: newSlots });
      },

      runSim: () => {
        const { competitionId, slots, opponentSeason } = get();
        const result = simulateSeason(competitionId, slots, opponentSeason || undefined, get().teamName || undefined);
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
        localStorage.removeItem('pick-xi-store');
        set({
          lang: 'zh',
          theme: 'dark',
          competitionId: 'epl',
          formationId: '433',
          seasonFrom: '1992-93',
          seasonTo: '2024-25',
          difficulty: 'easy',
          opponentSeason: '',
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
      name: 'pick-xi-store',
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
        competitionId: s.competitionId,
        formationId: s.formationId,
        seasonFrom: s.seasonFrom,
        seasonTo: s.seasonTo,
        difficulty: s.difficulty,
        opponentSeason: s.opponentSeason,
        teamName: s.teamName,
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

/** Get the difficulty config for the current difficulty level. */
export function difficultyConfig(d: Difficulty) {
  return DIFFICULTY_CONFIGS[d];
}
