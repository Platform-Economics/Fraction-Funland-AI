import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GameBadge } from "./Badge";
import { Mascot } from "./Mascot";
import { Star, ArrowRight, RotateCcw } from "lucide-react";

interface CelebrationModalProps {
  isOpen: boolean;
  score: number;
  totalQuestions: number;
  newBadges?: Array<{ type: string; name: string; description: string }>;
  onContinue: () => void;
  onRetry?: () => void;
}

function Confetti() {
  const colors = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 20,
            rotate: Math.random() * 720 - 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function CelebrationModal({
  isOpen,
  score,
  totalQuestions,
  newBadges = [],
  onContinue,
  onRetry,
}: CelebrationModalProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPerfect = score === totalQuestions;
  const isGood = percentage >= 70;

  const getMessage = () => {
    if (isPerfect) return "Perfect Score! You're Amazing!";
    if (percentage >= 80) return "Fantastic Work!";
    if (percentage >= 60) return "Great Job! Keep Learning!";
    return "Good Try! Practice Makes Perfect!";
  };

  const getMascotMood = () => {
    if (isPerfect) return "celebrating";
    if (isGood) return "excited";
    return "encouraging";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {isPerfect && <Confetti />}
          
          <motion.div
            className="bg-card border border-card-border rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Mascot mood={getMascotMood()} size="large" className="mx-auto mb-6" />
            
            <motion.h2
              className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {getMessage()}
            </motion.h2>
            
            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <div className="flex gap-1">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-8 h-8 ${
                      i < score
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
            
            <motion.p
              className="text-xl font-semibold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              You got{" "}
              <span className="text-primary">{score}</span> out of{" "}
              <span className="text-secondary">{totalQuestions}</span> correct!
            </motion.p>

            {newBadges.length > 0 && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-muted-foreground mb-3">New Badges Earned!</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {newBadges.map((badge) => (
                    <GameBadge
                      key={badge.name}
                      type={badge.type as any}
                      name={badge.name}
                      description={badge.description}
                      earned
                      size="medium"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              className="flex gap-3 justify-center flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {!isGood && onRetry && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onRetry}
                  data-testid="button-retry"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </Button>
              )}
              <Button
                size="lg"
                onClick={onContinue}
                data-testid="button-continue"
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
