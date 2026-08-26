import { View } from "react-native";
import { TeamView } from "./TeamView";
import { Scoreboard } from "./Scoreboard";

export function MatchView() {
  return (
    <View style={styles.matchCard}>
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
