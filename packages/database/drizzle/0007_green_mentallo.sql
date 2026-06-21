CREATE TYPE "public"."subscription_type" AS ENUM('Free', 'Pro', 'Pro+', 'Business');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan" "subscription_type" DEFAULT 'Free' NOT NULL;