import { motion } from "framer-motion";
import { Star, Trophy, Flame, Target, Zap, Award, Medal, Crown } from "lucide-react";

type BadgeType = "star" | "trophy" | "flame" | "target" | "zap" | "award" | "medal" | "crown";

interface BadgeProps {
  type: BadgeType;
  name: string;
  description?: string;
  earned?: boolean;
  size?: "small" | "medium" | "large";
  showDetails?: boolean;
  className?: string;
}

const badgeIcons: Record<BadgeType, typeof Star> = {
  star: Star,
  trophy: Trophy,
  flame: Flame,
  target: Target,
  zap: Zap,
  award: Award,
  medal: Medal,
  crown: Crown,
};

const badgeColors: Record<BadgeType, { bg: string; icon: string; glow: string }> = {
  star: {
    bg: "from-yellow-300 to-orange-400",
    icon: "text-yellow-700",
    glow: "shadow-yellow-400/50",
  },
  trophy: {
    bg: "from-amber-300 to-yellow-500",
    icon: "text-amber-700",
    glow: "shadow-amber-400/50",
  },
  flame: {
    bg: "from-orange-400 to-red-500",
    icon: "text-orange-800",
    glow: "shadow-orange-400/50",
  },
  target: {
    bg: "from-green-400 to-emerald-500",
    icon: "text-green-800",
    glow: "shadow-green-400/50",
  },
  zap: {
    bg: "from-purple-400 to-pink-500",
    icon: "text-purple-800",
    glow: "shadow-purple-400/50",
  },
  award: {
    bg: "from-blue-400 to-indigo-500",
    icon: "text-blue-800",
    glow: "shadow-blue-400/50",
  },
  medal: {
    bg: "from-rose-400 to-pink-500",
    icon: "text-rose-800",
    glow: "shadow-rose-400/50",
  },
  crown: {
    bg: "from-yellow-400 to-amber-500",
    icon: "text-yellow-800",
    glow: "shadow-yellow-500/50",
  },
};

export function GameBadge({
  type,
  name,
  description,
  earned = false,
  size = "medium",
  showDetails = true,
  className = "",
}: BadgeProps) {
  const Icon = badgeIcons[type];
  const colors = badgeColors[type];

  const sizeClasses = {
    small: { container: "w-12 h-12", icon: "w-6 h-6" },
    medium: { container: "w-16 h-16", icon: "w-8 h-8" },
    large: { container: "w-20 h-20", icon: "w-10 h-10" },
  };

  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className={`
          ${sizeClasses[size].container} 
          rounded-full 
          flex items-center justify-center
          ${earned 
            ? `bg-gradient-to-br ${colors.bg} shadow-lg ${colors.glow}` 
            : "bg-muted border-2 border-dashed border-muted-foreground/30"
          }
        `}
        whileHover={earned ? { scale: 1.1, rotate: 5 } : {}}
        animate={earned ? {
          boxShadow: [
            `0 0 20px 0 rgba(255,200,0,0.3)`,
            `0 0 30px 5px rgba(255,200,0,0.5)`,
            `0 0 20px 0 rgba(255,200,0,0.3)`,
          ],
        } : {}}
        transition={{ duration: 2, repeat: earned ? Infinity : 0 }}
      >
        <Icon
          className={`
            ${sizeClasses[size].icon}
            ${earned ? colors.icon : "text-muted-foreground/40"}
          `}
          fill={earned ? "currentColor" : "none"}
        />
      </motion.div>
      {showDetails && (
        <div className="text-center">
          <p className={`text-sm font-semibold ${earned ? "text-foreground" : "text-muted-foreground"}`}>
            {name}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
