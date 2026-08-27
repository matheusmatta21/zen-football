import { Image, Text, View } from "react-native";

export function HeaderCard() {
  return (
    <View className="relative mb-4 items-center justify-center">
      <Text className="absolute left-0">18/08</Text>
      <View className="flex-row items-center gap-1">
        <Image
          source={require("../../../assets/images/premier-league.png")}
          className="h-[18px] w-[18px]"
        />
        <Text>Premier League</Text>
      </View>
    </View>
  );
}
