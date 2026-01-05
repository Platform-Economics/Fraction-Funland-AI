import { motion, type TargetAndTransition } from "framer-motion";

type MascotMood = "happy" | "excited" | "thinking" | "encouraging" | "celebrating";

interface MascotProps {
  mood?: MascotMood;
  message?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

export function Mascot({ mood = "happy", message, size = "medium", className = "" }: MascotProps) {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  };

  const moodEmotes: Record<MascotMood, { eyes: string; mouth: string; animation: TargetAndTransition }> = {
    happy: {
      eyes: "^",
      mouth: "◡",
      animation: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2 } },
    },
    excited: {
      eyes: "★",
      mouth: "D",
      animation: { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.5 } },
    },
    thinking: {
      eyes: "◔",
      mouth: "~",
      animation: { rotate: [0, 5, -5, 0], transition: { repeat: Infinity, duration: 2 } },
    },
    encouraging: {
      eyes: "◠",
      mouth: "◡",
      animation: { y: [0, -3, 0], transition: { repeat: Infinity, duration: 1.5 } },
    },
    celebrating: {
      eyes: "✧",
      mouth: "D",
      animation: { 
        scale: [1, 1.15, 1], 
        rotate: [0, 10, -10, 0],
        transition: { repeat: Infinity, duration: 0.8 } 
      },
    },
  };

  const current = moodEmotes[mood];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={current.animation}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 dark:from-purple-500 dark:via-pink-500 dark:to-orange-400 flex items-center justify-center shadow-lg">
          <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-300 dark:to-orange-300 flex flex-col items-center justify-center">
            <div className="flex gap-3 text-lg font-bold text-purple-700">
              <span>{current.eyes}</span>
              <span>{current.eyes}</span>
            </div>
            <div className="text-xl font-bold text-pink-600 mt-1">
              {current.mouth}
            </div>
          </div>
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-yellow-100"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-2xl px-4 py-2 max-w-[200px] text-center shadow-md"
        >
          <p className="text-sm font-medium">{message}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-b border-r border-card-border rotate-45" />
        </motion.div>
      )}
    </div>
  );
}
