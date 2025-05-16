import { AppState } from "./types/AppActionTypes";


export default {
    user: null,
    drawerOpen: false,
    preferences: {
        theme: 'dark',
        language: 'en'
      }
} satisfies AppState;