import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertPageSchema, 
  insertContactSchema, 
  insertFaqSchema, 
  insertCallLogSchema,
  insertLinkSchema 
} from "@shared/schema";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || req.user?.role !== "admin") {
    return res.status(403).send("Forbidden");
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Admin routes
  app.get("/api/pages", requireAuth, async (req, res) => {
    const pages = await storage.getPages();
    res.json(pages);
  });

  app.post("/api/pages", requireAdmin, async (req, res) => {
    const page = await storage.createPage(insertPageSchema.parse(req.body));
    res.status(201).json(page);
  });

  app.delete("/api/pages/:id", requireAdmin, async (req, res) => {
    await storage.deletePage(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Contacts
  app.get("/api/contacts", requireAuth, async (req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.post("/api/contacts", requireAdmin, async (req, res) => {
    const contact = await storage.createContact(insertContactSchema.parse(req.body));
    res.status(201).json(contact);
  });

  app.delete("/api/contacts/:id", requireAdmin, async (req, res) => {
    await storage.deleteContact(parseInt(req.params.id));
    res.sendStatus(204);
  });

  app.put("/api/contacts/:id", requireAdmin, async (req, res) => {
    const contact = await storage.updateContact(
      parseInt(req.params.id),
      insertContactSchema.parse(req.body)
    );
    res.json(contact);
  });

  // FAQ
  app.get("/api/faq", requireAuth, async (req, res) => {
    const entries = await storage.getFaqEntries();
    res.json(entries);
  });

  app.post("/api/faq", requireAdmin, async (req, res) => {
    const entry = await storage.createFaqEntry(insertFaqSchema.parse(req.body));
    res.status(201).json(entry);
  });

  app.delete("/api/faq/:id", requireAdmin, async (req, res) => {
    await storage.deleteFaqEntry(parseInt(req.params.id));
    res.sendStatus(204);
  });

  app.put("/api/faq/:id", requireAdmin, async (req, res) => {
    const entry = await storage.updateFaqEntry(
      parseInt(req.params.id),
      insertFaqSchema.parse(req.body)
    );
    res.json(entry);
  });

  // Links
  app.get("/api/links", requireAuth, async (req, res) => {
    const links = await storage.getLinks();
    res.json(links);
  });

  app.post("/api/links", requireAdmin, async (req, res) => {
    const link = await storage.createLink(insertLinkSchema.parse(req.body));
    res.status(201).json(link);
  });

  app.delete("/api/links/:id", requireAdmin, async (req, res) => {
    await storage.deleteLink(parseInt(req.params.id));
    res.sendStatus(204);
  });

  app.put("/api/links/:id", requireAdmin, async (req, res) => {
    const link = await storage.updateLink(
      parseInt(req.params.id),
      insertLinkSchema.parse(req.body)
    );
    res.json(link);
  });

  // Call logs
  app.get("/api/call-logs", requireAuth, async (req, res) => {
    const logs = await storage.getCallLogsByUser(req.user!.id);
    res.json(logs);
  });

  app.post("/api/call-logs", requireAuth, async (req, res) => {
    const log = await storage.createCallLog({
      ...insertCallLogSchema.parse(req.body),
      userId: req.user!.id,
    });
    res.status(201).json(log);
  });

  // Scénarios
  app.get("/api/scenarios", requireAuth, async (req, res) => {
    const scenarios = await storage.getScenarios();
    res.json(scenarios);
  });

  app.post("/api/scenarios/:id/answer", requireAuth, async (req, res) => {
    const scenarioId = parseInt(req.params.id);
    const answer = req.body.answer;
    const result = await storage.submitScenarioAnswer(req.user!.id, scenarioId, answer);
    res.json(result);
  });

  // User Progress
  app.get("/api/user-progress", requireAuth, async (req, res) => {
    const progress = await storage.getUserProgress(req.user!.id);
    res.json(progress);
  });

  const httpServer = createServer(app);
  return httpServer;
}