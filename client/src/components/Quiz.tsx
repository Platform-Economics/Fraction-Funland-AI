import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { FractionVisual } from "./FractionVisual";
import { AnswerOption } from "./AnswerOption";
import { Mascot } from "./Mascot";
import { CelebrationModal } from "./CelebrationModal";
import { SketchPad, getEquationSteps } from "./SketchPad";
import { Lightbulb, ArrowRight, Volume2, VolumeX, PenLine } from "lucide-react";
import { soundManager } from "@/lib/sounds";
import type { Question } from "@shared/schema";

interface QuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
  onExit: () => void;
}

export function Quiz({ questions, onComplete, onExit }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSketchPad, setShowSketchPad] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    soundManager.playClick();
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    setShowResult(true);
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers([...answers, correct]);
    
    if (correct) {
      setScore(score + 1);
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.setEnabled(newState);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (isLastQuestion) {
      soundManager.playCelebration();
      setShowCelebration(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    }
  };

  const handleComplete = () => {
    onComplete(score);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
    setScore(0);
    setShowCelebration(false);
    setAnswers([]);
  };

  const getMascotMood = () => {
    if (showResult && isCorrect) return "celebrating";
    if (showResult && !isCorrect) return "encouraging";
    if (showHint) return "thinking";
    return "happy";
  };

  const getMascotMessage = () => {
    if (showResult && isCorrect) return "Amazing! You got it!";
    if (showResult && !isCorrect) return "That's okay! Keep trying!";
    if (showHint) return currentQuestion.hint || "Think about it carefully!";
    return "You can do this!";
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <ProgressBar
          current={currentIndex + 1}
          total={questions.length}
          className="flex-1 mr-4"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleSound}
          data-testid="button-toggle-sound"
          aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <motion.h2
                className="text-xl md:text-2xl font-display font-bold text-foreground"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                data-testid="text-question"
              >
                {currentQuestion.question}
              </motion.h2>
              <div className="flex gap-1">
                {!showResult && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowSketchPad(true)}
                    data-testid="button-sketchpad"
                    title="Open Scratch Pad"
                  >
                    <PenLine className="w-5 h-5" />
                  </Button>
                )}
                {currentQuestion.hint && !showResult && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowHint(!showHint)}
                    data-testid="button-hint"
                    className={showHint ? "text-primary" : ""}
                  >
                    <Lightbulb className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>

            {(currentQuestion.visualType && currentQuestion.numerator !== undefined && currentQuestion.denominator !== undefined) && (
              <div className="flex justify-center mb-8">
                <FractionVisual
                  numerator={currentQuestion.numerator}
                  denominator={currentQuestion.denominator}
                  type={currentQuestion.visualType}
                  size="medium"
                  showLabel={false}
                />
              </div>
            )}

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <AnswerOption
                  key={index}
                  option={option}
                  index={index}
                  isSelected={selectedAnswer === option}
                  isCorrect={
                    showResult
                      ? option === currentQuestion.correctAnswer
                        ? true
                        : selectedAnswer === option
                        ? false
                        : null
                      : null
                  }
                  showResult={showResult}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={showResult}
                />
              ))}
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4">
              <Mascot
                mood={getMascotMood()}
                size="small"
                message={showHint || showResult ? getMascotMessage() : undefined}
              />

              {!showResult ? (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  data-testid="button-check-answer"
                  className="gap-2"
                >
                  Check Answer
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleNext}
                  data-testid="button-next-question"
                  className="gap-2"
                >
                  {isLastQuestion ? "See Results" : "Next Question"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <CelebrationModal
        isOpen={showCelebration}
        score={score}
        totalQuestions={questions.length}
        newBadges={
          score === questions.length
            ? [{ type: "star", name: "Perfect Score!", description: "Got all answers correct" }]
            : []
        }
        onContinue={handleComplete}
        onRetry={handleRetry}
      />

      <AnimatePresence>
        {showSketchPad && currentQuestion && (
          <SketchPad
            {...getEquationSteps(currentQuestion.question)}
            onClose={() => setShowSketchPad(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
