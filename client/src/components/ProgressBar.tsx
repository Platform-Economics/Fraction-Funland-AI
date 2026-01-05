import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface ProgressBarProps {
  current: number;
  total: number;
  showStars?: boolean;
  className?: string;
}

export function ProgressBar({ current, total, showStars = true, className = "" }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  const starPositions = [25, 50, 75, 100];

  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-5 bg-muted rounded-full overflow-hidden border border-border">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {showStars && starPositions.map((pos) => (
          <div
            key={pos}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${pos}%` }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: percentage >= pos ? 1.2 : 1,
                rotate: percentage >= pos ? 360 : 0
              }}
              transition={{ duration: 0.5, delay: percentage >= pos ? 0.3 : 0 }}
            >
              <Star
                className={`w-4 h-4 ${
                  percentage >= pos
                    ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                    : "text-muted-foreground/50"
                }`}
              />
            </motion.div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-sm text-muted-foreground">
        <span>Question {current} of {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}
