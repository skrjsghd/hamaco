import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const profile = pgTable('profile', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const profileRelations = relations(profile, ({ many }) => ({
  hairstyles: many(hairstyle),
}))

export const hairstyle = pgTable('hairstyle', {
  imageUrl: varchar('image_url', { length: 256 }).primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  profileEmail: varchar('profile_email', { length: 256 }).notNull(),
})

export const hairstyleRelations = relations(hairstyle, ({ one }) => ({
  profile: one(profile, {
    fields: [hairstyle.profileEmail],
    references: [profile.email],
  }),
}))
