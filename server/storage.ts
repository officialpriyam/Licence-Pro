import { db } from "./db";
import { licenses, type License, type InsertLicense, type UpdateLicenseRequest, settings, type Settings, type InsertSettings } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // License operations
  getLicenses(): Promise<License[]>;
  getLicense(id: number): Promise<License | undefined>;
  getLicenseByKey(key: string): Promise<License | undefined>;
  createLicense(license: InsertLicense): Promise<License>;
  updateLicense(id: number, updates: UpdateLicenseRequest): Promise<License>;
  deleteLicense(id: number): Promise<void>;
  
  // Helper to mark a check
  markLicenseChecked(id: number): Promise<void>;

  // Settings operations
  getSettings(): Promise<Settings | undefined>;
  updateSettings(updates: InsertSettings): Promise<Settings>;
}

export class DatabaseStorage implements IStorage {
  async getLicenses(): Promise<License[]> {
    return await db.select().from(licenses).orderBy(desc(licenses.createdAt));
  }

  async getLicense(id: number): Promise<License | undefined> {
    const [license] = await db.select().from(licenses).where(eq(licenses.id, id));
    return license;
  }

  async getLicenseByKey(key: string): Promise<License | undefined> {
    const [license] = await db.select().from(licenses).where(eq(licenses.key, key));
    return license;
  }

  async createLicense(insertLicense: InsertLicense): Promise<License> {
    const [license] = await db.insert(licenses).values(insertLicense).returning();
    return license;
  }

  async updateLicense(id: number, updates: UpdateLicenseRequest): Promise<License> {
    const [updated] = await db.update(licenses)
      .set(updates)
      .where(eq(licenses.id, id))
      .returning();
    return updated;
  }

  async deleteLicense(id: number): Promise<void> {
    await db.delete(licenses).where(eq(licenses.id, id));
  }

  async markLicenseChecked(id: number): Promise<void> {
    await db.update(licenses)
      .set({ lastCheckedAt: new Date() })
      .where(eq(licenses.id, id));
  }

  async getSettings(): Promise<Settings | undefined> {
    try {
      const [s] = await db.select().from(settings).limit(1);
      return s;
    } catch (err) {
      console.warn('Settings table access failed, might not exist yet');
      return undefined;
    }
  }

  async updateSettings(updates: InsertSettings): Promise<Settings> {
    const existing = await this.getSettings();
    if (existing) {
      const [updated] = await db.update(settings)
        .set(updates)
        .where(eq(settings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db.insert(settings).values(updates).returning();
      return inserted;
    }
  }
}

export const storage = new DatabaseStorage();
