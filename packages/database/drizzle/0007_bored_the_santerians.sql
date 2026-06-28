ALTER TABLE "forms" ADD COLUMN "version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN "idempotency_key" varchar(64);--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "form_fields_form_idx" ON "form_fields" USING btree ("form_id");--> statement-breakpoint
CREATE UNIQUE INDEX "form_submissions_form_idempotency_idx" ON "form_submissions" USING btree ("form_id","idempotency_key") WHERE "form_submissions"."idempotency_key" IS NOT NULL;