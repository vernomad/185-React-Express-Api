import { AppState, Preferences } from "./types/AppActionTypes";

export default {
    user: null,
    drawerOpen: false,
    preferences: {
        theme: 'dark',
        language: 'en'
      } as Preferences,
} satisfies AppState;