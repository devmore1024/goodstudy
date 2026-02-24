export interface ChatMessage {
  id: string;
  role: 'ai' | 'user' | 'system';
  content: string;
  timestamp: number;
  inputType?: 'text' | 'tag-select' | 'voice' | 'voiceprint' | 'card' | 'child-list';
  inputConfig?: TagSelectConfig | VoiceConfig | CardConfig | ChildListConfig;
  isTyping?: boolean;
}

export interface TagSelectConfig {
  type: 'tag-select';
  groups?: TagGroup[];
  tags?: string[];
  searchable?: boolean;
  multi?: boolean;
  columns?: number;
}

export interface TagGroup {
  label: string;
  tags: string[];
}

export interface VoiceConfig {
  type: 'voice';
  options?: string[];
}

export interface CardConfig {
  type: 'card';
  cardType: 'profile' | 'confirm';
  data: Record<string, string>;
}

export interface ChildListConfig {
  type: 'child-list';
  children: ChildInfo[];
}

export interface ChildInfo {
  id: string;
  name: string;
  grade: string;
  avatar?: string;
}

export interface ChatFlowStep {
  id: string;
  aiMessage: string;
  inputType: ChatMessage['inputType'];
  inputConfig?: ChatMessage['inputConfig'];
  nextStep?: string | ((answer: string) => string);
  fieldKey?: string;
}

export interface ChatFlowConfig {
  steps: ChatFlowStep[];
  initialStep: string;
}

export interface UserProfile {
  name: string;
  grade?: string;
  city?: string;
  voicePrint?: boolean;
  role?: 'student' | 'parent';
  parentRole?: string;
  linkedChildren?: ChildInfo[];
}

export type A4State = 'entry' | 'camera' | 'crop' | 'info' | 'ocr-result' | 'multi-subject';

export interface ExamInfo {
  examType: string;
  subject: string;
  date: string;
  totalScore: string;
  myScore: string;
}

export interface QuestionResult {
  id: number;
  content: string;
  status: 'correct' | 'wrong' | 'uncertain';
  score: number;
  fullScore: number;
}

export type TeacherMode = 'full' | 'upper' | 'avatar' | 'hidden';
