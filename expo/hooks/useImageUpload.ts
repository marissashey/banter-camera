import {useMutation, useQueryClient} from '@tanstack/react-query';
import {supabase} from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import {Banter} from '@/types/banter';
import {addOptimisticBanter, updateOptimisticBanter} from '@/hooks/useBanters';

interface UploadImageParams {
  uri: string;
  fileName: string;
}

interface UploadResult {
  uploadPath: string;
  banter: string;
}

// Dummy function that returns placeholder banter
const generateDummyBanter = (): string => {
  return "This is a placeholder banter! Blah blah blah.";
};

export const useImageUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadResult, Error, UploadImageParams & {banterId: string}, {banterId: string}>({
    mutationFn: async ({uri, fileName}) => {
      // For now, we'll just simulate the upload process
      // In the future, this can be uncommented to use real Supabase storage
      /*
      // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to blob
      const response = await fetch(`data:image/jpeg;base64,${base64}`);
      const blob = await response.blob();

      // Upload to Supabase storage
      const {data: uploadData, error: uploadError} = await supabase.storage
        .from('images')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      */

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Use dummy function instead of calling Supabase function
      const banter = generateDummyBanter();

      return {
        uploadPath: `dummy/path/${fileName}`, // Dummy path
        banter,
      };
    },
    onMutate: async ({uri, fileName, banterId}) => {
      // Optimistically add the banter to the gallery
      const optimisticBanter: Banter = {
        id: banterId,
        imageUri: uri,
        banterText: 'Generating...',
        createdAt: new Date(),
        isGenerating: true,
      };

      addOptimisticBanter(queryClient, optimisticBanter);

      return {banterId};
    },
    onSuccess: (data, variables, context) => {
      // Update the banter with the real result
      if (context && 'banterId' in context && context.banterId) {
        updateOptimisticBanter(queryClient, context.banterId, {
          banterText: data.banter,
          isGenerating: false,
        });
      }
    },
    onError: (error, variables, context) => {
      // Update the banter to show error state
      if (context && 'banterId' in context && context.banterId) {
        updateOptimisticBanter(queryClient, context.banterId, {
          banterText: 'Failed to generate banter',
          isGenerating: false,
        });
      }
    },
  });
};
