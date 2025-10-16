import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  portraitImageUrl: varchar("portrait_image_url", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const hairstyle = pgTable("hairstyle", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  description: varchar("description", { length: 512 }),
  hairLength: text("hair_length"),
  cutType: text("cut_type"),
  permType: text("perm_type"),
  straightType: text("straight_type"),
  updoType: text("updo_type"),
  curlPattern: text("curl_pattern"),
  bangsType: text("bangs_type"),
  volumeType: text("volume_type"),
  layeringType: text("layering_type"),
  finishTexture: text("finish_texture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const hairstyleSuggestionStatus = pgEnum("hairstyle_suggestion_status", [
  "PENDING",
  "GENERATING",
  "COMPLETED",
  "FAILED",
]);

export const hairstyleSuggestion = pgTable("hairstyle_suggestion", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  hairstyleId: uuid("hairstyle_id").notNull(),
  imageUrl: varchar("image_url", { length: 256 }),
  status: hairstyleSuggestionStatus("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(user, ({ many }) => ({
  hairstyleSuggestions: many(hairstyleSuggestion),
}));

export const hairstyleSuggestionRelations = relations(
  hairstyleSuggestion,
  ({ one }) => ({
    user: one(user, {
      fields: [hairstyleSuggestion.userId],
      references: [user.id],
    }),
    hairstyle: one(hairstyle, {
      fields: [hairstyleSuggestion.hairstyleId],
      references: [hairstyle.id],
    }),
  }),
);

export const hairstyleRelations = relations(hairstyle, ({ many }) => ({
  hairstyleSuggestions: many(hairstyleSuggestion),
}));
