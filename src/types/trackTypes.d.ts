/* ---------- Matching backend meta types ---------- */
export type ViewMeta = {
  device?: string;
  geo?: string;
  browser?: string;
  os?: string;
  target?: string;
  referrer?: string;
  durationOnPage?: number; 
};

export type ClickMeta = {
  location: string;
  device?: string;
  clickTarget: string;
  timeSincePageLoad?: number;
};

export type HoverMeta = {
  element: string;
  duration: number;
};

export type GeoData = {
  country: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  timezone?: string;
};

export type CustomMeta = Record<string, string | number | boolean>;

/* ---------- Union for event types ---------- */
export type TrackingEventType = "view" | "click" | "hover" | "custom";

/* ---------- Type mapping for event-specific metadata ---------- */
type EventMetaMap = {
  view: ViewMeta;
  click: ClickMeta;
  hover: HoverMeta;
  custom: CustomMeta;
};

/* ---------- Generic input for a tracking event ---------- */
export type TrackEventInput<T extends TrackingEventType = TrackingEventType> = {
  type: T;
  slug: string;
  meta?: EventMetaMap[T];
};

export type TrackingEvent = {
  type: TrackingEventType;
  slug: string; // e.g. "/home", "button-cta", "hero-section"
  sessionId: string | null;
  userId?: string | null;
  createdAt: string; // ISO string is safer for file logging
  ip?: string;
  geo?: GeoData;
  meta?: ViewMeta | ClickMeta | HoverMeta | CustomMeta;
};