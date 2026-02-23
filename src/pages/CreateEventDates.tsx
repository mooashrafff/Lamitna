import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import Lanterns from "@/components/Lanterns";
import Stars from "@/components/Stars";
import { supabase } from "@/integrations/supabase/client";
import { saveEvent, saveEventSupabase, type StoredEvent } from "@/lib/events";
import type { MealType } from "./CreateEvent";

interface CreateEventState {
  eventName: string;
  mealType: MealType;
  dishParty: boolean;
}

const CreateEventDates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CreateEventState | null;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!state?.eventName) {
      navigate("/create", { replace: true });
    }
  }, [state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const inviteId = [...crypto.getRandomValues(new Uint8Array(4))].map((b) => b.toString(16).padStart(2, "0")).join("");
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id ?? "anonymous";
    const dateStr = selectedDate ? selectedDate.toISOString().slice(0, 10) : "";
    const event: StoredEvent = {
      id: inviteId,
      name: state!.eventName,
      mealType: state!.mealType,
      dishParty: state!.dishParty,
      dates: dateStr ? [dateStr] : [],
      message: message.trim() || undefined,
      hasPlan: false,
      createdAt: new Date().toISOString(),
    };
    saveEvent(userId, event);
    try {
      await saveEventSupabase(userId, event);
    } catch {
      // Supabase may be unavailable or table not created; localStorage still has the event
    }
    navigate("/event-created", { state: { inviteId } });
  };

  if (!state?.eventName) return null;

  return (
    <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
      <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
      <Lanterns count={8} />
      <Stars count={25} />
      <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 pt-24 sm:pt-28 pb-8 w-full min-w-0">
        <div className="w-full max-w-md flex justify-start mb-2">
          <Link
            to="/create"
            state={state}
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
          Select Dates
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6"
        >
          <div className="rounded-2xl bg-card/90 border border-border backdrop-blur-md p-5 shadow-xl flex flex-col items-center justify-center [&_.rdp]:text-foreground [&_.rdp-day_selected]:bg-primary [&_.rdp-day_selected]:text-primary-foreground [&_.rdp-day_selected]:font-semibold [&_.rdp-day_selected]:ring-2 [&_.rdp-day_selected]:ring-primary/40 [&_.rdp-day_selected]:ring-offset-2 [&_.rdp-day_selected]:ring-offset-card [&_.rdp-day_selected]:shadow-lg [&_.rdp-day_selected]:shadow-primary/25 [&_.rdp-button]:text-foreground [&_.rdp-nav_button]:bg-primary/20 [&_.rdp-nav_button]:text-primary-foreground [&_.rdp-nav_button]:rounded-full [&_.rdp-head_cell]:text-muted-foreground [&_.rdp-day]:rounded-full [&_.rdp]:mx-auto [&_.rdp-months]:justify-center [&_.rdp-month]:flex [&_.rdp-month]:flex-col [&_.rdp-month]:items-center [&_.rdp-caption]:flex [&_.rdp-caption]:justify-center [&_.rdp-table]:mx-auto">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full max-w-[280px]"
              classNames={{
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              }}
            />
          </div>

          <div className="flex justify-center gap-4">
            <span className="text-primary text-lg">✦</span>
            <span className="text-primary text-lg">✦</span>
          </div>

          <div className="rounded-2xl bg-card/90 border border-border backdrop-blur-md p-4 shadow-xl">
            <label className="block text-sm font-body text-foreground mb-2">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Looking forward to breaking fast together! 🌙"
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 min-h-[44px] rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-60 disabled:pointer-events-none touch-manipulation"
          >
            {submitting ? "Creating…" : "CREATE & GET LINK"}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateEventDates;
