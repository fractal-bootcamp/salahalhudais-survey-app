export interface Survey {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  surveyId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'text';
  orderIndex: number;
  options?: Option[];
}

export interface Option {
  id: string;
  questionId: string;
  optionText: string;
  orderIndex: number;
}

export interface Response {
  id: string;
  surveyId: string;
  createdAt: string;
}

export interface Answer {
  id: string;
  responseId: string;
  questionId: string;
  answerText: string;
} 