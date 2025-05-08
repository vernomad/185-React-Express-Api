import { Dispatch } from "react";

export interface Preferences {
    theme: 'light' | 'dark';
    language: 'en' | 'es' | 'fr' | 'de';
  }

export interface AppState {
    drawerOpen: boolean;
    preferences: Preferences;
}

export enum AppActionType {
    SET_DRAWER_VISIBLE = "SET_DRAWER_VISIBLE",
    SET_PREFERENCES = "SET_PREFERENCES",
}

export interface AppAction {
    type: AppActionType;
    payload: boolean | Preferences;
}

export interface SetDrawerVisible extends AppAction {
    type: AppActionType.SET_DRAWER_VISIBLE;
    payload: boolean;
  }

export interface SetPreferences  {
    type: AppActionType.SET_PREFERENCES;
    payload: Preferences;
  }

  export type AppActionTypes = 
  | SetDrawerVisible
  | SetPreferences

  export type AppDispatch = Dispatch<AppActionTypes>;