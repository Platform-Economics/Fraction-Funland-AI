import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
import { textToSpeech } from "./replit_integrations/audio/client";

// Cache directory for generated audio files
const AUDIO_CACHE_DIR = path.join(process.cwd(), "audio_cache");
if (!fs.existsSync(AUDIO_CACHE_DIR)) {
  fs.mkdirSync(AUDIO_CACHE_DIR, { recursive: true });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessons();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lesson" });
    }
  });

  app.get("/api/lessons/:id/questions", async (req, res) => {
    try {
      const questions = await storage.getQuestionsByLesson(req.params.id);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  app.get("/api/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const { lessonId, score, totalQuestions } = req.body;
      
      if (!lessonId || typeof score !== "number" || typeof totalQuestions !== "number") {
        return res.status(400).json({ error: "Invalid request body" });
      }

      const progress = await storage.updateProgress(lessonId, score, totalQuestions);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // Welcome voice introduction endpoint
  app.get("/api/welcome-audio", async (req, res) => {
    try {
      const name = (req.query.name as string) || "friend";
      const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      const cacheFile = path.join(AUDIO_CACHE_DIR, `welcome-${sanitizedName}.wav`);
      
      // Check file cache first
      if (fs.existsSync(cacheFile)) {
        res.setHeader("Content-Type", "audio/wav");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.sendFile(cacheFile);
      }

      // Generate the welcome narration with enthusiasm
      const script = `Welcome to Fraction Fun! Hey ${name}, I'm so excited to learn fractions with you today! Get ready for a super fun adventure with pizzas, games, and awesome rewards! Let's do this!`;
      
      const audioBuffer = await textToSpeech(script, "nova", "wav");
      
      // Save to file cache
      fs.writeFileSync(cacheFile, audioBuffer);
      
      res.setHeader("Content-Type", "audio/wav");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(audioBuffer);
    } catch (error) {
      console.error("Error generating welcome audio:", error);
      res.status(500).json({ error: "Failed to generate welcome audio" });
    }
  });

  return httpServer;
}
