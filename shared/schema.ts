import { pgTable, text, serial, integer, boolean, jsonb, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  displayName: text("display_name"),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(),
  answer: text("answer").notNull(),
  explanation: text("explanation"),
});

export const quizSessions = pgTable("quiz_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  questionIds: jsonb("question_ids").notNull(),
  answers: jsonb("answers").notNull(),
  score: integer("score"),
  totalQuestions: integer("total_questions").notNull(),
  completed: boolean("completed").default(false),
  timeRemaining: integer("time_remaining").default(2700), // 45 minutes in seconds
  timeElapsed: integer("time_elapsed"),
  percentage: integer("percentage"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userQuestionHistory = pgTable("user_question_history", {
  userId: integer("user_id").notNull(),
  questionId: integer("question_id").notNull(),
  answeredAt: timestamp("answered_at").defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.questionId] }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  question: true,
  options: true,
  answer: true,
  explanation: true,
});

export const insertQuizSessionSchema = createInsertSchema(quizSessions).pick({
  userId: true,
  questionIds: true,
  answers: true,
  score: true,
  totalQuestions: true,
  completed: true,
  timeRemaining: true,
  timeElapsed: true,
  percentage: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuizSession = z.infer<typeof insertQuizSessionSchema>;
export type QuizSession = typeof quizSessions.$inferSelect;
export type UserQuestionHistory = typeof userQuestionHistory.$inferSelect;
