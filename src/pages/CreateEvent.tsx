import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Sun, Sparkles } from "lucide-react";
import Lanterns from "@/components/Lanterns";
import Stars from "@/components/Stars";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

export type MealType = "iftar" | "suhoor" | "both";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");
  const [mealType, setMealType] = useState<MealType>("iftar");
  const [dishParty, setDishParty] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/create/dates", {
      state: { eventName: eventName.trim() || "Ramadan Dinners with Friends", mealType, dishParty },
    });
  };

  return (
    <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
      <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
      <Lanterns count={8} />
      <Stars count={25} />
      <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 pt-24 sm:pt-28 pb-8 w-full min-w-0">
        {/* Back */}
        <div className="w-full max-w-md flex justify-start mb-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-foreground font-body text-sm hover:text-primary transition-colors"
          >
            <span>←</span> Back
          </Link>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6"
        >
          Create Event
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl bg-card/90 border border-border backdrop-blur-md p-6 shadow-xl"
        >
          {/* Event Name */}
          <div className="mb-5">
            <label className="block text-sm font-body text-foreground mb-2">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Ramadan Dinners with Friends"
              className="w-full px-4 py-3 rounded-lg bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm"
            />
          </div>

          {/* Decorative stars */}
          <div className="flex justify-center gap-4 mb-5">
            <span className="text-primary text-lg">✦</span>
            <span className="text-primary text-lg">✦</span>
          </div>

          {/* Meal Type */}
          <div className="mb-5">
            <label className="block text-sm font-body text-foreground mb-3">Meal Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "iftar" as const, label: "Iftar", Icon: Flame },
                { id: "suhoor" as const, label: "Suhoor", Icon: Sun },
                { id: "both" as const, label: "Both", Icon: Sparkles },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMealType(id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border font-body text-sm font-medium transition-all ${
                    mealType === id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-foreground border-border hover:bg-muted/70"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Dish Party */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-body text-foreground">
                Dish Party <span className="text-destructive">🌶️</span>
              </label>
              <p className="text-muted-foreground text-xs mt-0.5">Guests each bring a dish to share.</p>
            </div>
            <Switch checked={dishParty} onCheckedChange={setDishParty} className="shrink-0 mt-1" />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 min-h-[44px] rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-widest hover:brightness-110 transition-all touch-manipulation"
          >
            Next
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateEvent;
