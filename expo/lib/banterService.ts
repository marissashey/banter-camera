import {BanterExcerpt} from '@/types/banter';

export interface GenerateBanterRequest {
  imageUri: string;
}

export interface GenerateBanterResponse {
  excerpts: BanterExcerpt[];
}

// Mock remote call. Replace implementation later.
export async function requestBanterForImage(imageUri: string): Promise<BanterExcerpt[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    {text: 'Hey this is a really neat picture.'},
    {text: 'I like the work you put into the angles and lighting.'},
    {text: 'It really puts me at ease seeing such tasteful imagery.'},
  ];
}


