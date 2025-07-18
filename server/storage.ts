import { User, Question, QuizSession, InsertUser, InsertQuizSession, UserQuestionHistory, users, questions, quizSessions, userQuestionHistory } from "@shared/schema";
import { togafQuestions } from "../client/src/data/questions";
import { db } from "./db";
import { eq, notInArray, sql, desc, asc, and, inArray } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question methods
  getAllQuestions(): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByIds(ids: number[]): Promise<Question[]>;
  getUnseenQuestions(userId: number): Promise<Question[]>;
  
  // Quiz session methods
  createQuizSession(session: InsertQuizSession): Promise<QuizSession>;
  getQuizSession(id: number): Promise<QuizSession | undefined>;
  updateQuizSession(id: number, updates: Partial<QuizSession>): Promise<QuizSession | undefined>;
  getUserQuizSessions(userId: number): Promise<QuizSession[]>;
  
  // User progress tracking
  markQuestionsAsSeen(userId: number, questionIds: number[]): Promise<void>;
  getUserQuestionHistory(userId: number): Promise<UserQuestionHistory[]>;
  resetUserProgress(userId: number): Promise<void>;
  
  // Leaderboard methods
  getGlobalLeaderboard(questionCount?: number): Promise<any[]>;
  getUserLeaderboard(userId: number, questionCount?: number): Promise<any[]>;
  flushScoreboards(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData();
  }
  
  private async initializeData() {
    try {
      // Check if we have questions in the database
      const existingQuestions = await db.select().from(questions).limit(1);
      
      if (existingQuestions.length === 0) {
        // Insert TOGAF questions
        const questionData = togafQuestions.map(q => ({
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: null
        }));
        await db.insert(questions).values(questionData);
      }
      
      // Check if we have a default user
      const existingUser = await db.select().from(users).where(eq(users.username, "user")).limit(1);
      
      if (existingUser.length === 0) {
        await db.insert(users).values({
          username: "user",
          password: "password"
        });
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async findOrCreateUserByName(displayName: string): Promise<User> {
    // First try to find existing user by display name
    const [existingUser] = await db.select().from(users).where(eq(users.displayName, displayName));
    
    if (existingUser) {
      return existingUser;
    }
    
    // Create new user with display name as username, handle duplicates
    const username = displayName.toLowerCase().replace(/\s+/g, '_');
    try {
      const [newUser] = await db.insert(users).values({
        username,
        displayName,
      }).returning();
      return newUser;
    } catch (error) {
      if (error.code === '23505') {
        // Username already exists, try to find by username
        const [existingByUsername] = await db.select().from(users).where(eq(users.username, username));
        if (existingByUsername) {
          return existingByUsername;
        }
      }
      throw error;
    }
  }

  async getAllQuestions(): Promise<Question[]> {
    return await db.select().from(questions);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question;
  }

  async getQuestionsByIds(ids: number[]): Promise<Question[]> {
    if (ids.length === 0) return [];
    return await db.select().from(questions).where(inArray(questions.id, ids));
  }

  async getUnseenQuestions(userId: number): Promise<Question[]> {
    const seenQuestionIds = await db
      .select({ questionId: userQuestionHistory.questionId })
      .from(userQuestionHistory)
      .where(eq(userQuestionHistory.userId, userId));
    
    const seenIds = seenQuestionIds.map(row => row.questionId);
    if (seenIds.length === 0) {
      // No questions seen yet, return all questions
      return await this.getAllQuestions();
    }
    
    // Return only questions that haven't been seen
    return await db
      .select()
      .from(questions)
      .where(notInArray(questions.id, seenIds));
  }

  async createQuizSession(session: InsertQuizSession): Promise<QuizSession> {
    const [newSession] = await db.insert(quizSessions).values(session).returning();
    return newSession;
  }

  async getQuizSession(id: number): Promise<QuizSession | undefined> {
    const [session] = await db.select().from(quizSessions).where(eq(quizSessions.id, id));
    return session;
  }

  async updateQuizSession(id: number, updates: Partial<QuizSession>): Promise<QuizSession | undefined> {
    const [session] = await db
      .update(quizSessions)
      .set(updates)
      .where(eq(quizSessions.id, id))
      .returning();
    return session;
  }

  async getUserQuizSessions(userId: number): Promise<QuizSession[]> {
    return await db.select().from(quizSessions).where(eq(quizSessions.userId, userId));
  }

  async markQuestionsAsSeen(userId: number, questionIds: number[]): Promise<void> {
    const values = questionIds.map(questionId => ({
      userId,
      questionId,
    }));
    
    console.log(`Marking ${questionIds.length} questions as seen for user ${userId}: ${questionIds.slice(0, 10)}...`);
    
    await db.insert(userQuestionHistory).values(values).onConflictDoNothing();
    
    // Verify the insert worked
    const count = await db.select().from(userQuestionHistory).where(eq(userQuestionHistory.userId, userId));
    console.log(`User ${userId} now has ${count.length} seen questions in database`);
  }

  async getUserQuestionHistory(userId: number): Promise<UserQuestionHistory[]> {
    return await db.select().from(userQuestionHistory).where(eq(userQuestionHistory.userId, userId));
  }

  async resetUserProgress(userId: number): Promise<void> {
    await db.delete(userQuestionHistory).where(eq(userQuestionHistory.userId, userId));
  }

  async getUserProgress(userId: number): Promise<{
    totalQuestions: number;
    seenQuestions: number;
    unseenQuestions: number;
    progressPercentage: number;
  }> {
    const history = await this.getUserQuestionHistory(userId);
    const allQuestions = await this.getAllQuestions();
    const unseenQuestions = await this.getUnseenQuestions(userId);
    
    return {
      totalQuestions: allQuestions.length,
      seenQuestions: history.length,
      unseenQuestions: unseenQuestions.length,
      progressPercentage: Math.round((history.length / allQuestions.length) * 100)
    };
  }

  async getGlobalLeaderboard(questionCount?: number): Promise<Array<{ displayName: string; score: number; percentage: number; totalQuestions: number; timeElapsed: number; createdAt: Date }>> {
    const whereConditions = [
      eq(quizSessions.completed, true),
      sql`${quizSessions.score} IS NOT NULL`,
      sql`${quizSessions.percentage} IS NOT NULL`,
      sql`${quizSessions.timeElapsed} IS NOT NULL`,
      sql`${users.displayName} IS NOT NULL`
    ];
    
    if (questionCount) {
      whereConditions.push(eq(quizSessions.totalQuestions, questionCount));
    }
    
    const results = await db
      .select({
        displayName: users.displayName,
        score: quizSessions.score,
        percentage: quizSessions.percentage,
        totalQuestions: quizSessions.totalQuestions,
        timeElapsed: quizSessions.timeElapsed,
        createdAt: quizSessions.createdAt,
      })
      .from(quizSessions)
      .innerJoin(users, eq(quizSessions.userId, users.id))
      .where(and(...whereConditions))
      .orderBy(desc(quizSessions.percentage), asc(quizSessions.timeElapsed))
      .limit(10);
    
    return results as Array<{ displayName: string; score: number; percentage: number; totalQuestions: number; timeElapsed: number; createdAt: Date }>;
  }

  async getUserLeaderboard(userId: number, questionCount?: number): Promise<Array<{ score: number; percentage: number; totalQuestions: number; timeElapsed: number; createdAt: Date }>> {
    const whereConditions = [
      eq(quizSessions.userId, userId),
      eq(quizSessions.completed, true),
      sql`${quizSessions.score} IS NOT NULL`,
      sql`${quizSessions.percentage} IS NOT NULL`,
      sql`${quizSessions.timeElapsed} IS NOT NULL`
    ];
    
    if (questionCount) {
      whereConditions.push(eq(quizSessions.totalQuestions, questionCount));
    }
    
    const results = await db
      .select({
        score: quizSessions.score,
        percentage: quizSessions.percentage,
        totalQuestions: quizSessions.totalQuestions,
        timeElapsed: quizSessions.timeElapsed,
        createdAt: quizSessions.createdAt,
      })
      .from(quizSessions)
      .where(and(...whereConditions))
      .orderBy(desc(quizSessions.percentage), asc(quizSessions.timeElapsed))
      .limit(10);
    
    return results as Array<{ score: number; percentage: number; totalQuestions: number; timeElapsed: number; createdAt: Date }>;
  }

  async flushScoreboards(): Promise<void> {
    // Delete all quiz sessions (this will effectively flush all scoreboards)
    await db.delete(quizSessions);
    
    // Also reset all user progress
    await db.delete(userQuestionHistory);
  }
}

export const storage = new DatabaseStorage();
