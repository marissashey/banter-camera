import {StyleSheet} from 'react-native';
import {CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import {useState} from 'react';
import {Text, View} from '@/components/Themed';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Text style={styles.button} onPress={requestPermission}>
          Grant permission
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        {/* Camera view content can be added here later */}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  button: {
    textAlign: 'center',
    backgroundColor: '#2196F3',
    color: 'white',
    padding: 10,
    margin: 20,
    borderRadius: 5,
  },
  camera: {
    flex: 1,
  },
});
