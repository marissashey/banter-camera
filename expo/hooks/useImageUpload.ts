import {useMutation, useQueryClient} from '@tanstack/react-query';
import {supabase} from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';
import {decode} from 'base64-arraybuffer';
import uuid from 'react-native-uuid';
import {Banter} from '@/types/banter';
import {addOptimisticBanter, updateOptimisticBanter} from '@/hooks/useBanters';

interface UploadImageParams {
  imageUri: string;
}

interface UploadResult {
  banterText: string;
}

export const useImageUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadResult, Error, UploadImageParams, {banterId: string}>({
                mutationFn: async ({imageUri}) => {
      // Generate unique filename
      const fileName = `${uuid.v4()}.jpg`;

      // Read the image file as base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to ArrayBuffer for React Native upload
      const arrayBuffer = decode(base64);

      // Upload file to Supabase storage using ArrayBuffer
      const {data: uploadData, error: uploadError} = await supabase.storage
        .from('images')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Create a signed URL for the uploaded image (valid for 1 hour)
      const {data: urlData, error: urlError} = await supabase.storage
        .from('images')
        .createSignedUrl(fileName, 600); // 600 seconds = 10 minutes

      if (urlError || !urlData?.signedUrl) {
        throw new Error('Failed to create signed URL for uploaded image');
      }

      // Call the generate-banter edge function
      const {data: banterData, error: banterError} = await supabase.functions.invoke('generate-banter', {
        body: {
          image_url: urlData.signedUrl
        }
      });

      if (banterError) {
        throw new Error(`Banter generation failed: ${banterError.message}`);
      }

      // Console.log the output as requested
      console.log('Edge function output:', banterData);

      return {
        banterText: banterData.banter_text || 'Failed to generate banter'
      };
    },
    onMutate: async ({imageUri}) => {
      // Generate a unique ID for this banter
      const banterId = uuid.v4() as string;

      // Optimistically add the banter to the gallery
      const optimisticBanter: Banter = {
        id: banterId,
        imageUri: imageUri,
        banterText: 'Generating...',
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
          banterText: data.banterText,
          isGenerating: false,
        });
      }
    },
    onError: (error, variables, context) => {
      // Update the banter to show error state
      if (context?.banterId) {
        updateOptimisticBanter(queryClient, context.banterId, {
          banterText: 'Failed to generate banter',
          isGenerating: false,
        });
      }
      console.error('Image upload error:', error);
    },
  });
};
