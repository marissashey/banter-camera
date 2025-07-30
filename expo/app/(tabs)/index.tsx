import {StyleSheet, TouchableOpacity, Image, Alert} from 'react-native';
import {CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import {useState, useRef} from 'react';
import {Text, View} from '@/components/Themed';
import {useImageUpload} from '@/hooks/useImageUpload';
import uuid from 'react-native-uuid';

type CameraMode = 'camera' | 'preview';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<CameraMode>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Upload mutation using custom hook
  const uploadMutation = useImageUpload();

  // Success and error handlers
  const handleUploadSuccess = (data: {uploadPath: string; banter: string}) => {
    // Just go back to camera mode - the banter will appear in the gallery
    handleCancel();
  };

  const handleUploadError = (error: Error) => {
    Alert.alert(
      'Upload Failed',
      `Sorry, something went wrong: ${error.message}`,
      [{text: 'OK'}]
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedImage(photo.uri);
        setMode('preview');
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const handleSubmit = () => {
    if (capturedImage) {
      const fileName = `image_${uuid.v4()}.jpg`;
      const banterId = uuid.v4() as string;

      uploadMutation.mutate(
        {
          uri: capturedImage,
          fileName,
          banterId,
        },
        {
          onSuccess: handleUploadSuccess,
          onError: handleUploadError,
        }
      );
    }
  };

  const handleCancel = () => {
    setCapturedImage(null);
    setMode('camera');
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === 'preview' && capturedImage) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{uri: capturedImage}} style={styles.preview} />
        <View style={styles.previewControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.cancelButton]}
            onPress={handleCancel}
            disabled={uploadMutation.isPending}
          >
            <Text style={styles.controlButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.submitButton]}
            onPress={handleSubmit}
            disabled={uploadMutation.isPending}
          >
            <Text style={styles.controlButtonText}>
              {uploadMutation.isPending ? 'Uploading...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  submitButton: {
    backgroundColor: '#00aa00',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
