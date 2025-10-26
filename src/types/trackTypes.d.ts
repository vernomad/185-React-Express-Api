// -------- Event Metadata --------
export type ViewMeta = {
  device?: string;
  geo?: string;
  browser?: string;
  os?: string;
  target?: string;
  referrer?: string;
};

export type ClickMeta = {
  location: string;
  device?: string;
  clickTarget: string;
  durationOnPage?: number;
};

export type HoverMeta = {
  element: string;
  duration: number;
};

export type CustomMeta = Record<string, string | number | boolean>;

// -------- Aggregated Stats --------
export type AggregatedStat = {
  views: number;
  authenticated: number;
  uniqueSessions: number;
  meta: {
    device: Record<string, number>;
    geo: Record<string, number>;
    browser: Record<string, number>;
    os: Record<string, number>;
    target: Record<string, number>;
  };
};

// -------- Tracking Event --------
export type TrackingEventType = "click" | "view" | "hover" | "custom";

export type TrackingEvent = {
  id: string;
  type: TrackingEventType;
  slug: string; // e.g. "/home", "button-cta", "hero-section"
  sessionId: string;
  userId?: string | null;
  createdAt: string; // ISO string is safer for file logging
  ip: string;
  meta?: ViewMeta | ClickMeta | HoverMeta | CustomMeta;
  isAuthenticated?: boolean;
};
