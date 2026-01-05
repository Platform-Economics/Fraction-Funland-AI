import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Mascot } from "@/components/Mascot";
import { GameBadge } from "@/components/Badge";
import { LessonIntro } from "@/components/LessonIntro";
import { Quiz } from "@/components/Quiz";
import { VisualTutorial } from "@/components/VisualTutorial";
import { Star, Trophy, ArrowLeft, Flame } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Lesson, Question, UserProgress } from "@shared/schema";
import backgroundImage from "@assets/freepik__sara-is-an-elementary-school-teacher-in-a-fairytal__4_1767594478975.png";
import welcomeVideo from "@assets/freepik__a-vibrant-animated-scene-unfolds-in-a-whimsical-fo__4_1767595518398.mp4";

type GameState = "splash" | "welcome" | "intro" | "tutorial" | "quiz" | "complete";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("splash");
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
    setGameState("tutorial");
  };

  const handleTutorialComplete = () => {
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

  const handleEnterApp = () => {
    setGameState("welcome");
  };

  const getLessonProgress = (lessonId: string) => {
    return progress?.lessonProgress?.find(p => p.lessonId === lessonId);
  };

  const getLessonIcon = (order: number) => {
    const icons = ["1/2", "12÷4", "2.5", "3/4"];
    return icons[(order - 1) % icons.length];
  };

  const getLessonGradient = (order: number) => {
    const gradients = [
      "from-purple-500 via-pink-500 to-orange-400",
      "from-blue-500 via-cyan-500 to-green-400",
      "from-orange-500 via-red-500 to-pink-400",
      "from-green-500 via-teal-500 to-blue-400",
    ];
    return gradients[(order - 1) % gradients.length];
  };

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
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background dark:from-background/80 dark:via-background/90 dark:to-background" />
      <div className="relative z-10">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {gameState !== "welcome" && gameState !== "splash" && (
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
        {gameState === "splash" && (
          <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-8">
            <motion.div
              className="max-w-lg w-full text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.h1
                className="text-4xl md:text-5xl font-display font-bold mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </motion.h1>
              <motion.h2
                className="text-5xl md:text-6xl font-display font-bold text-foreground mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                data-testid="text-welcome-name"
              >
                Chloe!
              </motion.h2>
              
              <motion.div
                className="rounded-2xl overflow-hidden shadow-2xl mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto max-h-[300px] object-cover"
                  data-testid="video-welcome"
                >
                  <source src={welcomeVideo} type="video/mp4" />
                </video>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  size="lg"
                  className="text-xl px-8 py-6 gap-2"
                  onClick={handleEnterApp}
                  data-testid="button-start-playing"
                >
                  <Star className="w-6 h-6" />
                  Start Playing!
                </Button>
              </motion.div>
            </motion.div>
          </div>
        )}

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
              <h3 className="text-2xl font-display font-bold mb-6">Your Lessons</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {lessons.map((lesson, index) => {
                  const lessonProg = getLessonProgress(lesson.id);
                  return (
                    <Card
                      key={lesson.id}
                      className="overflow-hidden cursor-pointer hover-elevate active-elevate-2"
                      onClick={() => handleSelectLesson(lesson)}
                      data-testid={`card-lesson-${lesson.order}`}
                    >
                      <div className="flex flex-col">
                        <div className={`bg-gradient-to-br ${getLessonGradient(lesson.order)} p-6 flex items-center justify-center`}>
                          <div className="text-center text-white">
                            <div className="text-5xl font-display font-bold mb-2">{getLessonIcon(lesson.order)}</div>
                            <p className="text-base opacity-90">Lesson {lesson.order}</p>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <h4 className="text-xl font-display font-bold mb-1" data-testid={`text-lesson-title-${lesson.order}`}>{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-lesson-desc-${lesson.order}`}>{lesson.description}</p>
                            </div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-5 h-5 ${
                                    lessonProg && lessonProg.score >= star
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {lessonProg && (
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{Math.round((lessonProg.correctAnswers / lessonProg.totalQuestions) * 100)}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                  style={{ width: `${(lessonProg.correctAnswers / lessonProg.totalQuestions) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                          <Button size="default" className="w-full" data-testid={`button-start-lesson-${lesson.order}`}>
                            {lessonProg ? "Continue" : "Start Lesson"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
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

        {gameState === "tutorial" && selectedLesson && (
          <VisualTutorial
            lessonId={selectedLesson.id}
            onComplete={handleTutorialComplete}
          />
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
    </div>
  );
}
