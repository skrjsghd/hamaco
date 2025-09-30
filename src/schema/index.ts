import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import {
  bangsTypeEnum,
  curlPatternEnum,
  cutTypeEnum,
  finishTextureEnum,
  hairLengthEnum,
  layeringTypeEnum,
  permTypeEnum,
  straightTypeEnum,
  updoTypeEnum,
  volumeTypeEnum,
} from "./hairstyle-enum";

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
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 512 }),
  hairLength: hairLengthEnum("hair_length").notNull(),
  cutType: cutTypeEnum("cut_type"),
  permType: permTypeEnum("perm_type"),
  straightType: straightTypeEnum("straight_type"),
  updoType: updoTypeEnum("updo_type"),
  curlPattern: curlPatternEnum("curl_pattern"),
  bangsType: bangsTypeEnum("bangs_type"),
  volumeType: volumeTypeEnum("volume_type"),
  layeringType: layeringTypeEnum("layering_type"),
  finishTexture: finishTextureEnum("finish_texture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const hairstyleSuggestion = pgTable("hairstyle_suggestion", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  hairstyleId: uuid("hairstyle_id").notNull(),
  imageUrl: varchar("image_url", { length: 256 }).notNull(),
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
