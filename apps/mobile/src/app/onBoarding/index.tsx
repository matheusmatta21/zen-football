import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { withUniwind } from "uniwind";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Club } from "@zen/types";
import { useSelectedClub } from "@/contexts/SelectedClubContext";
import WelcomeStep from "./_components/WelcomeStep";
import SelectClubStep from "./_components/SelectClubStep";
import ConfirmClubStep from "./_components/ConfirmClubStep";

const StyledSafeAreaView = withUniwind(SafeAreaView);

type Step = "welcome" | "selectClub" | "confirmClub";
type Direction = "forward" | "back";

const SLIDE_DURATION = 280;

/** Avançando, o step novo entra pela direita; voltando, entra pela esquerda. */
function getSlideTransition(direction: Direction) {
  return direction === "forward"
    ? {
        entering: SlideInRight.duration(SLIDE_DURATION),
        exiting: SlideOutLeft.duration(SLIDE_DURATION),
      }
    : {
        entering: SlideInLeft.duration(SLIDE_DURATION),
        exiting: SlideOutRight.duration(SLIDE_DURATION),
      };
}

export default function OnBoarding() {
  const { selectClub } = useSelectedClub();
  const [step, setStep] = useState<Step>("welcome");
  const [direction, setDirection] = useState<Direction>("forward");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const goToStep = (nextStep: Step, nextDirection: Direction) => {
    setDirection(nextDirection);
    setStep(nextStep);
  };

  const { entering, exiting } = getSlideTransition(direction);

  return (
    <StyledSafeAreaView className="flex-1 bg-pitch">
      <View className="flex-1 w-full overflow-hidden">
        <Animated.View
          key={step}
          entering={entering}
          exiting={exiting}
          style={[StyleSheet.absoluteFill, styles.stepContainer]}
        >
          {step === "welcome" && (
            <WelcomeStep onNext={() => goToStep("selectClub", "forward")} />
          )}

          {step === "selectClub" && (
            <SelectClubStep
              selectedClub={selectedClub}
              onSelectClub={setSelectedClub}
              onNext={() => goToStep("confirmClub", "forward")}
            />
          )}

          {step === "confirmClub" && selectedClub && (
            <ConfirmClubStep
              club={selectedClub}
              onConfirm={() => selectClub(selectedClub)}
              onBack={() => goToStep("selectClub", "back")}
            />
          )}
        </Animated.View>
      </View>
    </StyledSafeAreaView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
