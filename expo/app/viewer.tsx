import {useMemo, useState} from 'react';
import {StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Text, View} from '@/components/Themed';
import {useBanters} from '@/hooks/useBanters';

export default function ViewerScreen() {
  const params = useLocalSearchParams<{id?: string}>();
  const router = useRouter();
  const {data: banters = []} = useBanters();
  const [index, setIndex] = useState(0);

  const banter = useMemo(() => banters.find(b => b.id === params.id), [banters, params.id]);

  if (!banter) {
    return (
      <View style={styles.center}>
        <Text>Loading…</Text>
      </View>
    );
  }

  const total = banter.excerpts.length;
  const currentText = banter.excerpts[Math.min(index, total - 1)]?.text ?? '';

  const onAdvance = () => {
    if (index + 1 >= total) {
      router.back();
    } else {
      setIndex(i => i + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: banter.imageUri}} style={styles.image} />
      <TouchableOpacity activeOpacity={0.9} onPress={onAdvance} style={styles.captionContainer}>
        <View style={styles.captionBox}>
          <Text style={styles.captionText}>{currentText}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    width,
    height,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  captionContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  captionBox: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 16,
  },
  captionText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


