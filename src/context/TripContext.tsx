import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { loadUserTravelBookings } from '@/services/bookingService';
import { loadFestivalTravelData, saveTravelChoice } from '@/services/travelService';
import { TravelOption } from '@/types/models';

type TripContextValue = {
  travelOptions: TravelOption[];
  selectedTravel: TravelOption | null;
  festivalId: string | null;
  bookingByTravelOptionId: Record<string, string>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  selectTravel: (id: string) => Promise<boolean>;
  rememberBooking: (travelOptionId: string, bookingId: string) => void;
  retry: () => Promise<void>;
};

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([]);
  const [selectedTravel, setSelectedTravel] = useState<TravelOption | null>(null);
  const [festivalId, setFestivalId] = useState<string | null>(null);
  const [bookingByTravelOptionId, setBookingByTravelOptionId] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!user) {
      setTravelOptions([]);
      setSelectedTravel(null);
      setFestivalId(null);
      setBookingByTravelOptionId({});
      setUserId(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await loadFestivalTravelData(user.id);
      const bookings = await loadUserTravelBookings(user.id, data.festivalId);
      const savedOption = data.travelOptions.find(
        (option) => option.id === data.savedTravelOptionId,
      );
      const defaultOption = data.travelOptions.find((option) => option.name === 'Bike');
      const selectedOption = savedOption ?? defaultOption ?? data.travelOptions[0];

      if (!data.savedTravelOptionId && selectedOption) {
        await saveTravelChoice({
          festivalId: data.festivalId,
          userId: user.id,
          travelOptionId: selectedOption.id,
        });
      }

      setTravelOptions(data.travelOptions);
      setFestivalId(data.festivalId);
      setBookingByTravelOptionId(bookings);
      setUserId(user.id);
      setSelectedTravel(selectedOption);
    } catch (loadError) {
      setTravelOptions([]);
      setSelectedTravel(null);
      setFestivalId(null);
      setBookingByTravelOptionId({});
      setUserId(null);
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const startupTimer = setTimeout(() => void loadData(), 0);
    return () => clearTimeout(startupTimer);
  }, [loadData]);

  const selectTravel = useCallback(async (id: string) => {
    const nextOption = travelOptions.find((option) => option.id === id);
    if (!nextOption || !festivalId || !userId || isSaving) return false;

    const previousOption = selectedTravel;
    setSelectedTravel(nextOption);
    setIsSaving(true);
    setError(null);

    try {
      await saveTravelChoice({ festivalId, userId, travelOptionId: id });
      return true;
    } catch (saveError) {
      setSelectedTravel(previousOption);
      setError(getErrorMessage(saveError));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [festivalId, isSaving, selectedTravel, travelOptions, userId]);

  const rememberBooking = useCallback((travelOptionId: string, bookingId: string) => {
    setBookingByTravelOptionId((current) => ({ ...current, [travelOptionId]: bookingId }));
  }, []);

  const value = useMemo(
    () => ({
      travelOptions,
      selectedTravel,
      festivalId,
      bookingByTravelOptionId,
      isLoading,
      isSaving,
      error,
      selectTravel,
      rememberBooking,
      retry: loadData,
    }),
    [
      bookingByTravelOptionId,
      error,
      festivalId,
      isLoading,
      isSaving,
      loadData,
      rememberBooking,
      selectTravel,
      selectedTravel,
      travelOptions,
    ],
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
