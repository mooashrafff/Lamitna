import { Moon, Star, UtensilsCrossed, ClipboardList, ShoppingCart } from "lucide-react";

const STEPS = [
  { key: 1, icon: Moon },
  { key: 2, icon: Star },
  { key: 3, icon: UtensilsCrossed },
  { key: 4, icon: ClipboardList },
  { key: 5, icon: ShoppingCart },
];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {STEPS.map(({ key, icon: Icon }, i) => {
        const isActive = key === currentStep;
        const isPast = key < currentStep;
        return (
          <div key={key} className="flex items-center">
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors ${
                isActive
                  ? "bg-primary border-primary text-primary-foreground"
                  : isPast
                    ? "bg-primary/80 border-primary text-primary-foreground"
                    : "border-muted-foreground/40 text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-6 h-0.5 mx-0.5 ${
                  isPast ? "bg-primary/60" : "bg-muted-foreground/30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
