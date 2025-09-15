import { integer, pgTable, text, varchar, json, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer(),
});

export const SessionChartTable = pgTable("sessionChartTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar({ length: 255 }).notNull().unique(),
  selectedDoctor: json().$type<any>(),   // ✅ store doctor object/array
  notes: text(),
  report: json().$type<any>(),          // ✅ structured report data
  conversation: json().$type<any>(),    // ✅ chat history
  createdBy: varchar({ length: 255 }).references(() => usersTable.email).notNull(),
 createdOn: timestamp().defaultNow().notNull(), 
});
