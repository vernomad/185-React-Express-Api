import { AppActionType, AppDispatch, Preferences } from "./types/AppActionTypes";


export const initializeState = async (dispatch: AppDispatch) => {
  let preferences: Preferences = {
    theme: "dark",
    language: "en",
  };

  const stored = localStorage.getItem("preferences");

  if (stored) {
    try {
      preferences = {
        ...preferences,
        ...JSON.parse(stored),
      };
    } catch (error) {
      console.error("Failed to parse preferences", error);
    }
  }

  requestAnimationFrame(() => {
    dispatch({
      type: AppActionType.SET_PREFERENCES,
      payload: preferences,
    });
  });

  return { preferences };
};