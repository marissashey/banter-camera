import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import {useState, useRef} from 'react';
import {Text, View} from '@/components/Themed';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useImageUpload} from '@/hooks/useImageUpload';

type CameraMode = 'camera' | 'preview';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<CameraMode>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  const uploadImage = useImageUpload();

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
        console.log('Error taking picture:', error);
      }
    }
  };

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleSubmit = async () => {
    if (!capturedImage) return;

    try {
      await uploadImage.mutateAsync({imageUri: capturedImage});
      // Success! Go back to camera mode
      setCapturedImage(null);
      setMode('camera');
    } catch (error) {
      console.error('Upload failed:', error);
      // You could show an error message here instead of just logging
    }
  };

  const handleCancel = () => {
    setCapturedImage(null);
    setMode('camera');
  };

  if (mode === 'preview' && capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{uri: capturedImage}} style={styles.previewImage} />
        {/* Buttons positioned absolutely on top, just like camera mode */}
        <View style={[styles.previewControls, {bottom: insets.bottom + 20}]}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, uploadImage.isPending && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={uploadImage.isPending}
          >
            <Text style={styles.buttonText}>
              {uploadImage.isPending ? 'Uploading...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />

      {/* Capture button positioned absolutely on top */}
      <View style={[styles.captureButtonContainer, {bottom: insets.bottom}]}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>

      {/* Switch camera button positioned bottom-right */}
      <TouchableOpacity
        style={[styles.switchButton, {bottom: insets.bottom + 12}]}
        onPress={toggleFacing}
        accessibilityLabel="Switch camera"
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      >
        <Ionicons name="camera-reverse-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  captureButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
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
  switchButton: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  previewControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#00aa00',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#666666',
    opacity: 0.7,
  },
});
