import { z } from "zod";

export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  whyItMatters: z.string(),
  realWorldExamples: z.array(z.object({
    icon: z.string(),
    text: z.string(),
  })),
  order: z.number(),
});

export const questionSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  type: z.enum(["multiple-choice", "visual-select", "drag-drop"]),
  question: z.string(),
  visualType: z.enum(["pizza", "bar", "circles", "objects"]).optional(),
  numerator: z.number().optional(),
  denominator: z.number().optional(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  hint: z.string().optional(),
  order: z.number(),
});

export const badgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  requirement: z.object({
    type: z.enum(["lesson-complete", "streak", "perfect-score", "total-correct"]),
    value: z.number(),
    lessonId: z.string().optional(),
  }),
});

export const progressSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean(),
  score: z.number(),
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  attempts: z.number(),
});

export const userProgressSchema = z.object({
  id: z.string(),
  totalCorrect: z.number(),
  currentStreak: z.number(),
  bestStreak: z.number(),
  earnedBadges: z.array(z.string()),
  lessonProgress: z.array(progressSchema),
});

export type Lesson = z.infer<typeof lessonSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Badge = z.infer<typeof badgeSchema>;
export type Progress = z.infer<typeof progressSchema>;
export type UserProgress = z.infer<typeof userProgressSchema>;

export const insertProgressSchema = progressSchema;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

export const users = null;
export type InsertUser = { username: string; password: string };
export type User = { id: string; username: string; password: string };
