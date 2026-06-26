CREATE INDEX "forms_owner_created_idx" ON "forms" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE INDEX "form_submissions_form_created_idx" ON "form_submissions" USING btree ("form_id","created_at");--> statement-breakpoint
CREATE INDEX "form_views_form_id_idx" ON "form_views" USING btree ("form_id");