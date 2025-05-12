export type Source = {
  term?: string;
  id?: string;
  metadata?: {
    term?: string;
    [key: string]: any;
  };
};

export type Message = {
  sender: 'user' | 'assistant';
  text: string;
  timestamp?: string;
  sources?: Source[];
  followup?: string;
  isTyping?: boolean; // For typewriter effect
  fullText?: string; // To store the complete message during typing
};
