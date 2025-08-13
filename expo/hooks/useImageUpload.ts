import {useMutation, useQueryClient} from '@tanstack/react-query';
import uuid from 'react-native-uuid';
import {Banter, BanterExcerpt} from '@/types/banter';
import {addOptimisticBanter, updateOptimisticBanter} from '@/hooks/useBanters';
import {persistImage, requestBanterForImage} from '@/lib/banterService';

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
      const imageId = uuid.v4() as string;
      const signedUrl = await persistImage(imageUri, imageId);
      const excerpts = await requestBanterForImage(signedUrl);
      return { excerpts };
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
