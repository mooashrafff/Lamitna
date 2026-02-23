import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lanterns from "@/components/Lanterns";
import Stars from "@/components/Stars";
import { getEventByIdPublic, insertEventResponse } from "@/lib/eventsSupabase";
import type { StoredEvent } from "@/lib/events";
import { toast } from "@/components/ui/sonner";

const mealLabel: Record<StoredEvent["mealType"], string> = {
  iftar: "Iftar",
  suhoor: "Suhoor",
  both: "Both",
};

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
};

const Invite = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<StoredEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dish, setDish] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedDate, setSubmittedDate] = useState("");
  const [submittedEventName, setSubmittedEventName] = useState("");
  const [submittedMealType, setSubmittedMealType] = useState<StoredEvent["mealType"]>("iftar");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getEventByIdPublic(id)
      .then((e) => {
        setEvent(e ?? null);
        if (e?.dates?.length) setSelectedDate(e.dates[0]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const isDishRequired = event?.dishParty ?? false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !event) return;
    if (isDishRequired && !dish.trim()) {
      toast.error("Please say what dish you'll bring.");
      return;
    }
    const dateToSend = event.dates.length === 1 ? event.dates[0] : selectedDate;
    if (!dateToSend) {
      toast.error("Please select a date.");
      return;
    }
    setSubmitting(true);
    try {
      await insertEventResponse(event.id, {
        guestName: name.trim(),
        chosenDate: dateToSend,
        dish: dish.trim() || null,
      });
      setSubmittedDate(dateToSend);
      setSubmittedEventName(event.name);
      setSubmittedMealType(event.mealType);
      setSubmitted(true);
      toast.success("Thanks! Your response was recorded.");
    } catch {
      toast.error("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
        <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
        <Lanterns count={8} />
        <Stars count={25} />
        <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-8">
          <p className="text-muted-foreground font-body text-sm">Loading invite…</p>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md w-full">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">Invite not found</h1>
            <p className="text-muted-foreground text-sm mb-6">This link may be invalid or the event was removed.</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 min-h-[44px] flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all touch-manipulation"
            >
              Go to Lamitna
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleAddToGoogleCalendar = () => {
    if (!submittedDate || !submittedEventName) return;
    const url = getGoogleCalendarUrl(submittedEventName, submittedDate, mealLabel[submittedMealType]);
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Opening Google Calendar");
  };

  const handleAddToAppleCalendar = () => {
    if (!submittedDate || !submittedEventName) return;
    const blob = getIcsBlob(submittedEventName, submittedDate, mealLabel[submittedMealType]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${submittedEventName.replace(/\s+/g, "-")}-calendar.ics`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(isIOS ? "Opening in Apple Calendar" : "Calendar file downloaded");
  };

  const handleCopyAnnouncement = async () => {
    const text = submittedDate && submittedEventName
      ? `I'm joining ${submittedEventName} on ${formatDateLong(submittedDate)} – Ramadan Mubarak! 🌙`
      : "Ramadan Mubarak! 🌙";
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
        <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
        <Lanterns count={8} />
        <Stars count={25} />
        <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-md w-full flex flex-col items-center"
          >
            {/* Circular arrangement of 7 golden stars */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-6" aria-hidden>
              {[...Array(7)].map((_, i) => {
                const angle = (i * 360) / 7 - 90;
                const r = 38;
                const x = 50 + r * Math.cos((angle * Math.PI) / 180);
                const y = 50 + r * Math.sin((angle * Math.PI) / 180);
                return (
                  <div
                    key={i}
                    className="absolute w-5 h-5 sm:w-6 sm:h-6 text-primary"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Star className="w-full h-full fill-primary stroke-primary" />
                  </div>
                );
              })}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              You're all set!
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-sm mx-auto mb-6">
              Ramadan Mubarak! Your availability has been submitted. May this Ramadan bring you peace and blessings.
            </p>

            {/* CONFIRMED date + Add to calendar */}
            {submittedDate && (
              <div className="w-full max-w-sm rounded-2xl bg-card/90 border border-border border-primary/30 backdrop-blur-md p-4 shadow-xl mb-6 text-left">
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                  Confirmed
                </p>
                <p className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-primary shrink-0" aria-hidden />
                  {formatDateLong(submittedDate)}
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleAddToGoogleCalendar}
                    className="flex items-center justify-center gap-2 w-full py-3 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-body font-semibold text-sm transition-all touch-manipulation"
                  >
                    <Calendar className="w-5 h-5 shrink-0" />
                    Add to Google Calendar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToAppleCalendar}
                    className="flex items-center justify-center gap-2 w-full py-3 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all touch-manipulation"
                  >
                    <Calendar className="w-5 h-5 shrink-0" />
                    {isIOS ? "Add to Apple Calendar" : "Add to Calendar (.ics)"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyAnnouncement}
                    className="flex items-center justify-center gap-2 w-full py-3 min-h-[44px] rounded-xl bg-primary/90 text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all touch-manipulation"
                  >
                    <FileText className="w-5 h-5 shrink-0" />
                    Copy announcement
                  </button>
                </div>
              </div>
            )}

            <Link
              to="/"
              className="inline-block px-6 py-3 min-h-[44px] flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all touch-manipulation"
            >
              Go to Lamitna
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
      <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
      <Lanterns count={8} />
      <Stars count={25} />
      <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 pt-24 sm:pt-28 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md min-w-0"
        >
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 text-center">
            {event.name}
          </h1>
          <p className="text-muted-foreground text-sm mb-6 text-center flex items-center justify-center gap-1.5">
            {event.mealType === "iftar" && <span aria-hidden>🌅</span>}
            {mealLabel[event.mealType]}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="invite-name" className="block font-body text-sm font-medium text-foreground mb-1.5">
                Your Name
              </label>
              <input
                id="invite-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                When are you available?
              </label>
              <div className="rounded-lg border border-input bg-muted/30 px-3 py-2.5 font-body text-sm text-foreground">
                {event.dates.length === 0 ? (
                  <span className="text-muted-foreground">No dates set</span>
                ) : event.dates.length === 1 ? (
                  formatDate(event.dates[0])
                ) : (
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  >
                    {event.dates.map((d) => (
                      <option key={d} value={d}>
                        {formatDate(d)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="invite-dish" className="block font-body text-sm font-medium text-foreground mb-1.5">
                What dish will you bring?{isDishRequired ? "" : " (optional)"}
              </label>
              <input
                id="invite-dish"
                type="text"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                placeholder="e.g. Biryani, Fattoush, Kunafa..."
                required={isDishRequired}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 min-h-[44px] rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 touch-manipulation disabled:opacity-70"
              >
                {submitting ? "Submitting…" : "Submit availability"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Invite;
