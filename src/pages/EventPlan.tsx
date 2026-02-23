import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  ClipboardList,
  ShoppingCart,
  Flame,
  Users,
  Wine,
  Smile,
  ChefHat,
  Search,
  FlameKindling,
  Leaf,
  Milk,
  Check,
  Globe,
  X,
  RefreshCw,
  MessageCircle,
  Copy,
} from "lucide-react";
import Lanterns from "@/components/Lanterns";
import Stars from "@/components/Stars";
import StepIndicator from "@/components/plan/StepIndicator";
import { supabase } from "@/integrations/supabase/client";
import { getEventById, getEventByIdSupabase, updateEventHasPlan, updateEventHasPlanSupabase } from "@/lib/events";
import { generateMenuWithAI } from "@/lib/aiChef";
import {
  CUISINES,
  getMenuForCuisineFallback,
  getGroceryForCuisineFallback,
  type MenuItem,
  type GroceryItem,
  type MoodOption,
  type CookingEffort,
  type DietaryOption,
} from "@/lib/planData";
import { getSavedPlan, savePlan } from "@/lib/planStorage";
import { toast } from "@/components/ui/sonner";

const MOOD_OPTIONS: { id: MoodOption; label: string; icon: React.ElementType }[] = [
  { id: "cozy", label: "Cozy & intimate", icon: Flame },
  { id: "big_family", label: "Big family energy", icon: Users },
  { id: "fancy", label: "Fancy dinner party", icon: Wine },
  { id: "chill", label: "Chill & casual", icon: Smile },
];

const COOKING_OPTIONS: { id: CookingEffort; label: string; icon: React.ElementType }[] = [
  { id: "simple", label: "Keep it simple", icon: Search },
  { id: "happy_to_cook", label: "Happy to cook", icon: ChefHat },
  { id: "all_out", label: "Going all out", icon: FlameKindling },
];

const DIETARY_OPTIONS: { id: DietaryOption; label: string; icon: React.ElementType }[] = [
  { id: "vegetarian", label: "Vegetarian-friendly", icon: Leaf },
  { id: "nut_free", label: "Nut-free", icon: Leaf },
  { id: "dairy_free", label: "Dairy-free", icon: Milk },
  { id: "no_restrictions", label: "No restrictions", icon: Check },
];

