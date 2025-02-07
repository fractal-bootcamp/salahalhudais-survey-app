import { Sequelize, DataTypes, UUIDV4 } from 'sequelize';
import 'dotenv/config'
const sequelize = new Sequelize('survey', 'sal', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
  // Add these options for better debugging
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Force sync during development
    await sequelize.sync({ 
      force: true,
      // Add logging to see detailed SQL
      logging: (sql) => {
        console.log('Executing sync:', sql);
      }
    });
    console.log('All models were synchronized successfully.');
    
    // Verify tables after sync
    const [results] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    console.log('Available tables:', results);
    
  } catch (error) {
    console.error('Unable to connect to or sync the database:', error);
    throw error; // Re-throw to see where it fails
  }
};

export default sequelize;