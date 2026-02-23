export type MealType = "iftar" | "suhoor" | "both";

export interface StoredEvent {
  id: string;
  name: string;
  mealType: MealType;
  dishParty: boolean;
  dates: string[];
  message?: string;
  hasPlan: boolean;
  createdAt: string;
}

const STORAGE_PREFIX = "ramadan_events_";

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function getEvents(userId: string): StoredEvent[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const data = JSON.parse(raw) as StoredEvent[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveEvent(userId: string, event: StoredEvent): void {
  const events = getEvents(userId);
  const index = events.findIndex((e) => e.id === event.id);
  const next = index >= 0 ? [...events] : [...events, event];
  if (index >= 0) next[index] = event;
  localStorage.setItem(storageKey(userId), JSON.stringify(next));
}

export function getEventById(userId: string, eventId: string): StoredEvent | undefined {
  return getEvents(userId).find((e) => e.id === eventId);
}

export function updateEventHasPlan(userId: string, eventId: string, hasPlan: boolean): void {
  const events = getEvents(userId);
  const event = events.find((e) => e.id === eventId);
  if (!event) return;
  saveEvent(userId, { ...event, hasPlan });
}

export function deleteEvent(userId: string, eventId: string): void {
  const events = getEvents(userId).filter((e) => e.id !== eventId);
  localStorage.setItem(storageKey(userId), JSON.stringify(events));
}

export function getInviteLink(eventId: string): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/invite/${eventId}`;
}

// Optional: Supabase-backed API (use when table exists). Import and call these from app.
export { fetchEvents, saveEventSupabase, deleteEventSupabase, updateEventHasPlanSupabase, getEventByIdSupabase } from "./eventsSupabase";