export default function EventPlan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [eventMealType, setEventMealType] = useState<string>("iftar");
  const [step, setStep] = useState(1);
  const [pendingGrocery, setPendingGrocery] = useState<GroceryItem[] | null>(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [mood, setMood] = useState<MoodOption | null>(null);
  const [cookingEffort, setCookingEffort] = useState<CookingEffort | null>(null);
  const [dietary, setDietary] = useState<DietaryOption | null>(null);
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [newDishCategory, setNewDishCategory] = useState<MenuItem["category"]>("Mains");
  const [newDishName, setNewDishName] = useState("");
  const [newDishQty, setNewDishQty] = useState("");

  useEffect(() => {
    if (!id) return;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserId(session.user.id);
      const fromSupabase = await getEventByIdSupabase(session.user.id, id).catch(() => null);
      const event = fromSupabase ?? getEventById(session.user.id, id);
      if (!event) {
        navigate("/dashboard", { replace: true });
        return;
      }
      setEventName(event.name);
      setEventMealType(event.mealType);
      if (event.hasPlan) {
        const saved = getSavedPlan(session.user.id, id);
        if (saved?.menuItems?.length && saved?.groceryItems?.length) {
          setMenuItems(saved.menuItems);
          setGroceryItems(saved.groceryItems);
          setStep(7);
        }
      }
    });
  }, [id, navigate]);

  useEffect(() => {
    if (step !== 4 || !cuisine) return;
    let cancelled = false;
    setMenuLoading(true);
    generateMenuWithAI({
      guestCount,
      cuisine,
      mood,
      cookingEffort,
      dietary,
      mealType: eventMealType,
    })
      .then(({ menuItems: nextMenu, groceryItems: nextGrocery, fromAI }) => {
        if (cancelled) return;
        setMenuItems(nextMenu);
        setPendingGrocery(nextGrocery);
        if (fromAI) toast.success("Lamitna crafted your menu!");
        else toast.info("Using suggested menu (AI not connected).");
        setStep(5);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const fallbackMenu = getMenuForCuisineFallback(cuisine, guestCount);
        const fallbackGrocery = getGroceryForCuisineFallback(cuisine);
        setMenuItems(fallbackMenu);
        setPendingGrocery(fallbackGrocery);
        const msg = err instanceof Error ? err.message : "";
        if (msg && msg.includes("timed out")) {
          toast.info("Took too long — here's a suggested menu! You can still edit it.");
        } else if (msg) {
          toast.error(`AI chef: ${msg.slice(0, 120)}`);
        } else {
          toast.info("Using suggested menu. Add GEMINI_API_KEY or OPENAI_API_KEY in Supabase Edge Function secrets.");
        }
        setStep(5);
      })
      .finally(() => {
        if (!cancelled) setMenuLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [step, cuisine, guestCount, mood, cookingEffort, dietary, eventMealType]);

  useEffect(() => {
    if (step === 6) {
      const t = setTimeout(() => {
        if (pendingGrocery?.length) {
          setGroceryItems(pendingGrocery);
        } else {
          setGroceryItems(getGroceryForCuisineFallback(cuisine ?? "default"));
        }
        setStep(7);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [step, pendingGrocery, cuisine]);

  useEffect(() => {
    if (step === 7 && userId && id && menuItems.length > 0) {
      savePlan(userId, id, { menuItems, groceryItems });
    }
  }, [step, userId, id, menuItems, groceryItems]);

  const handleDoneRamadan = async () => {
    if (!userId || !id) return;
    savePlan(userId, id, { menuItems, groceryItems });
    updateEventHasPlan(userId, id, true);
    try {
      await updateEventHasPlanSupabase(userId, id, true);
    } catch {
      // Supabase may be unavailable; localStorage is updated
    }
    toast.success("Ramadan Mubarak! Your plan is saved.");
    navigate("/dashboard");
  };

  const removeMenuItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const addMenuItem = () => {
    if (!newDishName.trim()) return;
    setMenuItems((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        category: newDishCategory,
        name: newDishName.trim(),
        quantity: newDishQty.trim() || "1 serving",
      },
    ]);
    setNewDishName("");
    setNewDishQty("");
  };

  const toggleGroceryChecked = (itemId: string) => {
    setGroceryItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i))
    );
  };

  const copyGroceryList = () => {
    const text = groceryItems
      .reduce(
        (acc, i) => {
          const cat = acc.cats.includes(i.category) ? "" : `${i.category}\n`;
          if (!acc.cats.includes(i.category)) acc.cats.push(i.category);
          return { ...acc, text: acc.text + cat + `- [ ] ${i.name}\n` };
        },
        { text: "", cats: [] as string[] }
      )
      .text;
    navigator.clipboard.writeText(text);
    toast.success("List copied!");
  };

  const groceryCheckedCount = groceryItems.filter((i) => i.checked).length;

  if (userId === null || !eventName) return null;

  return (
    <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
      <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
      <Lanterns count={8} />
      <Stars count={25} />
      <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />

      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 pt-24 sm:pt-28 pb-6 max-w-lg mx-auto w-full min-w-0">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-foreground font-body text-sm mb-4 hover:text-primary transition-colors"
        >
          <span>←</span> Back to {eventName}
        </Link>

        <StepIndicator currentStep={step <= 3 ? step : step <= 5 ? 4 : 5} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 flex flex-col items-center"
            >
              <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
                How many are joining your table?
              </h1>
              <p className="text-muted-foreground text-sm text-center mb-8">
                The more, the merrier — let's make sure there's enough for everyone.
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                  className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center text-foreground text-xl hover:bg-muted/80 transition-colors"
                >
                  −
                </button>
                <span className="font-display text-4xl font-bold text-primary min-w-[3rem] text-center">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestCount((c) => c + 1)}
                  className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center text-foreground text-xl hover:bg-muted/80 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-12 w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                Next <span>→</span>
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1"
            >
              <h1 className="font-display text-2xl font-bold text-foreground text-center mb-1">
                Vibe check ✨
              </h1>
              <p className="text-muted-foreground text-sm text-center mb-6">
                Tell us what kind of gathering you're dreaming of
              </p>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">How would you describe the mood?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {MOOD_OPTIONS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setMood(id)}
                        className={`flex items-center gap-2 py-3 px-3 rounded-lg border text-left text-sm transition-colors ${
                          mood === id ? "bg-primary/20 border-primary text-foreground" : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">How much cooking are you up for?</p>
                  <div className="grid grid-cols-1 gap-2">
                    {COOKING_OPTIONS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setCookingEffort(id)}
                        className={`flex items-center gap-2 py-3 px-3 rounded-lg border text-left text-sm transition-colors ${
                          cookingEffort === id ? "bg-primary/20 border-primary text-foreground" : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Any dietary notes?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {DIETARY_OPTIONS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDietary(id)}
                        className={`flex items-center gap-2 py-3 px-3 rounded-lg border text-left text-sm transition-colors ${
                          dietary === id ? "bg-primary/20 border-primary text-foreground" : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-lg bg-muted text-foreground font-body font-semibold text-sm uppercase tracking-wider"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-widest"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1"
            >
              <h1 className="font-display text-2xl font-bold text-foreground text-center mb-1">
                What's on the menu?
              </h1>
              <p className="text-muted-foreground text-sm text-center mb-6">
                Pick a cuisine and we'll craft something special.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-8">
                {CUISINES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCuisine(c.id)}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border text-center text-xs font-medium transition-colors ${
                      cuisine === c.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    {c.id === "mixed" ? <Globe className="w-4 h-4 mb-1" /> : <span className="text-lg font-bold mb-0.5">{c.code}</span>}
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg bg-muted text-foreground font-body font-semibold text-sm uppercase tracking-wider">
                  ← Back
                </button>
                <button
                  onClick={() => cuisine && setStep(4)}
                  disabled={!cuisine}
                  className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-widest disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6"
              >
                <ChefHat className="w-14 h-14 text-primary drop-shadow-lg" strokeWidth={1.5} />
              </motion.div>
              <h2 className="font-display text-xl font-bold text-foreground mb-1">Cooking up your menu...</h2>
              <p className="text-muted-foreground text-sm">Our AI chef is crafting something special</p>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 pb-24"
            >
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h1 className="font-display text-xl font-bold text-foreground">Your menu</h1>
              </div>
              <p className="text-muted-foreground text-sm mb-4">Tweak it until it's perfect — add, remove, or edit anything.</p>
              {(["Appetizers", "Mains", "Sides", "Drinks", "Desserts"] as const).map((cat) => {
                const items = menuItems.filter((i) => i.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} className="mb-4">
                    <p className="text-accent font-semibold text-xs uppercase tracking-wider mb-2">{cat}</p>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-card/80 border border-border px-3 py-2"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-foreground text-sm truncate">{item.name}</p>
                            <p className="text-muted-foreground text-xs">{item.quantity}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMenuItem(item.id)}
                            className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="rounded-lg border-2 border-dashed border-primary/40 p-3 mb-6">
                <select
                  value={newDishCategory}
                  onChange={(e) => setNewDishCategory(e.target.value as MenuItem["category"])}
                  className="w-full mb-2 px-3 py-2 rounded-lg bg-muted/40 border border-border text-foreground text-sm"
                >
                  {(["Appetizers", "Mains", "Sides", "Drinks", "Desserts"] as const).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Dish name"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  className="w-full mb-2 px-3 py-2 rounded-lg bg-muted/40 border border-border text-foreground text-sm placeholder:text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Qty"
                  value={newDishQty}
                  onChange={(e) => setNewDishQty(e.target.value)}
                  className="w-full mb-2 px-3 py-2 rounded-lg bg-muted/40 border border-border text-foreground text-sm placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={addMenuItem}
                  className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm flex items-center justify-center gap-1"
                >
                  + ADD
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setPendingGrocery(null);
                    setMenuItems([]);
                    setStep(4);
                  }}
                  className="flex-1 py-3 rounded-lg bg-muted text-foreground font-body font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
                <button
                  onClick={() => setStep(6)}
                  className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-widest"
                >
                  Generate grocery list →
                </button>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center py-12"
            >
              <ShoppingCart className="w-16 h-16 text-primary mb-4" />
              <h2 className="font-display text-xl font-bold text-foreground mb-1">Building your grocery list...</h2>
              <p className="text-muted-foreground text-sm">Calculating quantities for your guests</p>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 pb-28"
            >
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h1 className="font-display text-xl font-bold text-foreground">Your grocery list</h1>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {groceryCheckedCount} of {groceryItems.length} items checked off — you've got this!
              </p>
              <div className="flex gap-2 mb-6">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("My Ramadan grocery list:\n" + groceryItems.map((i) => `- ${i.name}`).join("\n"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-lg border-2 border-accent text-foreground font-body font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <button
                  onClick={copyGroceryList}
                  className="flex-1 py-2.5 rounded-lg border-2 border-accent text-foreground font-body font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Copy list
                </button>
              </div>
              <div className="space-y-4 mb-8">
                {Array.from(new Set(groceryItems.map((i) => i.category))).map((cat) => (
                  <div key={cat}>
                    <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-2">{cat}</p>
                    <div className="space-y-1.5">
                      {groceryItems
                        .filter((i) => i.category === cat)
                        .map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-3 rounded-lg bg-card/80 border border-border px-3 py-2 cursor-pointer hover:bg-card"
                          >
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleGroceryChecked(item.id)}
                              className="rounded border-border"
                            />
                            <span className={`text-sm ${item.checked ? "text-muted-foreground line-through" : "text-foreground"}`}>
                              {item.name}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 py-3 rounded-lg bg-muted text-foreground font-body font-semibold text-sm uppercase tracking-wider"
                >
                  ← Back to menu
                </button>
                <button
                  onClick={handleDoneRamadan}
                  className="flex-1 py-3.5 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  Done – Ramadan Mubarak! <Moon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
