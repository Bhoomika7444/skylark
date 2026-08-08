import { useQuery } from '@tanstack/react-query';
import { fetchHealth, fetchWorkOrders, fetchDeals } from '../services/api.js';

export function useMondayData() {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 30000,
  });

  const workOrdersQuery = useQuery({
    queryKey: ['workOrders'],
    queryFn: fetchWorkOrders,
    staleTime: 10000,
    refetchInterval: 5 * 60 * 1000,
  });

  const dealsQuery = useQuery({
    queryKey: ['deals'],
    queryFn: fetchDeals,
    staleTime: 10000,
    refetchInterval: 5 * 60 * 1000,
  });

  const isLoading = healthQuery.isLoading || workOrdersQuery.isLoading || dealsQuery.isLoading;
  const isError = healthQuery.isError || workOrdersQuery.isError || dealsQuery.isError;

  const woSync = workOrdersQuery.data?.lastSyncedAt;
  const dealSync = dealsQuery.data?.lastSyncedAt;
  let lastSyncedAt: string | null = null;
  if (woSync && dealSync) {
    lastSyncedAt = new Date(woSync).getTime() > new Date(dealSync).getTime() ? woSync : dealSync;
  } else {
    lastSyncedAt = woSync || dealSync || null;
  }

  return {
    health: healthQuery.data,
    workOrders: workOrdersQuery.data?.data || [],
    workOrdersQuality: workOrdersQuery.data?.qualityReport,
    deals: dealsQuery.data?.data || [],
    dealsQuality: dealsQuery.data?.qualityReport,
    isLiveConnection: Boolean(workOrdersQuery.data?.isLiveConnection || dealsQuery.data?.isLiveConnection),
    lastSyncedAt,
    isLoading,
    isError,
    refetchAll: () => {
      healthQuery.refetch();
      workOrdersQuery.refetch();
      dealsQuery.refetch();
    },
  };
}
