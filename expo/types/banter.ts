export interface BanterExcerpt {
  text: string;
  // Future fields: audioUrl?: string; durationMs?: number; speaker?: string;
}

export interface Banter {
  id: string;
  imageUri: string;
  excerpts: BanterExcerpt[];
  createdAt: Date;
  isGenerating?: boolean; // For optimistic updates
}
