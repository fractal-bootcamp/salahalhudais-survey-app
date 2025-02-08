import { Elysia } from "elysia";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { surveys, questions, options, responses, answers } from './schema';
import { eq, sql } from 'drizzle-orm';
import { cors } from '@elysiajs/cors';
import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql);

const app = new Elysia()
  .use(cors())
  .group('/api', app => app
    // Surveys
    .get('/surveys', async () => {
      return await db.select().from(surveys);
    })
    .post('/surveys', async ({ body }) => {
      const { title, description } = body as any;
      const result = await db.insert(surveys)
        .values({ title, description })
        .returning();
      return result[0];
    })
    
    .post('/surveys/:surveyId/questions', async ({ params, body }) => {
      const { questionText, questionType, options: questionOptions } = body as any;

      const question = await db.insert(questions).values({
        surveyId: params.surveyId,
        questionText,
        questionType,
        orderIndex: 0,
      }).returning();

      let optionsData = [];
      if (questionOptions?.length) {
        const optionsToInsert = questionOptions.map((opt: string, idx: number) => ({
          questionId: question[0].id,
          optionText: opt,
          orderIndex: idx,
        }));

        optionsData = await db.insert(options)
          .values(optionsToInsert)
          .returning();
      }

      return {
        ...question[0],
        options: optionsData
      };
    })
    
    .get('/surveys/:id', async ({ params }) => {
      try {
        const survey = await db.select().from(surveys).where(eq(surveys.id, params.id));
        if (!survey[0]) return new Response('Survey not found', { status: 404 });

        const surveyQuestions = await db.select({
          id: questions.id,
          surveyId: questions.surveyId,
          questionText: questions.questionText,
          questionType: questions.questionType,
          orderIndex: questions.orderIndex,
        })
        .from(questions)
        .where(eq(questions.surveyId, params.id));

        const questionIds = surveyQuestions.map(q => q.id);
        const allOptions = [];
        for (const qId of questionIds) {
          const opts = await db.select()
            .from(options)
            .where(eq(options.questionId, qId));
          allOptions.push(...opts);
        }

        const questionsWithOptions = surveyQuestions.map(question => ({
          ...question,
          options: allOptions
            .filter(opt => opt.questionId === question.id)
            .sort((a, b) => a.orderIndex - b.orderIndex)
        }));

        return { ...survey[0], questions: questionsWithOptions };
      } catch (error) {
        return new Response('Internal Server Error', { status: 500 });
      }
    })

    // Responses
    .post('/surveys/:surveyId/responses', async ({ params, body }) => {
      try {
        const { answers: answerData } = body as { answers: Record<string, string> };
        
        const response = await db.insert(responses)
          .values({
            surveyId: params.surveyId,
          })
          .returning();

        const answerRecords = Object.entries(answerData).map(([questionId, answerText]) => ({
          responseId: response[0].id,
          questionId,
          answerText,
        }));

        if (answerRecords.length > 0) {
          await db.insert(answers).values(answerRecords);
        }

        return { success: true };
      } catch (error) {
        return new Response('Failed to submit survey', { status: 500 });
      }
    })

    .get('/surveys/:id/responses', async ({ params }) => {
      const surveyResponses = await db.select({
        id: responses.id,
        surveyId: responses.surveyId,
        createdAt: responses.createdAt,
        answers: answers
      })
      .from(responses)
      .leftJoin(answers, eq(answers.responseId, responses.id))
      .where(eq(responses.surveyId, params.id));

      const groupedResponses = surveyResponses.reduce((acc, curr) => {
        const existing = acc.find(r => r.id === curr.id);
        if (existing) {
          existing.answers.push(curr.answers);
        } else {
          acc.push({
            id: curr.id,
            surveyId: curr.surveyId,
          });
        }
        return acc;
      }, [] as any[]);

      return groupedResponses;
    })
  )
  .listen(3000);

console.log('🚀 Server running on http://localhost:3000');
