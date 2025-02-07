import Question from '../database/models/Question';

export const createQuestion = async (text, surveyID) => {
  return await Question.create({
    text: text,
    surveyId: surveyID
  })
}

export const getQuestions = async () => {
  return await Question.findAll();
};

export const getQuestionById = async (questionId: string) => {
  return await Question.findByPk(questionId);
};

export const updateQuestion = async (questionId: string, question: string) => {
  const q = await Question.findByPk(questionId);
  if (q) {
    await q.update({question: question});
    return await q.save();
  }
  throw new Error('Question not found');
};

export const deleteQuestion = async (questionId: string) => {
  const q = await Question.findByPk(questionId);
  if (q) {
    return await q.destroy();
  }
  throw new Error('Question not found');
};
