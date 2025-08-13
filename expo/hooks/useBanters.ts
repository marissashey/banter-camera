import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import {Banter} from '@/types/banter';
import {loadBanters, saveBanters} from '@/lib/localStore';

// For now, we'll store banters in memory. Later this can be replaced with Supabase
let bantersStore: Banter[] = [];

const BANTERS_QUERY_KEY = ['banters'];

// Simulate getting banters from backend
const getBanters = async (): Promise<Banter[]> => {
  // TODO: Replace with remote fetch; for now load from local storage
  if (bantersStore.length === 0) {
    bantersStore = await loadBanters();
  }
  return [...bantersStore];
};

// Simulate adding a banter
const addBanter = async (banter: Banter): Promise<Banter> => {
  bantersStore.unshift(banter); // Add to beginning for newest first
  await saveBanters(bantersStore);
  return banter;
};

// Simulate updating a banter
const updateBanter = async (id: string, updates: Partial<Banter>): Promise<Banter> => {
  const index = bantersStore.findIndex(b => b.id === id);
  if (index !== -1) {
    bantersStore[index] = {...bantersStore[index], ...updates};
    await saveBanters(bantersStore);
    return bantersStore[index];
  }
  throw new Error('Banter not found');
};

export const useBanters = () => {
  return useQuery({
    queryKey: BANTERS_QUERY_KEY,
    queryFn: getBanters,
  });
};

export const useAddBanter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBanter,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: BANTERS_QUERY_KEY});
    },
  });
};

export const useUpdateBanter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, updates}: {id: string; updates: Partial<Banter>}) =>
      updateBanter(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: BANTERS_QUERY_KEY});
    },
  });
};

// Helper function for optimistic updates
export const addOptimisticBanter = (queryClient: any, banter: Banter) => {
  queryClient.setQueryData(BANTERS_QUERY_KEY, (old: Banter[] = []) => {
    const updated = [banter, ...old];
    // Fire-and-forget save for persistence
    saveBanters(updated);
    return updated;
  });
};

export const updateOptimisticBanter = (queryClient: any, id: string, updates: Partial<Banter>) => {
  queryClient.setQueryData(BANTERS_QUERY_KEY, (old: Banter[] = []) => {
    const updated = old.map(banter => banter.id === id ? {...banter, ...updates} : banter);
    saveBanters(updated);
    return updated;
  });
};
