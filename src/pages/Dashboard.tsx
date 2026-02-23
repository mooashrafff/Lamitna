import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Trash2, ChefHat, ShoppingCart, LogOut } from "lucide-react";
import Lanterns from "@/components/Lanterns";
import Stars from "@/components/Stars";
import { supabase } from "@/integrations/supabase/client";
import { getEvents, deleteEvent, getInviteLink, fetchEvents, deleteEventSupabase, type StoredEvent } from "@/lib/events";
import { toast } from "@/components/ui/sonner";

const mealLabel: Record<StoredEvent["mealType"], string> = {
  iftar: "Iftar",
  suhoor: "Suhoor",
  both: "Both",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [events, setEvents] = useState<StoredEvent[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserId(session.user.id);
      setUserEmail(session.user.email ?? null);
      try {
        const fromSupabase = await fetchEvents(session.user.id);
        setEvents(fromSupabase);
      } catch {
        setEvents(getEvents(session.user.id));
      }
    });
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCopy = async (eventId: string) => {
    const link = getInviteLink(eventId);
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!userId) return;
    try {
      await deleteEventSupabase(userId, eventId);
    } catch {
      // table may not exist yet
    }
    deleteEvent(userId, eventId);
    setEvents(getEvents(userId));
    try {
      const fromSupabase = await fetchEvents(userId);
      setEvents(fromSupabase);
    } catch {
      setEvents(getEvents(userId));
    }
    toast.success("Event removed");
  };

  if (userId === null) return null;

  return (
    <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
      <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
      <Lanterns count={8} />
      <Stars count={25} />
      <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />

      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 pt-24 sm:pt-28 pb-8 max-w-4xl mx-auto w-full min-w-0">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground truncate">
              My Events
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {userEmail && (
              <span className="text-muted-foreground font-body text-xs sm:text-sm hidden sm:inline truncate max-w-[120px] md:max-w-none" title="Signed in">
                {userEmail}
              </span>
            )}
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-foreground font-body text-xs sm:text-sm font-semibold uppercase tracking-wider hover:text-primary transition-colors min-h-[44px] items-center px-2 touch-manipulation"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            SIGN OUT
          </button>
          </div>
        </div>

        {/* Event cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card/90 border border-border backdrop-blur-md p-4 shadow-xl flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link
                  to={`/event/${event.id}`}
                  className="font-display text-lg font-semibold text-foreground truncate flex-1 hover:text-primary transition-colors min-h-[44px] flex items-center touch-manipulation"
                >
                  {event.name}
                </Link>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleCopy(event.id); }}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    aria-label="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleDelete(event.id); }}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <Link to={`/event/${event.id}`} className="text-muted-foreground text-sm mb-4 block hover:text-foreground transition-colors">
                {mealLabel[event.mealType]} – {event.dates.length} date{event.dates.length !== 1 ? "s" : ""}
              </Link>
              <Link
                to={`/event/${event.id}/plan`}
                className="mt-auto flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all touch-manipulation"
              >
                {event.hasPlan ? (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    VIEW PLAN
                  </>
                ) : (
                  <>
                    <ChefHat className="w-4 h-4" />
                    PLAN EVENT
                  </>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* New event button + Home link */}
        <div className="mt-auto pt-4 pb-8 flex flex-col items-center gap-4">
          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 w-full max-w-md py-4 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 touch-manipulation"
          >
            <span className="text-lg leading-none">+</span> NEW EVENT
          </Link>
          <Link
            to="/"
            className="text-muted-foreground font-body text-sm font-medium hover:text-primary transition-colors inline-flex items-center gap-1 min-h-[44px] items-center touch-manipulation"
          >
            Home <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
