import { supabase } from "@/integrations/supabase/client";
import {
  getMenuForCuisineFallback,
  getGroceryForCuisineFallback,
  type MenuItem,
  type GroceryItem,
} from "@/lib/planData";

export interface GenerateMenuInput {
  guestCount: number;
  cuisine: string;
  mood: string | null;
  cookingEffort: string | null;
  dietary: string | null;
  mealType?: string;
  /** Used to encourage different outputs on regenerate */
  variation?: string;
}

export interface GenerateMenuResult {
  menuItems: MenuItem[];
  groceryItems: GroceryItem[];
  fromAI: boolean;
}

const AI_CHEF_TIMEOUT_MS = 25_000; // Stop waiting after 25s and use suggested menu

/**
 * Calls the AI chef (Supabase Edge Function) to generate menu + grocery list.
 * Falls back to randomized static data if the function is not deployed, fails, or times out.
 */
export async function generateMenuWithAI(input: GenerateMenuInput): Promise<GenerateMenuResult> {
  const invokePromise = supabase.functions.invoke("generate-menu", {
    body: {
      guestCount: input.guestCount,
      cuisine: input.cuisine,
      mood: input.mood,
      cookingEffort: input.cookingEffort,
      dietary: input.dietary,
      mealType: input.mealType ?? "iftar",
      variation: input.variation ?? String(Date.now()),
    },
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Menu request timed out")), AI_CHEF_TIMEOUT_MS)
  );

  try {
    const { data, error } = await Promise.race([invokePromise, timeoutPromise]);

    if (error) throw error;
    if (data?.error) {
      const details = typeof data.details === "string" ? data.details : "";
      throw new Error(details ? `${data.error}: ${details}` : String(data.error));
    }

    const menuItems = (data?.menuItems ?? []).map((item: { id?: string; category: string; name: string; quantity: string }, i: number) => ({
      id: item.id ?? `ai-${Date.now()}-${i}`,
      category: item.category as MenuItem["category"],
      name: item.name,
      quantity: item.quantity,
    }));

    const groceryItems = (data?.groceryItems ?? []).map((item: { id?: string; category: string; name: string }, i: number) => ({
      id: item.id ?? `ai-g-${Date.now()}-${i}`,
      category: item.category,
      name: item.name,
      checked: false,
    }));

    if (menuItems.length > 0) {
      return { menuItems, groceryItems, fromAI: true };
    }
  } catch (_) {
    // Fall through to fallback
  }

  const menuItems = getMenuForCuisineFallback(input.cuisine, input.guestCount);
  const groceryItems = getGroceryForCuisineFallback(input.cuisine);
  return { menuItems, groceryItems, fromAI: false };
}
