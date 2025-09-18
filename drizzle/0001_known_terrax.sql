CREATE TABLE "it315-api-key_hardware_specs" (
	"id" text PRIMARY KEY NOT NULL,
	"api_key_id" text NOT NULL,
	"image_url" text,
	"brandname" varchar(100),
	"processor" varchar(200),
	"graphic" varchar(200),
	"display" varchar(150),
	"ram" varchar(50),
	"storage" varchar(100),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "it315-api-key_hardware_specs" ADD CONSTRAINT "it315-api-key_hardware_specs_api_key_id_it315-api-key_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."it315-api-key_api_keys"("id") ON DELETE cascade ON UPDATE no action;