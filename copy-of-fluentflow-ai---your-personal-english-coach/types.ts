
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SCENARIOS = 'SCENARIOS',
  POLISHING = 'POLISHING',
  TUTOR = 'TUTOR',
  VOCABULARY = 'VOCABULARY'
}

export type ScenarioCategory = 'Daily' | 'Work' | 'Travel' | 'Social';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: ScenarioCategory;
  icon: string;
}

export interface Word {
  term: string;
  definition: string;
  example: string;
  phonetic: string;
  status: 'new' | 'learning' | 'mastered';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
