CREATE TABLE "it315_api_key_api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"hashedKey" text NOT NULL,
	"last4" varchar(4) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "it315_api_key_hardware_specs" (
	"id" text PRIMARY KEY NOT NULL,
	"api_key_id" text NOT NULL,
	"front_view" text,
	"side_view" text,
	"back_view" text,
	"description" text,
	"monthly_price" varchar(50),
	"fully_paid_price" varchar(50),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DROP TABLE "it315-api-key_api_keys" CASCADE;--> statement-breakpoint
DROP TABLE "it315-api-key_hardware_specs" CASCADE;--> statement-breakpoint
ALTER TABLE "it315_api_key_hardware_specs" ADD CONSTRAINT "it315_api_key_hardware_specs_api_key_id_it315_api_key_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."it315_api_key_api_keys"("id") ON DELETE cascade ON UPDATE no action;