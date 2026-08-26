import { View } from "react-native";
import { ScoreboardGoals } from "./ScoreboardGoals";
import { ScoreboardTime } from "./ScoreboardTime";

export function Scoreboard() {
  return (
    <View style={styles.scoreboardContainer}>
      <ScoreboardGoals />
      <ScoreboardTime />
    </View>
  );
}