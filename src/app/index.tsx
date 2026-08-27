import { ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

import { Header } from "./_components/Header";
import { MatchCard } from "./_components/MatchCard";

// SafeAreaView vem de uma lib externa, entao precisa do HOC para aceitar className
const StyledSafeAreaView = withUniwind(SafeAreaView);

export default function Index() {
  return (
    <StyledSafeAreaView className="flex-1 bg-pitch">
      <Header />
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow w-full items-center gap-5 bg-pitch py-[30px]"
      >
        <MatchCard />
        <MatchCard />
        <MatchCard />
        <MatchCard />
      </ScrollView>
    </StyledSafeAreaView>
  );
}
