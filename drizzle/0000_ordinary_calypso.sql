CREATE TYPE "public"."bangs_type" AS ENUM('SeeThrough', 'Full', 'Choppy', 'CenterPart', 'SidePart', 'SlickBack');--> statement-breakpoint
CREATE TYPE "public"."curl_pattern" AS ENUM('Loose', 'Medium', 'Tight', 'Irregular');--> statement-breakpoint
CREATE TYPE "public"."cut_type" AS ENUM('Bob', 'Pixie', 'Layered', 'Shag', 'OneLength');--> statement-breakpoint
CREATE TYPE "public"."finish_texture" AS ENUM('Glossy', 'Natural', 'Matte');--> statement-breakpoint
CREATE TYPE "public"."hair_length" AS ENUM('AboveEar', 'EarToJaw', 'BelowJaw', 'Shoulder', 'Collarbone', 'Bust', 'MidBack', 'Waist');--> statement-breakpoint
CREATE TYPE "public"."layering_type" AS ENUM('Light', 'Medium', 'Heavy');--> statement-breakpoint
CREATE TYPE "public"."perm_type" AS ENUM('C_Curl', 'S_Curl', 'Hippie', 'Glam', 'Digital', 'Sand');--> statement-breakpoint
CREATE TYPE "public"."straight_type" AS ENUM('NaturalStraight', 'VolumeMagic');--> statement-breakpoint
CREATE TYPE "public"."updo_type" AS ENUM('Ponytail', 'Bun', 'HalfUp', 'AllBack');--> statement-breakpoint
CREATE TYPE "public"."volume_type" AS ENUM('Flat', 'Root', 'Sides', 'Overall');--> statement-breakpoint
CREATE TABLE "hairstyle" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(512),
	"hair_length" "hair_length" NOT NULL,
	"cut_type" "cut_type",
	"perm_type" "perm_type",
	"straight_type" "straight_type",
	"updo_type" "updo_type",
	"curl_pattern" "curl_pattern",
	"bangs_type" "bangs_type",
	"volume_type" "volume_type",
	"layering_type" "layering_type",
	"finish_texture" "finish_texture",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hairstyle_suggestion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"hairstyle_id" uuid NOT NULL,
	"image_url" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"portrait_image_url" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
