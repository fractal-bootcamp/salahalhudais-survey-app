import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Survey, Question } from '../types';
import { api } from '../utils/api';

export function TakeSurvey() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey & { questions: Question[] }>();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/api/surveys/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch survey');
        return res.json();
      })
      .then(data => {
        console.log('Fetched survey data:', data);
        setSurvey(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(`/api/surveys/${id}/responses`, { answers });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit survey');
      }
      
      navigate(`/surveys/${id}`);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit survey');
    }
  };

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!survey) return <div className="alert alert-error">Survey not found</div>;

  return (
    <form onSubmit={handleSubmit} className="container mx-auto max-w-2xl p-4 space-y-6">
      <div className="card bg-base-100 shadow-xl p-6">
        <h1 className="text-3xl font-bold">{survey.title}</h1>
        <p className="text-lg mt-2">{survey.description}</p>
      </div>

      {survey.questions.map(question => {
        
        return (
          <div key={question.id} className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-4">{question.questionText}</h3>
            {question.questionType === 'multiple_choice' && question.options && (
              <div className="space-y-3">
                {question.options.map(option => (
                  <label key={option.id} className="flex items-center gap-3 p-2 rounded hover:bg-base-200 cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value={option.optionText}
                      onChange={e => setAnswers(prev => ({
                        ...prev,
                        [question.id]: e.target.value
                      }))}
                      className="radio radio-primary"
                      required
                    />
                    <span>{option.optionText}</span>
                  </label>
                ))}
              </div>
            )}
            {question.questionType === 'text' && (
              <textarea
                className="textarea textarea-bordered w-full"
                value={answers[question.id] || ''}
                onChange={e => setAnswers(prev => ({
                  ...prev,
                  [question.id]: e.target.value
                }))}
                required
              />
            )}
          </div>
        );
      })}

      <button type="submit" className="btn btn-primary">
        Submit Survey
      </button>
    </form>
  );
}