import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const documents = sqliteTable('documents', { id: text('id').primaryKey(), payload: text('payload').notNull(), updatedAt: integer('updated_at').notNull() });
export const progress = sqliteTable('progress', { id: text('id').primaryKey(), userId: text('user_id').notNull(), payload: text('payload').notNull(), updatedAt: integer('updated_at').notNull() });
export const revisions = sqliteTable('revisions', { id: text('id').primaryKey(), chapterId: integer('chapter_id').notNull(), payload: text('payload').notNull(), createdAt: integer('created_at').notNull() });
