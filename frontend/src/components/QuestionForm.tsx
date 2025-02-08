import { useState } from 'react';

export function QuestionForm({ surveyId, onQuestionAdded }: { surveyId: string, onQuestionAdded: () => void }) {
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'text'>('multiple_choice');
  const [options, setOptions] = useState<string[]>(['']);
  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (questionType === 'multiple_choice' && options.filter(Boolean).length < 2) {
        setError('Multiple choice questions need at least 2 options');
        return;
      }

      const response = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText,
          questionType,
          options: questionType === 'multiple_choice' ? options.filter(Boolean) : [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      onQuestionAdded();
      setQuestionText('');
      setOptions(['']);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create question');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Question</span>
        </label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Enter your question"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Question Type</span>
        </label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value as 'multiple_choice' | 'text')}
          className="select select-bordered w-full"
        >
          <option value="multiple_choice">Multiple Choice</option>
          <option value="text">Text</option>
        </select>
      </div>

      {questionType === 'multiple_choice' && (
        <div className="space-y-2">
          <label className="label">
            <span className="label-text">Options</span>
          </label>
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="input input-bordered flex-1"
                placeholder={`Option ${index + 1}`}
                required
              />
              {options.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="btn btn-square btn-error"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="btn btn-secondary w-full"
          >
            Add Option
          </button>
        </div>
      )}

      <button type="submit" className="btn btn-primary w-full">
        Add Question
      </button>
    </form>
  );
}