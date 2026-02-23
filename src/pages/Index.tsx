import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarDays, ChefHat, Users, Heart } from "lucide-react";
import Lanterns from "@/components/Lanterns";
import Stars from "@/components/Stars";
import FeatureCard from "@/components/FeatureCard";
import appLogo from "@/assets/lametna.png";
import { supabase } from "@/integrations/supabase/client";

const features = [
  {
    icon: <CalendarDays className="w-8 h-8" />,
    title: "Pick the Perfect Night",
    description: "Choose your dates, invite friends, and find the evening that works for everyone",
  },
  {
    icon: <ChefHat className="w-8 h-8" />,
    title: "Lamitna Plans the Feast",
    description: "Get an AI-crafted menu by Lamitna tailored to your cuisine and vibe — plus a ready-to-go grocery list",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Bring a Dish",
    description: "Turn it into a dish party — guests sign up with what they're bringing so nothing's missing",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Come Together",
    description: "See who's coming, what's cooking, and gather around a table that's truly shared",
  },
];

const Index = () => {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSignedIn(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
      {/* One khayma line at the very top, above the lanterns */}
      <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
      <Lanterns count={12} />
      <Stars count={40} />
      {/* One khayma line at the very bottom of the page */}
      <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pt-24 sm:pt-28 pb-8 text-center">
        {/* Main logo (Lamitna) – black bg blends away via .logo-brand; circle fixed, logo scaled up inside */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-4 sm:mb-6 flex justify-center"
        >
          <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border-2 sm:border-4 border-primary shadow-lg shadow-primary/20 overflow-hidden flex items-center justify-center bg-transparent">
            <img
              src={appLogo}
              alt="Lamitna – Our Gathering"
              className="logo-brand w-[145%] h-[145%] object-contain bg-transparent"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 break-words"
        >
          Ramadan{" "}
          <span className="text-gold-gradient">Together</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-lg mx-auto mb-8 sm:mb-10 leading-relaxed px-0"
        >
          Send one link, find the best night to gather, and let <span className="text-primary font-semibold">Lamitna</span> plan an AI-crafted menu with a grocery list. This Ramadan, the only hard part is saving room for dessert.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <Link
            to={signedIn ? "/create" : "/auth"}
            className="inline-block px-6 sm:px-10 py-3.5 sm:py-4 min-h-[44px] flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 touch-manipulation"
          >
            Start Planning ✨
          </Link>
          <Link
            to="/dashboard"
            className="text-muted-foreground font-body text-sm font-medium hover:text-primary transition-colors inline-flex items-center gap-1 min-h-[44px] items-center touch-manipulation"
          >
            My gatherings <span>→</span>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto w-full min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              From invite to table — <span className="text-primary">Lamitna</span> has you covered
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for a Ramadan gathering, all in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 text-center">
        <p className="font-display text-xl text-muted-foreground italic">
          Ramadan Mubarak — may your table always be full
        </p>
      </footer>
    </div>
  );
};

export default Index;
