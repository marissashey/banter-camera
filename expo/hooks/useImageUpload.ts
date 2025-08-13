import {useMutation, useQueryClient} from '@tanstack/react-query';
import uuid from 'react-native-uuid';
import {Banter, BanterExcerpt} from '@/types/banter';
import {addOptimisticBanter, updateOptimisticBanter} from '@/hooks/useBanters';
import {requestBanterForImage} from '../lib/banterService';
import {ensureImagePersisted} from '@/lib/localStore';

interface UploadImageParams {
  imageUri: string;
}

interface UploadResult {
  excerpts: BanterExcerpt[];
}

export const useImageUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadResult, Error, UploadImageParams, {banterId: string}>({
    mutationFn: async ({imageUri}) => {
      // Persist image locally so it survives reloads
      const banterId = uuid.v4() as string;
      const persistedUri = await ensureImagePersisted(imageUri, banterId);
      // Call mock remote banter generator
      const excerpts = await requestBanterForImage(persistedUri);
      return {excerpts};
    },
    onMutate: async ({imageUri}) => {
      // Generate a unique ID for this banter
      const banterId = uuid.v4() as string;

      // Optimistically add the banter to the gallery
      const optimisticBanter: Banter = {
        id: banterId,
        imageUri: imageUri,
        excerpts: [{text: 'Generating...'}],
        createdAt: new Date(),
        isGenerating: true,
      };

      addOptimisticBanter(queryClient, optimisticBanter);

      return {banterId};
    },
    onSuccess: (data, variables, context) => {
      // Update the banter with the real result
      if (context?.banterId) {
        updateOptimisticBanter(queryClient, context.banterId, {
          excerpts: data.excerpts,
          isGenerating: false,
        });
      }
    },
    onError: (error, variables, context) => {
      // Update the banter to show error state
      if (context?.banterId) {
        updateOptimisticBanter(queryClient, context.banterId, {
          excerpts: [{text: 'Failed to generate banter'}],
          isGenerating: false,
        });
      }
      console.error('Image upload error:', error);
    },
  });
};
