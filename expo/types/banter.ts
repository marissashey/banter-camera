export interface Banter {
  id: string;
  imageUri: string;
  banterText: string;
  createdAt: Date;
  isGenerating?: boolean; // For optimistic updates
}
