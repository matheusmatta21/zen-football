import { View } from "react-native";
import ScoreboardGoals from "./ScoreboardGoals";
import ScoreboardTime from "./ScoreboardTime";

export default function Scoreboard() {
  return (
    <View className="absolute left-0 right-0 top-0 h-15.75 flex-col items-center justify-center">
      <ScoreboardGoals />
      <ScoreboardTime />
    </View>
  );
}
