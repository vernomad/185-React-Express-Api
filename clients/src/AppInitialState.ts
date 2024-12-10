import { AppState } from "./types/AppActionTypes";


export default {
    drawerOpen: false,
    preferences: {
        theme: 'dark',
        language: 'en'
      }
} satisfies AppState;