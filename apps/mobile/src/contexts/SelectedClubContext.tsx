import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Club } from "@zen/types";
import { parseStoredClub } from "@/utils/storedClub";

const STORAGE_KEY = "@zen-football/selected-club";

type SelectedClubContextValue = {
  selectedClub: Club | null;
  selectedClubId: number | null;
  selectClub: (club: Club) => void;
  isHydrating: boolean;
};

const SelectedClubContext = createContext<SelectedClubContextValue | null>(
  null,
);

export function SelectedClubProvider({ children }: { children: ReactNode }) {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let isActive = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((storedClubId) => {
        if (!isActive) return;
        setSelectedClub(parseStoredClub(storedClubId));
      })
      .catch((cause) => {
        console.error(cause);
      })
      .finally(() => {
        if (!isActive) return;
        setIsHydrating(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const selectClub = useCallback((club: Club) => {
    setSelectedClub(club);

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(club)).catch((cause) => {
      console.error(cause);
    });
  }, []);

  const value = useMemo(
    () => ({ selectedClub, selectedClubId: selectedClub?.id ?? null, selectClub, isHydrating }),
    [selectedClub, selectClub, isHydrating],
  );

  return (
    <SelectedClubContext.Provider value={value}>
      {children}
    </SelectedClubContext.Provider>
  );
}

export function useSelectedClub() {
  const context = useContext(SelectedClubContext);

  if (context === null) {
    throw new Error(
      "useSelectedClub precisa ser usado dentro de <SelectedClubProvider>.",
    );
  }

  return context;
}
