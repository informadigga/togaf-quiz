import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const createQuizSessionSchema = z.object({
  questionCount: z.number().min(20).max(60).default(20),
  userName: z.string().min(1).max(50)
});

const loginSchema = z.object({
  userName: z.string().min(1).max(50)
});

const updateQuizSessionSchema = z.object({
  answers: z.record(z.string()).optional(),
  timeRemaining: z.number().optional(),
  timeElapsed: z.number().optional(),
  completed: z.boolean().optional()
});

const submitAnswerSchema = z.object({
  questionId: z.number(),
  answer: z.string()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all questions
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // User login/create
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { userName } = loginSchema.parse(req.body);
      
      // Special handling for flush user
      if (userName.toLowerCase() === 'flush') {
        await storage.flushScoreboards();
        res.json({ id: 999, username: 'flush', displayName: 'Scoreboards Flushed' });
        return;
      }
      
      const user = await storage.findOrCreateUserByName(userName);
      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login", error: error.message });
    }
  });

  // Create a new quiz session (simplified version)
  app.post("/api/quiz/start", async (req, res) => {
    try {
      console.log("Quiz start request:", req.body);
      const { questionCount, userName } = createQuizSessionSchema.parse(req.body);
      
      // Find or create user
      const user = await storage.findOrCreateUserByName(userName);
      console.log("User found/created:", user);
      
      // Get all questions
      const allQuestions = await storage.getAllQuestions();
      console.log("Total questions available:", allQuestions.length);
      
      // Select random questions
      const shuffled = [...allQuestions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const selectedQuestions = shuffled.slice(0, questionCount);
      const questionIds = selectedQuestions.map(q => q.id);
      
      console.log("Selected question IDs:", questionIds);
      
      // Create quiz session
      const session = await storage.createQuizSession({
        userId: user.id,
        questionIds,
        answers: {},
        totalQuestions: questionCount,
        timeRemaining: questionCount === 30 ? 30 * 60 : 60 * 60,
        timeElapsed: 0
      });
      
      console.log("Quiz session created:", session);
      res.json(session);
    } catch (error) {
      console.error("Error starting quiz:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      res.status(500).json({ 
        message: "Failed to create quiz session", 
        error: error.message,
        stack: error.stack 
      });
    }
  });

  // Get quiz session
  app.get("/api/quiz/:sessionId", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const session = await storage.getQuizSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Quiz session not found" });
      }
      
      console.log("Session questionIds:", session.questionIds, "Type:", typeof session.questionIds);
      const questionIds = Array.isArray(session.questionIds) ? session.questionIds : JSON.parse(session.questionIds as string);
      console.log("Parsed questionIds:", questionIds);
      const questions = await storage.getQuestionsByIds(questionIds);
      console.log("Found questions:", questions.length);
      
      res.json({
        session,
        questions
      });
    } catch (error) {
      console.error("Error fetching quiz session:", error);
      res.status(500).json({ message: "Failed to fetch quiz session" });
    }
  });

  // Update quiz session (save answers, update timer)
  app.put("/api/quiz/:sessionId", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const updates = updateQuizSessionSchema.parse(req.body);
      
      const session = await storage.updateQuizSession(sessionId, updates);
      
      if (!session) {
        return res.status(404).json({ message: "Quiz session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Error updating quiz session:", error);
      res.status(500).json({ message: "Failed to update quiz session" });
    }
  });

  // Submit quiz and calculate score
  app.post("/api/quiz/:sessionId/submit", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const session = await storage.getQuizSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Quiz session not found" });
      }
      
      const questions = await storage.getQuestionsByIds(session.questionIds as number[]);
      const answers = session.answers as Record<string, string>;
      
      let correctAnswers = 0;
      const results = questions.map((question: any) => {
        const userAnswer = answers[question.id.toString()];
        const isCorrect = userAnswer === question.answer;
        if (isCorrect) correctAnswers++;
        
        return {
          questionId: question.id,
          question: question.question,
          options: question.options,
          correctAnswer: question.answer,
          userAnswer: userAnswer || null,
          isCorrect
        };
      });
      
      // Questions are already marked as seen when quiz session is created
      // No need to mark them again here
      
      const score = correctAnswers;
      const percentage = Math.round((correctAnswers / questions.length) * 100);
      
      await storage.updateQuizSession(sessionId, {
        score,
        percentage,
        timeElapsed: session.timeElapsed || 0,
        completed: true
      });
      
      res.json({
        score,
        totalQuestions: questions.length,
        percentage,
        results
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit quiz" });
    }
  });

  // Get user progress
  app.get("/api/user/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      console.log(`Getting progress for user ${userId}`);
      
      const history = await storage.getUserQuestionHistory(userId);
      const allQuestions = await storage.getAllQuestions();
      const unseenQuestions = await storage.getUnseenQuestions(userId);
      
      const progressData = {
        totalQuestions: allQuestions.length,
        seenQuestions: history.length,
        unseenQuestions: unseenQuestions.length,
        progressPercentage: Math.round((history.length / allQuestions.length) * 100)
      };
      
      console.log(`Progress data for user ${userId}:`, progressData);
      res.json(progressData);
    } catch (error) {
      console.error("Error getting user progress:", error);
      res.status(500).json({ message: "Failed to get user progress" });
    }
  });

  // Reset user progress
  app.post("/api/user/:userId/reset", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.resetUserProgress(userId);
      res.json({ message: "Progress reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset progress" });
    }
  });

  // Get global leaderboard
  app.get("/api/leaderboard/global", async (req, res) => {
    try {
      const questionCount = req.query.questionCount ? parseInt(req.query.questionCount as string) : undefined;
      const leaderboard = await storage.getGlobalLeaderboard(questionCount);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get global leaderboard" });
    }
  });

  // Get user leaderboard
  app.get("/api/leaderboard/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const questionCount = req.query.questionCount ? parseInt(req.query.questionCount as string) : undefined;
      const leaderboard = await storage.getUserLeaderboard(userId, questionCount);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user leaderboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
