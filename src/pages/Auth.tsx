import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lanterns from "@/components/Lanterns";
import Stars from "@/components/Stars";
import { motion } from "framer-motion";
import appLogo from "@/assets/lametna.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        if (data.user && !data.session) {
          toast.success("Check your email for the confirmation link.");
        } else {
          toast.success("Account created! Welcome.");
          navigate("/");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        toast.success("Signed in!");
        navigate("/");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto khayma-pattern">
      {/* One khayma line at the very top, above the lanterns */}
      <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
      <Lanterns count={8} />
      <Stars count={25} />
      {/* One khayma line at the very bottom of the page */}
      <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-6">
        <div className="pointer-events-auto w-full max-w-[300px] sm:max-w-[320px] md:max-w-[360px] px-2 sm:px-5 flex flex-col items-center min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-w-0 p-3 sm:p-4 rounded-2xl bg-card/90 border border-border backdrop-blur-md shadow-xl overflow-hidden"
          >
        {/* Logo (Lamitna) – circle fixed, logo scaled up inside */}
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-primary shadow-lg shadow-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0 bg-transparent">
            <img
              src={appLogo}
              alt="Lamitna – Our Gathering"
              className="logo-brand w-[145%] h-[145%] object-contain bg-transparent"
            />
          </div>
        </div>

        <h2 className="font-display text-xs sm:text-sm md:text-base font-bold text-foreground text-center mb-0.5 px-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          {isSignUp ? "Create your account" : "Sign in to host your gathering"}
        </h2>
        <p className="text-muted-foreground text-center text-xs mb-2">
          Welcome to Lamitna
        </p>

        <form className="space-y-2" onSubmit={handleEmailAuth}>
          <div>
            <label className="block text-xs font-body text-foreground mb-0.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body text-sm min-h-[44px] sm:min-h-[38px] touch-manipulation"
            />
          </div>
          <div>
            <label className="block text-xs font-body text-foreground mb-0.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body text-sm min-h-[44px] sm:min-h-[38px] touch-manipulation"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 min-h-[44px] sm:min-h-[38px] shadow-lg shadow-primary/20 touch-manipulation"
          >
            {loading ? "Please wait…" : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-2">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline font-semibold focus:outline-none focus:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
          </motion.div>
          <Link
            to="/"
            className="text-muted-foreground font-body text-xs font-medium hover:text-primary transition-colors inline-flex items-center gap-1 mt-2 min-h-[44px] items-center touch-manipulation"
          >
            Back to home <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
