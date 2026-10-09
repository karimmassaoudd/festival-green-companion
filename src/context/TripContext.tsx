import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { loadFestivalTravelData, saveTravelChoice } from '@/services/travelService';
import { TravelOption } from '@/types/models';

type TripContextValue = {
  travelOptions: TravelOption[];
  selectedTravel: TravelOption | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  selectTravel: (id: string) => Promise<void>;
  retry: () => Promise<void>;
};

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: PropsWithChildren) {
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([]);
  const [selectedTravel, setSelectedTravel] = useState<TravelOption | null>(null);
  const [festivalId, setFestivalId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loadFestivalTravelData();
      const savedOption = data.travelOptions.find(
        (option) => option.id === data.savedTravelOptionId,
      );
      const defaultOption = data.travelOptions.find((option) => option.name === 'Bike');

      setTravelOptions(data.travelOptions);
      setFestivalId(data.festivalId);
      setUserId(data.userId);
      setSelectedTravel(savedOption ?? defaultOption ?? data.travelOptions[0]);
    } catch (loadError) {
      setTravelOptions([]);
      setSelectedTravel(null);
      setFestivalId(null);
      setUserId(null);
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const startupTimer = setTimeout(() => void loadData(), 0);
    return () => clearTimeout(startupTimer);
  }, [loadData]);

  const selectTravel = useCallback(async (id: string) => {
    const nextOption = travelOptions.find((option) => option.id === id);
    if (!nextOption || !festivalId || !userId || isSaving) return;

    const previousOption = selectedTravel;
    setSelectedTravel(nextOption);
    setIsSaving(true);
    setError(null);

    try {
      await saveTravelChoice({ festivalId, userId, travelOptionId: id });
    } catch (saveError) {
      setSelectedTravel(previousOption);
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }, [festivalId, isSaving, selectedTravel, travelOptions, userId]);

  const value = useMemo(
    () => ({
      travelOptions,
      selectedTravel,
      isLoading,
      isSaving,
      error,
      selectTravel,
      retry: loadData,
    }),
    [error, isLoading, isSaving, loadData, selectTravel, selectedTravel, travelOptions],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrip must be used within TripProvider');
  return context;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An unexpected database error occurred.';
}
