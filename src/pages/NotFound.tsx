import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Lanterns from "@/components/Lanterns";
import Stars from "@/components/Stars";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full max-w-full bg-khayma-radial relative overflow-x-hidden overflow-y-auto flex items-center justify-center khayma-pattern">
      <div className="khayma-border-top h-1.5 w-full absolute top-0 left-0 right-0 z-30" aria-hidden />
      <Lanterns count={8} />
      <Stars count={25} />
      <div className="khayma-border-bottom h-1.5 w-full absolute bottom-0 left-0 right-0 z-30" aria-hidden />
      <div className="relative z-10 text-center px-4 sm:px-6 min-w-0">
        <h1 className="mb-4 font-display text-3xl sm:text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-base sm:text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="inline-flex items-center justify-center min-h-[44px] text-primary underline hover:text-primary/90 touch-manipulation">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
