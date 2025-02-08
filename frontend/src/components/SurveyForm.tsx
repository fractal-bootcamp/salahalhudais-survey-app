import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export function SurveyForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/surveys', { title, description });
      
      if (!response.ok) {
        throw new Error('Failed to create survey');
      }
      
      const data = await response.json();
      if (data.id) {
        navigate(`/surveys/${data.id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create survey');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card w-96 bg-base-100 shadow-xl p-6">
      {error && (
        <div className="alert alert-error mb-4">
          {error}
        </div>
      )}
      
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Survey Title</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Enter survey title"
          required
        />
      </div>

      <div className="form-control w-full mt-4">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          placeholder="Enter survey description"
          rows={4}
        />
      </div>

      <button type="submit" className="btn btn-primary mt-6 w-full">
        Create Survey
      </button>
    </form>
  );
}