import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, ShoppingCart, Calendar, Share2, Check, UtensilsCrossed, Users, Star, List } from "lucide-react";
import Lanterns from "@/components/Lanterns";
import Stars from "@/components/Stars";
import { supabase } from "@/integrations/supabase/client";
import { getInviteLink, getEventById, type StoredEvent } from "@/lib/events";
import { getEventByIdSupabase, fetchEventResponses, type EventResponse } from "@/lib/eventsSupabase";
import { toast } from "@/components/ui/sonner";

const mealLabel: Record<StoredEvent["mealType"], string> = {
  iftar: "Iftar",
  suhoor: "Suhoor",
  both: "Both",
};

function formatDateShort(dateStr: string) {
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatDateLong(dateStr: string) {
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [event, setEvent] = useState<StoredEvent | null>(null);
  const [responses, setResponses] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      const uid = session.user.id;
      setUserId(uid);
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const [evFromSupabase, res] = await Promise.all([
          getEventByIdSupabase(uid, id),
          fetchEventResponses(id).catch(() => []),
        ]);
        const ev = evFromSupabase ?? getEventById(uid, id) ?? null;
        setEvent(ev ?? null);
        setResponses(Array.isArray(res) ? res : []);
      } catch {
        const localEv = getEventById(uid, id);
        setEvent(localEv ?? null);
        setResponses([]);
      } finally {
        setLoading(false);
      }
    });
  }, [id, navigate]);

  const inviteLink = id ? getInviteLink(id) : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleShareDishList = async () => {
    const lines = responses
      .filter((r) => r.dish)
      .map((r) => `${r.guestName}: ${r.dish}`);
    const text = lines.length ? lines.join("\n") : "No dishes added yet.";
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Dish list copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.name ?? "Ramadan gathering",
          text: `You're invited! Join here: ${inviteLink}`,
          url: inviteLink,
        });
        toast.success("Shared");
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (userId === null || loading) {
    return (
      <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
        <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
        <Lanterns count={8} />
        <Stars count={25} />
        <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-8">
          <p className="text-muted-foreground font-body text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
        <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
        <Lanterns count={8} />
        <Stars count={25} />
        <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-8">
          <p className="text-muted-foreground font-body text-sm mb-4">Event not found.</p>
          <Link to="/dashboard" className="text-primary font-body font-semibold hover:underline">
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  const bestDate = event.dates[0];
  const responseCount = responses.length;
  const isEmpty = responseCount === 0;
  const cardClass = "rounded-2xl bg-card/90 border border-border border-primary/30 backdrop-blur-md p-4 shadow-xl";

  return (
    <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
      <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
      <Lanterns count={8} />
      <Stars count={25} />
      <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />

      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 pt-24 sm:pt-28 pb-8 max-w-2xl mx-auto w-full min-w-0">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-muted-foreground font-body text-sm hover:text-primary transition-colors mb-6"
        >
          ← Back to events
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header: event name + meal type & response count with icons */}
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {event.name}
            </h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-primary" aria-hidden />
                {mealLabel[event.mealType]}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" aria-hidden />
                {responseCount} friend{responseCount !== 1 ? "s" : ""} responded
              </span>
            </p>
          </div>

          <Link
            to={`/event/${event.id}/plan`}
            className="flex items-center justify-center gap-2 w-full py-3 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all touch-manipulation shadow-lg shadow-primary/20"
          >
            <ShoppingCart className="w-4 h-4" />
            VIEW PLAN
          </Link>

          {/* Empty state: prominent message (like reference image) */}
          {isEmpty && (
            <p className="text-foreground font-body text-center text-lg sm:text-xl py-8 px-4">
              No responses yet — share the link with friends!
            </p>
          )}

          {/* Best day(s) */}
          <div className={cardClass}>
            <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" aria-hidden />
              Best day(s)
            </h2>
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {bestDate ? (
                <span className="inline-flex items-center rounded-full bg-muted/60 text-foreground font-body text-sm px-3 py-1.5">
                  {formatDateLong(bestDate)}
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">No date set</span>
              )}
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 py-2 min-h-[44px] rounded-lg bg-primary text-primary-foreground font-body font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all touch-manipulation px-4 ml-auto"
              >
                <Calendar className="w-4 h-4" />
                CONFIRM DATE
              </Link>
            </div>
          </div>

          {/* Who responded */}
          <div className={cardClass}>
            <h2 className="font-display font-semibold text-foreground mb-3">Name</h2>
            {isEmpty ? (
              <p className="text-muted-foreground text-sm">No responses yet. Share the invite link!</p>
            ) : (
              <ul className="space-y-3">
                {responses.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 font-body text-sm text-foreground"
                  >
                    <span>{r.guestName}</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                      {formatDateShort(r.chosenDate)}
                      <Check className="w-4 h-4 text-primary" aria-hidden />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Dish contributions (only for dish party) */}
          {event.dishParty && (
            <div className={cardClass}>
              <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <List className="w-4 h-4 text-primary" aria-hidden />
                Dish contributions
              </h2>
              {responses.filter((r) => r.dish).length === 0 ? (
                <p className="text-muted-foreground text-sm mb-3">No dishes added yet.</p>
              ) : (
                <ul className="space-y-2 mb-3">
                  {responses
                    .filter((r) => r.dish)
                    .map((r) => (
                      <li key={r.id} className="flex items-center justify-between gap-3 font-body text-sm text-foreground">
                        <span>{r.guestName}</span>
                        <span className="text-muted-foreground">{r.dish}</span>
                      </li>
                    ))}
                </ul>
              )}
              <button
                type="button"
                onClick={handleShareDishList}
                className="inline-flex items-center justify-center gap-2 py-2 min-h-[44px] rounded-lg bg-primary text-primary-foreground font-body font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all touch-manipulation px-4"
              >
                <Copy className="w-4 h-4" />
                SHARE DISH LIST
              </button>
            </div>
          )}

          {/* Share with more friends — same row as ref: label left, buttons right */}
          <div className={`${cardClass} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
            <h2 className="font-display font-semibold text-foreground shrink-0">Share with more friends</h2>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-body font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all touch-manipulation px-4"
              >
                <Copy className="w-4 h-4" />
                COPY
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-body font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all touch-manipulation px-4"
              >
                <Share2 className="w-4 h-4" />
                SHARE
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;
