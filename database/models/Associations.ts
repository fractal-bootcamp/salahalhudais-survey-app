import { DataTypes } from 'sequelize';
import Survey from './Survey.ts';
import Question from './Question.ts';
import AnswerChoices from './answerChoice.ts';
import Answers from './Answers.ts';
import sequelize from '../dbConfig.ts';

const QuestionAnswerChoice = sequelize.define('QuestionAnswerChoice', {
  questionId: {
    type: DataTypes.UUID,
    references: { model: Question, key: 'questionId' }
  },
  answerChoiceId: {
    type: DataTypes.UUID,
    references: { model: AnswerChoices, key: 'answerChoiceId' }
  }
});

export const initializeAssociations = () => {
  Answers.belongsTo(Question, { foreignKey: 'questionId' });
  Answers.belongsTo(Survey, { foreignKey: 'surveyId' });
  
  Survey.hasMany(Question, { foreignKey: 'surveyId' });
  Question.belongsTo(Survey, { foreignKey: 'surveyId' });
  
  Question.hasMany(AnswerChoices, {
    foreignKey: 'questionId',
    onDelete: 'CASCADE'
  });
  AnswerChoices.belongsTo(Question, { foreignKey: 'questionId' });
  
  Question.belongsToMany(AnswerChoices, { through: QuestionAnswerChoice });
  AnswerChoices.belongsToMany(Question, { through: QuestionAnswerChoice });
};

