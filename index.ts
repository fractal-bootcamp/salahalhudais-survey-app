import { initializeDatabase } from './database/dbConfig.ts'
import { initializeAssociations } from './database/models/Associations.ts';
import { getSurveys, getSurveyById, deleteSurvey, updateSurvey, createSurvey} from './services/SurveyService.ts';
import { createQuestion, deleteQuestion, getQuestionById, getQuestions, updateQuestion } from './services/QuestionService.ts';
import './database/models/Survey';
import './database/models/Question';
import './database/models/answerChoice';
import './database/models/Answers';
import './database/models/Associations';
import sequelize from './database/dbConfig.ts';
const express = require("express");
const morgan = require("morgan");
const { body, validationResult} = require("express-validator");
const PORT = 3000;
const app = express();

const startApp = async () => {
  await initializeDatabase();
  initializeAssociations

  await sequelize.sync({ alter: true });
  console.log("Tables being made");
};
startApp();

app.set('views', "./views");
app.set('view engine', "pug");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false}));
app.use(morgan("common"));


app.use(express.json());

app.get('/surveys', async (req, res) => {
  try {
    const surveys = await getSurveys();
    const surveyTitles = surveys.map(survey => survey.title);
    console.log(surveyTitles);

    res.render("Survey", {
      surveys: surveyTitles
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/surveys/creation', async (req, res) => {
  try {
    const { title } = req.body;
    const newSurvey = await createSurvey(title);
    res.send("Survey added successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})
app.post('/surveys/addquestion', async (req, res) => {
  try {
    console.log(req.body, "Hello!");
    const surveyID = req.body.surveyId;
    const question = req.body.question;
    const newQuestion = await createQuestion(question, surveyID);
    res.send("Question added to survey Successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send("internel Server error");
  }
});

app.post('/surveys/:surveyId/submission', (req, res) => {

});



app.post('/surveys/results', (req, res) => {
  
})




app.listen(PORT, "localhost", () => {
  console.log("Listening to port 3000");
})