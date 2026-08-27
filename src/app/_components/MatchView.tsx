import { View } from "react-native";
import { Scoreboard } from "./Scoreboard";
import { TeamView } from "./TeamView";

export function MatchView() {
  return (
    <View className="mt-4 w-full flex-row items-center justify-between">
      <TeamView
        teamName="Bournemouth"
        teamImage={require("../../../assets/images/bournemouth.png")}
      />
      <Scoreboard />

      <TeamView
        teamName="Chelsea"
        teamImage={require("../../../assets/images/chelsea.webp")}
      />
    </View>
  );
}
