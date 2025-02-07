import Survey from '../database/models/Survey';

export const createSurvey = async (title: string) => {
  return (await Survey.create({ title: title }))
};

export const getSurveys = async () => {
  return await Survey.findAll();
};

export const getSurveyById = async (surveyId: string) => {
  return await Survey.findByPk(surveyId);
};

export const updateSurvey = async (surveyId: string, title: string) => {
  const survey = await Survey.findByPk(surveyId);
  if (survey) {
    await survey.update({ title: title });
    return await survey.save();
  }
  throw new Error('Survey not found');
};

export const deleteSurvey = async (surveyId: string) => {
  const survey = await Survey.findByPk(surveyId);
  if (survey) {
    return await survey.destroy();
  }
  throw new Error('Survey not found');
};