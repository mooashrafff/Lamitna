import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, MessageCircle, Mail, FileText } from "lucide-react";
import Lanterns from "@/components/Lanterns";
import Stars from "@/components/Stars";
import { toast } from "@/components/ui/sonner";

const EventCreated = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inviteId = (location.state as { inviteId?: string } | null)?.inviteId;

  const inviteLink = inviteId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${inviteId}`
    : "";

  useEffect(() => {
    if (!inviteId) navigate("/create", { replace: true });
  }, [inviteId, navigate]);

  const handleCopy = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const shareViaWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Join my Ramadan gathering: ${inviteLink}`)}`,
      "_blank"
    );
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=Ramadan gathering invite&body=${encodeURIComponent(`You're invited! Join here: ${inviteLink}`)}`;
  };

  const shareViaNotes = () => {
    if (navigator.share) {
      navigator.share({
        title: "Ramadan gathering invite",
        text: `Join my Ramadan gathering: ${inviteLink}`,
        url: inviteLink,
      }).catch(() => handleCopy());
    } else {
      handleCopy();
    }
  };

  if (!inviteId) return null;

  return (
    <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
      <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
      <Lanterns count={8} />
      <Stars count={25} />
      <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md min-w-0 rounded-2xl bg-card/90 border border-border backdrop-blur-md p-4 sm:p-6 shadow-xl space-y-6"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-center">
            Event Created!
          </h1>
          <p className="text-muted-foreground text-sm text-center">
            Share this link with your friends:
          </p>

          <div className="rounded-lg bg-muted/60 border border-border px-4 py-3">
            <p className="text-foreground font-body text-sm break-all select-all">{inviteLink}</p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-3 min-h-[44px] rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all touch-manipulation"
          >
            <Copy className="w-4 h-4" />
            COPY
          </button>

          <div>
            <p className="text-muted-foreground text-xs mb-3">Share via</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={shareViaWhatsApp}
                className="flex flex-col items-center justify-center gap-2 py-3 sm:py-4 min-h-[44px] rounded-lg border-2 border-accent text-foreground hover:bg-accent/10 transition-colors touch-manipulation"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent shrink-0" />
                <span className="font-body text-xs">WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={shareViaEmail}
                className="flex flex-col items-center justify-center gap-2 py-3 sm:py-4 min-h-[44px] rounded-lg border-2 border-accent text-foreground hover:bg-accent/10 transition-colors touch-manipulation"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-accent shrink-0" />
                <span className="font-body text-xs">Email</span>
              </button>
              <button
                type="button"
                onClick={shareViaNotes}
                className="flex flex-col items-center justify-center gap-2 py-3 sm:py-4 min-h-[44px] rounded-lg border-2 border-accent text-foreground hover:bg-accent/10 transition-colors touch-manipulation"
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-accent shrink-0" />
                <span className="font-body text-xs">Notes</span>
              </button>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="block text-center font-body text-sm font-semibold text-primary hover:underline min-h-[44px] flex items-center justify-center touch-manipulation"
          >
            GO TO DASHBOARD →
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default EventCreated;
