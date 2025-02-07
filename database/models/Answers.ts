import { DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../dbConfig.ts';
import Question from './Question.ts';
import Survey from './Survey.ts';

const Answers = sequelize.define('Answers', {
  answerId: {
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
  surveyId: {
    type: DataTypes.UUID,
    references: {
      model: Survey,
      key: 'surveyId',
    }
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Answers;

