import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.15, duration: 0.5 }}
    className="flex flex-col items-center text-center p-6 rounded-xl bg-card/80 border border-border backdrop-blur-sm hover:bg-card hover:border-primary/30 transition-colors"
  >
    <div className="mb-4 text-primary text-3xl">{icon}</div>
    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default FeatureCard;
