CREATE TYPE "public"."field_type_num" AS ENUM('TEXT', 'TEXTAREA', 'NUMBER', 'EMAIL', 'PHONE', 'URL', 'SELECT', 'RADIO', 'CHECKBOX', 'DATE', 'RATING', 'FILE_UPLOAD', 'TIME', 'DATETIME', 'SLIDER', 'TOGGLE');--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"label" varchar(255) NOT NULL,
	"label_key" varchar(255) NOT NULL,
	"placeholder" varchar(255),
	"is_required" boolean DEFAULT false NOT NULL,
	"index" numeric NOT NULL,
	"type" "field_type_num" NOT NULL,
	"options" jsonb,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "form_fields_form_id_index_unique" UNIQUE("form_id","index")
);
--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;