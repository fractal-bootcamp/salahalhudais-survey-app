import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Survey } from '../types';
import { api } from '../utils/api';

export function SurveyList() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/api/surveys')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch surveys');
        return res.json();
      })
      .then(setSurveys)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {surveys.map(survey => (
        <div key={survey.id} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{survey.title}</h2>
            <p>{survey.description}</p>
            <div className="card-actions justify-end">
              <Link to={`/surveys/${survey.id}/take`} className="btn btn-primary">
                Take Survey
              </Link>
              <Link to={`/surveys/${survey.id}`} className="btn btn-ghost">
                View Results
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 