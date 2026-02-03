CREATE TABLE "licenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"client_name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_checked_at" timestamp,
	CONSTRAINT "licenses_key_unique" UNIQUE("key")
);

CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"discord_token" text,
	"discord_admin_id" text,
	"discord_logs_channel_id" text,
	"discord_update_channel_id" text,
	"smtp_host" text,
	"smtp_port" serial NOT NULL,
	"smtp_user" text,
	"smtp_password" text,
	"smtp_from" text,
	"license_email_template" text
);
--> statement-breakpoint
ALTER TABLE "licenses" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "licenses" ADD COLUMN "discord_id" text;