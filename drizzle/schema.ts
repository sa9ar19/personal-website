<<<<<<< HEAD
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  varchar,
  pgEnum,
  PgSerial,
  PgText,
} from "drizzle-orm/pg-core";

// 1. Define the User Role Enum (PostgreSQL specific)
export const roleEnum = pgEnum("role", ["user", "admin"]);

// 2. Users Table (Required for Auth)
export const users = pgTable("users", {
  // We use openId as the primary key because that's what your auth system expects
  openId: varchar("openId", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// 3. Destinations Table (Your main table)
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  destinationName: text("destinationName").notNull(),
  destinationDetail: text("destinationDetail").notNull(),
  coverUrl: text("coverUrl").notNull(),
  imagesId: text("imagesId"),
  imagesUrl: text("imagesUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// 4. Gallery
export const galleryPhotos = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  destinationId: integer("destinationId")
    .references(() => destinations.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("imageUrl").notNull(),
  description: text("description"),
  order: integer("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// 5. blogPosts table definition
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  coverUrl: text("coverUrl"),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  author: text("author").default("sa9ar").notNull(),
});

// 6. Signup for newsletter
export const newsletterSignups = pgTable("newsletter_signups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  contact: text("contact"),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});


// Types for your code to use
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = typeof destinations.$inferInsert;

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type InsertGalleryPhoto = typeof galleryPhotos.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export type NewsletterSignup = typeof newsletterSignups.$inferSelect;
export type InsertNewsletterSignup = typeof newsletterSignups.$inferInsert;
=======
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, longtext } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Gallery & Destinations ──────────────────────────────────────────────────

export const destinations = mysqlTable("destinations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  coverImageUrl: varchar("coverImageUrl", { length: 1024 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = typeof destinations.$inferInsert;

export const galleryPhotos = mysqlTable("gallery_photos", {
  id: int("id").autoincrement().primaryKey(),
  destinationId: int("destinationId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type InsertGalleryPhoto = typeof galleryPhotos.$inferInsert;

// ── Blog ────────────────────────────────────────────────────────────────────

export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: longtext("content").notNull(),
  excerpt: text("excerpt"),
  featuredImageUrl: varchar("featuredImageUrl", { length: 1024 }),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ── Social Links ────────────────────────────────────────────────────────────

export const socialLinks = mysqlTable("social_links", {
  id: int("id").autoincrement().primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertSocialLink = typeof socialLinks.$inferInsert;
>>>>>>> d0a6ff7366ca6b6442c6ae10f05246e32109fee5
