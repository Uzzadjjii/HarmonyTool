import { IStorage } from "./types";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, sql } from "drizzle-orm"; // Added import for sql
import { pool } from "./db";
import {
  users,
  pages,
  contacts,
  faqEntries,
  callLogs,
  links,
  type User,
  type Page,
  type Contact,
  type FaqEntry,
  type CallLog,
  type Link,
} from "@shared/schema";
import { type Scenario, type UserProgress } from "@shared/schema"; // Added import for Scenario and UserProgress


const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: any): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getPages(): Promise<Page[]> {
    return await db.select().from(pages);
  }

  async getPage(id: number): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page;
  }

  async createPage(insertPage: any): Promise<Page> {
    const [page] = await db.insert(pages).values(insertPage).returning();
    return page;
  }

  async updatePage(id: number, page: any): Promise<Page> {
    const [updated] = await db
      .update(pages)
      .set(page)
      .where(eq(pages.id, id))
      .returning();
    return updated;
  }

  async deletePage(id: number): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async createContact(contact: any): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async updateContact(id: number, contact: any): Promise<Contact> {
    const [updated] = await db
      .update(contacts)
      .set(contact)
      .where(eq(contacts.id, id))
      .returning();
    return updated;
  }

  async deleteContact(id: number): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

  async getFaqEntries(): Promise<FaqEntry[]> {
    return await db.select().from(faqEntries);
  }

  async createFaqEntry(faq: any): Promise<FaqEntry> {
    const [entry] = await db.insert(faqEntries).values(faq).returning();
    return entry;
  }

  async updateFaqEntry(id: number, faq: any): Promise<FaqEntry> {
    const [updated] = await db
      .update(faqEntries)
      .set(faq)
      .where(eq(faqEntries.id, id))
      .returning();
    return updated;
  }

  async createCallLog(log: any): Promise<CallLog> {
    const [callLog] = await db.insert(callLogs).values(log).returning();
    return callLog;
  }

  async getCallLogsByUser(userId: number): Promise<CallLog[]> {
    return await db
      .select()
      .from(callLogs)
      .where(eq(callLogs.userId, userId));
  }

  async deleteFaqEntry(id: number): Promise<void> {
    await db.delete(faqEntries).where(eq(faqEntries.id, id));
  }

  async getLinks(): Promise<Link[]> {
    return await db.select().from(links);
  }

  async createLink(link: any): Promise<Link> {
    const [newLink] = await db.insert(links).values(link).returning();
    return newLink;
  }

  async updateLink(id: number, link: any): Promise<Link> {
    const [updated] = await db
      .update(links)
      .set(link)
      .where(eq(links.id, id))
      .returning();
    return updated;
  }
  async deleteLink(id: number): Promise<void> {
    await db.delete(links).where(eq(links.id, id));
  }

  async getScenarios(): Promise<Scenario[]> {
    return await db.select().from(scenarios);
  }

  async submitScenarioAnswer(userId: number, scenarioId: number, answer: number): Promise<{ correct: boolean; points: number }> {
    const [scenario] = await db
      .select()
      .from(scenarios)
      .where(eq(scenarios.id, scenarioId));

    if (!scenario) {
      throw new Error("Scenario not found");
    }

    const correct = scenario.correctAnswer === answer;
    const points = correct ? scenario.points : 0;

    if (correct) {
      // Mettre à jour les points de l'utilisateur
      await db
        .update(users)
        .set({
          points: sql`${users.points} + ${points}`,
        })
        .where(eq(users.id, userId));

      // Mettre à jour la progression
      const [progress] = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId));

      if (progress) {
        await db
          .update(userProgress)
          .set({
            totalPoints: sql`${userProgress.totalPoints} + ${points}`,
            completedScenarios: sql`${userProgress.completedScenarios} || ${JSON.stringify([scenarioId])}::jsonb`,
            updatedAt: new Date(),
          })
          .where(eq(userProgress.userId, userId));
      } else {
        await db.insert(userProgress).values({
          userId,
          totalPoints: points,
          completedScenarios: [scenarioId],
          completedQuizzes: [], //Added default values
          badges: [], //Added default values
          level: 1, //Added default values
        });
      }
    }

    return { correct, points };
  }

  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    if (!progress) {
      // Créer une entrée par défaut si elle n'existe pas
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          totalPoints: 0,
          completedScenarios: [],
          completedQuizzes: [], //Added default values
          badges: [], //Added default values
          level: 1, //Added default values
        })
        .returning();
      return newProgress;
    }

    return progress;
  }
}

export const storage = new DatabaseStorage();