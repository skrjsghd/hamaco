ALTER TABLE "hairstyle" ALTER COLUMN "hair_length" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "hairstyle" ALTER COLUMN "hair_length" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hairstyle" ALTER COLUMN "cut_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "hairstyle" ALTER COLUMN "perm_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "hairstyle" ALTER COLUMN "straight_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "hairstyle" ALTER COLUMN "updo_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "hairstyle" ALTER COLUMN "curl_pattern" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "hairstyle" ALTER COLUMN "bangs_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "hairstyle" ALTER COLUMN "volume_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "hairstyle" ALTER COLUMN "layering_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "hairstyle" ALTER COLUMN "finish_texture" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."bangs_type";--> statement-breakpoint
DROP TYPE "public"."curl_pattern";--> statement-breakpoint
DROP TYPE "public"."cut_type";--> statement-breakpoint
DROP TYPE "public"."finish_texture";--> statement-breakpoint
DROP TYPE "public"."hair_length";--> statement-breakpoint
DROP TYPE "public"."layering_type";--> statement-breakpoint
DROP TYPE "public"."perm_type";--> statement-breakpoint
DROP TYPE "public"."straight_type";--> statement-breakpoint
DROP TYPE "public"."updo_type";--> statement-breakpoint
DROP TYPE "public"."volume_type";