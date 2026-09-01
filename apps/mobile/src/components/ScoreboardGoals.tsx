import { Text, View } from "react-native";

type ScoreboardGoalsProps = {
  status: "live" | "finished" | "upcoming";
};

const goalFontVariants = {
  live: "text-4xl font-bold",
  finished: "text-3xl font-bold",
  upcoming: "text-2xl font-bold",
};

const xFontVariants = {
  live: "text-2xl",
  finished: "text-xl",
  upcoming: "text-lg",
};

export default function ScoreboardGoals({ status }: ScoreboardGoalsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {status === "live" && (
        <>
          <Text className={goalFontVariants[status]}>2</Text>
          <Text className={xFontVariants[status]}>x</Text>
          <Text className={goalFontVariants[status]}>2</Text>
        </>
      )}
      {status === "finished" && (
        <>
          <Text className={goalFontVariants[status]}>1</Text>
          <Text className={xFontVariants[status]}>x</Text>
          <Text className={goalFontVariants[status]}>0</Text>
        </>
      )}
      {status === "upcoming" && (
        <>
          <Text className={xFontVariants[status]}>VS</Text>
        </>
      )}
    </View>
  );
}
