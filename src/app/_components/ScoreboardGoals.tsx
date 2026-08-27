import { Text, View } from "react-native";

export function ScoreboardGoals() {
  return (
    <View className="flex-row items-center justify-center gap-2">
      <Text className="text-[32px] font-bold">2</Text>
      <Text>x</Text>
      <Text className="text-[32px] font-bold">2</Text>
    </View>
  );
}
