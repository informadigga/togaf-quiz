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
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Create a new quiz session
  app.post("/api/quiz/start", async (req, res) => {
    try {
      const { questionCount, userName } = createQuizSessionSchema.parse(req.body);
      const user = await storage.findOrCreateUserByName(userName);
      
      // Get user progress to check completion
      const progress = await storage.getUserProgress(user.id);
      
      // If progress is complete (all questions seen), flush progress
      if (progress.progressPercentage >= 100) {
        await storage.resetUserProgress(user.id);
        console.log(`Progress flushed for user ${user.id} - all questions completed`);
      }
      
      // Get all questions and separate into seen/unseen lists
      const allQuestions = await storage.getAllQuestions();
      const unseenQuestions = await storage.getUnseenQuestions(user.id);
      
      // Create seen questions list (all questions minus unseen ones)
      const unseenIds = new Set(unseenQuestions.map(q => q.id));
      const seenQuestions = allQuestions.filter(q => !unseenIds.has(q.id));
      
      console.log(`Total questions: ${allQuestions.length}`);
      console.log(`Unseen questions: ${unseenQuestions.length}`);
      console.log(`Seen questions: ${seenQuestions.length}`);
      
      let selectedQuestions = [];
      
      if (unseenQuestions.length >= questionCount) {
        // Enough unseen questions - use only unseen questions
        console.log(`Using ${questionCount} unseen questions`);
        const shuffledUnseen = [...unseenQuestions];
        for (let i = shuffledUnseen.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledUnseen[i], shuffledUnseen[j]] = [shuffledUnseen[j], shuffledUnseen[i]];
        }
        selectedQuestions = shuffledUnseen.slice(0, questionCount);
      } else if (unseenQuestions.length > 0) {
        // Not enough unseen questions - put all unseen questions at the front, then fill with seen questions
        console.log(`Using all ${unseenQuestions.length} unseen questions at front + ${questionCount - unseenQuestions.length} seen questions as fillers`);
        
        // Start with all unseen questions (shuffled)
        const shuffledUnseen = [...unseenQuestions];
        for (let i = shuffledUnseen.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledUnseen[i], shuffledUnseen[j]] = [shuffledUnseen[j], shuffledUnseen[i]];
        }
        
        selectedQuestions = [...shuffledUnseen];
        
        // Fill remaining slots with seen questions
        if (seenQuestions.length > 0) {
          const shuffledSeen = [...seenQuestions];
          for (let i = shuffledSeen.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSeen[i], shuffledSeen[j]] = [shuffledSeen[j], shuffledSeen[i]];
          }
          
          const needed = questionCount - unseenQuestions.length;
          const fillerQuestions = shuffledSeen.slice(0, needed);
          selectedQuestions = [...selectedQuestions, ...fillerQuestions];
        }
      } else {
        // No unseen questions - reset progress and start fresh
        console.log(`No unseen questions available, resetting progress`);
        await storage.resetUserProgress(user.id);
        const freshQuestions = await storage.getAllQuestions();
        const shuffledFresh = [...freshQuestions];
        for (let i = shuffledFresh.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledFresh[i], shuffledFresh[j]] = [shuffledFresh[j], shuffledFresh[i]];
        }
        selectedQuestions = shuffledFresh.slice(0, questionCount);
      }
      
      const questionIds = selectedQuestions.map((q: any) => q.id);
      
      console.log(`Session questionIds: ${JSON.stringify(questionIds)} Type: ${typeof questionIds}`);
      console.log(`Unseen questions available: ${unseenQuestions.length}, Total needed: ${questionCount}`);
      
      const session = await storage.createQuizSession({
        userId: user.id,
        questionIds,
        answers: {},
        totalQuestions: questionCount,
        timeRemaining: questionCount === 30 ? 30 * 60 : 60 * 60,
        timeElapsed: 0
      });
      
      // Mark questions as seen immediately when quiz session is created
      await storage.markQuestionsAsSeen(user.id, questionIds);
      console.log(`Marked ${questionIds.length} questions as seen for user ${user.id}`);
      
      res.json(session);
    } catch (error) {
      console.error("Error starting quiz:", error);
      res.status(500).json({ message: "Failed to create quiz session" });
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
      const history = await storage.getUserQuestionHistory(userId);
      const allQuestions = await storage.getAllQuestions();
      const unseenQuestions = await storage.getUnseenQuestions(userId);
      
      res.json({
        totalQuestions: allQuestions.length,
        seenQuestions: history.length,
        unseenQuestions: unseenQuestions.length,
        progressPercentage: Math.round((history.length / allQuestions.length) * 100)
      });
    } catch (error) {
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
