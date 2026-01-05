import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mascot } from "./Mascot";
import { ArrowRight, Pizza, Ruler, Users, Lightbulb } from "lucide-react";
import type { Lesson } from "@shared/schema";

interface LessonIntroProps {
  lesson: Lesson;
  onStart: () => void;
}

const iconMap: Record<string, typeof Pizza> = {
  pizza: Pizza,
  ruler: Ruler,
  users: Users,
  lightbulb: Lightbulb,
};

export function LessonIntro({ lesson, onStart }: LessonIntroProps) {
  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-8 flex flex-col items-center justify-center min-h-[300px]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <Mascot mood="excited" size="large" />
            </motion.div>
            <motion.h1
              className="text-3xl md:text-4xl font-display font-bold text-white text-center mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              data-testid="text-intro-title"
            >
              {lesson.title}
            </motion.h1>
          </div>
          
          <div className="p-8 flex flex-col justify-between">
            <div>
              <motion.div
                className="flex items-center gap-2 text-primary mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Lightbulb className="w-6 h-6" />
                <span className="text-lg font-semibold">Why This Matters</span>
              </motion.div>
              
              <motion.p
                className="text-lg text-muted-foreground mb-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                data-testid="text-why-it-matters"
              >
                {lesson.whyItMatters}
              </motion.p>

              <motion.div
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="font-semibold text-foreground">You'll use fractions when:</p>
                <div className="space-y-3">
                  {lesson.realWorldExamples.map((example, i) => {
                    const Icon = iconMap[example.icon] || Pizza;
                    return (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-foreground font-medium">{example.text}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            <motion.div
              className="mt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Button
                size="lg"
                className="w-full text-lg py-6 gap-2"
                onClick={onStart}
                data-testid="button-start-lesson"
              >
                Start Learning!
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
