import { Dispatch } from "react";

export type User = {
  id: string;
  username: string;
  image: string;
  roles: string[]; 
  ip?: string;
}

export interface AuthenticatedUser extends User {
  isLoggedIn: true;
}
export interface UnauthenticatedUser extends User {
  isLoggedIn: false;
}

export interface Preferences {
    theme: 'light' | 'dark';
    language: 'en' | 'es' | 'fr' | 'de';
  }

export interface AppState {
    user: AuthenticatedUser | UnauthenticatedUser | null;
    drawerOpen: boolean;
    preferences: Preferences;
}

export enum AppActionType {
    SET_DRAWER_VISIBLE = "SET_DRAWER_VISIBLE",
    SET_PREFERENCES = "SET_PREFERENCES",
    SET_USER = "SET_USER"
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
export interface SetUser {
    type: AppActionType.SET_USER;
    payload: AuthenticatedUser | null;
  }

  export type AppActionTypes = 
  | SetDrawerVisible
  | SetPreferences
  | SetUser

  export type AppDispatch = Dispatch<AppActionTypes>;