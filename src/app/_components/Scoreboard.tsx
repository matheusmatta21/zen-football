import { View } from "react-native";
import ScoreboardGoals from "./ScoreboardGoals";
import ScoreboardTime from "./ScoreboardTime";

type ScoreboardProps = {
  status: "live" | "finished" | "upcoming";
};


export default function Scoreboard({ status }: ScoreboardProps) {
  return (
    <View className="absolute left-0 right-0 top-0 h-15.75 flex-col items-center justify-center">
      <ScoreboardGoals status={status} />
      <ScoreboardTime status={status} />
    </View>
  );
}
