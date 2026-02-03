import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const licenses = pgTable("licenses", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // The actual license key (UUID)
  clientName: text("client_name").notNull(),
  email: text("email"),
  discordId: text("discord_id"),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"), // Null means lifetime
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastCheckedAt: timestamp("last_checked_at"),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  discordToken: text("discord_token"),
  discordAdminId: text("discord_admin_id"),
  discordLogsChannelId: text("discord_logs_channel_id"),
  discordUpdateChannelId: text("discord_update_channel_id"),
  smtpHost: text("smtp_host"),
  smtpPort: serial("smtp_port"),
  smtpUser: text("smtp_user"),
  smtpPassword: text("smtp_password"),
  smtpFrom: text("smtp_from"),
  licenseEmailTemplate: text("license_email_template"),
});

// === SCHEMAS ===
export const insertLicenseSchema = createInsertSchema(licenses).omit({ 
  id: true, 
  createdAt: true, 
  lastCheckedAt: true 
}).extend({
  email: z.string().email().optional().nullable(),
  discordId: z.string().optional().nullable(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });

// === TYPES ===
export type License = typeof licenses.$inferSelect;
export type InsertLicense = z.infer<typeof insertLicenseSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

// Request types
export type CreateLicenseRequest = {
  clientName: string;
  email?: string;
  discordId?: string;
  description?: string;
  expiresInDays?: number; // Optional helper to calculate expiresAt
};

export type UpdateLicenseRequest = Partial<InsertLicense>;

export type VerifyLicenseRequest = {
  key: string;
};

export type VerifyLicenseResponse = {
  valid: boolean;
  message: string;
  license?: {
    clientName: string;
    expiresAt: string | null;
  };
};

export type AdminLoginRequest = {
  password: string;
};
