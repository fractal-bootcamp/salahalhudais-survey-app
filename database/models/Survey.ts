import { DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../dbConfig.ts';

const Survey = sequelize.define('Surveys', {
  surveyId: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
});

export default Survey;
