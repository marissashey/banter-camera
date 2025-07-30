import {StyleSheet} from 'react-native';
import {Text, View} from '@/components/Themed';

export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
});
