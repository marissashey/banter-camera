import * as FileSystem from 'expo-file-system';
import {Banter} from '@/types/banter';

const DATA_FILE = `${FileSystem.documentDirectory}banters.json`;
const IMAGES_DIR = `${FileSystem.documentDirectory}images/`;

// TODO: Replace all local load/save calls with remote API calls when backend is ready.

export async function ensureImagePersisted(sourceUri: string, id: string): Promise<string> {
  try {
    // Ensure images directory exists
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(IMAGES_DIR, {intermediates: true});
    }

    const targetUri = `${IMAGES_DIR}${id}.jpg`;
    // If already copied, return existing
    const existing = await FileSystem.getInfoAsync(targetUri);
    if (existing.exists) return targetUri;

    await FileSystem.copyAsync({from: sourceUri, to: targetUri});
    return targetUri;
  } catch (err) {
    console.warn('Failed to persist image locally, falling back to original URI', err);
    return sourceUri;
  }
}

export async function loadBanters(): Promise<Banter[]> {
  try {
    const info = await FileSystem.getInfoAsync(DATA_FILE);
    if (!info.exists) return [];
    const json = await FileSystem.readAsStringAsync(DATA_FILE);
    const raw = JSON.parse(json) as Array<Omit<Banter, 'createdAt'> & {createdAt: string}>;
    return raw.map(b => ({...b, createdAt: new Date(b.createdAt)}));
  } catch (err) {
    console.warn('Failed to load banters from local storage', err);
    return [];
  }
}

export async function saveBanters(banters: Banter[]): Promise<void> {
  try {
    // Serialize dates to ISO strings
    const payload = banters.map(b => ({...b, createdAt: b.createdAt.toISOString()}));
    await FileSystem.writeAsStringAsync(DATA_FILE, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save banters to local storage', err);
  }
}


