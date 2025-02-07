import { DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../dbConfig.ts';
import Survey from './Survey.ts';

const Question = sequelize.define('Question', {
  questionId: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surveyId: {
    type: DataTypes.UUID,
    references: {
      model: Survey,
      key: 'surveyId'
    }
  },
  type: {
    type: DataTypes.ENUM('MULTIPLE_CHOICE', 'TEXT', 'NUMBER'),
    allowNull: false,
    defaultValue: 'TEXT'
  }
});

export default Question;
