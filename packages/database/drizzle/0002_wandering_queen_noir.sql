ALTER TABLE "form_submissions" ADD COLUMN "referrer" varchar(2048);--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN "utm_source" varchar(255);--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN "utm_medium" varchar(255);--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN "utm_campaign" varchar(255);--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN "time_spent_ms" integer;--> statement-breakpoint
ALTER TABLE "form_views" ADD COLUMN "referrer" varchar(2048);--> statement-breakpoint
ALTER TABLE "form_views" ADD COLUMN "utm_source" varchar(255);--> statement-breakpoint
ALTER TABLE "form_views" ADD COLUMN "utm_medium" varchar(255);--> statement-breakpoint
ALTER TABLE "form_views" ADD COLUMN "utm_campaign" varchar(255);