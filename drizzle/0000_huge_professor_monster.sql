CREATE TABLE "hairstyle" (
	"image_url" varchar(256) PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"profile_email" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"email" varchar(256) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
