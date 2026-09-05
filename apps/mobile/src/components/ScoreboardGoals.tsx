import { hasScore, type Match } from "@zen/types";
import { Text, View } from "react-native";

type ScoreboardGoalsProps = {
  match: Match;
};

const goalFontVariants = {
  live: "text-4xl font-bold",
  finishedToday: "text-4xl font-bold",
  paused: "text-4xl font-bold",
  finished: "text-3xl font-bold",
  upcoming: "text-2xl font-bold",
};

const xFontVariants = {
  live: "text-2xl",
  finishedToday: "text-2xl",
  paused: "text-2xl",
  finished: "text-xl",
  upcoming: "text-lg",
};

export default function ScoreboardGoals({ match }: ScoreboardGoalsProps) {
  const { status } = match;

  return (
    <View className="flex-row items-center justify-center gap-2">
      {hasScore(match) ? (
        <>
          <Text className={goalFontVariants[status]}>{match.homeGoals}</Text>
          <Text className={xFontVariants[status]}>x</Text>
          <Text className={goalFontVariants[status]}>{match.awayGoals}</Text>
        </>
      ) : (
        <Text className={xFontVariants[status]}>VS</Text>
      )}
    </View>
  );
}
