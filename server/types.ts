import { User, Page, Contact, FaqEntry, CallLog, Link } from "@shared/schema";
import type { Store } from "express-session";

export interface IStorage {
  sessionStore: Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;
  
  // Page methods
  getPages(): Promise<Page[]>;
  getPage(id: number): Promise<Page | undefined>;
  createPage(page: any): Promise<Page>;
  updatePage(id: number, page: any): Promise<Page>;
  deletePage(id: number): Promise<void>;
  
  // Contact methods
  getContacts(): Promise<Contact[]>;
  createContact(contact: any): Promise<Contact>;
  deleteContact(id: number): Promise<void>;
  
  // FAQ methods
  getFaqEntries(): Promise<FaqEntry[]>;
  createFaqEntry(faq: any): Promise<FaqEntry>;
  deleteFaqEntry(id: number): Promise<void>;
  
  // Call log methods
  createCallLog(log: any): Promise<CallLog>;
  getCallLogsByUser(userId: number): Promise<CallLog[]>;
  
  // Link methods
  getLinks(): Promise<Link[]>;
  createLink(link: any): Promise<Link>;
  deleteLink(id: number): Promise<void>;
}
