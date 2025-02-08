import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';

export const surveys = pgTable('surveys', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  surveyId: uuid('survey_id').references(() => surveys.id),
  questionText: text('question_text').notNull(),
  questionType: text('question_type').notNull(),
  orderIndex: integer('order_index').notNull(),
});

export const options = pgTable('options', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  optionText: text('option_text').notNull(),
  orderIndex: integer('order_index').notNull(),
});

export const responses = pgTable('responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  surveyId: uuid('survey_id').references(() => surveys.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const answers = pgTable('answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  responseId: uuid('response_id').references(() => responses.id),
  questionId: uuid('question_id').references(() => questions.id),
  answerText: text('answer_text').notNull(),
});
