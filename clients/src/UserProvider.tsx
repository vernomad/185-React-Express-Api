// UserProvider.tsx
import { useState, useEffect, ReactNode, useReducer, useCallback, useMemo, startTransition } from 'react';
import { UserContext } from './UserContext'; 
import { AppState, AppActionType, AppActionTypes } from './types/AppActionTypes';
import AppInitialState from './AppInitialState';
import { initializeState } from './initializeState';

interface UserProviderProps {
  children: ReactNode;
}

function AppReducer(
  state: AppState,
  action: AppActionTypes,
): AppState {
  switch (action.type) {
    case AppActionType.SET_DRAWER_VISIBLE: 
    return {
      ...state,
      drawerOpen: action.payload as boolean,
    };
    case AppActionType.SET_PREFERENCES:
      return { ...state, preferences: action.payload };

    case AppActionType.SET_USER:
      return { ...state, user: action.payload };

  default:
    return state;
 }
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = useReducer(AppReducer, AppInitialState, (initial) => {

     const storedUser = localStorage.getItem("user");
    return storedUser
      ? { ...initial, user: JSON.parse(storedUser) }
      : initial;
  });

  const [isInitialized, setIsInitialized] = useState(false);

   const [loading, setLoading] = useState<boolean>(true);

   setTimeout(() => {
    setLoading(false)
   }, 0)

  /* ----------------------------- */
  /* Initial bootstrap             */
  /* ----------------------------- */

  useEffect(() => {
  console.log("APP PROVIDER");
    let mounted = true;

    (async () => {
      try {
      const result = await initializeState(dispatch);
       console.log(
      "INIT RESULT",
      result.preferences.theme
       );
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        console.log("App initialized");
        if (mounted) setIsInitialized(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleDrawer = useCallback(() => {
    dispatch({
      type: AppActionType.SET_DRAWER_VISIBLE,
      payload: !state.drawerOpen
    });
  }, [state.drawerOpen])

   const setTheme = useCallback(
    (theme: "dark" | "light") => {
      startTransition(() => {
        dispatch({
          type: AppActionType.SET_PREFERENCES,
          payload: { ...state.preferences, theme },
        });
      });
    },
    [state.preferences],
  );

   const toggleTheme = useCallback(() => {
    setTheme(state.preferences.theme === "light" ? "dark" : "light");
  }, [state.preferences.theme, setTheme]);

  //  const setUser = (user: AuthenticatedUser | null) => {
  //   dispatch({ type: AppActionType.SET_USER, payload: user });
  // };

  useEffect(() => {
  if (!isInitialized) return;

  const persist = async () => {
    const prefs = state.preferences;

    try {
     localStorage.setItem("preferences", JSON.stringify(prefs));
    } catch (err) {
      console.error(err);
    }
  };

  persist();
}, [isInitialized, state.preferences]);

  useEffect(() => {
  if (!isInitialized) return;

  const isDark = state.preferences.theme === "dark";

  const html = document.documentElement;
  html.classList.toggle("dark", isDark);
  html.classList.toggle("light", !isDark);
}, [isInitialized, state.preferences.theme]);

const contextValue = useMemo(() => ({ 
  state, 
  dispatch, 
  toggleDrawer,
  setTheme,
  toggleTheme,
   }), [state, dispatch, toggleDrawer, setTheme, toggleTheme]);


  if (loading) {
    return <div className='container'>Loading...</div>;
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
