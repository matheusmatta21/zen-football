import { View } from "react-native";
import ScoreboardGoals from "./ScoreboardGoals";
import ScoreboardTime from "./ScoreboardTime";

type ScoreboardProps = {
  status: "live" | "finished" | "upcoming";
};

const crestHeightVariants = {
  live: "h-12",
  finished: "h-8",
  upcoming: "h-8",
};

export default function Scoreboard({ status }: ScoreboardProps) {
  return (
    <View className="absolute left-0 right-0 top-0 flex-col items-center gap-0.5">
      <View className={`${crestHeightVariants[status]} justify-center`}>
        <ScoreboardGoals status={status} />
      </View>
      <ScoreboardTime status={status} />
    </View>
  );
}
