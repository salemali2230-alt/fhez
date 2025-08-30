
export interface ExplanationContent {
  type: 'heading' | 'paragraph' | 'image' | 'list';
  content: string | string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Chapter {
  id: number;
  title: string;
  explanation: ExplanationContent[];
  experiments: {
    id: number;
    title: string;
    description: string;
  }[];
  games: {
    quiz: QuizQuestion[];
  };
}

export type TabKey = 'explanation' | 'experiments' | 'games';
