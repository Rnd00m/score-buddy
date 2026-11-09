import type { Game, PlayerProfile } from "~/types/global";
import type { UserGameHistoryRow } from "~/composables/useUserGamesHistoryQuery";

export interface LastKnownUser {
  id: string;
  email?: string;
}

// Entries are tagged with the account that created them so that signing in
// with another account on this device never uploads them to the wrong one.
interface PendingGame {
  ownerId: string;
  game: Game;
}

interface PendingProfile {
  ownerId: string;
  profile: PlayerProfile;
}

export const useSyncQueueStore = defineStore('syncQueue', {
  state: () => (
    {
      lastKnownUser: null as LastKnownUser | null,
      pendingGames: [] as PendingGame[],
      pendingProfiles: [] as PendingProfile[],
      historyCache: {} as Record<string, UserGameHistoryRow[]>,
    }
  ),
  persist: {
    key: 'syncQueueStore',
    storage: piniaPluginPersistedstate.localStorage()
  },
  getters: {
    hasPendingForCurrentUser: (state): boolean => {
      const userId = state.lastKnownUser?.id;

      return state.pendingGames.some((entry) => entry.ownerId === userId)
        || state.pendingProfiles.some((entry) => entry.ownerId === userId);
    },
  },
  actions: {
    rememberUser(user: LastKnownUser) {
      this.lastKnownUser = user;
    },
    forgetUser() {
      if (this.lastKnownUser) {
        delete this.historyCache[this.lastKnownUser.id];
      }

      this.lastKnownUser = null;
    },
    enqueueGame(ownerId: string, game: Game) {
      this.removePendingGame(ownerId, game.uuid);
      this.pendingGames.push({ ownerId, game: JSON.parse(JSON.stringify(game)) });
    },
    removePendingGame(ownerId: string, uuid: string) {
      this.pendingGames = this.pendingGames.filter((entry) => entry.ownerId !== ownerId || entry.game.uuid !== uuid);
    },
    enqueueProfile(ownerId: string, profile: PlayerProfile) {
      this.removePendingProfile(ownerId, profile.name);
      this.pendingProfiles.push({ ownerId, profile: JSON.parse(JSON.stringify(profile)) });
    },
    removePendingProfile(ownerId: string, name: string) {
      this.pendingProfiles = this.pendingProfiles.filter((entry) => entry.ownerId !== ownerId || entry.profile.name !== name);
    },
    setHistoryCache(ownerId: string, rows: UserGameHistoryRow[]) {
      this.historyCache[ownerId] = rows;
    },
  }
})
