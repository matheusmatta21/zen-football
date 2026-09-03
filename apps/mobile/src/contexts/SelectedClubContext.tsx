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

import { CLUBS, ClubId } from "@/components/tournaments";

const STORAGE_KEY = "@zen-football/selected-club";

type SelectedClubContextValue = {
  selectedClubId: ClubId | null;
  selectClub: (clubId: ClubId) => void;
  isHydrating: boolean;
};

const SelectedClubContext = createContext<SelectedClubContextValue | null>(
  null,
);

function isKnownClubId(value: string | null): value is ClubId {
  return CLUBS.some((club) => club.id === value);
}

export function SelectedClubProvider({ children }: { children: ReactNode }) {
  const [selectedClubId, setSelectedClubId] = useState<ClubId | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let isActive = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((storedClubId) => {
        if (!isActive) return;
        if (isKnownClubId(storedClubId)) {
          setSelectedClubId(storedClubId);
          // console.log("Clube selecionado recuperado do AsyncStorage:", storedClubId);
        }
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

  const selectClub = useCallback((clubId: ClubId) => {
    setSelectedClubId(clubId);

    AsyncStorage.setItem(STORAGE_KEY, clubId).catch((cause) => {
      console.error(cause);
    });
  }, []);

  const value = useMemo(
    () => ({ selectedClubId, selectClub, isHydrating }),
    [selectedClubId, selectClub, isHydrating],
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
