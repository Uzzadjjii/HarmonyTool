import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "teleconseiller"] }).notNull(),
  points: integer("points").default(0),
  level: integer("level").default(1),
});

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull().unique(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
});

export const faqEntries = pgTable("faq_entries", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
});

export const callLogs = pgTable("call_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  duration: integer("duration").notNull(),
  outcome: text("outcome").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
});

export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  choices: jsonb("choices").notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  points: integer("points").notNull().default(10),
  category: text("category").notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  isWeekly: boolean("is_weekly").default(false),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  question: text("question").notNull(),
  choices: jsonb("choices").notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  points: integer("points").notNull().default(5),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalPoints: integer("total_points").notNull().default(0),
  completedScenarios: jsonb("completed_scenarios").notNull().default([]),
  completedQuizzes: jsonb("completed_quizzes").notNull().default([]),
  badges: jsonb("badges").notNull().default([]),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const learningContent = pgTable("learning_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type", { enum: ["article", "video", "podcast"] }).notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  duration: integer("duration"),
  points: integer("points").notNull().default(5),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  requirement: jsonb("requirement").notNull(),
  points: integer("points").notNull().default(50),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertPageSchema = createInsertSchema(pages);
export const insertContactSchema = createInsertSchema(contacts);
export const insertFaqSchema = createInsertSchema(faqEntries);
export const insertCallLogSchema = createInsertSchema(callLogs);
export const insertLinkSchema = createInsertSchema(links);
export const insertScenarioSchema = createInsertSchema(scenarios);
export const insertQuizSchema = createInsertSchema(quizzes);
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions);
export const insertLearningContentSchema = createInsertSchema(learningContent);
export const insertBadgeSchema = createInsertSchema(badges);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type FaqEntry = typeof faqEntries.$inferSelect;
export type CallLog = typeof callLogs.$inferSelect;
export type Link = typeof links.$inferSelect;
export type Scenario = typeof scenarios.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type LearningContent = typeof learningContent.$inferSelect;
export type Badge = typeof badges.$inferSelect;