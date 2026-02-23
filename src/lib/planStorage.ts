import type { MenuItem, GroceryItem } from "@/lib/planData";

const PLAN_STORAGE_PREFIX = "ramadan_plan_";

function planKey(userId: string, eventId: string): string {
  return `${PLAN_STORAGE_PREFIX}${userId}_${eventId}`;
}

export interface SavedPlan {
  menuItems: MenuItem[];
  groceryItems: GroceryItem[];
}

export function getSavedPlan(userId: string, eventId: string): SavedPlan | null {
  try {
    const raw = localStorage.getItem(planKey(userId, eventId));
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedPlan;
    if (!Array.isArray(data.menuItems) || !Array.isArray(data.groceryItems)) return null;
    return {
      menuItems: data.menuItems,
      groceryItems: data.groceryItems.map((i) => ({
        id: i.id,
        category: i.category ?? "OTHER",
        name: i.name ?? "",
        checked: Boolean(i.checked),
      })),
    };
  } catch {
    return null;
  }
}

export function savePlan(userId: string, eventId: string, plan: SavedPlan): void {
  try {
    localStorage.setItem(planKey(userId, eventId), JSON.stringify(plan));
  } catch {
    // ignore
  }
}
