import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface AnswerOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null;
  showResult: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function AnswerOption({
  option,
  index,
  isSelected,
  isCorrect,
  showResult,
  onClick,
  disabled = false,
}: AnswerOptionProps) {
  const letters = ["A", "B", "C", "D"];

  const getBackgroundColor = () => {
    if (!showResult) {
      if (isSelected) return "bg-primary/20 border-primary";
      return "bg-card border-card-border hover:bg-muted";
    }
    if (isCorrect === true) return "bg-green-100 dark:bg-green-900/30 border-green-500";
    if (isCorrect === false && isSelected) return "bg-red-100 dark:bg-red-900/30 border-red-500";
    return "bg-card border-card-border opacity-50";
  };

  return (
    <motion.button
      className={`
        relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left w-full
        transition-colors ${getBackgroundColor()}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      data-testid={`button-answer-${index}`}
    >
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
          ${showResult && isCorrect === true
            ? "bg-green-500 text-white"
            : showResult && isCorrect === false && isSelected
            ? "bg-red-500 text-white"
            : isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
          }
        `}
      >
        {showResult && isCorrect === true ? (
          <Check className="w-5 h-5" />
        ) : showResult && isCorrect === false && isSelected ? (
          <X className="w-5 h-5" />
        ) : (
          letters[index]
        )}
      </div>
      <span className="text-xl font-semibold flex-1">{option}</span>
      {showResult && isCorrect === true && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-green-600 dark:text-green-400 font-semibold"
        >
          Correct!
        </motion.div>
      )}
    </motion.button>
  );
}
