export type SignalType = 'begriff' | 'pause' | 'wasser' | 'frage';

export interface Signal {
  id: string;
  type: SignalType;
  sessionCode: string;
  timestamp: number;
  message?: string;
}

export interface Session {
  code: string;
  title: string;
  teacherName: string;
  presentationUrl?: string;
  participantCount: number;
  captionsEnabled: boolean;
  pollsEnabled: boolean;
  signalsEnabled: boolean;
  status: 'active' | 'paused' | 'ended';
}

export interface Caption {
  id: string;
  text: string;
  translation?: string;
  timestamp: number;
  isFinal: boolean;
}

export interface Poll {
  id: string;
  question: string;
  type: 'ja_nein' | 'mc' | 'abcd' | 'freitext' | 'numerisch';
  options?: string[];
  isActive: boolean;
  results?: Record<string, number>;
}

export interface ViewerSettings {
  captionsVisible: boolean;
  captionFontSize: 'sm' | 'md' | 'lg' | 'xl';
  highContrast: boolean;
  signalButtonsVisible: boolean;
  beamerMode: boolean;
  translationLanguage: string;
}
