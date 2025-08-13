import {StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity, Dimensions} from 'react-native';
import {Text, View} from '@/components/Themed';
import {useBanters} from '@/hooks/useBanters';
import {useRouter} from 'expo-router';

function EmptyState() {
  return (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyTitle}>No banters yet!</Text>
      <Text style={styles.emptySubtitle}>Take some photos in the Camera tab to see your banters here</Text>
    </View>
  );
}

export default function GalleryScreen() {
  const {data: banters = [], isLoading, error, refetch} = useBanters();
  const router = useRouter();

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load gallery</Text>
        <Text style={styles.errorSubtext}>Pull down to retry</Text>
      </View>
    );
  }

  const numColumns = 3;
  const imageSize = Math.floor(Dimensions.get('window').width / numColumns);

  return (
    <View style={styles.container}>
      <FlatList
        data={banters}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{width: imageSize, height: imageSize}}
            onPress={() => router.push({pathname: '/viewer', params: {id: item.id}})}
            activeOpacity={0.8}
          >
            <Image source={{uri: item.imageUri}} style={{width: imageSize, height: imageSize}} />
          </TouchableOpacity>
        )}
        contentContainerStyle={banters.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={EmptyState}
        refreshControl={<RefreshControl refreshing={!!isLoading} onRefresh={refetch} tintColor="#007AFF" />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateContainer: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});
