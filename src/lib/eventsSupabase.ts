import { supabase } from "@/integrations/supabase/client";
import type { StoredEvent } from "./events";

function rowToEvent(r: { id: string; name: string; meal_type: string; dish_party: boolean; dates: string[]; message: string | null; has_plan: boolean; created_at: string }): StoredEvent {
  return {
    id: r.id,
    name: r.name,
    mealType: r.meal_type as StoredEvent["mealType"],
    dishParty: r.dish_party,
    dates: Array.isArray(r.dates) ? r.dates : [],
    message: r.message ?? undefined,
    hasPlan: r.has_plan,
    createdAt: r.created_at,
  };
}

export async function fetchEvents(userId: string): Promise<StoredEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("id, name, meal_type, dish_party, dates, message, has_plan, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToEvent);
}

export async function saveEventSupabase(userId: string, event: StoredEvent): Promise<void> {
  const { error } = await supabase.from("events").upsert(
    {
      id: event.id,
      user_id: userId,
      name: event.name,
      meal_type: event.mealType,
      dish_party: event.dishParty,
      dates: event.dates,
      message: event.message ?? null,
      has_plan: event.hasPlan,
    },
    { onConflict: "id" }
  );
  if (error) throw error;
}

export async function deleteEventSupabase(userId: string, eventId: string): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", eventId).eq("user_id", userId);
  if (error) throw error;
}

export async function updateEventHasPlanSupabase(userId: string, eventId: string, hasPlan: boolean): Promise<void> {
  const { error } = await supabase.from("events").update({ has_plan: hasPlan }).eq("id", eventId).eq("user_id", userId);
  if (error) throw error;
}

export async function getEventByIdSupabase(userId: string, eventId: string): Promise<StoredEvent | null> {
  const { data, error } = await supabase
    .from("events")
    .select("id, name, meal_type, dish_party, dates, message, has_plan, created_at")
    .eq("user_id", userId)
    .eq("id", eventId)
    .single();
  if (error || !data) return null;
  return rowToEvent(data);
}

/** Fetch event by id for public invite page (no auth). Requires RLS policy "Allow public read for invite". */
export async function getEventByIdPublic(eventId: string): Promise<StoredEvent | null> {
  const { data, error } = await supabase
    .from("events")
    .select("id, name, meal_type, dish_party, dates, message, has_plan, created_at")
    .eq("id", eventId)
    .single();
  if (error || !data) return null;
  return rowToEvent(data);
}

/** Guest response from the invite form */
export interface EventResponse {
  id: string;
  eventId: string;
  guestName: string;
  chosenDate: string;
  dish: string | null;
  createdAt: string;
}

function rowToResponse(r: { id: string; event_id: string; guest_name: string; chosen_date: string; dish: string | null; created_at: string }): EventResponse {
  return {
    id: r.id,
    eventId: r.event_id,
    guestName: r.guest_name,
    chosenDate: r.chosen_date,
    dish: r.dish,
    createdAt: r.created_at,
  };
}

/** Submit a response from the public invite form (anon or authenticated). */
export async function insertEventResponse(eventId: string, payload: { guestName: string; chosenDate: string; dish?: string | null }): Promise<void> {
  const { error } = await supabase.from("event_responses").insert({
    event_id: eventId,
    guest_name: payload.guestName.trim(),
    chosen_date: payload.chosenDate,
    dish: payload.dish?.trim() || null,
  });
  if (error) throw error;
}

/** Fetch all responses for an event (caller must be event owner; RLS enforces). */
export async function fetchEventResponses(eventId: string): Promise<EventResponse[]> {
  const { data, error } = await supabase
    .from("event_responses")
    .select("id, event_id, guest_name, chosen_date, dish, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToResponse);
}
