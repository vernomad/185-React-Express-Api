import { AppActionType, AppDispatch, Preferences } from "./types/AppActionTypes";


export const initializeState = (dispatch: AppDispatch) => {
    const preferences: Preferences = {
        theme: localStorage.getItem("185Theme") as 'dark' | 'light' || 'light',
        language: 'en'
    }
    dispatch({ type: AppActionType.SET_PREFERENCES, payload: preferences})
}