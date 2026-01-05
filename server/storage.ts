import type { Lesson, Question, UserProgress, Progress } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  getQuestionsByLesson(lessonId: string): Promise<Question[]>;
  getUserProgress(): Promise<UserProgress>;
  updateProgress(lessonId: string, score: number, totalQuestions: number): Promise<UserProgress>;
}

const LESSONS: Lesson[] = [
  {
    id: "lesson-1",
    title: "What Are Fractions?",
    description: "Learn the basics of fractions - what they mean and how to read them!",
    whyItMatters: "Fractions are everywhere in your daily life! When you share a pizza with friends, measure ingredients for a recipe, or tell time, you're using fractions. Understanding fractions helps you be fair when sharing and makes math a lot easier!",
    realWorldExamples: [
      { icon: "pizza", text: "Sharing pizza equally with friends" },
      { icon: "ruler", text: "Measuring half a cup for a recipe" },
      { icon: "users", text: "Splitting treats fairly with siblings" },
    ],
    order: 1,
  },
  {
    id: "lesson-2",
    title: "Division Made Easy!",
    description: "Learn how to divide things into equal groups - it's like sharing!",
    whyItMatters: "Division helps you share things fairly! When you split candy with friends, divide toys into groups, or figure out how many pieces everyone gets, you're using division. It's one of the most useful math skills you'll ever learn!",
    realWorldExamples: [
      { icon: "users", text: "Sharing 12 cookies among 4 friends equally" },
      { icon: "pizza", text: "Cutting a pizza into equal slices for everyone" },
      { icon: "ruler", text: "Splitting your allowance into savings and spending" },
    ],
    order: 2,
  },
];

const QUESTIONS: Question[] = [
  {
    id: "q1",
    lessonId: "lesson-1",
    type: "visual-select",
    question: "Look at the pizza! What fraction of it is colored?",
    visualType: "pizza",
    numerator: 3,
    denominator: 4,
    options: ["1/2", "3/4", "2/4", "1/4"],
    correctAnswer: "3/4",
    hint: "Count how many slices are colored, then count the total number of slices!",
    order: 1,
  },
  {
    id: "q2",
    lessonId: "lesson-1",
    type: "visual-select",
    question: "How much of this chocolate bar is left?",
    visualType: "bar",
    numerator: 2,
    denominator: 5,
    options: ["2/5", "3/5", "1/5", "4/5"],
    correctAnswer: "2/5",
    hint: "The colored pieces show what's left. Count them and the total!",
    order: 2,
  },
  {
    id: "q3",
    lessonId: "lesson-1",
    type: "multiple-choice",
    question: "If you have 8 apples and give away 2, what fraction did you give away?",
    options: ["2/8", "6/8", "2/6", "8/2"],
    correctAnswer: "2/8",
    hint: "The top number (numerator) is what you gave away. The bottom number (denominator) is how many you started with!",
    order: 3,
  },
  {
    id: "q4",
    lessonId: "lesson-1",
    type: "visual-select",
    question: "What fraction of these circles is colored?",
    visualType: "circles",
    numerator: 1,
    denominator: 3,
    options: ["1/2", "1/3", "2/3", "3/3"],
    correctAnswer: "1/3",
    hint: "One circle is colored out of three total circles!",
    order: 4,
  },
  {
    id: "q5",
    lessonId: "lesson-1",
    type: "multiple-choice",
    question: "In the fraction 3/4, what does the number 4 mean?",
    options: [
      "The total number of equal parts",
      "How many parts we have",
      "How many are left over",
      "The answer",
    ],
    correctAnswer: "The total number of equal parts",
    hint: "The bottom number (denominator) tells us how many equal pieces something is divided into!",
    order: 5,
  },
  {
    id: "d1",
    lessonId: "lesson-2",
    type: "multiple-choice",
    question: "You have 12 cookies and want to share them equally with 3 friends. How many cookies does each person get?",
    options: ["3 cookies", "4 cookies", "6 cookies", "2 cookies"],
    correctAnswer: "4 cookies",
    hint: "If there are 4 people total (you + 3 friends), divide 12 by 4!",
    order: 1,
  },
  {
    id: "d2",
    lessonId: "lesson-2",
    type: "visual-select",
    question: "Look at the circles! If we divide 6 circles into 2 equal groups, how many are in each group?",
    visualType: "circles",
    numerator: 3,
    denominator: 6,
    options: ["2 circles", "3 circles", "4 circles", "6 circles"],
    correctAnswer: "3 circles",
    hint: "Split the 6 circles in half - how many are on each side?",
    order: 2,
  },
  {
    id: "d3",
    lessonId: "lesson-2",
    type: "multiple-choice",
    question: "What does 15 divided by 5 equal?",
    options: ["2", "3", "5", "10"],
    correctAnswer: "3",
    hint: "Think: how many groups of 5 can you make from 15?",
    order: 3,
  },
  {
    id: "d4",
    lessonId: "lesson-2",
    type: "multiple-choice",
    question: "You have 20 stickers and want to put them equally into 4 folders. How many stickers go in each folder?",
    options: ["4 stickers", "5 stickers", "6 stickers", "10 stickers"],
    correctAnswer: "5 stickers",
    hint: "Divide the total (20) by the number of folders (4)!",
    order: 4,
  },
  {
    id: "d5",
    lessonId: "lesson-2",
    type: "visual-select",
    question: "If we divide this pizza into 4 equal slices, what fraction is each slice?",
    visualType: "pizza",
    numerator: 1,
    denominator: 4,
    options: ["1/2", "1/3", "1/4", "1/5"],
    correctAnswer: "1/4",
    hint: "When you divide something into 4 parts, each part is one out of four!",
    order: 5,
  },
];

