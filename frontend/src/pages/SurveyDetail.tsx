import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QuestionForm } from '../components/QuestionForm';
import { Survey, Question, Response, Answer } from '../types';
import { api } from '../utils/api';

export function SurveyDetail() {
  const { id } = useParams();
  const [survey, setSurvey] = useState<Survey & { questions: Question[] }>();
  const [responses, setResponses] = useState<(Response & { answers: Answer[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [surveyRes, responsesRes] = await Promise.all([
        api.get(`/api/surveys/${id}`),
        api.get(`/api/surveys/${id}/responses`)
      ]);

      if (!surveyRes.ok || !responsesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const surveyData = await surveyRes.json();
      const responsesData = await responsesRes.json();
      setSurvey(surveyData);
      setResponses(responsesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <div className="loading loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!survey) return <div className="alert alert-error">Survey not found</div>;

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-4">
      <div className="card bg-base-100 shadow-xl p-6">
        <h1 className="text-3xl font-bold">{survey.title}</h1>
        <p className="text-lg mt-2">{survey.description}</p>
      </div>
      
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Question</h2>
        <QuestionForm surveyId={survey.id} onQuestionAdded={fetchData} />
      </div>
      
      {survey.questions.length > 0 && (
        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Questions & Responses</h2>
          <div className="space-y-4">
            {survey.questions.map((question, index) => {
              const answersForQuestion = responses.filter(r => 
                r.answers?.some(a => a.questionId === question.id)
              );
              
              console.log('Question:', question);
              console.log('Options:', question.options);
              console.log('Question with options:', {
                questionType: question.questionType,
                options: question.options,
                hasOptions: question.options && question.options.length > 0
              });
              
              return (
                <div key={question.id} className="card bg-base-200 p-4">
                  <h3 className="text-xl font-semibold">
                    Question {index + 1}: {question.questionText}
                  </h3>
                  
                  {question.questionType === 'multiple_choice' && question.options && question.options.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium mb-2">Options:</p>
                      <div className="space-y-2 pl-4">
                        {question.options.map(opt => (
                          <div key={opt.id} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span>{opt.optionText}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {answersForQuestion.length > 0 && (
                    <div className="mt-4 bg-base-100 rounded-lg p-4">
                      <p className="font-medium text-primary">Answers ({answersForQuestion.length}):</p>
                      <div className="mt-2 space-y-2 divide-y divide-base-300">
                        {answersForQuestion.map((response, idx) => {
                          const answer = response.answers?.find(a => a.questionId === question.id);
                          if (!answer) return null;
                          return (
                            <div key={`${response.id}-${question.id}`} className="pt-2 first:pt-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">Answer {idx + 1}:</span>
                                <span className="text-gray-700">{answer.answerText}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 