import type { Color, PlayerProfile } from "~/types/global";
import { v4 as uuidv4 } from 'uuid';

export const usePlayerProfilesStore = defineStore('playerProfiles', {
  state: () => (
    {
      profiles: [] as PlayerProfile[]
    }
  ),
  persist: {
    key: 'playerProfilesStore',
    storage: piniaPluginPersistedstate.localStorage()
  },
  actions: {
    addProfile(name: string, color: Color): PlayerProfile {
      const profile: PlayerProfile = {
        id: uuidv4(),
        name,
        color
      };

      this.profiles.push(profile);

      return profile;
    },
    updateProfile(id: string, name: string, color: Color) {
      const profile = this.profiles.find((profile) => profile.id === id);

      if (!profile) return;

      profile.name = name;
      profile.color = color;
    },
    removeProfile(id: string) {
      this.profiles = this.profiles.filter((profile) => profile.id !== id);
    }
  }
})
