import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

import { travelOptions } from '@/data/mockData';
import { TravelOption } from '@/types/models';

type TripContextValue = {
  selectedTravel: TravelOption;
  selectTravel: (id: string) => void;
};

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: PropsWithChildren) {
  const [selectedTravelId, setSelectedTravelId] = useState('bike');
  const selectedTravel = travelOptions.find((option) => option.id === selectedTravelId) ?? travelOptions[0];

  const value = useMemo(
    () => ({ selectedTravel, selectTravel: setSelectedTravelId }),
    [selectedTravel],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrip must be used within TripProvider');
  return context;
}
