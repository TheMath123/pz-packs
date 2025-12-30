CREATE TABLE "modpack_export_configurations" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"modpack_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"mods_order" jsonb,
	"mod_config" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "modpack_export_configurations" ADD CONSTRAINT "modpack_export_configurations_modpack_id_modpacks_id_fk" FOREIGN KEY ("modpack_id") REFERENCES "public"."modpacks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modpack_export_configurations" ADD CONSTRAINT "modpack_export_configurations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

ALTER TABLE "modpacks" ADD COLUMN "metadata" jsonb;