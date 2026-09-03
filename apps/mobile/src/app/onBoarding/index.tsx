import { withUniwind } from "uniwind";
import { SafeAreaView } from "react-native-safe-area-context";
import WelcomeStep from "./_components/WelcomeStep";

export default function OnBoarding() {
  const StyledSafeAreaView = withUniwind(SafeAreaView);

  return (
    <StyledSafeAreaView className="flex-1 items-center justify-center bg-pitch">
      <WelcomeStep />
    </StyledSafeAreaView>
  );
}
