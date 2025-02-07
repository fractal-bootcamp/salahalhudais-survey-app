import { DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../dbConfig.ts';
import Question from './Question.ts';

const AnswerChoices = sequelize.define('AnswerChoices', {
  answerChoiceId: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  questionId: {
    type: DataTypes.UUID,
    references: {
      model: Question,
      key: 'questionId'
    }
  },
  choice: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

export default AnswerChoices;