export class MemStorage implements IStorage {
  private lessons: Map<string, Lesson>;
  private questions: Map<string, Question>;
  private userProgress: UserProgress;

  constructor() {
    this.lessons = new Map();
    this.questions = new Map();

    LESSONS.forEach((lesson) => {
      this.lessons.set(lesson.id, lesson);
    });

    QUESTIONS.forEach((question) => {
      this.questions.set(question.id, question);
    });

    this.userProgress = {
      id: "user-1",
      totalCorrect: 0,
      currentStreak: 1,
      bestStreak: 1,
      earnedBadges: [],
      lessonProgress: [],
    };
  }

  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).sort((a, b) => a.order - b.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getQuestionsByLesson(lessonId: string): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter((q) => q.lessonId === lessonId)
      .sort((a, b) => a.order - b.order);
  }

  async getUserProgress(): Promise<UserProgress> {
    return this.userProgress;
  }

  async updateProgress(lessonId: string, score: number, totalQuestions: number): Promise<UserProgress> {
    const existingProgressIndex = this.userProgress.lessonProgress.findIndex(
      (p) => p.lessonId === lessonId
    );

    const newProgress: Progress = {
      lessonId,
      completed: true,
      score,
      totalQuestions,
      correctAnswers: score,
      attempts: existingProgressIndex >= 0 
        ? this.userProgress.lessonProgress[existingProgressIndex].attempts + 1 
        : 1,
    };

    if (existingProgressIndex >= 0) {
      this.userProgress.lessonProgress[existingProgressIndex] = newProgress;
    } else {
      this.userProgress.lessonProgress.push(newProgress);
    }

    this.userProgress.totalCorrect += score;

    if (score === totalQuestions && !this.userProgress.earnedBadges.includes("Perfect Score")) {
      this.userProgress.earnedBadges.push("Perfect Score");
    }

    if (this.userProgress.totalCorrect >= 10 && !this.userProgress.earnedBadges.includes("Super Star")) {
      this.userProgress.earnedBadges.push("Super Star");
    }

    return this.userProgress;
  }
}

export const storage = new MemStorage();
