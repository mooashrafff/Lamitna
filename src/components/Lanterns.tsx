import { useMemo } from "react";

interface LanternProps {
  count?: number;
}

const Lantern = ({ left, delay, size, colorVariant }: { left: string; delay: string; size: number; colorVariant: number }) => {
  const colors = [
    { body: "from-primary/30 to-primary/10", border: "border-primary/30", glow: "bg-primary/20", cap: "bg-gold-dim", tip: "border-t-primary/30" },
    { body: "from-secondary/30 to-secondary/10", border: "border-secondary/30", glow: "bg-secondary/20", cap: "bg-secondary", tip: "border-t-secondary/30" },
    { body: "from-accent/30 to-accent/10", border: "border-accent/30", glow: "bg-accent/20", cap: "bg-accent", tip: "border-t-accent/30" },
  ];
  const c = colors[colorVariant % colors.length];

  return (
    <div
      className="absolute top-0 animate-lantern-sway"
      style={{ left, animationDelay: delay }}
    >
      <div className="mx-auto w-px bg-gold-dim" style={{ height: `${size * 0.6}rem` }} />
      <div className="relative flex flex-col items-center">
        <div
          className={`rounded-t-sm ${c.cap}`}
          style={{ width: `${size * 0.4}rem`, height: `${size * 0.15}rem` }}
        />
        <div
          className={`relative rounded-b-full bg-gradient-to-b ${c.body} ${c.border} border`}
          style={{ width: `${size * 0.6}rem`, height: `${size * 0.9}rem` }}
        >
          <div
            className={`absolute inset-2 rounded-b-full ${c.glow} animate-lantern-glow`}
            style={{ animationDelay: delay }}
          />
        </div>
        <div
          className={`w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent ${c.tip}`}
        />
      </div>
    </div>
  );
};

const Lanterns = ({ count = 10 }: LanternProps) => {
  const lanterns = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i / count) * 100 + Math.random() * 5}%`,
      delay: `${Math.random() * 3}s`,
      size: 2 + Math.random() * 1.5,
      colorVariant: i,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {lanterns.map((l) => (
        <Lantern key={l.id} left={l.left} delay={l.delay} size={l.size} colorVariant={l.colorVariant} />
      ))}
    </div>
  );
};

export default Lanterns;
