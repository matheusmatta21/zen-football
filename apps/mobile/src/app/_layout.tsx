import "../global.css";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  SelectedClubProvider,
  useSelectedClub,
} from "@/contexts/SelectedClubContext";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { selectedClubId, isHydrating } = useSelectedClub();

  useEffect(() => {
    if (!isHydrating) {
      SplashScreen.hideAsync();
    }
  }, [isHydrating]);

  if (isHydrating) {
    return null;
  }

  const hasSelectedClub = selectedClubId !== null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={hasSelectedClub}>
        <Stack.Screen name="index" />
      </Stack.Protected>

      <Stack.Protected guard={!hasSelectedClub}>
        <Stack.Screen name="onBoarding" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <SelectedClubProvider>
          <RootNavigator />
        </SelectedClubProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
