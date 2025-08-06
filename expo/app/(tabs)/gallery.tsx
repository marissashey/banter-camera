import {StyleSheet, FlatList, Image, ActivityIndicator, RefreshControl} from 'react-native';
import {Text, View} from '@/components/Themed';
import {useBanters} from '@/hooks/useBanters';
import {Banter} from '@/types/banter';

interface BanterItemProps {
  banter: Banter;
}

function BanterItem({banter}: BanterItemProps) {
  return (
    <View style={styles.banterItem}>
      <Image source={{uri: banter.imageUri}} style={styles.banterImage} />
      <View style={styles.banterContent}>
        <View style={styles.banterTextContainer}>
          {banter.isGenerating && (
            <ActivityIndicator size="small" color="#666" style={styles.loadingSpinner} />
          )}
          <Text style={[
            styles.banterText,
            banter.isGenerating && styles.generatingText
          ]}>
            {banter.banterText}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {banter.createdAt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
        </Text>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No banters yet!</Text>
      <Text style={styles.emptySubtitle}>
        Take some photos in the Camera tab to see your banters here
      </Text>
    </View>
  );
}

export default function GalleryScreen() {
  const {data: banters = [], isLoading, error, refetch} = useBanters();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading gallery...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load gallery</Text>
        <Text style={styles.errorSubtext}>Pull down to retry</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={banters}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <BanterItem banter={item} />}
        contentContainerStyle={banters.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
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
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  banterItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  banterImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  banterContent: {
    padding: 16,
  },
  banterTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  loadingSpinner: {
    marginRight: 8,
    marginTop: 2,
  },
  banterText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  generatingText: {
    color: '#666',
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});
