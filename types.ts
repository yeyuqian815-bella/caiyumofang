
export enum AppMode {
  ORIGINAL = 'ORIGINAL',
  REWRITE = 'REWRITE'
}

export interface GenerationResult {
  content: string;
  timestamp: number;
}
