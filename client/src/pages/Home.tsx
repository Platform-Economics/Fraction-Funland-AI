import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Mascot } from "@/components/Mascot";
import { GameBadge } from "@/components/Badge";
import { LessonIntro } from "@/components/LessonIntro";
import { Quiz } from "@/components/Quiz";
import { ProgressBar } from "@/components/ProgressBar";
import { Star, Trophy, ArrowLeft, Flame } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Lesson, Question, UserProgress } from "@shared/schema";

type GameState = "welcome" | "intro" | "quiz" | "complete";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { data: lessons = [], isLoading: loadingLessons } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  const { data: progress, isLoading: loadingProgress } = useQuery<UserProgress>({
    queryKey: ["/api/progress"],
  });

  const { data: questions = [] } = useQuery<Question[]>({
    queryKey: ["/api/lessons", selectedLesson?.id, "questions"],
    enabled: !!selectedLesson?.id,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data: { lessonId: string; score: number; totalQuestions: number }) => {
      return apiRequest("POST", "/api/progress", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setGameState("intro");
  };

  const handleStartQuiz = () => {
    setGameState("quiz");
  };

  const handleQuizComplete = (score: number) => {
    if (selectedLesson) {
      updateProgressMutation.mutate({
        lessonId: selectedLesson.id,
        score,
        totalQuestions: questions.length,
      });
    }
    setGameState("complete");
  };

  const handleBackToHome = () => {
    setGameState("welcome");
    setSelectedLesson(null);
  };

  const currentLesson = lessons[0];
  const lessonProgress = progress?.lessonProgress?.find(p => p.lessonId === currentLesson?.id);

  if (loadingLessons || loadingProgress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Mascot mood="thinking" size="large" message="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/30 to-pink-50/30 dark:from-background dark:via-purple-950/20 dark:to-pink-950/20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {gameState !== "welcome" && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleBackToHome}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Fraction Fun
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {progress && (
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-1 text-orange-500" data-testid="counter-streak">
                  <Flame className="w-5 h-5 fill-current" />
                  <span className="font-bold" data-testid="text-streak-value">{progress.currentStreak}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500" data-testid="counter-correct">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold" data-testid="text-correct-value">{progress.totalCorrect}</span>
                </div>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        {gameState === "welcome" && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Mascot mood="happy" size="large" className="mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  Fraction Fun!
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                Learn fractions the fun way with colorful visuals, games, and rewards!
              </p>
            </motion.div>

            {progress && progress.earnedBadges.length > 0 && (
              <motion.div
                className="mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-center">Your Badges</h3>
                <div className="flex justify-center gap-6 flex-wrap">
                  {progress.earnedBadges.slice(0, 4).map((badgeId) => (
                    <GameBadge
                      key={badgeId}
                      type="star"
                      name={badgeId}
                      earned
                      size="medium"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-display font-bold mb-6">Today's Lesson</h3>
              
              {currentLesson && (
                <Card
                  className="overflow-hidden cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => handleSelectLesson(currentLesson)}
                  data-testid="card-lesson-1"
                >
                  <div className="grid md:grid-cols-3 gap-0">
                    <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-6 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl font-display font-bold mb-2">1/2</div>
                        <p className="text-lg opacity-90">What are Fractions?</p>
                      </div>
                    </div>
                    <div className="md:col-span-2 p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h4 className="text-2xl font-display font-bold mb-2" data-testid="text-lesson-title">{currentLesson.title}</h4>
                          <p className="text-muted-foreground" data-testid="text-lesson-description">{currentLesson.description}</p>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 ${
                                lessonProgress && lessonProgress.score >= star
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {lessonProgress && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{Math.round((lessonProgress.correctAnswers / lessonProgress.totalQuestions) * 100)}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${(lessonProgress.correctAnswers / lessonProgress.totalQuestions) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <Button size="lg" className="w-full md:w-auto" data-testid="button-start-lesson-card">
                        {lessonProgress ? "Continue Learning" : "Start Lesson"}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>

            <motion.div
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-4 text-center" data-testid="card-stat-badges">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold" data-testid="text-stat-badges">{progress?.earnedBadges.length || 0}</div>
                <div className="text-sm text-muted-foreground">Badges Earned</div>
              </Card>
              <Card className="p-4 text-center" data-testid="card-stat-correct">
                <Star className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold" data-testid="text-stat-correct">{progress?.totalCorrect || 0}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </Card>
              <Card className="p-4 text-center" data-testid="card-stat-streak">
                <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold" data-testid="text-stat-streak">{progress?.currentStreak || 0}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </Card>
              <Card className="p-4 text-center" data-testid="card-stat-best">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                  {progress?.bestStreak || 0}
                </div>
                <div className="text-2xl font-bold" data-testid="text-stat-best">{progress?.bestStreak || 0}</div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </Card>
            </motion.div>
          </div>
        )}

        {gameState === "intro" && selectedLesson && (
          <LessonIntro lesson={selectedLesson} onStart={handleStartQuiz} />
        )}

        {gameState === "quiz" && questions.length > 0 && (
          <Quiz
            questions={questions}
            onComplete={handleQuizComplete}
            onExit={handleBackToHome}
          />
        )}

        {gameState === "complete" && (
          <div className="max-w-lg mx-auto px-4 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Mascot mood="celebrating" size="large" className="mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold mb-4">
              Great Work Today!
            </h2>
            <p className="text-muted-foreground mb-8">
              You're making amazing progress with fractions. Come back tomorrow to continue learning!
            </p>
            <Button size="lg" onClick={handleBackToHome} data-testid="button-back-home">
              Back to Home
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
