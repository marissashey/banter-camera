import {BanterExcerpt} from '@/types/banter';
import {supabase} from '@/lib/supabase';

export interface GenerateBanterRequest {
  imageUri: string;
}

export interface GenerateBanterResponse {
  excerpts: BanterExcerpt[];
}

// Persist an image to Supabase Storage and return a signed URL suitable for backend processing
export async function persistImage(imageUri: string, imageId: string): Promise<string> {
  const path = `banters/${imageId}.jpg`;

  const res = await fetch(imageUri);
  const blob = await res.blob();
  const contentType = res.headers.get('content-type') || 'image/jpeg';

  const { error: uploadError } = await supabase
    .storage
    .from('images')
    .upload(path, blob, { contentType, upsert: true });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: signed, error: signedErr } = await supabase
    .storage
    .from('images')
    .createSignedUrl(path, 60 * 60); // 1 hour

  if (signedErr || !signed?.signedUrl) {
    throw new Error(`Failed to create signed URL: ${signedErr?.message ?? 'Unknown error'}`);
  }

  return signed.signedUrl;
}

// Call the Supabase Edge Function to generate banter for a given image URL
export async function requestBanterForImage(imageUrl: string): Promise<BanterExcerpt[]> {
  const { data, error } = await supabase.functions.invoke('generate-banter', {
    body: { image_url: imageUrl },
  });

  if (error) {
    throw new Error(`Function error: ${error.message}`);
  }

  const excerpts: BanterExcerpt[] = Array.isArray(data?.excerpts)
    ? data.excerpts
    : [];
  return excerpts;
}


